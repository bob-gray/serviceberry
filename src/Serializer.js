"use strict";

const Base = require("solv/src/abstract/base"),
	json = require("serviceberry-json"),
	defaultHandlers = {
		[json.contentType]: json.serialize
	};

class Serializer extends Base {
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

	serialize (request, response) {
		var handler = this.invoke(getHandler, response),
			serialized;

		if (handler) {
			serialized = handler.call(this, request, response);
		} else {
			serialized = response.getBody();
		}

		return serialized;
	}
}

function getHandler (response) {
	var type = response.getContentType();

	return this.handlers[type];
}

module.exports = Serializer;
