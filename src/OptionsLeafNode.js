"use strict";

require("solv/src/array/add");
require("solv/src/array/contains");
require("solv/src/function/curry");

var OptionsLeafNode = {},
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

meta.define("./LeafNode", require("./LeafNode"));

OptionsLeafNode = createClass(
	meta({
		"name": "OptionsLeafNode",
		"type": "class",
		"extends": "./LeafNode",
		"arguments": [{
			"name": "allow",
			"type": "array"
		}]
	}),
	init
);

function init (allow) {
	allow.add("OPTIONS");

	if (allow.contains("GET")) {
		allow.add("HEAD");
	}

	allow.sort();

	this.superCall({
		method: "OPTIONS"
	});

	this.handlers.push(respond.curry(allow.join()));
}

function respond (allow, request, response) {
	response.writeHead(204, {
		Allow: allow
	});
	response.end();
}

module.exports = OptionsLeafNode;