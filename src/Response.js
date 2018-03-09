"use strict";

const Base = require("solv/src/abstract/base"),
	EventEmitter = require("events"),
	StatusAccessor = require("./StatusAccessor"),
	HeadersAccessor = require("./HeadersAccessor"),
	contentType = require("content-type");

class Response extends Base {
	constructor (serverResponse) {
		super();
		this.serverResponse = serverResponse;
		this.invoke(StatusAccessor.init);
		this.invoke(HeadersAccessor.init);
		this.setEncoding("utf-8");
		this.serverResponse.on("finish", this.proxy("emit", "finish"))
			.on("error", this.proxy("emit", "error"));
	}

	copy () {
		var copied = Object.create(this.constructor.prototype);

		return Object.assign(copied, this);
	}

	getContentType () {
		var type;

		try {
			type = contentType.parse(this.getHeader("Content-Type")).type;
		} catch (error) {
			// throws if missing header or header is malformed
		}

		return type;
	}

	getContent () {
		return Buffer.from(this.content, this.getEncoding());
	}

	setContent (content) {
		this.content = content;
	}

	getBody () {
		return this.body;
	}

	setBody (body) {
		this.body = body;
	}

	getEncoding () {
		return this.encoding;
	}

	setEncoding (encoding) {
		this.encoding = encoding;
	}

	set (options) {
		if (options.status) {
			this.setStatus(options.status);
		}

		if (options.headers) {
			this.setHeaders(options.headers);
		}

		if (options.encoding) {
			this.setEncoding(options.encoding);
		}

		if ("body" in options) {
			this.setBody(options.body);
		}

		if (options.finish) {
			this.on("finish", options.finish);
		}
	}
}

Object.assign(
	Response.prototype,
	EventEmitter.prototype,
	StatusAccessor.prototype,
	HeadersAccessor.prototype
);

module.exports = Response;
