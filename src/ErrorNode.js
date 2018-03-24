"use strict";

const LeafNode = require("./LeafNode"),
	HttpError = require("./HttpError"),
	messages = {
		404: request => "No resource at " + request.getUrl(),
		405: request => "Request method " + request.getMethod() + " is not allowed",
		406: request => "No acceptable response type for " + request.getAccept() + " can be produced",
		415: request => "Request content type " + request.getContentType() + " is not supported"
	};

class ErrorNode extends LeafNode {
	constructor (code, headers) {
		super();

		this.handlers.push(request => {
			var message = messages[code](request);

			throw new HttpError(message, code, headers);
		});
	}
}

module.exports = ErrorNode;
