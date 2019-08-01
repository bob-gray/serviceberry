"use strict";

const Base = require("solv/src/abstract/base");

class Operator extends Base {
	constructor () {
		super();
		this.alive = true;
		this.promise = this.invoke(createPromise);
	}

	call (handler, args) {
		this.invoke(callHandler, handler, args);

		return this.promise.finally(regulate.bind(this));
	}

	kill () {
		this.alive = false;
	}
}

function createPromise () {
	return new Promise((resolve, reject) => Object.assign(this, {resolve, reject}));
}

function callHandler (handler, args) {
	try {
		this.invoke(handleResult, handler.apply(this, args));
	} catch (error) {
		this.reject(error);
	}
}

function regulate () {
	var result;

	if (!this.alive) {
		result = new Promise(Function.prototype);
	}

	return result;
}

function handleResult (result) {
	if (result instanceof Error) {
		this.reject(result);
	} else if (result === false) {
		this.reject();
	} else if (typeof result !== "undefined") {
		Promise.resolve(result).then(this.resolve, this.reject);
	}
}

module.exports = Operator;