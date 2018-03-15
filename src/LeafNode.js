"use strict";

const TrunkNode = require("./TrunkNode"),
	accepts = require("accepts");

class LeafNode extends TrunkNode {
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

	chooseNext () {
		// A leaf is the end of the road
	}

	transition () {
		// A leaf is the end of the road
	}
}

module.exports = LeafNode;