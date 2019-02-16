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

	use (...handlers) {
		this.node.handlers.push(...handlers);

		return this;
	}

	cope (...handlers) {
		this.node.coping.push(...handlers);

		return this;
	}

	waitFor (...setup) {
		this.node.waiting.push(...setup);

		return this;
	}
}

module.exports = Leaf;
