"use strict";

var Branch,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

meta.define("./Leaf", require("./Leaf"));

Branch = createClass(
	meta({
		"name": "Branch",
		"type": "class",
		"extends": "./Leaf",
		"description": "HTTP service branch",
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

Branch.method(
	meta({
		"name": "at",
		"arguments": [{
			"name": "path",
			"type": "string"
		}],
		"returns": {
			"name": "branch",
			"type": "object"
		}
	}),
	at
);

Branch.method(
	meta({
		"name": "on",
		"arguments": [{
			"name": "method",
			"type": "string"
		}, {
			"name": "usable",
			"type": "object"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	onUsable
);

Branch.method(
	meta({
		"name": "on",
		"arguments": [{
			"name": "options",
			"type": "object"
		}, {
			"name": "usable",
			"type": "object"
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	onUsable
);

Branch.method(
	meta({
		"name": "on",
		"arguments": [{
			"name": "method",
			"type": "string"
		}, {
			"name": "handler",
			"type": "function",
			"required": false
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	onMethod
);

Branch.method(
	meta({
		"name": "on",
		"arguments": [{
			"name": "options",
			"type": "object"
		}, {
			"name": "handler",
			"type": "function",
			"required": false
		}],
		"returns": {
			"name": "leaf",
			"type": "object"
		}
	}),
	on
);

function init (options) {
	this.node = new BranchNode(options);
}

function at (path) {
	var branch = new Branch({
		path: path
	});

	this.invoke(growBranch, branch.node);

	return branch;
}

function onUsable (options, usable) {
	return this.on(options, handler);
}

function onMethod (method, handler) {
	return this.on({
		method: method
	}, handler);
}

function on (options, handler) {
	var leaf = new Leaf(options);

	this.invoke(growLeaf, leaf.node);

	if (handler) {
		leaf.use(handler);
	}

	return leaf;
}

function growBranch (node) {
	this.node.branches.push(node);
}

function growLeaf (node) {
	this.node.leaves.push(node);
}

module.exports = Branch;