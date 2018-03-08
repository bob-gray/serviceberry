"use strict";

const Base = require("solv/src/abstract/base");

class Operator extends Base {
	call (handler, ...args) {
		this.invoke(createPromise);
		this.invoke(callHandler, handler, args);

		return this.promise;
	}
}

function createPromise () {
	this.promise = new Promise((resolve, reject) => {
		this.resolve = this.proxy("delay", resolve);
		this.reject = this.proxy("delay", reject);
	});
}

function callHandler (handler, args) {
	try {
		this.invoke(handleResult, handler.apply(this, args));
	} catch (error) {
		this.reject(error);
	}
}

function handleResult (result) {
	if (result instanceof Error || result === false) {
		this.reject(result);
	} else if (typeof result !== "undefined") {
		Promise.resolve(result).then(this.resolve, this.reject);
	}
}

 module.exports = Operator;