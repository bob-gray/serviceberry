"use strict";

require("solv/src/abstract/base");
require("solv/src/abstract/emitter");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const statusCodes = require("./statusCodes");

meta.define("./StatusAccessor", require("./StatusAccessor"));
meta.define("./HeadersAccessor", require("./HeadersAccessor"));

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
		"name": "notFound",
		"arguments": []
	}),
	notFound
);

Response.method(
	meta({
		"name": "notAllowed",
		"arguments": []
	}),
	notAllowed
);

Response.method(
	meta({
		"name": "unsupported",
		"arguments": []
	}),
	unsupported
);

Response.method(
	meta({
		"name": "notAcceptable",
		"arguments": []
	}),
	notAcceptable
);

Response.method(
	meta({
		"name": "unauthorized",
		"arguments": []
	}),
	unauthorized
);

Response.method(
	meta({
		"name": "forbidden",
		"arguments": []
	}),
	forbidden
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
		"name": "getData",
		"arguments": [],
		"returns": "string|buffer|undefined"
	}),
	getData
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

// TODO: set status to 204 if 200 and no content
// TODO: enable auto serializers before send based on content-type header
// TODO: set content-length on send if body has length and content-length not set
// TODO: handle timeout and throw timeout error

function init (serverResponse) {
	this.serverResponse = serverResponse;
	this.status = {};
	this.headers = {};
	this.setStatus(statusCodes.OK);
	serverResponse.on("finish", this.proxy("trigger", "finish"));
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

function getData () {
	// TODO: return serialized body
	return this.body;
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

	if (options.body) {
		this.setBody(options.body);
	}

	if (options.finished) {
		this.on("finished", options.finished);
	}
}

function send (options) {
	var serverResponse = this.serverResponse,
		status = this.status;

	this.set(options);

	serverResponse.writeHead(status.code, status.text, this.headers);
	serverResponse.end(this.getData(), this.encoding);
}

function notFound () {
	return this.invoke(respond, statusCodes.NOT_FOUND);
}

function notAllowed () {
	return this.invoke(respond, statusCodes.METHOD_NOT_ALLOWED);
}

function unsupported () {
	return this.invoke(respond, statusCodes.UNSUPPORTED_MEDIA_TYPE);
}

function notAcceptable () {
	return this.invoke(respond, statusCodes.NOT_ACCEPTABLE);
}

function unauthorized () {
	return this.invoke(respond, statusCodes.UNAUTHORIZED);
}

function forbidden () {
	return this.invoke(respond, statusCodes.FORBIDDEN);
}

function respond (statusCode) {
	this.serverResponse.writeHead(statusCode);

	return this.serverResponse.end();
}

module.exports = Response;