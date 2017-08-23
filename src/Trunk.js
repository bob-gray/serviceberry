"use strict";

var Trunk,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	http = require("http"),
	TrunkNode = require("./TrunkNode"),
	Request = require("./Request"),
	Response = require("./Response"),
	Route = require("./Route");

meta.define("./Branch", require("./Branch"));

Trunk = createClass(
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
	// TODO: maybe listen and trigger request event here on trunk for easy general purpose service level logging

	this.server.listen(
		this.options.port,
		this.options.host,
		this.options.backlog,
		callback
	);
}

function respond (incomingMessage, serverResponse) {
	var response = new Response(serverResponse),
		request = new Request({
			incomingMessage: incomingMessage,
			response: response,
			route: new Route(this)
		});

	response.setSerializers(this.options.serializers);
	this.invoke(plotRoute, request, response, this.node);

	request.proceed();
}

function plotRoute (request, response, current) {
	var next;

	request.route.add(current.handlers);
	request.route.catch(current.catches);
	current.transition(request, response);
	
	next = current.chooseNext(request, response);
	
	if (next) {
		return this.invoke(plotRoute, request, response, next);
	}
}

module.exports = Trunk;