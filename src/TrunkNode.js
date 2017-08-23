"use strict";

require("solv/src/abstract/base");
require("solv/src/array/first");
require("solv/src/array/add");
require("solv/src/array/contains");
require("solv/src/array/is-empty");
require("solv/src/function/constrict");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const statusCodes = require("./statusCodes");

const TrunkNode = createClass(
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
		}, {
			"name": "response",
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
		}, {
			"name": "response",
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

function transition (request) {
	request.remainingPath = request.path;
}

function chooseNext (request, response) {
	var next;

	if (request.remainingPath.length) {
		next = this.invoke(chooseBranch, request, response);
	} else {
		next = this.invoke(chooseLeaf, request, response);
	}

	return next;
}

function chooseBranch (request, response) {
	return this.branches.find(branch => branch.test(request, response));
}

function chooseLeaf (request, response) {
	var ErrorNode = require("./ErrorNode"),
		allowed = this.leaves.filter(leaf => leaf.isAllowed(request)),
		supported = allowed.filter(leaf => leaf.isSupported(request)),
		acceptable = supported.filter(leaf => leaf.isAcceptable(request, response)),
		leaf;

	if (allowed.isEmpty() && request.getMethod() === "HEAD") {
		allowed = this.leaves.filter(leaf => leaf.options.method === "GET");
	}

	if (this.leaves.isEmpty()) {
		leaf = new ErrorNode(statusCodes.NOT_FOUND, request);
	} else if (allowed.isEmpty() && request.getMethod() === "OPTIONS") {
		leaf = this.invoke(autoOptions);		
	} else if (allowed.isEmpty()) {
		leaf = new ErrorNode(statusCodes.METHOD_NOT_ALLOWED, request, {
			Allow: this.invoke(getAllow)
		});
	} else if (supported.isEmpty()) {
		leaf = new ErrorNode(statusCodes.UNSUPPORTED_MEDIA_TYPE, request);
	} else if (acceptable.isEmpty()) {
		leaf = new ErrorNode(statusCodes.NOT_ACCEPTABLE, request);
	} else {
		leaf = acceptable.first();
	}

	return leaf;
}

function getAllow () {
	var allow = this.leaves.map(leaf => leaf.options.method).filter(method => method);

	allow.add("OPTIONS");

	if (allow.contains("GET")) {
		allow.add("HEAD");
	}

	allow.sort();

	return allow.join();
}

function autoOptions () {
	var OptionsNode = require("./OptionsNode"),
		allow = this.invoke(getAllow),
		options;

	if (allow) {
		options = new OptionsNode(allow);
	}

	return options;
}

module.exports = TrunkNode;