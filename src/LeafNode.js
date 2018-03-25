"use strict";

const Base = require("solv/src/abstract/base"),
	accepts = require("accepts");

class LeafNode extends Base {
	constructor (options = {}) {
		super();

		Object.assign(this, {
			options: {...options},
			handlers: [],
			catches: []
		});
	}

	isAllowed (request) {
		var allowed = true,
			method = this.options.method;

		if (method === "*") {
			method = null;
		}

		if (!Array.isArray(method) && method) {
			method = [method];
		}

		if (method) {
			allowed = method.includes(request.getMethod());
		}

		return allowed;
	}

	isSupported (request) {
		var supported = true,
			consumes = this.options.consumes,
			contentType = request.getContentType();

		if (!Array.isArray(consumes) && consumes) {
			consumes = [consumes];
		}

		if (!contentType && consumes) {
			supported = false;
		} else if (consumes) {
			supported = consumes.includes(contentType);
		}

		return supported;
	}

	isAcceptable (request, response) {
		var acceptable;

		if (this.options.produces) {
			acceptable = accepts(request.incomingMessage).type(this.options.produces);
		}

		if (acceptable && response.withoutHeader("Content-Type")) {
			// TODO: set content type charset
			response.setHeader("Content-Type", acceptable);
		}

		return acceptable !== false;
	}

	transition () {
		// A leaf is the end of the route
	}

	chooseNext () {
		// A leaf is the end of the route
	}
}

module.exports = LeafNode;
