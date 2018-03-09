"use strict";

const StatusAccessor = require("./StatusAccessor"),
	HeadersAccessor = require("./HeadersAccessor");

class HttpError extends Error {
	constructor (error, status = 500, headers = {}) {
		var initialized = error instanceof HttpError;

		super();

		if (initialized) {
			Object.assign(this, error);
		} else {
			this.message = error.message || error;
			this.invoke(StatusAccessor.init, status || error.status);
			this.invoke(HeadersAccessor.init, headers);
		}

		if (!initialized && this.withoutHeader("Content-Type")) {
			this.setHeader("Content-Type", "text/plain; charset=utf-8");
		}

		if (!initialized && error.message) {
			this.originalError = error;
		}
	}

	getMessage () {
		return this.message;
	}
}

Object.assign(
	HttpError.prototype,
	StatusAccessor.prototype,
	HeadersAccessor.prototype
);

module.exports = HttpError;