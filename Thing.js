class Thing {
  constructor(name) {
    const define = (name, getValue, target = this) => Object.defineProperty(target, name, { get: () => getValue });
    const getProxy = (handler, targetOrEmptyObject = true) =>
      new Proxy(typeof targetOrEmptyObject  === 'boolean' ? targetOrEmptyObject ? {} : () => {} : targetOrEmptyObject, handler);

    const generateBooleanMethods = (value) => getProxy({
      get: (_, name) => {
        define(`is_a_${name}`, value);
        define(`is_not_a_${name}`, value);
        return this;
      }
    });

    define('name', name);
    define('is_a', generateBooleanMethods(true));
    define('is_not_a', generateBooleanMethods(false));
    define('is_the', getProxy({
      get: (target, name) => (target[name] = getProxy({
        get: (_, nameValue) => {
          define(name, () => nameValue);
          return this;
        }
      }))
    }));

    define('has', getProxy({
        apply: (_, thisValue, args) => getProxy({
          get: (_, name) => {
            thisValue[name] = new Thing(name);

            define('having', getProxy({
                // apply: (target, thisValue, args) => {
                  // this.has.apply(thisValue, args);
                  // return getProxy({
                  //   get: (_, name) => {
                  //     thisValue[name] = Object.create(new thisValue.constructor());
                  //     return thisValue[name];
                  //   }
                  // });
                  // return getProxy({}, thisValue.has)
                // }
              }, thisValue[name].has), thisValue[name]);

            return thisValue[name];
          }
        })
      }, false)
    );
  }


}


const main = function() {
  const jane = new Thing('Jane');

  jane.is_a.man.is_a.person;
  jane.is_the.parent_of.joe.is_the.child_of.mikky;

  // jane.has(1).head;
  jane.has(1).head.having(1).eyes.is_a.momo.has(1).gogo.having(1).toto.having(1).nono;
  // jane.head.is_a.main;

  console.log(jane.is_a_man);
  console.log(jane.is_not_a_person);
  console.log(jane.is_not_a_man);
  console.log(jane.is_a_person);

  console.log(jane.parent_of);
  console.log(jane.child_of);
  console.log(jane.head instanceof Thing);
  console.log(jane.head.eyes instanceof Thing);
  console.log(jane.head.eyes.is_a_momo);
  console.log(jane.gogo instanceof Thing);
  // с этим надо побороться теперь
  console.log(jane.head.eyes);
  console.log(jane.is_a_momo);
};

if (require.main === module) {
  main();
}