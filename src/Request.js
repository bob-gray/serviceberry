"use strict";

require("solv/src/object/for-each");

const EventEmitter = require("events"),
	headersAccessor = require("./headersAccessor"),
	url = require("url"),
	querystring = require("querystring"),
	contentType = require("content-type"),
	{randomBytes} = require("crypto");

class Request extends EventEmitter {
	constructor (incomingMessage) {
		super();

		Object.assign(this, {
			incomingMessage,
			headers: incomingMessage.headers,
			id: createId(),
			startStamp: process.hrtime(),
			contentType: parseContentType(incomingMessage),
			pathParams: {},
			content: ""
		});

		this.remainingPath = this.getUrl().pathname.slice(1);
		incomingMessage.setEncoding(this.getEncoding());
	}

	copy () {
		var copied = Object.create(this.constructor.prototype);

		return Object.assign(copied, this);
	}

	getId () {
		return this.id;
	}

	getIp () {
		return this.incomingMessage.socket.remoteAddress;
	}

	getProtocol () {
		var protocol = this.getHeader("X-Forwarded-Proto") || "http";

		if (this.incomingMessage.connection.encrypted) {
			protocol = "https";
		}

		return protocol;
	}

	getPort () {
		return this.incomingMessage.socket.localPort;
	}

	getHost () {
		return this.getHeader("host");
	}

	getMethod () {
		return this.incomingMessage.method;
	}

	getUrl () {
		return url.parse(this.incomingMessage.url);
	}

	getFullUrl () {
		return this.getProtocol() + "://" + this.getHost() + this.getUrl().href;
	}

	getParam (name) {
		var params = this.getParams();

		return params[name];
	}

	getParams () {
		var body = this.getBody();

		if (typeof body === "undefined") {
			body = {};
		} else if (typeof body !== "object" || Array.isArray(body)) {
			body = {body};
		}

		return Object.assign({}, body, this.getQueryParams(), this.pathParams);
	}

	getPathParam (name) {
		return this.pathParams[name];
	}

	getPathParams () {
		return Object.assign({}, this.pathParams);
	}

	getQueryParam (name) {
		var params = this.getQueryParams();

		return params[name];
	}

	getQueryParams () {
		return querystring.parse(this.getUrl().query);
	}

	getAllowedMethods (allow) {
		return this.allowedMethods;
	}

	setAllowedMethods (allow) {
		this.allowedMethods = allow;
	}

	getBody () {
		return this.body;
	}

	setBody (body) {
		this.body = body;
	}

	getContent () {
		return this.content;
	}

	setContent (content) {
		this.content = content;
	}

	getContentType () {
		return this.contentType && this.contentType.type;
	}

	getEncoding () {
		return this.contentType && (this.contentType.parameters.charset || "utf-8");
	}

	getElapsedTime () {
		const seconds = 0,
			nanoseconds = 1,
			milliseconds = 1e3,
			elapsed = process.hrtime(this.startStamp);

		return elapsed[seconds] * milliseconds +
			elapsed[nanoseconds] / milliseconds / milliseconds;
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
		parsed = contentType.parse(incomingMessage);
	} catch (error) {
		// throws if missing header or header is malformed
	}

	return parsed;
}

module.exports = Request;
