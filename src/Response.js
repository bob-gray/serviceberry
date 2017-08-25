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
			"name": "serverResponse",
			"type": "object"
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

// TODO: support thenable async serializers
// TODO: handle timeout and throw timeout error

function init (serverResponse) {
	this.invoke(StatusAccessor.init);
	this.invoke(HeadersAccessor.init);
	this.invoke(initSerializers);
	this.setEncoding("utf-8");
	this.sendBody = true;
	serverResponse.on("finish", this.proxy("trigger", "finish"));
	serverResponse.on("error", this.proxy("fail"));
	this.serverResponse = serverResponse;
}

function send (options) {
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

	// TODO: maybe don't send the body on 204 and 304
	if (content.length && this.sendBody) {
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

function setSendBody (sendBody) {
	this.sendBody = sendBody;
}

function getSendBody () {
	return this.sendBody;
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

	if ("sendBody" in options) {
		this.setSendBody(options.sendBody);
	}

	if (options.finished) {
		this.on("finish", options.finish);
	}
}

module.exports = Response;