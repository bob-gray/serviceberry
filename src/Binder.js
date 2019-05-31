"use strict";

const Base = require("solv/src/abstract/base");

class Binder extends Base {
	bind (steward, method, callback) {
		steward[method] = this.proxy(guard, steward, method, callback);
		this.bound = true;

		return this;
	}

	unbind () {
		this.bound = false;
	}
}

function guard (steward, method, callback, ...args) {
	if (this.bound) {
		this.unbind();
		this.invoke(execute, method, callback, args);
	} else {
		steward.emit("No Control");
	}
}

function execute (method, callback, args) {
	this[method](...args);

	if (callback) {
		callback.apply(null, args);
	}
}

module.exports = Binder;
