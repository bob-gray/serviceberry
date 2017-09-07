"use strict";

require("solv/src/array/empty");

const createClass = require("solv/src/class");
const type = require("solv/src/type");
const HttpError = require("./HttpError");
const Binder = require("./Binder")

const Route = createClass(
	{
		name: "Route",
		type: "class",
		extends: Binder,
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
		name: "proceed",
		arguments: []
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
	this.invoke(Binder.init, [
		"proceed",
		"fail"
	]);
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function catch_ (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function begin (request) {
	this.request = this.bind(request);
	this.proceed();
}

function proceed () {
	var handler = this.invoke(getNextHandler),
		request = this.request,
		result;

	this.invoke(recatch);

	if (handler) {
		result = this.callHandler(handler, this.trunk, request, request.response);
		this.request = this.target;
	} else {
		this.fail("Request proceed called while handler queue was empty");
	}

	if (result) {
		result.then(request.proceed, request.fail);
	}
}

function fail (error) {
	var handler = this.catches.pop();

	error = new HttpError(error);
	this.caught.unshift(handler);
	this.request.error = error;

	if (handler) {
		setImmediate(this.proxy(callHandler, handler));
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

function getNextHandler () {
	var next = this.queue.shift();

	if (next && next.errorHandler) {
		this.catches.push(next.errorHandler);
		next = this.invoke(getNextHandler);
	}

	return next;
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
	this.caught.empty();
}

module.exports = Route;