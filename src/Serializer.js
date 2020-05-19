"use strict";

const {freeze, base} = require("./class"),
	json = require("serviceberry-json"),
	defaultHandlers = {
		[json.contentType]: json.serialize
	};

module.exports = freeze(base(class Serializer {
	constructor (handlers = {}) {
		this.handlers = Object.freeze(Object.assign(Object.create(null), defaultHandlers, handlers));
		Object.freeze(this);
	}

	serialize (request, response) {
		const type = response.getContentType(),
			handler = this.handlers[type] || response.getBody.bind(response);

		var serialized = handler(request, response);

		if (typeof serialized === "undefined") {
			serialized = "";
		}

		return serialized;
	}
}));
