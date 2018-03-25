"use strict";

require("solv/src/array/empty");

const Base = require("solv/src/abstract/base");

class Route extends Base {
	constructor (root, ...args) {
		super();

		Object.assign(this, {
			queue: [],
			catches: [...root.catches],
			caught: [],
			options: {...root.options}
		});

		if (root.test(...args)) {
			this.invoke(plotNext, root, args);
		}
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

function plotNext (node, args) {
	var next = this.invoke(moveToNext, node, args);

	if (next) {
		this.invoke(plot, next, args);
	}
}

function moveToNext (node, args) {
	this.invoke(add, node.handlers);
	node.transition(...args);

	return node.chooseNext(...args);
}

function plot (node) {
	this.invoke(setOptions, node.options);
	this.invoke(addCatches, node.catches);
	this.invoke(plotNext, ...arguments);
}

function recatch () {
	this.catches = this.catches.concat(this.caught);
	this.caught.empty();
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function addCatches (handlers) {
	this.queue = this.queue.concat(handlers.map(toFailHandlers));
}

function setOptions (options) {
	Object.assign(this.options, options);
}

function getNext () {
	var next = this.queue.shift();

	if (next && next.failHandler) {
		this.catches.push(next.failHandler);
		next = this.invoke(getNext);
	}

	return next;
}

function toFailHandlers (handler) {
	return {
		failHandler: handler
	};
}

module.exports = Route;
