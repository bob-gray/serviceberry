"use strict";

const querystring = require("querystring");

module.exports = {
	contentType: "application/x-www-form-urlencoded",
	deserialize: deserializeForm
};

function deserializeForm (request, response) {
	return querystring.parse(request.getContent());
}