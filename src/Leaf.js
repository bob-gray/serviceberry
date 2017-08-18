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
			"name": "middleware",
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
			"name": "middleman",
			"type": "object"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	useObject
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

function init (options) {
	this.node = new LeafNode(options);
}

function use (middleware) {
	this.node.handlers.push(middleware);

	return this;
}

function useObject (middleman) {
	this.node.handlers.push(middleman.use.bind(middleman));

	return this;
}

function catch_ (handler) {
	this.node.catches.push(handler);

	return this;
}

module.exports = Leaf;