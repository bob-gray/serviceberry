"use strict";

const http = require("http"),
	statusCodes = Object.assign(Object.create(null), http.STATUS_CODES),
	nonWords = /\W+/g;

Object.keys(statusCodes).forEach(statusCode => {
	const statusText = statusCodes[statusCode].toUpperCase();

	statusCode = Number(statusCode);
	statusCodes[statusText] = statusCode;
	statusCodes[statusText.replace(nonWords, "_")] = statusCode;
});

module.exports = Object.freeze(statusCodes);
