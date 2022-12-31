"use strict";

const statusAccessor = require("./statusAccessor"),
	headersAccessor = require("./headersAccessor"),
	statusCodes = require("./statusCodes");

class HttpError extends Error {
	constructor (error = "", ...rest) {
		var initialized = error instanceof HttpError;

		super();

		if (initialized) {
			Object.assign(this, error);
		} else {
			init.call(this, error, ...rest);
		}

		if (error.stack) {
			this.stack = error.stack;
		}
	}

	get name () {
		return this.constructor.name;
	}

	getMessage () {
		return this.message;
	}
}

Object.assign(
	HttpError.prototype,
	statusAccessor,
	headersAccessor.getters,
	headersAccessor.setters
);

// eslint-disable-next-line complexity
function init (error, status, headers = {}) {
	if (error instanceof Error) {
		this.message = error.message;
		this.originalError = error;
	} else {
		this.message = error;
	}

	if (!this.message) {
		this.message = "Unknown error";
	}

	this.initStatus(status || error.status || statusCodes.INTERNAL_SERVER_ERROR);
	this.initHeaders(headers);

	if (this.withoutHeader("Content-Type")) {
		this.setHeader("Content-Type", "text/plain; charset=utf-8");
	}
}

module.exports = HttpError;
