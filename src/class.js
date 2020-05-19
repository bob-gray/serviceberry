"use strict";

module.exports = Object.freeze({
	freeze (Class) {
		Object.freeze(Class.prototype);

		return Object.freeze(Class);
	},

	base (Class) {
		if (Object.getPrototypeOf(Class.prototype) !== Object.prototype) {
			throw new Error("Base class cannot extend another class");
		}

		Object.setPrototypeOf(Class.prototype, null);

		return Class;
	}
});
