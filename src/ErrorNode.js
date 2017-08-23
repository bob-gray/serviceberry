"use strict";

require("solv/src/function/curry");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const HttpError = require("./HttpError");
const messages = {
	404: (request) => "No resource at " + request.getUrl(),
	405: (request) => "Request method " + request.getMethod() + " is not allowed",
	415: (request) => "Request content type " + request.getContentType() + " is not supported",
	406: (request) => "No acceptable response type for " + request.getAccept() + " can be produced"
};

meta.define("./LeafNode", require("./LeafNode"));

const ErrorNode = createClass(
	meta({
		"name": "ErrorNode",
		"type": "class",
		"extends": "./LeafNode",
		"arguments": [{
			"name": "code",
			"type": "number"
		}]
	}),
	init
);

function init (code, request, headers) {
	this.superCall();

	this.handlers.push(respond.curry(code, request, headers));
}

function respond (code, request, headers) {
	throw new HttpError(messages[code](request), code, headers);
}

module.exports = ErrorNode;