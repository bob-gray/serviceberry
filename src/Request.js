"use strict";

require("solv/src/object/merge");
require("solv/src/object/copy");
require("solv/src/function/constrict");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const type = require("solv/src/type");
const url = require("url");
const querystring = require("querystring");
const Route = require("./Route");
const json = require("./serviceberry-json");
const form = require("./serviceberry-form");
const HttpError = require("./HttpError");
const statusCodes = require("./statusCodes");

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
		"name": "setDeserializer",
		"arguments": [{
			"name": "contentType",
			"type": "string"
		}, {
			"name": "deserializer",
			"type": "function"
		}]
	}),
	setDeserializer
);

Request.method(
	meta({
		"name": "setDeserializers",
		"arguments": [{
			"name": "deserializers",
			"type": "object",
			"default": {}
		}]
	}),
	setDeserializers
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
		"name": "setTimeout",
		"arguments": [{
			"name": "milliseconds",
			"type": "number"
		}]
	}),
	setTimeout_
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
	meta({
		"name": "getBody",
		"arguments": [],
		"returns": "any"
	}),
	getBody
);

Request.method(
	{
		name: "plotRoute",
		arguments: [{
			name: "trunk",
			type: "object"
		}]
	},
	plotRoute
);

Request.method(
	{
		name: "plot",
		arguments: [{
			name: "node",
			type: "object"
		}]
	},
	plot
);

Request.method(
	{
		name: "begin",
		arguments: []
	},
	begin
);

Request.method(
	meta({
		name: "proceed",
		arguments: []
	}),
	proceed
);

Request.method(
	meta({
		"name": "fail",
		"arguments": [{
			"name": "error",
			"type": "any"
		}]
	}),
	fail
);

Request.method(
	{
		name: "copy",
		arguments: [],
		returns: "object"
	},
	copy
);

function init () {
	this.response.request = this;
	this.proceed = this.constructor.prototype.proceed.bind(this).constrict();
	this.fail = this.constructor.prototype.fail.bind(this).constrict(0, 1);

	if (!this.begun) {
		this.time = Date.now();
		this.invoke(parseContentType);
		this.url = url.parse(this.incomingMessage.url);
		this.path = this.url.pathname;
		this.pathParams = {};
		this.content = "";
		this.deserializers = {};
		this.setDeserializer(json.contentType, json.deserialize);
		this.setDeserializer(form.contentType, form.deserialize);
		this.incomingMessage.on("error", this.fail);
	}
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

	return Object.merge({}, this.getQueryParams(), body, this.pathParams);
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

function getContent () {
	return this.content;
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

function setDeserializers (deserializers) {
	Object.merge(this.deserializers, deserializers);
}

function setDeserializer (contentType, deserializer) {
	this.deserializers[contentType] = deserializer;
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

function setTimeout_ (timeout) {
	this.timeout = timeout;
}

function begin () {
	this.begun = true;
	this.invoke(setTimer);
	this.incomingMessage.setEncoding(this.getEncoding());
	new Promise(this.proxy(read))
		.then(this.proxy(deserialize))
		.then(this.proxy(beginRoute));
}

function setTimer () {
	var timeout,
		wait = this.timeout - (Date.now() - this.time);

	if (this.timeout) {
		timeout = setTimeout(() => this.fail(timeoutError()), wait);
		timeout.unref();
	}
}

function read (resolve) {
	this.incomingMessage.on("data", this.proxy(writeContent));
	this.incomingMessage.on("end", resolve);
}

function writeContent (content) {
	this.content += content;
}

function deserialize () {
	var type = this.getContentType();

	if (type in this.deserializers) {
		this.body = this.deserializers[type](this, this.response);
	}

	if (!this.body) {
		this.body = this.content;
	}
}

function proceed () {
	this.route.proceed(this);
}

function fail (error) {
	this.route.fail(error);
}

function copy () {
	return new this.constructor(this);
}

function plotRoute (trunk) {
	this.route = new Route(trunk);
	this.plot(trunk.node);
}

function beginRoute () {
	this.route.begin(this);
}

function plot (node) {
	var next;

	this.route.add(node.handlers);
	this.route.catch(node.catches);
	node.transition(this, this.response);
	next = node.chooseNext(this, this.response);

	if (next) {
		this.plot(next);
	}
}

function timeoutError () {
	return new HttpError("Request timed out", statusCodes.SERVICE_UNAVAILABLE);
}

module.exports = Request;