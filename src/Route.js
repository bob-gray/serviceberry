"use strict";

require("solv/src/array/empty");

const Base = require("solv/src/abstract/base");

class Route extends Base {
	constructor (root, ...args) {
		super();

		Object.assign(this, {
			queue: [],
			coping: [],
			coped: [],
			options: {}
		});

		this.invoke(plot, root, args);
	}

	getNextHandler () {
		this.invoke(resetCoping);

		return this.invoke(getNext);
	}

	getNextCoping () {
		var handler = this.coping.pop();

		this.coped.unshift(handler);

		return handler;
	}
}

function plot (node, args) {
	this.invoke(setOptions, node.options);
	this.invoke(addCoping, node.coping);
	this.invoke(add, node.handlers);
	node.transition(...args);
	this.invoke(plotNext, node, args);
}

function plotNext (node, args) {
	var next = node.chooseNext(...args);

	if (next) {
		this.invoke(plot, next, args);
	}
}

function resetCoping () {
	this.coping = this.coping.concat(this.coped);
	this.coped.empty();
}

function add (handlers) {
	this.queue = this.queue.concat(handlers);
}

function addCoping (handlers) {
	this.queue = this.queue.concat(handlers.map(toCoping));
}

function setOptions (options) {
	Object.assign(this.options, options);
}

function getNext () {
	var next = this.queue.shift();

	if (next && next.coping) {
		this.coping.push(next.coping);
		next = this.invoke(getNext);
	}

	return next;
}

function toCoping (handler) {
	return {
		coping: handler
	};
}

module.exports = Route;
