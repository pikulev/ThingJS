export class Thing {
  constructor(name) {
    const define = (name, getValue, target = this) => Object.defineProperty(target, name, { get: () => getValue });
    const getProxy = (handler, targetOrEmptyObject = true) =>
      new Proxy(typeof targetOrEmptyObject === 'boolean' ? targetOrEmptyObject ? {} : () => {
      } : targetOrEmptyObject, handler);

    const generateBooleanMethods = (value) => getProxy({
      get: (_, name) => {
        define(`is_a_${name}`, value);
        define(`is_not_a_${name}`, !value);
        return this;
      }
    });

    define('name', name);
    define('is_a', generateBooleanMethods(true));
    define('is_not_a', generateBooleanMethods(false));
    define('is_the', getProxy({
      get: (target, name) => (target[name] = getProxy({
        get: (_, nameValue) => {
          define(name, nameValue);
          return this;
        }
      }))
    }));

    define('has', getProxy({
        apply: (_, thisValue, args) => getProxy({
          get: (_, name) => {
            const childThing = new Thing(name);
            define('having', getProxy({}, childThing.has), childThing);

            if (args[0] > 1) {
              thisValue[name] = new Array(args[0]).fill(childThing);
              define('each', getProxy({
                apply: (_, thisValue, args) => {
                  const tempFn = getProxy({
                    apply: (target, thisValue, _) => {
                      const newFn = new Function('', `this.${target.toString().split('=>').pop().trim()}`);
                      newFn.call(thisValue);
                    }
                  }, args[0]);
                  thisValue.forEach((thing) => {
                    tempFn.call(thing);
                  });
                }
              }, false), thisValue[name]);

              return thisValue[name];
            }

            return (thisValue[name] = childThing);
          }
        })
      }, false)
    );
  }


}


const main = function() {
  const jane = new Thing('Jane');
};

if (require.main === module) {
  main();
}