"use strict";

require("solv/src/object/for-each");

const http = require("http"),
	statusCodes = Object.assign({}, http.STATUS_CODES),
	nonWord = /\W+/g;

Object.forEach(statusCodes, (text, code) => {
	statusCodes[constCase(text)] = Number(code);
});

function constCase (text) {
	return text.toUpperCase().replace(nonWord, "_");
}

module.exports = statusCodes;