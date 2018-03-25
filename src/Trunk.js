"use strict";

const Branch = require("./Branch"),
	http = require("http"),
	BranchNode = require("./BranchNode"),
	Request = require("./Request"),
	Response = require("./Response"),
	Route = require("./Route"),
	Director = require("./Director"),
	defaultOptions = {
		port: 3000,
		path: "/",
		autoStart: true,
		timeout: 10000
	};

class Trunk extends Branch {
	static create (options) {
		return new Trunk(options);
	}

	constructor (options = {}) {
		super({...defaultOptions, ...options});

		this.server = http.createServer();

		if (options.autoStart) {
			process.nextTick(this.proxy("start"));
		}

		if (options.callback) {
			this.server.on("listening", options.callback);
		}
	}

	createNode (options) {
		this.node = new BranchNode(options);
	}

	start (callback) {
		var options = this.options;

		this.server.on("request", this.proxy(respond))
			.listen(options.port, options.host, options.backlog, callback);
	}
}

function respond (incomingMessage, serverResponse) {
	var request = new Request(incomingMessage),
		response = new Response(serverResponse),
		director = new Director(request, response),
		route = new Route(this.node, request, response);

	director.run(route);
}

module.exports = Trunk;
