"use strict";

const Base = require("solv/src/abstract/base");

class Binder extends Base {
	bind (steward, method, implementation) {
		steward[method] = this.proxy(guard, steward, implementation || method);
		this.bound = true;

		return this;
	}

	unbind () {
		this.bound = false;
	}
}

function guard (steward, implementation, ...args) {
	if (this.bound) {
		this.unbind();
		this.invoke(execute, implementation, args);
	} else {
		steward.emit("No Control");
	}
}

function execute (implementation, args) {
	if (typeof implementation === "string") {
		implementation = this[implementation];
	}

	implementation.apply(this, args);
}

module.exports = Binder;
