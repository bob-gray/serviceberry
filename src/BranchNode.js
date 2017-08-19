"use strict";

require("solv/src/regexp/escape");
require("solv/src/function/curry");
require("solv/src/object/merge");

var BranchNode,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	placeholders = /\{[^}]+\}/g,
	escapedBraces = /\\([{}])/g;

meta.define("./TrunkNode", require("./TrunkNode"));

BranchNode = createClass(
	meta({
		"name": "BranchNode",
		"type": "class",
		"extends": "./TrunkNode",
		"arguments": [{
			"name": "options",
			"type": "object"
		}]
	}),
	init
);

BranchNode.method(
	meta({
		"name": "test",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "boolean"
	}),
	test
);

BranchNode.method(
	meta({
		"name": "transition",
		"arguments": [{
			"name": "request",
			"type": "object"
		}]
	}),
	transition
);

function init () {
	this.superApply(arguments);
	this.invoke(createPattern);
	this.invoke(setPlaceholders);
}

function test (request) {
	return this.pattern.test(request.remainingPath);
}

function transition (request) {
	Object.merge(request.pathParams, this.invoke(parsePathParams, request));
	request.remainingPath = request.remainingPath.replace(this.pattern, "");
	request.notFound = request.remainingPath.length > 0 || !this.leaves.length;
}

function createPattern () {
	var src = RegExp.escape(this.options.path).replace(escapedBraces, "$1").replace(placeholders, "([^/]+)");

	this.pattern = new RegExp("^" + src);
}

function setPlaceholders () {
	if (placeholders.test(this.options.path)) {
		this.placeholders = this.options.path.match(placeholders).map(placeholder => placeholder.slice(1, -1));
	} else {
		this.placeholders = [];
	}
}

function parsePathParams (request) {
	var values = request.remainingPath.match(this.pattern),
		params = {};

	values.shift();

	this.placeholders.forEach((placeholder, index) => params[placeholder] = values[index]);

	return params;
}

module.exports = BranchNode;