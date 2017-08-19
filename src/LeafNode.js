"use strict";

require("solv/src/regexp/escape");
require("solv/src/function/curry");
require("solv/src/array/contains");

var LeafNode,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	type = require("solv/src/type"),
	accepts = require("accepts"),
	contentType = require("content-type");

meta.define("./TrunkNode", require("./TrunkNode"));

LeafNode = createClass(
	meta({
		"name": "LeafNode",
		"type": "class",
		"extends": "./TrunkNode",
		"arguments": [{
			"name": "options",
			"type": "object",
			"default": {}
		}]
	})
);

LeafNode.method(
	meta({
		"name": "isAllowed",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "boolean"
	}),
	isAllowed
);

LeafNode.method(
	meta({
		"name": "isSupported",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "boolean"
	}),
	isSupported
);

LeafNode.method(
	meta({
		"name": "isAcceptable",
		"arguments": [{
			"name": "request",
			"type": "object"
		}],
		"returns": "boolean"
	}),
	isAcceptable
);

LeafNode.method(
	meta({
		"name": "transition",
		"override": true,
		"arguments": [{
			"name": "request",
			"type": "object"
		}]
	}),
	Function.prototype
);

LeafNode.method(
	meta({
		"name": "chooseNext",
		"override": true,
		"arguments": [{
			"name": "request",
			"type": "object"
		}]
	}),
	Function.prototype
);

function isAllowed (request) {
	return request.getMethod() === this.options.method;
}

function isSupported (request) {
	var supported = true,
		consumes = this.options.consumes;

	if (consumes && type.is.not("array", consumes)) {
		consumes = [consumes];
	}

	if (consumes) {
		supported = consumes.contains(this.invoke(getRequestType, request));
	}

	return supported;
}

function isAcceptable (request) {
	var acceptable = true;

	if (this.options.produces) {
		acceptable = accepts(request.incomingMessage).type(this.options.produces) !== false;
	}

	return acceptable;
}

function getRequestType (request) {
	// throws if missing header or header is malformed
	try {
		return contentType.parse(request.incomingMessage).type;
	} catch (error) {
		// ignore
	}
}

module.exports = LeafNode;