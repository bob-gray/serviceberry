"use strict";

const Base = require("solv/src/abstract/base");

class HandlersResolver extends Base {
	constructor () {
		super();
		this.resolved = this.invoke(init);
	}
}

async function init () {
	await nextTick();

	return this.invoke(resolveHandlers);
}

function nextTick () {
	return new Promise(process.nextTick);
}

async function resolveHandlers () {
	var resolve = Promise.resolve.bind(Promise),
		handlers = this.handlers.map(resolve),
		catches = this.catches.map(resolve);

	handlers = await Promise.all(handlers);
	catches = await Promise.all(catches);

	this.handlers = handlers.map(prepareHandler);
	this.catches = catches.map(prepareHandler);
}

function prepareHandler (handler) {
	if (typeof handler !== "function" && typeof handler.use === "function") {
		handler = handler.use.bind(handler);
	}

	if (typeof handler !== "function") {
		badHandler();
	}

	return handler;
}

function badHandler () {
	throw new Error("handler must be a function or an object with a `use` method");
}

module.exports = HandlersResolver;
