export class Thing {
  constructor(name) {
    const define = (name, getValue, target = this) => Object.defineProperty(target, name, { get: () => getValue });
    const getProxy = (handler, targetOrEmptyObject = true) =>
      new Proxy(typeof targetOrEmptyObject === 'boolean' ? (targetOrEmptyObject ? {} : function() {
      }) : targetOrEmptyObject, handler);

    const generateBooleanMethods = (value, thisValue = this) => getProxy({
      get: (_, name) => {
        define(`is_a_${name}`, value, thisValue);
        define(`is_not_a_${name}`, !value, thisValue);
        return thisValue;
      }
    });

    const generatePropertyWithValue = (thisValue = this) => getProxy({
      get: (target, name) => (target[name] = getProxy({
        get: (_, nameValue) => {
          define(name, nameValue, thisValue);
          return thisValue;
        }
      }))
    });

    const generateNestedItemsCallback = () => getProxy({
      apply: (_, thisValue, args) => {
        const getFnBody = fnSrt => `this.${fnSrt.toString()
          .replace(/^[^{]*{\s*[return]*/, '').replace(/\s*}[^}]*$/, '')
          .split('=>').pop().trim()}`;

        thisValue.map(thing => getProxy({
          apply: (target, thisValue) => new Function('h', getFnBody(target)).call(thisValue)
        }, args[0]).call(thing) && thing);
      }
    }, false);


    define('name', name);
    define('is_a', generateBooleanMethods(true));
    define('is_not_a', generateBooleanMethods(false));
    define('is_the', generatePropertyWithValue());

    define('has', getProxy({
        apply: (_, thisValue, args) => getProxy({
          get: (_, name) => {
            const getNestedItem = (name) => {
              const childThing = new Thing(name);
              define('having', getProxy({}, childThing.has), childThing);
              define('with', getProxy({}, childThing.having), childThing);
              define('being_the', generatePropertyWithValue(childThing), childThing);
              return childThing;
            };

            if (args[0] > 1) {
              thisValue[name] = [...Array(args[0])].map(() => getNestedItem(name));
              define('each', generateNestedItemsCallback(), thisValue[name]);
              return thisValue[name];
            }

            return (thisValue[name] = getNestedItem(name));
          }
        })
      }, false)
    );
  }
}


const main = function() {
  const jane = new Thing('Jane');

  jane.has(2).arms.each(arm => having(1).hand.having(5).fingers);
  console.log(5, jane.arms[0].hand.fingers.length);
};

if (require.main === module) {
  main();
}