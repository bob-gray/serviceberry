"use strict";

const statusAccessor = require("./statusAccessor"),
	headersAccessor = require("./headersAccessor"),
	statusCodes = require("./statusCodes");

class HttpError extends Error {
	constructor (error = "") {
		var initialized = error instanceof HttpError;

		super();

		if (initialized) {
			Object.assign(this, error);
		} else {
			init.apply(this, arguments);
		}
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

function init (error, status, headers = {}) {
	this.message = error.message || error;
	this.initStatus(status || error.status || statusCodes.INTERNAL_SERVER_ERROR);
	this.initHeaders(headers);

	if (this.withoutHeader("Content-Type")) {
		this.setHeader("Content-Type", "text/plain; charset=utf-8");
	}

	if (error.message) {
		this.originalError = error;
	}
}

module.exports = HttpError;
