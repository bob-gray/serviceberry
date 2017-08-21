"use strict";

require("solv/src/object/copy");

var HeadersAccessor,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

HeadersAccessor = createClass(
	meta({
		"name": "HeadersAccessor",
		"type": "class",
		"arguments": []
	})
);

HeadersAccessor.method(
	meta({
		"name": "getHeaders",
		"arguments": [],
		"returns": "object"
	}),
	getHeaders
);

HeadersAccessor.method(
	meta({
		"name": "getHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "string|array"
	}),
	getHeader
);

HeadersAccessor.method(
	meta({
		"name": "setHeaders",
		"arguments": [{
			"name": "headers",
			"type": "object"
		}]
	}),
	setHeaders
);

HeadersAccessor.method(
	meta({
		"name": "setHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}, {
			"name": "value",
			"type": "string|array"
		}]
	}),
	setHeader
);

function getHeaders () {
	return Object.copy(this.headers);
}

function getHeader (name) {
	return this.headers[name];
}

function setHeaders (headers) {
	Object.merge(this.headers, headers);
}

function setHeader (name, value) {
	this.headers[name] = value;
}

module.exports = HeadersAccessor;