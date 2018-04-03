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
			process.nextTick(this.proxy("start"));
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

	use (handler) {
		if (this === this.root) {
			super.use(handler);
		} else {
			this.root.use(handler);
		}

		return this;
	}

	catch (handler) {
		if (this === this.root) {
			super.catch(handler);
		} else {
			this.root.catch(handler);
		}

		return this;
	}

	start (callback) {
		var {port, host, backlog} = this.options;

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
		route = new Route(this.root.node, request, response);

	director.run(route);
}

module.exports = Trunk;
