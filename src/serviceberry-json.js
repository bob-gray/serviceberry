"use strict";

module.exports = {
	contentType: "application/json",
	serialize: serializeJson,
	deserialize: deserializeJson
};

function serializeJson (request, response) {
	var body = response.getBody(),
		content;

	if (body) {
		content = JSON.stringify(body);
	}

	return content;
}

function deserializeJson (request, response) {
	var content = request.getContent(),
		body;

	if (content) {
		body = JSON.parse(content);
	}

	return body;
}
