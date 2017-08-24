"use strict";

const createClass = require("solv/src/class");
const HttpError = require("./HttpError");

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
		name: "isOwner",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	isOwner
);

Route.method(
	{
		name: "setRequest",
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	setRequest
);

Route.method(
	{
		name: "getNextHandler",
		arguments: [],
		returns: "function|undefined"
	},
	getNextHandler
);

Route.method(
	{
		name: "callHandler",
		arguments: [{
			name: "handler",
			type: "function"
		}]
	},
	callHandler
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

Route.method(
	{
		name: "recatch",
		arguments: []
	},
	recatch
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
	this.request = request;
	this.proceed(request);
}

function proceed (request) {
	var handler,
		owner = this.isOwner(request);

	if (owner) {
		this.recatch();
		handler = this.getNextHandler();
	}

	if (handler) {
		this.setRequest(request.copy());
		this.callHandler(handler);
	} else if (owner) {
		this.fail(new HttpError("proceed() called while handler queue was empty"));
	} else {
		request.trigger("warning", "proceed() from outside the current handler");
	}
}

function isOwner (request) {
	return request === this.request;
}

function setRequest (request) {
	this.request = request;
}

function toErrorHandlers (handler) {
	return {
		errorHandler: handler
	};
}

function getNextHandler () {
	var next = this.queue.shift();

	if (next.errorHandler) {
		this.catches.push(next.errorHandler);
		next = this.getNextHandler();
	}

	return next;
}

function callHandler (handler) {
	try {
		handler.call(this.trunk, this.request, this.request.response);
	} catch (error) {
		this.fail(new HttpError(error));
	}
}

function fail (error) {
	var handler = this.catches.pop();

	this.caught.unshift(handler);
	this.request.error = error;

	if (handler) {
		this.callHandler(handler);
	} else {
		this.request.response.send({
			status: error.getStatus(),
			headers: error.getHeaders(),
			body: error.getMessage()
		});
	}
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
}

module.exports = Route;