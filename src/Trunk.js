"use strict";

const Branch = require("./Branch"),
	http = require("http"),
	BranchNode = require("./BranchNode"),
	Request = require("./Request"),
	Response = require("./Response"),
	RequestRoute = require("./RequestRoute"),
	Director = require("./Director"),
	defaultOptions = {
		port: 3000,
		path: "",
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

		if (this.options.autoStart) {
			setImmediate(this.proxy("start"));
		}

		if (this.options.callback) {
			this.server.on("listening", this.options.callback);
		}
	}

	createNode (options) {
		this.node = new BranchNode(options);

		if (options.path && options.path !== "/") {
			this.root = new Branch();
			this.root.node.branches.push(this.node);
		} else {
			this.root = this;
		}
	}

	use (...handlers) {
		if (this === this.root) {
			super.use(...handlers);
		} else {
			this.root.use(...handlers);
		}

		return this;
	}

	cope (...handlers) {
		if (this === this.root) {
			super.cope(...handlers);
		} else {
			this.root.cope(...handlers);
		}

		return this;
	}

	async start (callback) {
		var {port, host, backlog} = this.options;

		await this.node.resolved;

		this.server.on("request", this.proxy(respond))
			.listen(port, host, backlog, callback);
	}

	stop (callback) {
		this.server.close(callback);
	}
}

function respond (incomingMessage, serverResponse) {
	var request = new Request(incomingMessage),
		response = new Response(serverResponse),
		director = new Director(request, response),
		route = new RequestRoute(this.root.node, request, response);

	director.run(route);
}

module.exports = Trunk;
