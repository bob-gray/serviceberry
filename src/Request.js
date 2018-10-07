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

	getElapsedTime () {
		const seconds = 0,
			nanoseconds = 1,
			milliseconds = 1e3,
			elapsed = process.hrtime(this.startStamp);

		return (elapsed[seconds] * milliseconds) +
			(elapsed[nanoseconds] / milliseconds / milliseconds);
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

	getHost () {
		return this.getHeader("Host");
	}

	getPort () {
		return this.incomingMessage.socket.localPort;
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

	setContent (content) {
		this.content = content;
	}

	getContent () {
		return this.content;
	}

	getContentType () {
		return this.contentType && this.contentType.type;
	}

	getEncoding () {
		return this.contentType && (this.contentType.parameters.charset || "utf-8");
	}

	getPathParam (name) {
		return this.pathParams[name.toLowerCase()];
	}

	getPathParams () {
		return Object.assign({}, this.pathParams);
	}

	getQueryParam (name) {
		var params = this.getQueryParams();

		return params[name.toLowerCase()];
	}

	getQueryParams () {
		return querystring.parse(this.getUrl().query);
	}

	setBody (body) {
		this.body = body;
	}

	getBody () {
		return this.body;
	}

	getBodyParam (name) {
		var param,
			lower = name.toLowerCase(),
			body = this.body || {};

		if (name in body) {
			param = body[name];
		} else if (lower in body) {
			param = body[lower];
		}

		return param;
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

	getParam (name) {
		var params = this.getParams(),
			param,
			lower = name.toLowerCase();

		if (name in params) {
			param = params[name];
		} else if (lower in params) {
			param = params[lower];
		}

		return param;
	}

	setAllowedMethods (allow) {
		this.allowedMethods = allow;
	}

	getAllowedMethods () {
		return this.allowedMethods;
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
