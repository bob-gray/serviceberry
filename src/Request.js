"use strict";

const headersAccessor = require("./headersAccessor"),
	HttpError = require("./HttpError"),
	{URL} = require("url"),
	querystring = require("querystring"),
	contentType = require("content-type"),
	{randomBytes} = require("crypto");

class Request {
	#startStamp;
	#id;
	#incomingMessage;
	#url;
	#pathParams;
	#headers;
	#contentType;
	#content;
	#body;

	constructor (incomingMessage) {
		this.#startStamp = process.hrtime();
		this.#id = createId();
		this.#incomingMessage = incomingMessage;
		this.#headers = Object.freeze(incomingMessage.headers);
		this.#url = Object.freeze(new URL(this.getFullUrl()));
		this.#pathParams = Object.create(null);
		this.#contentType = parseContentType(incomingMessage);
		this.#content = "";

		this.remainingPath = this.#url.pathname.slice(1);
		incomingMessage.setEncoding(this.getEncoding());
	}

	get incomingMessage () {
		return this.#incomingMessage;
	}

	get pathParams () {
		return this.#pathParams;
	}

	// headersAccessor mixin can't access #headers directly
	get headers () {
		return this.#headers;
	}

	getId () {
		return this.#id;
	}

	getElapsedTime () {
		const seconds = 0,
			nanoseconds = 1,
			milliseconds = 1e3,
			elapsed = process.hrtime(this.#startStamp);

		return (elapsed[seconds] * milliseconds) +
			(elapsed[nanoseconds] / milliseconds / milliseconds);
	}

	getIp () {
		return this.getHeader("X-Forwarded-For") || this.#incomingMessage.socket.remoteAddress;
	}

	getProtocol () {
		var protocol = this.getHeader("X-Forwarded-Proto") || "http";

		if (this.#incomingMessage.connection.encrypted) {
			protocol = "https";
		}

		return protocol;
	}

	getHost () {
		return this.getHeader("X-Forwarded-Host") || this.getHeader("Host");
	}

	getPort () {
		return this.#incomingMessage.socket.localPort;
	}

	getMethod () {
		return this.#incomingMessage.method;
	}

	getUrl () {
		return this.#url;
	}

	getFullUrl () {
		return this.getProtocol() + "://" + this.getHost() + this.#incomingMessage.url;
	}

	setContent (content) {
		this.#content = content;
	}

	getContent () {
		return this.#content;
	}

	getContentType () {
		return this.#contentType && this.#contentType.type;
	}

	getEncoding () {
		return this.#contentType && (this.#contentType.parameters.charset || "utf8");
	}

	getPathParam (name) {
		return getCaseInsensitive(this.#pathParams, name);
	}

	getPathParams () {
		return Object.assign(Object.create(null), this.#pathParams);
	}

	getQueryParam (name) {
		return getCaseInsensitive(this.getQueryParams(), name);
	}

	getQueryParams () {
		return querystring.parse(this.getUrl().search.slice(1));
	}

	setBody (body) {
		this.#body = body;
	}

	getBody () {
		return this.#body;
	}

	getBodyParam (name) {
		return getCaseInsensitive(this.#body || Object.create(null), name);
	}

	getParams () {
		var body = this.#body;

		if (typeof body === "undefined") {
			body = Object.create(null);
		} else if (typeof body !== "object" || Array.isArray(body)) {
			body = {body};
		}

		return Object.assign(Object.create(null), body, this.getQueryParams(), this.#pathParams);
	}

	getParam (name) {
		return getCaseInsensitive(this.getParams(), name);
	}

	setAllowedMethods (allow) {
		this.allowedMethods = allow;
	}

	getAllowedMethods () {
		return this.allowedMethods;
	}

	proceed (latestResult) {
		// Calling proceed on a request proxy yields control
		// and signals to the director to proceed
		this.latestResult = latestResult;
	}

	fail (...args) {
		throw new HttpError(...args);
	}
}

Object.assign(
	Request.prototype,
	headersAccessor.getters
);

function createId () {
	return randomBytes(8).toString("hex").toLowerCase();
}

function parseContentType (incomingMessage) {
	var parsed;

	try {
		parsed = Object.freeze(contentType.parse(incomingMessage));
	} catch (error) {
		// throws if missing header or header is malformed
	}

	return parsed;
}

function getCaseInsensitive (params, name) {
	var lower = name.toLowerCase(),
		param;

	if (name in params) {
		param = params[name];
	} else if (lower in params) {
		param = params[lower];
	}

	return param;
}

module.exports = Request;
