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
		"description": "HTTP service",
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
		"arguments": []
	}),
	start
);

function init (options) {
	this.options = options;
	this.server = http.createServer();
	this.node = new TrunkNode();
}

function start () {
	this.server.on("request", this.proxy(respond));

	this.server.listen(
		this.options.port,
		this.options.hostname,
		this.options.backlog
	);
}

function respond (incomingMessage, serverResponse) {
	var response = new Response(serverResponse),
		request = new Request({
			service: this,
			incomingMessage: incomingMessage,
			response: response,
			route: new Route()
		});

	this.invoke(plotRoute, request, this.node);

	if (request.notFound) {
		response.notFound();
	} else if (request.notAllowed) {
		response.notAllowed();
	} else if (request.unsupported) {
		response.unsupported();
	} else if (request.unacceptable) {
		response.unacceptable();
	} else {
		request.proceed();
	}
}

function plotRoute (request, current) {
	var next;

	request.route.add(current.handlers);
	request.route.catch(current.catches);
	current.transition(request);
	
	next = current.chooseNext(request);
	
	if (next) {
		return this.invoke(plotRoute, request, next);
	}
}

module.exports = Trunk;