"use strict";

require("solv/src/object/merge");
require("solv/src/object/copy");

var Request,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	url = require("url"),
	querystring = require("querystring");

Request = createClass(
	meta({
		"name": "Request",
		"type": "class",
		"description": "HTTP request object",
		"arguments": [{
			"name": "properties",
			"type": "object",
			"properties": {
				"service": {
					"type": "object"
				},
				"incomingMessage": {
					"type": "object"
				},
				"response": {
					"type": "object"
				},
				"route": {
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
		"name": "proceed",
		"arguments": []
	}),
	proceed
);

function init () {
	this.url = url.parse(this.incomingMessage.url);
	this.path = this.url.pathname;
	this.remainingPath = this.path;
	this.pathParams = {};
}

function getMethod () {
	return this.incomingMessage.method;
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

	return headers[name];
}

function getHeaders () {
	return this.incomingMessage.headers;
}

function proceed () {
	this.route.proceed(this.service, [this, this.response]);
}

module.exports = Request;