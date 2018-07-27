"use strict";

require("solv/src/regexp/escape");
require("solv/src/array/first");
require("solv/src/array/add");
require("solv/src/array/is-empty");

const ChildrenResolver = require("./ChildrenResolver"),
	placeholders = /\{[^}]+\}/g,
	escapedBraces = /\\([{}])/g;

class BranchNode extends ChildrenResolver {
	constructor (options = {path: ""}) {
		super();

		Object.assign(this, {
			options: {...options},
			branches: [],
			leaves: [],
			handlers: [],
			catches: []
		});

		this.invoke(stripLeadingSlash);
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

	chooseNext (request, response) {
		var next;

		if (request.remainingPath.length) {
			next = this.invoke(chooseBranch, request, response);
		} else {
			next = this.invoke(chooseLeaf, request, response);
		}

		return next;
	}
}

function stripLeadingSlash () {
	var options = this.options,
		{path} = options;

	if (path.startsWith("/")) {
		options.path = path.slice(1);
	}
}

function createPattern () {
	var src = RegExp.escape(this.options.path).replace(escapedBraces, "$1")
		.replace(placeholders, "([^/]+)");

	this.pattern = new RegExp("^" + src + "/?");
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
		params[placeholder.toLowerCase()] = decodeURIComponent(values[index]);
	});

	return params;
}

function chooseBranch (request, response) {
	// eslint-disable-next-line no-shadow
	var branch = this.branches.find(branch => branch.test(request, response));

	if (!branch) {
		branch = notFound();
	}

	return branch;
}

function chooseLeaf (request, response) {
	var allowed = this.invoke(getAllowedLeaves, request),
		supported = allowed.filter(leaf => leaf.isSupported(request)),
		acceptable = supported.filter(leaf => leaf.isAcceptable(request, response)),
		leaf = acceptable.first();

	if (!leaf) {
		leaf = this.invoke(getAutoLeaf, request, allowed, supported);
	}

	return leaf;
}

function getAllowedLeaves (request) {
	var allowed = this.leaves.filter(leaf => leaf.isAllowed(request));

	if (allowed.isEmpty() && request.getMethod() === "HEAD") {
		allowed = this.leaves.filter(leaf => leaf.options.method === "GET");
	}

	return allowed;
}

function getAutoLeaf (request, allowed, supported) {
	var leaf;

	if (this.leaves.isEmpty()) {
		leaf = notFound();
	} else if (isAutoOptions(request, allowed)) {
		leaf = this.invoke(autoOptions, request);
	} else if (allowed.isEmpty()) {
		leaf = this.invoke(notAllowed, request);
	} else if (supported.isEmpty()) {
		leaf = unsupported();
	} else {
		leaf = notAcceptable();
	}

	return leaf;
}

function isAutoOptions (request, allowed) {
	return request.getMethod() === "OPTIONS" && allowed.isEmpty();
}

function autoOptions (request) {
	var OptionsNode = require("./OptionsNode");

	request.setAllowedMethods(this.invoke(getAllow));

	return new OptionsNode();
}

function notFound () {
	// TODO: create error object and set request.error for these error nodes so handlers can check it
	return createErrorNode("Not Found");
}

function notAllowed (request) {
	request.setAllowedMethods(this.invoke(getAllow));

	return createErrorNode("Method Not Allowed", {
		Allow: request.getAllowedMethods()
	});
}

function unsupported () {
	return createErrorNode("Unsupported Media Type");
}

function notAcceptable () {
	return createErrorNode("Not Acceptable");
}

function getAllow () {
	var allow = this.leaves.map(leaf => leaf.options.method)
		.reduce((flat, method) => flat.concat(method), []);

	allow.add("OPTIONS");

	if (allow.includes("GET")) {
		allow.add("HEAD");
	}

	allow.sort();

	return allow.join(", ");
}

function createErrorNode () {
	const ErrorNode = require("./ErrorNode");

	return new ErrorNode(...arguments);
}

module.exports = BranchNode;
