"use strict";

var Leaf,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	LeafNode = require("./LeafNode");

Leaf = createClass(
	meta({
		"name": "Leaf",
		"type": "class",
		"extends": "solv/src/abstract/base",
		"description": "HTTP service leaf",
		"arguments": [{
			"name": "options",
			"type": "object"
		}],
		"properties": {
			"node": {
				"type": "object"
			}
		}
	}),
	init
);

Leaf.method(
	meta({
		"name": "use",
		"arguments": [{
			"name": "handler",
			"type": "function"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	use
);

Leaf.method(
	meta({
		"name": "use",
		"arguments": [{
			"name": "useable",
			"type": "object"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	useUsable
);

Leaf.method(
	meta({
		"name": "catch",
		"arguments": [{
			"name": "handler",
			"type": "function"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	catch_
);

Leaf.method(
	meta({
		"name": "catch",
		"arguments": [{
			"name": "usable",
			"type": "object"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	catchUsable
);

function init (options) {
	this.node = new LeafNode(options);
}

function use (handler) {
	this.node.handlers.push(handler);

	return this;
}

function useUsable (usable) {
	return this.use(usable.use.bind(usable));
}

function catch_ (handler) {
	this.node.catches.push(handler);

	return this;
}

function catchUsable (usable) {
	return this.catch(usable.use.bind(usable));
}

module.exports = Leaf;