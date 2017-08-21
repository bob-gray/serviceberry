"use strict";

require("solv/src/function/curry");

var OptionsNode,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

meta.define("./LeafNode", require("./LeafNode"));

OptionsNode = createClass(
	meta({
		"name": "OptionsNode",
		"type": "class",
		"extends": "./LeafNode",
		"arguments": [{
			"name": "allow",
			"type": "string"
		}]
	}),
	init
);

function init (allow) {
	this.superCall({
		method: "OPTIONS"
	});

	this.handlers.push(respond.curry(allow));
}

function respond (allow, request, response) {
	response.send({
		status: 204,
		headers: {
			Allow: allow
		}
	});
}

module.exports = OptionsNode;