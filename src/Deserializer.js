"use strict";

require("solv/src/function/curry");

const createClass = require("solv/src/class");
const form = require("./serviceberry-form");
const json = require("./serviceberry-json");

const Deserializer = createClass(
	{
		name: "Deserializer",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "handlers",
			type: "object",
			default: {
				[form.contentType]: form.deserialize,
				[json.contentType]: json.deserialize
			}
		}]
	},
	init
);

Deserializer.method(
	{
		name: "set",
		arguments: [{
			name: "handlers",
			type: "object"
		}]
	},
	setMany
);

Deserializer.method(
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

Deserializer.method(
	{
		name: "deserialize",
		arguments: [{
			name: "request",
			type: "object"
		}, {
			name: "response",
			type: "object"
		}],
		returns: "promise"
	},
	deserialize
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

function deserialize (request, response) {
	var handler = this.invoke(getHandler, request);

	if (!handler) {
		handler = getRawContent;
	}

	return new Promise(this.proxy(read, request))
		.then(handler.bind(this, request, response));
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
