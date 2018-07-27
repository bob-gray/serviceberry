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
		this.node.handlers.push(handler);

		return this;
	}

	catch (handler) {
		this.node.catches.push(handler);

		return this;
	}

	waitFor (setup) {
		this.waiting.push(setup);

		return this;
	}
}

module.exports = Leaf;
