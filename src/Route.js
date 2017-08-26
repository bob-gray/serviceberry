"use strict";

require("solv/src/array/empty");

const createClass = require("solv/src/class");
const HttpError = require("./HttpError");
const type = require("solv/src/type");

const Route = createClass(
	{
		name: "Route",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "trunk",
			type: "object"
		}]
	},
	init
);

Route.method(
	{
		name: "add",
		arguments: [{
			name: "handlers",
			type: "array"
		}]
	},
	add
);

Route.method(
	{
		name: "catch",
		arguments: [{
			name: "handlers",
			type: "array"
		}]
	},
	catch_
);

Route.method(
	{
		name: "begin",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	begin
);

Route.method(
	{
		name: "bind",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	bind
);

Route.method(
	{
		name: "abort",
		arguments: []
	},
	abort
);

Route.method(
	{
		name: "hasControl",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	hasControl
);

Route.method(
	{
		name: "proceed",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	proceed
);

Route.method(
	{
		name: "fail",
		arguments: [{
			name: "error",
			type: "any"
		}]
	},
	fail
);

function init (trunk) {
	this.trunk = trunk;
	this.queue = [];
	this.catches = [];
	this.caught = [];
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function catch_ (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function begin (request) {
	this.proceed(this.bind(request));
}

function bind (request) {
	this.request = request;
	request.proceed = this.proxy(guard, "proceed", request);
	request.fail = this.proxy(guard, "fail", request);

	return request;
}

function abort () {
	this.bind(this.request.copy());
}

function hasControl (request) {
	return this.request === request;
}

function proceed (request) {
	var handler = this.invoke(getNextHandler);

	this.invoke(recatch);

	if (handler) {
		process.nextTick(this.proxy(callHandler, handler));
	} else {
		this.fail("Request proceed called while handler queue was empty");
	}
}

function fail (error) {
	var handler = this.catches.pop();

	error = new HttpError(error);
	this.caught.unshift(handler);
	this.request.error = error;

	if (handler) {
		process.nextTick(this.proxy(callHandler, handler));
	} else {
		this.request.response.send({
			status: error.getStatus(),
			headers: error.getHeaders(),
			body: error.getMessage()
		});
	}
}

function toErrorHandlers (handler) {
	return {
		errorHandler: handler
	};
}

function guard (method, request) {
	if (this.hasControl(request)) {
		this[method](this.bind(this.request.copy()));
	} else {
		request.trigger("warning", `Request ${method} was called through a handle which no longer controls the request`);
	}
}

function getNextHandler () {
	var next = this.queue.shift();

	if (next.errorHandler) {
		this.catches.push(next.errorHandler);
		next = this.invoke(getNextHandler);
	}

	return next;
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
	this.caught.empty();
}

function callHandler (handler) {
	var result;

	try {
		result = handler.call(this.trunk, this.request, this.request.response);
		this.invoke(chainThenable, result);
	} catch (error) {
		this.fail(error);
	}
}

function chainThenable (result) {
	if (result && type.is("function", result.then)) {
		this.bind(this.request.copy());
		result.then(this.request.proceed, this.request.fail);
	}
}

module.exports = Route;