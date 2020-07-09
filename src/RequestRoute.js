"use strict";

const {freeze} = require("./class"),
	Route = require("./Route");

module.exports = freeze(class RequestRoute extends Route {
	#remainingPaths = new WeakMap();
	#remainingPath;

	constructor (root, request, response) {
		const {remainingPath} = request;

		super();

		this.plot(root, request, response);
		request.remainingPath = remainingPath;
	}

	add (handlers, request) {
		handlers.forEach(handler => this.#remainingPaths.set(handler, request.remainingPath));

		return super.add(handlers);
	}

	getNextHandler () {
		const handler = super.getNextHandler();

		this.#remainingPath = this.#remainingPaths.get(handler);

		return handler;
	}

	get remainingPath () {
		return this.#remainingPath;
	}
});
