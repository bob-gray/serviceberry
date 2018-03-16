"use strict";

const statusCodes = require("./statusCodes"),
	HttpError = require("./HttpError");

module.exports = {
	contentType: "application/json",

	serialize (request, response) {
		var body = response.getBody(),
			content;

		if (body) {
			content = JSON.stringify(body);
		}

		request.proceed(content);
	},

	deserialize (request, response) {
		var content = request.getContent(),
			body;

		if (content) {
			try {
				body = JSON.parse(content);
			} catch (error) {
				throw new HttpError(error, statusCodes.BAD_REQUEST);
			}
			
		}

		request.proceed(body);
	}
};


