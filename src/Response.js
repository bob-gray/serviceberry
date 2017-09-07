"use strict";

require("solv/src/abstract/base");
require("solv/src/object/merge");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const statusCodes = require("./statusCodes");
const StatusAccessor = require("./StatusAccessor");
const HeadersAccessor = require("./HeadersAccessor");
const contentType = require("content-type");
const json = require("./serviceberry-json");
const Binder = require("./Binder");

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

Response.method(
	meta({
		"name": "send",
		"arguments": [{
			"name": "options",
			"type": "object",
			"default": {}
		}]
	}),
	send
);

Response.method(
	meta({
		"name": "fail",
		"arguments": [{
			"name": "error",
			"type": "any"
		}]
	}),
	fail
);

Response.method(
	meta({
		"name": "setSerializer",
		"arguments": [{
			"name": "contentType",
			"type": "string"
		}, {
			"name": "serializer",
			"type": "function"
		}]
	}),
	setSerializer
);

Response.method(
	meta({
		"name": "setSerializers",
		"arguments": [{
			"name": "serializers",
			"type": "object",
			"default": {}
		}]
	}),
	setSerializers
);

Response.method(
	meta({
		"name": "serialize",
		"arguments": [],
		"returns": "any"
	}),
	serialize
);

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

// TODO: support thenable async serializers

function init (copied) {
	this.send = this.proxy(guard, send);

	if (copied instanceof this.constructor) {
		this.binder.bind(this);
	} else {
		this.invoke(StatusAccessor.init);
		this.invoke(HeadersAccessor.init);
		this.binder = new Binder(["send"]);
		this.invoke(initSerializers);
		this.setEncoding("utf-8");
		this.serverResponse.on("finish", this.proxy("trigger", "finish"))
			.on("error", this.proxy("fail"));
	}
}

function send (options) {
	if (this.serverResponse.finished) {
		this.trigger("warning", "Response send was called after response was finshed");
	} else {
		this.invoke(finish, options);
	}
}

function finish (options) {
	var serverResponse = this.serverResponse,
		content;

	this.set(options);

	content = this.getContent();

	if (!content.length && this.is("OK")) {
		this.setStatus(statusCodes.NO_CONTENT);
	} else if (content.length && this.withoutHeader("Content-Length")) {
		this.setHeader("Content-Length", content.length);
	}

	serverResponse.writeHead(this.getStatusCode(), this.getStatusText(), this.getHeaders());

	// TODO: maybe don't send the body on 204 and 304 - node might already not send HEAD body
	if (content.length && this.request.getMethod() !== "HEAD") {
		serverResponse.write(content, this.getEncoding());
	}

	serverResponse.end();
}

function fail (error) {
	if (this.request) {
		this.request.fail(error);
	}
}

function initSerializers () {
	this.serializers = {};
	this.setSerializer("application/json", json.serialize);
}

function setSerializer (contentType, serializer) {
	this.serializers[contentType] = serializer;
}

function setSerializers (serializers) {
	Object.merge(this.serializers, serializers);
}

function serialize () {
	var type = this.getContentType(),
		serialized;

	if (type in this.serializers) {
		serialized = this.serializers[type](this.request, this);
	} else {
		serialized = this.getBody();
	}

	return serialized;
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
	var content = this.serialize() || "";
	
	return Buffer.from(content, this.getEncoding());
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

	if (options.finished) {
		this.on("finish", options.finish);
	}
}

function copy () {
	return new this.constructor(this);
}

module.exports = Response;