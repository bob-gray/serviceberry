"use strict";

var Route,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	HttpError = require("./HttpError");

Route = createClass(
	meta({
		"name": "Route",
		"type": "class",
		"description": "A queue of handler functions",
		"arguments": []
	}),
	init
);

Route.method(
	meta({
		"name": "add",
		"arguments": [{
			"name": "handlers",
			"type": "array"
		}]
	}),
	add
);

Route.method(
	meta({
		"name": "catch",
		"arguments": [{
			"name": "handlers",
			"type": "array"
		}]
	}),
	catch_
);

Route.method(
	meta({
		"name": "proceed",
		"arguments": [{
			"name": "request",
			"type": "object"
		}, {
			"name": "response",
			"type": "object"
		}]
	}),
	proceed
);

Route.method(
	{
		"name": "nextHandler",
		"arguments": [],
		"returns": "function|undefined"
	},
	nextHandler
);

Route.method(
	{
		"name": "fail",
		"arguments": [{
			"name": "error",
			"type": "any"
		}, {
			"name": "request",
			"type": "object"
		}, {
			"name": "response",
			"type": "object"
		}]
	},
	fail
);

Route.method(
	{
		"name": "next",
		"arguments": [],
		"returns": "function|object|undefined"
	},
	next
);

function init (trunk) {
	this.trunk = trunk;
	this.queue = [];
	this.catches = [];
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function catch_ (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function proceed (request, response) {
	var handler = this.nextHandler();

	try {
		if (handler) {
			handler.call(this.trunk, request, response);
		} else {
			throw new Error("Route.proceed() called when handler queue was empty");
		}
	} catch (error) {
		if (error instanceof HttpError) {
			this.fail(error, request, response);
		} else {
			this.fail(new HttpError(error), request, response);
		}
	}
}

function toErrorHandlers (handler) {
	return {
		errorHandler: handler
	};
}

function nextHandler () {
	var next = this.next();

	if (next.errorHandler) {
		this.catches.push(next.errorHandler);
		next = this.nextHandler();
	}

	return next;
}

function fail (error, request, response) {
	var handler = this.catches.pop();

	request.error = error;

	if (handler) {
		handler.call(this.trunk, request, response);
	} else {
		response.send({
			status: error.getStatus(),
			headers: error.getHeaders(),
			body: error.getMessage()
		});
	}
}

function next () {
	return this.queue.shift();
}

module.exports = Route;