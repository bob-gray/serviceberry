"use strict";

require("solv/src/object/merge");
require("solv/src/object/copy");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const type = require("solv/src/type");
const url = require("url");
const querystring = require("querystring");

const Request = createClass(
	meta({
		"name": "Request",
		"type": "class",
		"mixins": [
			"solv/src/abstract/base",
			"solv/src/abstract/emitter"
		],
		"description": "HTTP request object",
		"arguments": [{
			"name": "properties",
			"type": "object",
			"properties": {
				"incomingMessage": {
					"type": "object"
				},
				"response": {
					"type": "object"
				}
			}
		}]
	}),
	init
);

Request.method(
	meta({
		"name": "setOptions",
		"arguments": [{
			"name": "options",
			"type": "object"
		}]
	}),
	setOptions
);

Request.method(
	meta({
		"name": "getMethod",
		"arguments": [],
		"returns": "string"
	}),
	getMethod
);

Request.method(
	meta({
		"name": "getUrl",
		"arguments": [],
		"returns": "string"
	}),
	getUrl
);

Request.method(
	meta({
		"name": "getParam",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "string|undefined"
	}),
	getParam
);

Request.method(
	meta({
		"name": "getParams",
		"arguments": [],
		"returns": "object"
	}),
	getParams
);

Request.method(
	meta({
		"name": "getPathParam",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "string|undefined"
	}),
	getPathParam
);

Request.method(
	meta({
		"name": "getPathParams",
		"arguments": [],
		"returns": "object"
	}),
	getPathParams
);

Request.method(
	meta({
		"name": "getQueryParam",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "string|undefined"
	}),
	getQueryParam
);

Request.method(
	meta({
		"name": "getQueryParams",
		"arguments": [],
		"returns": "object"
	}),
	getQueryParams
);

Request.method(
	meta({
		"name": "getHeader",
		"arguments": [{
			"name": "name",
			"type": "string"
		}],
		"returns": "string|array|undefined"
	}),
	getHeader
);

Request.method(
	meta({
		"name": "getHeaders",
		"arguments": [],
		"returns": "object"
	}),
	getHeaders
);

Request.method(
	meta({
		"name": "getContentType",
		"arguments": [],
		"returns": "string"
	}),
	getContentType
);

Request.method(
	meta({
		"name": "getEncoding",
		"arguments": [],
		"returns": "string"
	}),
	getEncoding
);

Request.method(
	meta({
		"name": "getAccept",
		"arguments": [],
		"returns": "string|undefined"
	}),
	getAccept
);

Request.method(
	meta({
		"name": "getContent",
		"arguments": [],
		"returns": "string"
	}),
	getContent
);

Request.method(
	{
		name: "setContent",
		arguments: [{
			name: "content",
			type: "string"
		}]
	},
	setContent
);

Request.method(
	meta({
		"name": "getBody",
		"arguments": [],
		"returns": "any"
	}),
	getBody
);

Request.method(
	meta({
		"name": "setBody",
		"arguments": [{
			"name": "body",
			"type": "any"
		}]
	}),
	setBody
);

Request.method(
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

	this.time = Date.now();
	this.invoke(parseContentType);
	this.incomingMessage.setEncoding(this.getEncoding());
	this.url = url.parse(this.incomingMessage.url);
	this.path = this.url.pathname;
	this.pathParams = {};
	this.content = "";
}

function getMethod () {
	return this.incomingMessage.method;
}

function getUrl () {
	return this.incomingMessage.url;
}

function getParam (name) {
	var params = this.getParams();

	return params[name];
}

function getParams () {
	var body = this.getBody();

	if (body && type.is.not("object", body)) {
		body = {body};
	} else {
		body = {};
	}

	return Object.merge({}, body, this.getQueryParams(), this.pathParams);
}

function getPathParam (name) {
	return this.pathParams[name];
}

function getPathParams () {
	return Object.copy(this.pathParams);
}

function getQueryParam (name) {
	var params = this.getQueryParams();

	return params[name];
}

function getQueryParams () {
	return querystring.parse(this.url.query);
}

function getBody () {
	return this.body;
}

function setBody (body) {
	this.body = body;
}

function getContent () {
	return this.content;
}

function setContent (content) {
	this.content = content;
}

function getHeader (name) {
	var headers = this.getHeaders();

	return headers[name.toLowerCase()];
}

function getHeaders () {
	return this.incomingMessage.headers;
}

function parseContentType () {
	// throws if missing header or header is malformed
	try {
		this.contentType = contentType.parse(this.incomingMessage);
	} catch (error) {
		this.contentType = {
			type: "text/plain",
			parameters: {
				charset: "utf-8"
			}
		};
	}
}

function getContentType () {
	return this.contentType.type;
}

function getEncoding () {
	return this.contentType.parameters.charset || "utf-8";
}

function getAccept () {
	return this.getHeader("Accept");
}

function setOptions (options) {
	Object.forEach(options, this.proxy(setOption));
}

function setOption (value, name) {
	var setter = "set" + name.charAt(0).toUpperCase() + name.slice(1);

	if (setter in this) {
		this[setter](value);
	}
}

function copy () {
	return new this.constructor(this);
}

module.exports = Request;
