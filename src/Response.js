"use strict";

const EventEmitter = require("events"),
	{freeze} = require("./class"),
	statusAccessor = require("./statusAccessor"),
	headersAccessor = require("./headersAccessor"),
	contentType = require("content-type");

class Response extends EventEmitter {
	#body;
	#content;
	#encoding = "utf8";

	constructor (serverResponse) {
		super();

		this.serverResponse = serverResponse;
		this.initStatus();
		this.initHeaders();

		serverResponse.on("finish", this.emit.bind(this, "finish"));
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
		return this.#content || "";
	}

	setContent (content) {
		this.#content = content;
	}

	getBody () {
		return this.#body;
	}

	setBody (body) {
		this.#body = body;
	}

	getEncoding () {
		return this.#encoding;
	}

	setEncoding (encoding) {
		this.#encoding = encoding;
	}

	async send (options = {}) {
		this.set(options);

		if (typeof this.#body !== "undefined" && typeof this.#content === "undefined") {
			await this.serialize();
		}

		if (this.isContentStreamable()) {
			this.streamContent();
		} else {
			this.sendBufferedContent();
		}
	}

	async serialize () {
		this.#content = await new Promise(this.emit.bind(this, "serialize"));
	}

	notBegun () {
		return !this.serverResponse.headersSent;
	}

	isBodyStreamable () {
		return isStreamable(this.#body);
	}

	isContentStreamable () {
		return isStreamable(this.#content);
	}

	streamContent () {
		if (!this.serverResponse.headersSent) {
			this.writeHead();
		}

		this.#content.pipe(this.serverResponse);
	}

	sendBufferedContent () {
		const {serverResponse} = this,
			buffer = Buffer.from(this.getContent(), this.#encoding);

		if (!serverResponse.headersSent) {
			this.writeBufferedHead(buffer);
		}

		if (buffer.length) {
			serverResponse.end(buffer, this.#encoding);
		} else {
			serverResponse.end();
		}
	}

	writeBufferedHead (buffer) {
		if (!buffer.length && this.is("OK")) {
			this.setStatus("No Content");
		} else if (buffer.length && this.withoutHeader("Content-Length")) {
			this.setHeader("Content-Length", buffer.length);
		}

		if (!buffer.length) {
			this.removeHeader("Content-Length");
		}

		this.writeHead();
	}

	writeHead () {
		this.serverResponse.writeHead(
			this.getStatusCode(),
			this.getStatusText(),
			this.getHeaders()
		);
	}

	// eslint-disable-next-line complexity
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

		if ("content" in options) {
			this.setContent(options.content);
		} else if ("body" in options) {
			this.setBody(options.body);
		}

		if (options.finish) {
			this.on("finish", options.finish);
		}
	}
}

function isStreamable (value) {
	const type = typeof value;

	return value !== null && (type === "object" || type === "function") && typeof value.pipe === "function";
}

Object.assign(
	Response.prototype,
	statusAccessor,
	headersAccessor.getters,
	headersAccessor.setters
);

module.exports = freeze(Response);
