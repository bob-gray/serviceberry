"use strict";

const createClass = require("solv/src/class");
const type = require("solv/src/type");
const HttpError = require("./HttpError");
const Binder = require("./Binder");
const Deserializer = require("./Deserializer");
const Serializer = require("./Serializer");

const Director = createClass(
	{
		name: "Director",
		type: "class",
		extends: require("solv/src/abstract/base"),
		arguments: [{
			name: "properties",
			type: "object"
		}],
		properties: {
			request: {
				type: "object"
			},
			response: {
				type: "object"
			},
			route: {
				type: "object"
			}
		}
	},
	init
);

Director.method(
	{
		name: "run",
		arguments: [{
			name: "route",
			type: "object"
		}]
	},
	run
);

function init () {
	this.binder = new Binder();
	this.request.incomingMessage.on("error", this.proxy(fail));
}

function run (route) {
	this.route = route;
	this.invoke(deserialize).then(this.proxy(runRoute));
}

function deserialize () {
	var deserializer = new Deserializer(this.route.options.deserializers);

	this.invoke(bind);

	return this.binder.execute(deserializer.proxy("deserialize"), this.request, this.response)
		.then(this.request.proxy("setBody"))
		.catch(this.proxy(setDeserializeFail));
}

function runRoute () {
	var handler = this.route.getNextHandler();

	if (handler) {
		this.invoke(callHandler, handler);
	} else {
		this.invoke(fail, "Request proceed called when handler queue is empty");
	}
}

function bind () {
	var binder = this.binder;

	this.request = this.request.copy();
	this.response = this.response.copy();

	binder.bind(this.request, "proceed", binder.proxy("proceed"));
	binder.bind(this.request, "fail", binder.proxy("fail"));
	binder.bind(this.response, "send", this.proxy(send));
}

function setDeserializeFail (error) {
	this.request.getBody = () => {throw error};
}

function callHandler (handler) {
	this.invoke(bind);
	setImmediate(this.proxy(execute, handler));
}

function execute (handler) {
	this.binder.execute(handler, this.request, this.response)
		.then(this.proxy(runRoute))
		.catch(this.proxy(fail));
}

function fail (error) {
	var handler = this.route.getNextFailHandler();

	error = new HttpError(error);
	this.request.error = error;

	if (handler) {
		this.invoke(callHandler, handler);
	} else {
		this.invoke(send, {
			status: error.getStatus(),
			headers: error.getHeaders(),
			body: error.getMessage()
		});
	}
}

function send (options) {
	this.response.set(options);
	this.invoke(serialize).then(this.proxy(end));
}

function serialize () {
	var serializer = new Serializer(this.route.options.serializers);

	this.invoke(bind);

	return this.binder.execute(serializer.proxy("serialize"), this.request, this.response)
		.then(this.response.proxy("setContent"))
		.catch(this.proxy(fail));
}

function end () {
	var response = this.response,
		serverResponse = response.serverResponse,
		content;

	content = response.getContent();

	if (!content.length && response.is("OK")) {
		response.setStatus(statusCodes.NO_CONTENT);
	} else if (content.length && response.withoutHeader("Content-Length")) {
		response.setHeader("Content-Length", content.length);
	}

	serverResponse.writeHead(
		response.getStatusCode(),
		response.getStatusText(),
		response.getHeaders()
	);

	// TODO: maybe don't send the body on 204 and 304 - node might already not send HEAD body
	if (content.length && this.request.getMethod() !== "HEAD") {
		serverResponse.write(content, response.getEncoding());
	}

	serverResponse.end();
}

/*
TODO: implement timeout option here in the director
function setTimer () {
	var timeout,
		wait = this.timeout - (Date.now() - this.time);

	if (this.timeout) {
		timeout = setTimeout(this.proxy(timeout), wait);
		timeout.unref();
	}
}

function timeoutError () {
	return new HttpError("Request timed out", statusCodes.SERVICE_UNAVAILABLE);
}

function setTimeout_ (timeout) {
	this.timeout = timeout;
}
*/

module.exports = Director;
