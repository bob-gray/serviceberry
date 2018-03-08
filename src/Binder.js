"use strict";

const Base = require("solv/src/abstract/base");

class Binder extends Base {
	bind (steward, method, implementation) {
		steward[method] = this.proxy(guard, steward, implementation);
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
		implementation.apply(steward, args);
	} else {
		steward.trigger("No Control");
	}
}

module.exports = Binder;
