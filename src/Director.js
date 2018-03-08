"use strict";

const createClass = require("solv/src/class");
const type = require("solv/src/type");
const HttpError = require("./HttpError");
const Binder = require("./Binder");
const Operator = require("./Operator");
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
			}
		}
	}
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

function run (route) {
	this.route = route;
	this.request.incomingMessage.on("error", this.proxy(fail));
	this.operator = new Operator();
	this.invoke(deserialize).then(this.proxy(proceed));
}

function deserialize () {
	var deserializer = new Deserializer(this.route.options.deserializers),
		binder = this.invoke(bind);

	return this.operator.call(deserializer.proxy("deserialize"), this.request, this.response)
		.then(this.request.proxy("setBody"))
		.catch(this.proxy(setDeserializeFail))
		.then(binder.proxy("unbind"));
}

function proceed () {
	var handler = this.route.getNextHandler();

	if (handler) {
		this.invoke(callHandler, handler);
	} else {
		this.invoke(fail, "Request proceed called when handler queue was empty");
	}
}

function bind () {
	var binder = new Binder();

	this.request = this.request.copy();
	this.response = this.response.copy();

	return binder.bind(this.request, "proceed", this.operator.resolve)
		.bind(this.request, "fail", this.operator.reject)
		.bind(this.response, "send", this.proxy("delay", send));
}

function setDeserializeFail (error) {
	this.request.getBody = () => {throw error};
}

function callHandler (handler) {
	var binder = this.invoke(bind);

	setImmediate(this.proxy(call, handler, binder));
}

function call (handler, binder) {
	this.operator.call(handler, this.request, this.response)
		.then(this.proxy(proceed))
		.catch(this.proxy(fail))
		.then(binder.proxy("unbind"));
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
	var serializer = new Serializer(this.route.options.serializers),
		binder = this.invoke(bind);

	return this.operator.call(serializer.proxy("serialize"), this.request, this.response)
		.then(this.response.proxy("setContent"))
		.catch(this.proxy(fail))
		.then(binder.proxy("unbind"));
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
