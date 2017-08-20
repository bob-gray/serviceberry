"use strict";

require("solv/src/array/last");

var Route,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

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
			"name": "context",
			"type": "object"
		}, {
			"name": "args",
			"type": "array"
		}]
	}),
	proceed
);

Route.method(
	{
		"name": "nextHandler",
		"arguments": [],
		"returns": "function"
	},
	nextHandler
);

Route.method(
	{
		"name": "fail",
		"arguments": [{
			"name": "error",
			"type": "object"
		}, {
			"name": "context",
			"type": "object"
		}, {
			"name": "args",
			"type": "array"
		}]
	},
	fail
);

Route.method(
	{
		"name": "next",
		"arguments": [],
		"returns": "function|object"
	},
	next
);

function init () {
	this.queue = [];
	this.catches = [];
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function catch_ (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function proceed (context, args) {
	var handler = this.nextHandler();

	try {
		handler.apply(context, args);

	} catch (error) {
		this.fail(error, context, args);
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

function fail (error, context, args) {
	var handler = this.catches.pop();

	args.unshift(error);

	if (handler) {
		handler.apply(context, args);
	} else {
		throw error;
	}
}

function next () {
	return this.queue.shift();
}

module.exports = Route;