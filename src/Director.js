"use strict";

const Base = require("solv/src/abstract/base"),
	Binding = require("./Binding"),
	Deserializer = require("./Deserializer"),
	Serializer = require("./Serializer"),
	HttpError = require("./HttpError");

class Director extends Base {
	constructor (request, reponse) {
		super();
		request.incomingMessage.on("error", this.proxy(fail));
		this.request = request;
		this.response = reponse;
	}

	run (route) {
		this.route = route;
		this.invoke(setTimer);
		this.invoke(deserialize).then(this.proxy(proceed));
	}
}

function deserialize () {
	var deserializer = new Deserializer(this.route.options.deserializers);

	return this.invoke(bind)
		.call(deserializer.proxy("deserialize"), this.request, this.response)
		.then(this.request.proxy("setBody"))
		.catch(this.proxy(setDeserializeFail));
}

function proceed () {
	var handler = this.route.getNextHandler();

	if (handler) {
		this.invoke(callHandler, handler);
	} else {
		this.invoke(send, {
			body: this.request.latestResult
		});
	}
}

function fail (error) {
	const handler = this.route.getNextCoping();

	error = new HttpError(...toArray(error));

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

function serialize () {
	var serializer = new Serializer(this.route.options.serializers);

	return this.invoke(bind)
		.call(serializer.proxy("serialize"), this.request, this.response)
		.then(this.response.proxy("setContent"))
		.catch(this.proxy(fail));
}

function bind () {
	var binding = new Binding();

	this.request = this.request.copy();
	this.response = this.response.copy();

	return binding.bind(this.request, "proceed")
		.bind(this.request, "fail")
		.bind(this.response, "send", this.proxy(send));
}

function callHandler (handler) {
	setImmediate(this.proxy(call, handler));
}

function call (handler) {
	this.invoke(bind)
		.call(handler, this.request, this.response)
		.then(this.proxy(setLatestResult))
		.then(this.proxy(proceed))
		.catch(this.proxy(fail));
}

function send (options = {}) {
	this.response.set(options);
	this.invoke(serialize).then(this.proxy(end));
}

// eslint-disable-next-line max-statements
// eslint-disable-next-line complexity
function end () {
	var response = this.response,
		{serverResponse} = response,
		content = response.getContent();

	if (!content.length && response.is("OK")) {
		response.setStatus("No Content");
	} else if (content.length && response.withoutHeader("Content-Length")) {
		response.setHeader("Content-Length", content.length);
	}

	if (!content.length) {
		response.removeHeader("Content-Type");
	}

	serverResponse.writeHead(
		response.getStatusCode(),
		response.getStatusText(),
		response.getHeaders()
	);

	// TODO: maybe check status instead or as well (204, 304, ...)
	if (content.length) {
		serverResponse.write(content, response.getEncoding());
	}

	clearTimeout(this.timer);

	serverResponse.end();
}

function setLatestResult (result) {
	this.request.latestResult = result;
}

function setDeserializeFail (error) {
	this.request.getBody = () => {
		throw error;
	};
}

function setTimer () {
	var timeout = this.route.options.timeout;

	if (timeout) {
		this.timer = setTimeout(this.proxy(timedOut), timeout);
		this.timer.unref();
	}
}

function timedOut () {
	this.invoke(fail, [
		"Request timed out",
		"Service Unavailable"
	]);
}

function toArray (value) {
	return [].concat(value);
}

module.exports = Director;
