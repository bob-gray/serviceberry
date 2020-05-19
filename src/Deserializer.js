"use strict";

const {freeze, base} = require("./class"),
	form = require("serviceberry-form"),
	json = require("serviceberry-json"),
	defaultHandlers = {
		[form.contentType]: form.deserialize,
		[json.contentType]: json.deserialize
	};

module.exports = freeze(base(class Deserializer {
	constructor (handlers = {}) {
		this.handlers = Object.freeze(Object.assign(Object.create(null), defaultHandlers, handlers));
		Object.freeze(this);
	}

	async deserialize (request, response) {
		const type = request.getContentType(),
			handler = this.handlers[type] || request.getContent.bind(request);

		await new Promise(resolve => request.incomingMessage
			.on("data", content => request.setContent(request.getContent() + content))
			.on("end", resolve)
		);

		return handler(request, response);
	}
}));
