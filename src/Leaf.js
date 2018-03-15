"use strict";

require("solv/src/class/method");

const Base = require("solv/src/abstract/base"),
	LeafNode = require("./LeafNode");

class Leaf extends Base {
	constructor (options) {
		super();
		this.options = options;
		this.createNode(options);
	}

	createNode (options) {
		this.node = new LeafNode(options);
	}

	use (usable) {
		return this.use(usable.use.bind(usable));
	}

	catch (usable) {
		return this.catch(usable.use.bind(usable));
	}
}

Leaf.method({
	name: "use",
	signature: "function"
}, function (handler) {
	this.node.handlers.push(handler);

	return this;
});

Leaf.method({
	name: "catch",
	signature: "function"
}, function (handler) {
	this.node.catches.push(handler);

	return this;
});

module.exports = Leaf;