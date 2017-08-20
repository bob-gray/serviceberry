"use strict";

require("solv/src/abstract/base");

var Response,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta");

Response = createClass(
	meta({
		"name": "Response",
		"type": "class",
		"extends": "solv/src/abstract/base",
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
		"name": "writeHead",
		"arguments": [{
			"name": "statusCode",
			"type": "number"
		}, {
			"name": "statusMessage",
			"type": "string",
			"required": false
		}, {
			"name": "headers",
			"type": "object",
			"required": false
		}]
	}),
	writeHead
);

Response.method(
	meta({
		"name": "send",
		"arguments": [{
			"name": "data",
			"type": "string",
			"required": false
		}, {
			"name": "encoding",
			"type": "string",
			"required": false
		}, {
			"name": "callback",
			"type": "function",
			"required": false
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

function init (serverResponse) {
	this.serverResponse = serverResponse;
}

function writeHead () {
	var response = this.serverResponse;

	return response.writeHead.apply(response, arguments);
}

function send () {
	var response = this.serverResponse;

	return response.end.apply(response, arguments);
}

function notFound () {
	return this.invoke(respond, 404);
}

function notAllowed () {
	return this.invoke(respond, 405);
}

function unsupported () {
	return this.invoke(respond, 415);
}

function notAcceptable () {
	return this.invoke(respond, 406);
}

function unauthorized () {
	return this.invoke(respond, 401);
}

function forbidden () {
	return this.invoke(respond, 403);
}

function respond (statusCode) {
	this.serverResponse.writeHead(statusCode);

	return this.serverResponse.end();
}

module.exports = Response;