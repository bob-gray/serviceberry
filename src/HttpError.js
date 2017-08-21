"use strict";

require("solv/src/function/curry");

var HttpError,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	http = require("http");

meta.define("./StatusAccessor", require("./StatusAccessor"));
meta.define("./HeadersAccessor", require("./HeadersAccessor"));

HttpError = createClass(
	meta({
		"name": "HttpError",
		"type": "class",
		"extends": "Error",
		"mixins": [
			"./StatusAccessor",
			"./HeadersAccessor"
		],
		"arguments": [{
			"name": "error",
			"type": "any"
		}, {
			"name": "status",
			"type": "number|object",
			"default": 500
		}, {
			"name": "headers",
			"type": "object",
			"default": {}
		}]
	}),
	init
);

HttpError.method(
	meta({
		"name": "getMessage",
		"arguments": [],
		"returns": "string"
	}),
	getMessage
);

function init (error, status, headers) {
	this.superCall();
	this.message = error.message || error;

	this.status = {};
	this.setStatus(status || error.status);

	if (!headers["Content-Type"]) {
		headers["Content-Type"] = "text/plain";
	}

	if (!headers["Content-Length"]) {
		headers["Content-Length"] = this.getMessage().length;
	}

	this.headers = {};
	this.setHeaders(headers);

	if (error instanceof Error) {
		this.originalError = error;
	}
}

function getMessage () {
	return this.message;
}

module.exports = HttpError;