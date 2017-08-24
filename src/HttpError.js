"use strict";

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const http = require("http");
const StatusAccessor = require("./StatusAccessor");
const HeadersAccessor = require("./HeadersAccessor");

meta.define("./StatusAccessor", StatusAccessor);
meta.define("./HeadersAccessor", HeadersAccessor);

const HttpError = createClass(
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
	var initialized = error instanceof HttpError;

	if (initialized) {
		Object.merge(this, error);
	} else {
		this.superCall();
		this.message = error.message || error;
		this.invoke(StatusAccessor.init, status|| error.status);
		this.invoke(HeadersAccessor.init, headers);
	}

	if (!initialized && this.withoutHeader("Content-Type")) {
		this.setHeader("Content-Type", "text/plain; charset=utf-8");
	}

	if (!initialized && error.message) {
		this.originalError = error;
	}
}

function getMessage () {
	return this.message;
}

module.exports = HttpError;