"use strict";

const Binder = require("./Binder"),
	Operator = require("./Operator");

class Binding extends Binder {
	constructor () {
		var unbind;

		super(...arguments);

		this.operator = new Operator();
		unbind = this.proxy("unbind");

		this.operator.promise.then(unbind, unbind);
	}

	call (handler, ...args) {
		return this.operator.call(handler, args);
	}

	proceed (value) {
		this.operator.resolve(value);
	}

	fail (...args) {
		this.operator.reject(args);
	}

	send () {
		this.operator.kill();
	}
}

module.exports = Binding;