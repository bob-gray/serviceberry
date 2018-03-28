"use strict";

const LeafNode = require("./LeafNode"),
	HttpError = require("./HttpError"),
	messages = {
		"Not Found": request => "No resource at " + request.getUrl(),
		"Method Not Allowed": request => "Request method " + request.getMethod() + " is not allowed",
		"Not Acceptable": request => "No acceptable response type for " + request.getHeader("Accept"),
		"Unsupported Media Type": request => "Request content type " + request.getContentType() + " is not supported"
	};

class ErrorNode extends LeafNode {
	constructor (text, headers) {
		super();

		this.handlers.push(request => {
			throw new HttpError(
				messages[text](request),
				text,
				headers
			);
		});
	}
}

module.exports = ErrorNode;
