/* eslint no-shadow: "warn" */

"use strict";

require("solv/src/array/first");
require("solv/src/array/add");
require("solv/src/array/is-empty");

const Base = require("solv/src/abstract/base");

class TrunkNode extends Base {
	constructor (options = {}) {
		super();

		Object.assign(this, {
			options,
			branches: [],
			leaves: [],
			handlers: [],
			catches: []
		});
	}

	transition (request) {
		if (this.options.basePath) {
			request.remainingPath = request.remainingPath.replace(this.options.basePath, "");
		}
	}

	chooseNext (request, response) {
		var next;

		if (this.options.basePath && !request.path.startsWith(this.options.basePath)) {
			next = notFound(request);
		} else if (request.remainingPath.length) {
			next = this.invoke(chooseBranch, request, response);
		} else {
			next = this.invoke(chooseLeaf, request, response);
		}

		return next;
	}
}

function chooseBranch (request, response) {
	var branch = this.branches.find(branch => branch.test(request, response));

	if (!branch) {
		branch = notFound(request);
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
		leaf = this.invoke(autoOptions);
	} else if (allowed.isEmpty()) {
		leaf = this.invoke(notAllowed);
	} else if (supported.isEmpty()) {
		leaf = unsupported();
	} else {
		leaf = notAcceptable();
	}

	return leaf;
}

function autoOptions () {
	var OptionsNode = require("./OptionsNode"),
		allow = this.invoke(getAllow),
		options;

	if (allow) {
		options = new OptionsNode(allow);
	}

	return options;
}

function isAutoOptions (request, allowed) {
	return request.getMethod() === "OPTIONS" && allowed.isEmpty();
}

function notFound () {
	return createErrorNode("Not Found");
}

function notAllowed () {
	return createErrorNode("Method Not Allowed", {
		Allow: this.invoke(getAllow)
	});
}

function unsupported () {
	return createErrorNode("Unsupported Media Type");
}

function notAcceptable () {
	return createErrorNode("Not Acceptable");
}

function getAllow () {
	var allow = this.leaves.map(leaf => leaf.options.method).filter(method => method);

	allow.add("OPTIONS");

	if (allow.includes("GET")) {
		allow.add("HEAD");
	}

	allow.sort();

	return allow.join();
}

function createErrorNode () {
	const ErrorNode = require("./ErrorNode");

	return new ErrorNode(...arguments);
}

module.exports = TrunkNode;
