"use strict";

module.exports = function jsonSerializer (response) {
	return JSON.stringify(response.getBody() || "");
};