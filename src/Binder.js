"use strict";

require("solv/src/array/add");

const createClass = require("solv/src/class");
const type = require("solv/src/type");

const Binder = createClass(
	{
		name: "Binder",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "context",
			type: "object"
		}]
	},
	reset
);

Binder.method(
	{
		name: "bind",
		arguments: [{
			name: "steward",
			type: "object"
		}, {
			name: "name",
			type: "string"
		}, {
			name: "method",
			type: "function"
		}]
	},
	bind
);

Binder.method(
	{
		name: "execute",
		arguments: [{
			name: "handler",
			type: "function"
		}, {
			name: "nArgs",
			type: "any",
			required: false,
			repeating: true
		}]
	},
	execute
);

Binder.method(
	{
		name: "proceed",
		arguments: [{
			name: "result",
			type: "any",
			required: false
		}]
	},
	proceed
);

Binder.method(
	{
		name: "fail",
		arguments: [{
			name: "error",
			type: "any",
			required: false
		}]
	},
	fail
);

function bind (steward, name, method) {
	this.stewards.add(steward);
	steward[name] = this.proxy(guard, steward, method)
}

function reset () {
	this.stewards = [];
}

function execute (handler) {
	this.invoke(createPromise);
	callHandler.apply(this, arguments);

	return this.promise;
}

function guard (steward, method) {
	var args;

	if (this.invoke(isSteward, steward)) {
		this.invoke(reset);
		args = Array.from(arguments).slice(guard.length);
		method.apply(steward, args);
	} else {
		steward.trigger("No Control");
	}
}

function createPromise () {
	this.promise = new Promise((resolve, reject) => {
		this.resolve = resolve;
		this.reject = reject;
	});
}

function isSteward (steward) {
	return this.stewards.indexOf(steward) > -1;
}

function callHandler (handler) {
	var args = Array.from(arguments).slice(callHandler.length),
		result;

	try {
		result = handler.apply(this, args);
		this.invoke(handleResult, result);
	} catch (error) {
		this.fail(error);
	}
}

function handleResult (result) {
	if (type.is.not("undefined", result)) {
		this.invoke(reset);
	}

	if (result && type.is("function", result.then)) {
		result.then(this.proxy("proceed"), this.proxy("fail"));
	} else if (result instanceof Error) {
		this.fail(result);
	} else if (result) {
		this.proceed(result);
	} else if (type.is.not("undefined", result)) {
		this.fail(result);
	}
}

function proceed (result) {
	setImmediate(this.resolve, result);
}

function fail (error) {
	setImmediate(this.reject, error);
}

module.exports = Binder;
