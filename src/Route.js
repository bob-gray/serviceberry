"use strict";

require("solv/src/array/empty");

const createClass = require("solv/src/class");

const Route = createClass(
	{
		name: "Route",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "properties",
			type: "object"
		}],
		properties: {
			request: {
				type: "object"
			},
			response: {
				type: "object"
			},
			node: {
				type: "object"
			}
		}
	},
	init
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
		name: "getNextFailHandler",
		arguments: [],
		returns: "function|undefined"
	},
	getNextFailHandler
);

function init () {
	this.queue = [];
	this.catches = [];
	this.caught = [];
	this.options = {};
	this.invoke(plot, this.node);
}

function plot (node) {
	var next;

	this.invoke(add, node.handlers);
	this.invoke(addCatches, node.catches);
	this.invoke(setOptions, node.options);
	node.transition(this.request, this.response);

	next = node.chooseNext(this.request, this.response);

	if (next) {
		this.invoke(plot, next);
	}
}

function getNextHandler () {
	this.invoke(recatch);

	return this.invoke(getNext);
}

function getNextFailHandler () {
	var handler = this.catches.pop();

	this.caught.unshift(handler);

	return handler;
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function addCatches (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function setOptions (options) {
	Object.merge(this.options, {
		serializers: options.serializers,
		deserializers: options.deserializers
	});
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
	this.caught.empty();
}

function getNext () {
	var next = this.queue.shift();

	if (next && next.errorHandler) {
		this.catches.push(next.errorHandler);
		next = this.invoke(getNext);
	}

	return next;
}

function toErrorHandlers (handler) {
	return {
		errorHandler: handler
	};
}

module.exports = Route;
