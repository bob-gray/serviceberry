"use strict";

const Base = require("solv/src/abstract/base"),
	form = require("serviceberry-form"),
	json = require("serviceberry-json"),
	defaultHandlers = {
		[form.contentType]: form.deserialize,
		[json.contentType]: json.deserialize
	};

class Deserializer extends Base {
	constructor (handlers = {}) {
		super();
		this.handlers = {...defaultHandlers, ...handlers};
	}

	set (contentType, handler) {
		var handlers;

		if (arguments.length === 1) {
			handlers = arguments[0];
			Object.assign(this.handers, handlers);
		} else {
			this.handlers[contentType] = handler;
		}
	}

	deserialize (request, response) {
		var handler = this.invoke(getHandler, request);

		if (!handler) {
			handler = getRawContent;
		}

		return new Promise(this.proxy(read, request))
			.then(handler.bind(this, request, response));
	}
}

function read (request, resolve) {
	request.content = "";
	request.incomingMessage.on("data", this.proxy(writeContent, request))
		.on("end", resolve);
}

function writeContent (request, content) {
	request.content += content;
}

function getHandler (request) {
	var type = request.getContentType();

	return this.handlers[type];
}

function getRawContent (request) {
	return request.content;
}

module.exports = Deserializer;
