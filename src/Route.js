"use strict";

require("solv/src/array/empty");

const {freeze} = require("./class"),
	Base = require("solv/src/abstract/base"),
	deepMerge = require("./deepMerge");

module.exports = freeze(class Route extends Base {
	constructor () {
		super();

		Object.assign(this, {
			queue: [],
			coping: [],
			coped: [],
			options: {}
		});
	}

	plot (node, ...args) {
		this.invoke(setOptions, node.options);
		this.invoke(addCoping, node.coping);
		node.transition(...args);
		this.add(node.handlers, ...args);
		this.invoke(plotNext, node, args);
	}

	add (handlers) {
		this.queue = this.queue.concat(handlers);
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
});

function plotNext (node, args) {
	var next = node.chooseNext(...args);

	if (next) {
		this.plot(next, ...args);
	}
}

function resetCoping () {
	this.coping = this.coping.concat(this.coped);
	this.coped.empty();
}

function addCoping (handlers) {
	this.queue = this.queue.concat(handlers.map(toCoping));
}

function setOptions (options) {
	deepMerge(this.options, options);
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
