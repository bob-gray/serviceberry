"use strict";

require("solv/src/object/copy");
require("solv/src/object/for-each");
require("solv/src/abstract/base");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");

const HeadersAccessor = createClass(
	meta({
		"name": "HeadersAccessor",
		"type": "class",
		"mixins": "solv/src/abstract/base",
		"arguments": []
	})
);

HeadersAccessor.method(
	meta({
		"name": "init",
		"static": true,
		"arguments": []
	}),
	clearHeaders
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
		"returns": "string|number|array|undefined"
	}),
	getHeader
);

HeadersAccessor.method(
	meta({
		"name": "hasHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "boolean"
	}),
	hasHeader
);

HeadersAccessor.method(
	meta({
		"name": "withoutHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "boolean"
	}),
	withoutHeader
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
			"type": "string|number|array"
		}]
	}),
	setHeader
);

HeadersAccessor.method(
	meta({
		"name": "removeHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}]
	}),
	removeHeader
);

HeadersAccessor.method(
	meta({
		"name": "clearHeaders",
		"arguments": []
	}),
	clearHeaders
);

function getHeaders () {
	return Object.copy(this.headers);
}

function getHeader (name) {
	return this.headers[this.invoke(findName, name)];
}

function hasHeader (name) {
	return this.invoke(findName, name) !== undefined;
}

function withoutHeader (name) {
	return !this.hasHeader(name);
}

function setHeaders (headers) {
	Object.forEach(headers, (value, name) => this.setHeader(name, value));
}

function setHeader (name, value) {
	if (value === null) {
		delete this.headers[this.invoke(findName, name)];
	} else {
		this.headers[name] = value;
	}
}

function removeHeader (name) {
	this.setHeader(name, null);
}

function clearHeaders () {
	this.headers = {};
}

function findName (name) {
	name = name.toLowerCase();

	return Object.keys(this.headers).find(key => key.toLowerCase() === name);
}

module.exports = HeadersAccessor;