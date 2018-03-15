"use strict";

require("solv/src/object/for-each");

const EventEmitter = require("events"),
	Base = require("solv/src/abstract/base"),
	type = require("solv/src/type"),
	url = require("url"),
	querystring = require("querystring"),
	contentType = require("content-type");

class Request extends EventEmitter {
	constructor (incomingMessage) {
		super();
		this.incomingMessage = incomingMessage;
		this.invoke(parseContentType);
		this.incomingMessage.setEncoding(this.getEncoding());
		this.url = url.parse(this.incomingMessage.url);
		this.path = this.url.pathname;
		this.pathParams = {};
		this.content = "";
	}

	copy () {
		var copied = Object.create(this.constructor.prototype);

		return Object.assign(copied, this);
	}

	getMethod () {
		return this.incomingMessage.method;
	}

	getUrl () {
		return this.incomingMessage.url;
	}

	getAccept () {
		return this.getHeader("Accept");
	}

	getParam (name) {
		var params = this.getParams();

		return params[name];
	}

	getParams () {
		var body = this.getBody();

		if (body && type.is.not("object", body)) {
			body = {body};
		} else if (type.is.not("undefined", body) ) {
			body = {};
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
		return querystring.parse(this.url.query);
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

	getHeader (name) {
		var headers = this.getHeaders();

		return headers[name.toLowerCase()];
	}

	getHeaders () {
		return this.incomingMessage.headers;
	}

	hasHeader (name) {
		return this.invoke(findName, name) !== undefined;
	}

	withoutHeader (name) {
		return !this.hasHeader(name);
	}

	getContentType () {
		return this.contentType && this.contentType.type;
	}

	getEncoding () {
		return this.contentType && (this.contentType.parameters.charset || "utf-8");
	}
}

function parseContentType () {
	try {
		this.contentType = contentType.parse(this.incomingMessage);
	} catch (error) {
		// throws if missing header or header is malformed
	}
}

function findName (name) {
	name = name.toLowerCase();

	return Object.keys(this.incomingMessage.headers).find(key => key.toLowerCase() === name);
}

Object.assign(Request.prototype, Base.prototype);

module.exports = Request;
