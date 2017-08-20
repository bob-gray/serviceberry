"use strict";

require("solv/src/abstract/base");
require("solv/src/array/first");
require("solv/src/function/constrict");

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
		"name": "chooseNext",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "object|undefined"
	}),
	chooseNext
);

TrunkNode.method(
	meta({
		"name": "transition",
		"arguments": [{
			"name": "request",
			"type": "object"
		}]
	}),
	transition
);

function init (options) {
	this.options = options;
	this.branches = [];
	this.leaves = [];
	this.handlers = [];
	this.catches = [];
}

function chooseNext (request) {
	var next;

	if (request.notFound) {
		next = this.invoke(chooseBranch, request);
	} else {
		next = this.invoke(chooseLeaf, request);
	}

	return next;
}

function transition (request) {
	request.remainingPath = request.path;
	request.notFound = request.remainingPath.length > 0 || !this.leaves.length;
}

function chooseBranch (request) {
	return this.branches.find(branch => branch.test(request));
}

function chooseLeaf (request) {
	var allowed = this.leaves.filter(leaf => leaf.isAllowed(request)),
		supported,
		acceptable;

	if (!allowed.length && request.getMethod() === "OPTIONS") {
		allowed.push(this.invoke(createOptionsLeafNode));
	} else if (!allowed.length && request.getMethod() === "HEAD") {
		allowed = this.leaves.filter(leaf => leaf.options.method === "GET");
		request.response.send = request.response.send.constrict();
	}

	supported = allowed.filter(leaf => leaf.isSupported(request));
	acceptable = supported.filter(leaf => leaf.isAcceptable(request));

	request.notAllowed = !allowed.length;
	request.unsupported = !supported.length;
	request.notAcceptable = !acceptable.length;

	return acceptable.first();
}

function createOptionsLeafNode () {
	var OptionsNode = require("./OptionsNode");

	return new OptionsLeafNode(this.leaves.map(leaf => leaf.options.method));
}

module.exports = TrunkNode;