"use strict";

require("solv/src/object/merge");
require("solv/src/object/copy");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const url = require("url");
const querystring = require("querystring");
const Route = require("./Route");

const Request = createClass(
	meta({
		"name": "Request",
		"type": "class",
		"mixins": "solv/src/abstract/emitter",
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
		"returns": "string|undefined"
	}),
	getContentType
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
	{
		name: "proceed",
		arguments: []
	},
	proceed
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
	if (!this.begun) {
		this.url = url.parse(this.incomingMessage.url);
		this.path = this.url.pathname;
		this.pathParams = {};
	}

	this.proceed = this.constructor.prototype.proceed.bind(this);
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
	return Object.merge(this.getQueryParams(), this.pathParams);
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

function getHeader (name) {
	var headers = this.getHeaders();

	return headers[name.toLowerCase()];
}

function getHeaders () {
	return this.incomingMessage.headers;
}

function getContentType () {
	return this.getHeader("content-type");
}

function getAccept () {
	return this.getHeader("accept");
}

function begin () {
	this.begun = true;
	this.route.begin(this);
}

function proceed () {
	this.route.proceed(this);
}

function copy () {
	return new this.constructor(this);
}

function plotRoute (trunk) {
	this.route = new Route(trunk);
	this.plot(trunk.node);
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

module.exports = Request;