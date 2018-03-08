"use strict";

require("solv/src/array/empty");

const Base = require("solv/src/abstract/base");

class Route extends Base {
	constructor (root, ...args) {
		Object.assign(super(), {
			queue: [],
			catches: [],
			caught: [],
			options: {}
		});

		this.invoke(plot, root, args);
	}

	getNextHandler () {
		this.invoke(recatch);

		return this.invoke(getNext);
	}

	getNextFailHandler () {
		var handler = this.catches.pop();

		this.caught.unshift(handler);

		return handler;
	}
}

function plot (node, args) {
	var next;

	this.invoke(add, node.handlers);
	this.invoke(addCatches, node.catches);
	this.invoke(setOptions, node.options);
	node.transition.apply(node, args);

	next = node.chooseNext.apply(node, args);

	if (next) {
		this.invoke(plot, next, args);
	}
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
	this.caught.empty();
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function addCatches (handlers) {
	this.queue = this.queue.concat(handlers.map(toErrorHandlers));
}

function setOptions (options) {
	Object.assign(this.options, options);
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
