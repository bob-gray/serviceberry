"use strict";

const createClass = require("solv/src/class");
const type = require("solv/src/type");

const Binder = createClass(
	{
		name: "Binder",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "bindings",
			type: "array"
		}]
	},
	init
);

Binder.method(
	{
		name: "init",
		static: true,
		arguments: [{
			name: "bindings",
			type: "array"
		}]
	},
	init
);

Binder.method(
	{
		name: "bind",
		arguments: [{
			name: "target",
			type: "object"
		}]
	},
	bind
);

Binder.method(
	{
		name: "rebind",
		arguments: []
	},
	rebind
);

Binder.method(
	{
		name: "unbind",
		arguments: []
	},
	unbind
);

Binder.method(
	{
		name: "hasControl",
		arguments: [{
			name: "target",
			type: "object"
		}]
	},
	hasControl
);

Binder.method(
	{
		name: "callHandler",
		arguments: [{
			name: "handler",
			type: "function"
		}, {
			name: "context",
			type: "object"
		}, {
			name: "args",
			type: "any",
			required: false,
			repeating: true
		}]
	},
	callHandler
);

function init (bindings) {
	this.bindings = bindings;
}

function bind (target) {
	this.target = target;
	this.bindings.forEach((method) => target[method] = this.proxy(guard, method, target));

	return target;
}

function rebind () {
	return this.bind(this.target.copy());
}

function unbind () {
	return this.target = null;
}

function guard (method, target, ...rest) {
	if (this.hasControl(target)) {
		console.log(method);
		this[method](this.rebind(), ...rest);
	} else {
		noControl(target, method);
	}
}

function hasControl (target, method) {
	return this.target === target;
}

function noControl (target) {
	var className = target.constructor.name;

	target.trigger("warning", `${className} ${method} was called through a handler which no longer controls the ${className.toLowerCase()}`);
}

function callHandler (handler, context, ...args) {
	var result;

	try {
		result = handler.apply(context, args);
	} catch (error) {
		result = error;
	}

	return this.invoke(handleResult, result);
}

function handleResult (result) {
	var promise;

	if (result && type.is("function", result.then)) {
		this.rebind();
		promise = result;
	} else if (result instanceof Error) {
		promise = Promise.reject(result);
	} else if (result) {
		promise = Promise.resolve(result);
	} else if (type.is.not("undefined", result)) {
		promise = Promise.reject(result);
	}

	return promise;
}

module.exports = Binder;