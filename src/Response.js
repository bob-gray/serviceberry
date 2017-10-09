"use strict";

require("solv/src/abstract/base");
require("solv/src/object/merge");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const StatusAccessor = require("./StatusAccessor");
const HeadersAccessor = require("./HeadersAccessor");
const contentType = require("content-type");

meta.define("./StatusAccessor", StatusAccessor);
meta.define("./HeadersAccessor", HeadersAccessor);

const Response = createClass(
	meta({
		"name": "Response",
		"type": "class",
		"extends": "solv/src/abstract/base",
		"mixins": [
			"solv/src/abstract/emitter",
			"./StatusAccessor",
			"./HeadersAccessor"
		],
		"description": "HTTP response object",
		"arguments": [{
			"name": "properties",
			"type": "object",
			"properties": {
				"serverResponse": {
					"type": "object"
				}
			}
		}]
	}),
	init
);

/*meta({
	"name": "send",
	"arguments": [{
		"name": "options",
		"type": "object",
		"default": {}
	}]
})*/

Response.method(
	meta({
		"name": "getContentType",
		"arguments": []
	}),
	getContentType
);

Response.method(
	meta({
		"name": "getContent",
		"arguments": [],
		"returns": {
			"name": "buffer",
			"type": "any"
		}
	}),
	getContent
);

Response.method(
	meta({
		"name": "setContent",
		"arguments": [{
			"name": "content",
			"type": "any"
		}]
	}),
	setContent
);

Response.method(
	meta({
		"name": "getBody",
		"arguments": []
	}),
	getBody
);

Response.method(
	meta({
		"name": "setBody",
		"arguments": [{
			"name": "body",
			"type": "any"
		}]
	}),
	setBody
);

Response.method(
	meta({
		"name": "getEncoding",
		"arguments": []
	}),
	getEncoding
);

Response.method(
	meta({
		"name": "setEncoding",
		"arguments": [{
			"name": "encoding",
			"type": "string"
		}]
	}),
	setEncoding
);

Response.method(
	meta({
		"name": "set",
		"arguments": [{
			"name": "properties",
			"type": "object"
		}]
	}),
	set
);

Response.method(
	{
		name: "copy",
		arguments: [],
		returns: "object"
	},
	copy
);

function init (copied) {
	if (copied instanceof this.constructor) {
		return this;
	}

	this.invoke(StatusAccessor.init);
	this.invoke(HeadersAccessor.init);
	this.setEncoding("utf-8");
	this.serverResponse.on("finish", this.proxy("trigger", "finish"))
		.on("error", this.proxy("trigger", "error"));
}

function getContentType () {
	var type;

	// throws if missing header or header is malformed
	try {
		type = contentType.parse(this.getHeader("Content-Type")).type;
	} catch (error) {
		// ignore
	}

	return type;
}

function getContent () {
	return Buffer.from(this.content, this.getEncoding());
}

function setContent (content) {
	this.content = content;
}

function getBody () {
	return this.body;
}

function setBody (body) {
	this.body = body;
}

function getEncoding () {
	return this.encoding;
}

function setEncoding (encoding) {
	this.encoding = encoding;
}

function set (options) {
	if (options.status) {
		this.setStatus(options.status);
	}

	if (options.headers) {
		this.setHeaders(options.headers);
	}

	if (options.encoding) {
		this.setEncoding(options.encoding);
	}

	if ("body" in options) {
		this.setBody(options.body);
	}

	if (options.finish) {
		this.on("finish", options.finish);
	}
}

function copy () {
	return new this.constructor(this);
}

module.exports = Response;
