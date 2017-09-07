"use strict";

const createClass = require("solv/src/class");

const Deserializer = createClass(
	{
		name: "Deserializer",
		type: "class",
		mixins: require("./Binder"),
		arguments: [{
			name: "request",
			type: "object"
		}]
	},
	init
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
	}
);

Deserializer.method(
	{
		name: "deserialize",
		arguments: [],
		returns: {
			name: "promise",
			type: "object"
		}
	}
);

function init (request) {
	this.request = request;
	this.handlers = {};
	this.invoke(Binder.init, [
		"deserialize"
	]);
}

function set (contentType, handler) {
	this.handlers[contentType] = handler;
}

function deserialize () {
	var request = this.request;

	return new Promise(this.proxy(read))
		.then(this.proxy(getHandler))
		.then(this.proxy(callHandler, request.trunk, request, request.response))
		.then(this.proxy(setBody))
		.then(this.proxy("unbind"));
}

function read (resolve) {
	this.request.content = "";
	this.request.incomingMessage.on("data", this.proxy(writeContent))
		.on("end", resolve);
}

function writeContent (content) {
	this.request.content += content;
}

function getHandler () {
	var type = this.request.getContentType(),
		handler = this.handlers[type];

	if (!handler) {
		handler = this.proxy(getContent);
	}

	return handler;
}

function getContent () {
	return this.content;
}

function setBody (body) {
	this.request.body = body;
}

module.exports = Deserializer;