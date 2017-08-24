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
	this.node = new TrunkNode();
}

function start (callback) {
	this.server.on("request", this.proxy(respond));

	this.server.listen(
		this.options.port,
		this.options.host,
		this.options.backlog,
		callback
	);
}

function respond (incomingMessage, serverResponse) {
	var response = new Response(serverResponse),
		request = new Request({incomingMessage, response});

	request.plotRoute(this);
	response.setSerializers(this.options.serializers);
	request.begin();
}

module.exports = Trunk;