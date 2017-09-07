"use strict";

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const http = require("http");
const TrunkNode = require("./TrunkNode");
const Request = require("./Request");
const Response = require("./Response");

meta.define("./Branch", require("./Branch"));

const Trunk = createClass(
	meta({
		"name": "Trunk",
		"type": "class",
		"extends": "./Branch",
		"description": "HTTP service trunk",
		"arguments": [{
			"name": "options",
			"type": "object"
		}]
	}),
	init
);

Trunk.method(
	meta({
		"name": "start",
		"arguments": [{
			"name": "callback",
			"type": "function",
			"required": false
		}]
	}),
	start
);

function init (options) {
	this.options = options;
	this.server = http.createServer();
	this.node = new TrunkNode(options);
}

function start (callback) {
	var options = this.options;

	this.server.on("request", this.proxy(respond))
		.listen(options.port, options.host, options.backlog, callback);
}

function respond (incomingMessage, serverResponse) {
	var response = new Response({serverResponse, trunk: this}),
		request = new Request({incomingMessage, response});

	response.setSerializers(this.options.serializers);
	request.setDeserializers(this.options.deserializers);
	request.plotRoute(this);
	request.begin();
}

module.exports = Trunk;