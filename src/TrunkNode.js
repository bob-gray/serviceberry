"use strict";

require("solv/src/abstract/base");
require("solv/src/array/first");
require("solv/src/array/add");
require("solv/src/array/contains");
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

function chooseNext (request, response) {
	var next;

	if (request.found) {
		next = this.invoke(chooseLeaf, request, response);
	} else {
		next = this.invoke(chooseBranch, request, response);
	}

	return next;
}

function transition (request) {
	request.remainingPath = request.path;
	request.found = !request.remainingPath.length && this.leaves.length > 0;
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

	if (!allowed.length && request.getMethod() === "OPTIONS") {
		this.invoke(autoOptions, allowed);
	} else if (!allowed.length && request.getMethod() === "HEAD") {
		allowed = this.leaves.filter(leaf => leaf.options.method === "GET");
		// TODO: handle this differently if content-length is going to be automatic
		response.getData = Function.prototype;
	}

	if (!allowed.length) {
		leaf = new ErrorNode(statusCodes.METHOD_NOT_ALLOWED, request, {
			Allow: this.invoke(getAllow)
		});
	} else if (!supported.length) {
		leaf = new ErrorNode(statusCodes.UNSUPPORTED_MEDIA_TYPE, request);
	} else if (!acceptable.length) {
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

function autoOptions (allowed) {
	var OptionsNode = require("./OptionsNode"),
		allow = this.invoke(getAllow);

	if (allow) {
		allowed.push(new OptionsNode(methods));
	}
}

module.exports = TrunkNode;