"use strict";

require("solv/src/object/copy");
require("solv/src/object/for-each");

const http = require("http");
const statusCodes = Object.copy(http.STATUS_CODES);
const nonWord = /\W+/g;

Object.forEach(statusCodes, (text, code) => statusCodes[constCase(text)] = Number(code));

function constCase (text) {
	return text.toUpperCase().replace(nonWord, "_");
}

module.exports = statusCodes;