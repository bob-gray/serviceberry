"use strict";

const {freeze, base} = require("./class"),
	headersAccessor = require("./headersAccessor"),
	HttpError = require("./HttpError"),
	{decodeStream} = require("iconv-lite"),
	mime = require("mime-types"),
	{once} = require("events"),
	{URL} = require("url"),
	querystring = require("querystring"),
	contentType = require("content-type"),
	{randomBytes} = require("crypto");

class Request {
	#startStamp;
	#id;
	#url;
	#contentType;
	#charset;
	#content;
	#body;

	constructor (incomingMessage) {
		this.#startStamp = process.hrtime();
		this.#id = createId();

		Object.assign(this, {
			incomingMessage,
			headers: incomingMessage.headers,
			pathParams: Object.create(null)
		});

		this.#url = Object.freeze(new URL(this.getFullUrl()));
		this.#contentType = parseContentType(incomingMessage);
		this.remainingPath = this.#url.pathname.slice(1);

		// TODO: maybe incomingMessage should not be #content directly but piped through a PassThrough stream?
		this.#content = this.incomingMessage;

		if (this.#contentType) {
			this.#charset = this.#contentType.parameters.charset || (mime.charset(this.#contentType.type) || undefined);
		}

		if (this.#charset) {
			this.#charset = this.#charset.toLowerCase();
		}
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
		return this.getHeader("X-Forwarded-For") || this.incomingMessage.socket.remoteAddress;
	}

	getProtocol () {
		var protocol = this.getHeader("X-Forwarded-Proto") || "http";

		if (this.incomingMessage.connection.encrypted) {
			protocol = "https";
		}

		return protocol;
	}

	getHost () {
		return this.getHeader("X-Forwarded-Host") || this.getHeader("Host");
	}

	getPort () {
		return this.incomingMessage.socket.localPort;
	}

	getMethod () {
		return this.incomingMessage.method;
	}

	getUrl () {
		return this.#url;
	}

	getFullUrl () {
		return this.getProtocol() + "://" + this.getHost() + this.incomingMessage.url;
	}

	getCurrentPath () {
		const path = this.getUrl().pathname;

		return path.slice(1, path.length - this.remainingPath.length - 1);
	}

	decode () {
		try {
			this.pipe(decodeStream(this.getCharset()));
		} catch {
			// TODO: handle errors with encoding - ignoring for now until I figure out a good way to handle them
		}
	}

	pipe (stream, options) {
		this.#content = this.#content.pipe(stream, options);

		return stream;
	}

	buffer () {
		const stream = this.#content;

		this.#content = null;
		stream.on("data", chunk => this.addContent(chunk));

		return once(stream, "end");
	}

	setContent (content) {
		this.#content = content;
	}

	addContent (content) {
		if (!this.#content) {
			this.setContent(content);
		} else if (Buffer.isBuffer(this.#content)) {
			this.setContent(Buffer.concat([this.#content, content]));
		} else {
			this.setContent(this.#content + content);
		}
	}

	getContent () {
		return this.#content;
	}

	getContentType () {
		return this.#contentType && this.#contentType.type;
	}

	getCharset () {
		return this.#charset;
	}

	getEncoding () {
		return this.getCharset();
	}

	getPathParam (name) {
		return getCaseInsensitive(this.pathParams, name);
	}

	getPathParams () {
		return Object.assign(Object.create(null), this.pathParams);
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
		if (this.#body instanceof Error) {
			throw this.#body;
		}

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

		return Object.assign(Object.create(null), body, this.getQueryParams(), this.pathParams);
	}

	getParam (name) {
		return getCaseInsensitive(this.getParams(), name);
	}

	setAllowedMethods (allowedMethods) {
		this.allowedMethods = allowedMethods;
	}

	getAllowedMethods () {
		return this.allowedMethods;
	}

	proceed (latestResult) {
		// Calling proceed on a request proxy yields control
		// and signals to the director to proceed
		this.latestResult = latestResult;

		return latestResult;
	}

	fail (...args) {
		throw new HttpError(...args);
	}
}

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

Object.assign(
	Request.prototype,
	headersAccessor.getters
);

module.exports = freeze(base(Request));
