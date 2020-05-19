"use strict";

const Yieldable = require("./Yieldable");

function YieldableProxy (yielder, yieldingMethods, hiddenMethods = []) {
	const yieldable = new Yieldable();

	return {
		yieldable,

		proxy: new Proxy(yielder, {
			has (target, name) {
				return name in target && !hiddenMethods.includes(name);
			},

			get (target, name, receiver) {
				var value;

				// leverage "has" trap above
				if (name in receiver) {
					value = Reflect.get(target, name, receiver);
				}

				if (value && yieldingMethods.includes(name)) {
					value = new Proxy(value, {
						apply (method, context, args) {
							// the first time any one of the yielding methods are called control is yielded
							// the next call to any yielding methods will throw an error
							if (yieldable.yielded) {
								throw new Error(target.constructor.name +
									" proxy has yielded and is no longer controllable");
							}

							yieldable.yield(args[0]);

							// always bind yieldingMethods to the target
							return Reflect.apply(method, target, args);
						}
					});
				} else if (typeof value === "function") {
					value = new Proxy(value, {
						apply (method, context, args) {
							// use the target as the context when the context is the proxy
							// this allows the target's methods to mutate the target by shedding the proxy
							// and avoiding the set trap below
							if (context === receiver) {
								context = target;
							}

							return Reflect.apply(method, context, args);
						}
					});
				}

				return value;
			},

			set (target, name, value, receiver) {
				// once a properties is written it cannot be overridden
				if (Reflect.has(target, name)) {
					throw Error(target.constructor.name + " properties can not be overridden");
				}

				return Reflect.set(target, name, value, receiver);
			}
		})
	};
}

module.exports = YieldableProxy;
