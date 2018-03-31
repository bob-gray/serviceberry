"use strict";

const Base = require("solv/src/abstract/base"),
	LeafNode = require("./LeafNode");

class Leaf extends Base {
	constructor (options) {
		super();
		this.options = {...options};
		this.createNode(options);
	}

	createNode (options) {
		this.node = new LeafNode(options);
	}

	use (handler) {
		this.node.handlers.push(prepareHandler(handler));

		return this;
	}

	catch (handler) {
		this.node.catches.push(prepareHandler(handler));

		return this;
	}
}

function prepareHandler (handler) {
	if (typeof handler !== "function" && typeof handler.use === "function") {
		handler = handler.use.bind(handler);
	}

	if (typeof handler !== "function") {
		badHandler();
	}

	return handler;
}

function badHandler () {
	throw new Error("handler must be a function or an object with a `use` method");
}

module.exports = Leaf;
