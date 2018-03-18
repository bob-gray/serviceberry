"use strict";

const createClass = require("solv/src/class");
const json = require("serviceberry-json");

const Serializer = createClass(
	{
		name: "Serializer",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "handlers",
			type: "object",
			default: {
				[json.contentType]: json.serialize
			}
		}]
	},
	init
);

Serializer.method(
	{
		name: "set",
		arguments: [{
			name: "handlers",
			type: "object"
		}]
	},
	setMany
);

Serializer.method(
	{
		name: "set",
		arguments: [{
			name: "contentType",
			type: "string"
		}, {
			name: "handler",
			type: "function"
		}]
	},
	set
);

Serializer.method(
	{
		name: "serialize",
		arguments: [{
			name: "request",
			type: "object"
		}, {
			name: "response",
			type: "object"
		}]
	},
	serialize
);

function init (handlers) {
	this.handlers = handlers;
}

function setMany (handlers) {
	Object.merge(this.handlers, handlers);
}

function set (contentType, handler) {
	this.handlers[contentType] = handler;
}

function serialize (request, response) {
	var handler = this.invoke(getHandler, response),
		serialized;

	if (handler) {
		serialized = handler.call(this, request, response);
	} else {
		serialized = response.getBody();
	}

	return serialized;
}

function getHandler (response) {
	var type = response.getContentType();

	return this.handlers[type];
}

module.exports = Serializer;
