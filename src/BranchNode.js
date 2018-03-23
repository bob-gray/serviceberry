"use strict";

require("solv/src/regexp/escape");

var TrunkNode = require("./TrunkNode"),
	placeholders = /\{[^}]+\}/g,
	escapedBraces = /\\([{}])/g;

class BranchNode extends TrunkNode {
	constructor (options) {
		super(options);
		this.invoke(createPattern);
		this.invoke(setPlaceholders);
	}

	test (request) {
		return this.pattern.test(request.remainingPath);
	}

	transition (request) {
		Object.assign(request.pathParams, this.invoke(parsePathParams, request));
		request.remainingPath = request.remainingPath.replace(this.pattern, "");
	}
}

function createPattern () {
	var src = RegExp.escape(this.options.path).replace(escapedBraces, "$1")
		.replace(placeholders, "([^/]+)");

	this.pattern = new RegExp("^" + src);
}

function setPlaceholders () {
	if (placeholders.test(this.options.path)) {
		this.placeholders = this.options.path.match(placeholders)
			.map(placeholder => placeholder.slice(1, -1));
	} else {
		this.placeholders = [];
	}
}

function parsePathParams (request) {
	var values = request.remainingPath.match(this.pattern),
		params = {};

	values.shift();

	this.placeholders.forEach((placeholder, index) => {
		params[placeholder] = decodeURIComponent(values[index]);
	});

	return params;
}

module.exports = BranchNode;
