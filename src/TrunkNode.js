"use strict";

require("solv/src/abstract/base");
require("solv/src/array/first");

var TrunkNode,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

TrunkNode = createClass(
	meta({
		"name": "TrunkNode",
		"type": "class",
		"extends": "solv/src/abstract/base",
		"arguments": [{
			"name": "options",
			"type": "object",
			"default": {}
		}]
	}),
	init
);

TrunkNode.method(
	meta({
		"name": "chooseBranch",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "object|undefined"
	}),
	chooseBranch
);

TrunkNode.method(
	meta({
		"name": "chooseLeaf",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "object|undefined"
	}),
	chooseLeaf
);

TrunkNode.method(
	meta({
		"name": "transition",
		"arguments": [{
			"name": "request",
			"type": "object"
		}]
	}),
	Function.prototype
);

function init (options) {
	this.options = options;
	this.branches = [];
	this.leaves = [];
	this.handlers = [];
	this.catches = [];
}

function chooseBranch (request) {
	return this.branches.find(branch => branch.test(request));
}

function chooseLeaf (request) {
	var allowed = this.leaves.filter(leaf => leaf.isAllowed(request)),
		supported = allowed.filter(leaf => leaf.isSupported(request)),
		acceptable = supported.filter(leaf => leaf.isAcceptable(request));

	request.notAllowed = !allowed.length;
	request.unsupported = !supported.length;
	request.unacceptable = !acceptable.length;

	return acceptable.first();
}

module.exports = TrunkNode;