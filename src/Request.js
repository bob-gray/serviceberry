"use strict";

require("solv/src/object/for-each");

const EventEmitter = require("events"),
	headersAccessor = require("./headersAccessor"),
	url = require("url"),
	querystring = require("querystring"),
	contentType = require("content-type");

class Request extends EventEmitter {
	constructor (incomingMessage) {
		super();

		Object.assign(this, {
			incomingMessage,
			headers: incomingMessage.headers,
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

	getMethod () {
		return this.incomingMessage.method;
	}

	getUrl () {
		return url.parse(this.incomingMessage.url);
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
}

Object.assign(
	Request.prototype,
	headersAccessor.getters
);

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
