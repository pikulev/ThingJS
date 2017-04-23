export class Thing {
  constructor(name) {
    const define = (name, getValue, target = this, enumerable = false) => Object.defineProperty(target, name, {
      get: () => getValue,
      enumerable: enumerable
    });
    const getProxy = (handler, target = {}) => new Proxy(target, handler);

    const generateBooleanProperties = (value, thisValue = this) => getProxy({
      get: (_, name) => {
        define(`is_a_${name}`, value, thisValue);
        define(`is_not_a_${name}`, !value, thisValue);
        return thisValue;
      }
    });

    const generatePropertyWithValue = (thisValue = this) => getProxy({
      get: (target, name) => (target[name] = getProxy({
        get: (_, nameValue) => {
          define(name, nameValue, thisValue, true);

          return getProxy({
            get: (_, nextPropName) => nextPropName === 'and_the'
              ? generatePropertyWithValue(thisValue)
              : thisValue[nextPropName]
          });
        }
      }))
    });

    const generateHasMethod = handler => getProxy({
      apply: (_, thisValue, args) => {
        return getProxy({
          get: (_, name) => {
            return handler.call(thisValue, name, args[0] || 0);
          }
        });
      }
    }, new Function());

    const getSafeFunctionResult = (thisValue, callback, args = []) => {
      const thisPropsKeys = Object.getOwnPropertyNames(thisValue)
        .filter(prop => thisValue.propertyIsEnumerable(prop));
      const newFn = new Function(...thisPropsKeys, `return ${callback.toString()}`);
      return newFn.apply(thisValue, [...thisPropsKeys.map(prop => thisValue[prop])])(...args);
    };

    const generateNestedItemsCallback = () => getProxy({
      apply: (_, thisValue, args) => {
        const getFnBody = fnSrt => `this.${fnSrt.toString()
          .replace(/^[^{]*{\s*[return]*/, '').replace(/\s*}[^}]*$/, '')
          .split('=>').pop().trim()}`;

        thisValue.map(thing => getProxy({
          apply: (target, thisValue) => new Function('h', getFnBody(target)).call(thisValue)
        }, args[0]).call(thing) && thing);
      }
    }, new Function());


    define('name', name, this, true);
    define('is_a', generateBooleanProperties(true));
    define('is_not_a', generateBooleanProperties(false));
    define('is_the', generatePropertyWithValue());
    define('has', generateHasMethod((propName, itemsNumber) => {
      const getNestedItem = (propName) => {
        const childThing = new Thing(propName);
        define('with', getProxy({}, childThing.having, new Function()), childThing);
        define('being_the', generatePropertyWithValue(childThing), childThing);
        return childThing;
      };

      if (itemsNumber > 1) {
        this[propName] = [...Array(itemsNumber)].map(() => getNestedItem(propName.slice(0, -1)));
        define('each', generateNestedItemsCallback(), this[propName]);
        return this[propName];
      }

      return (this[propName] = getNestedItem(propName));
    }));
    define('having', getProxy({}, this.has, new Function()));

    define('can', getProxy({
      get: (target, name) => getProxy({
        apply: (_, thisValue, args) => {
          let callsHistory = [];
          const argsCopy = [...args];
          const callback = argsCopy.pop();

          if (argsCopy.length) {
            argsCopy.forEach(methodName => define(methodName, callsHistory));
          }

          define(name, getProxy({
            apply: (_, thisValue, args) => {
              const callResult = getSafeFunctionResult(thisValue, callback, args);
              return callsHistory.push(callResult) && callResult;
            }
          }, new Function));
        }
      }, new Function())
    }));
  }
}