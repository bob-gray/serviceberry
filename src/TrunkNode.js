"use strict";

require("solv/src/array/first");
require("solv/src/array/add");
require("solv/src/array/is-empty");

const Base = require("solv/src/abstract/base"),
	statusCodes = require("./statusCodes");

class TrunkNode extends Base {
	constructor (options = {}) {
		super();
		this.options = options;
		this.branches = [];
		this.leaves = [];
		this.handlers = [];
		this.catches = [];
	}

	transition (request) {
		request.remainingPath = request.path;

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
	var allowed = this.leaves.filter(leaf => leaf.isAllowed(request)),
		supported,
		acceptable,
		leaf;

	const ErrorNode = require("./ErrorNode");

	if (allowed.isEmpty() && request.getMethod() === "HEAD") {
		allowed = this.leaves.filter(leaf => leaf.options.method === "GET");
	}

	supported = allowed.filter(leaf => leaf.isSupported(request));
	acceptable = supported.filter(leaf => leaf.isAcceptable(request, response));

	if (this.leaves.isEmpty()) {
		leaf = notFound(request);
	} else if (allowed.isEmpty() && request.getMethod() === "OPTIONS") {
		leaf = this.invoke(autoOptions);
	} else if (allowed.isEmpty()) {
		leaf = new ErrorNode(statusCodes.METHOD_NOT_ALLOWED, {
			Allow: this.invoke(getAllow)
		});
	} else if (supported.isEmpty()) {
		leaf = new ErrorNode(statusCodes.UNSUPPORTED_MEDIA_TYPE);
	} else if (acceptable.isEmpty()) {
		leaf = new ErrorNode(statusCodes.NOT_ACCEPTABLE);
	} else {
		leaf = acceptable.first();
	}

	return leaf;
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

function autoOptions () {
	var OptionsNode = require("./OptionsNode"),
		allow = this.invoke(getAllow),
		options;

	if (allow) {
		options = new OptionsNode(allow);
	}

	return options;
}

function notFound (request) {
	const ErrorNode = require("./ErrorNode");

	return new ErrorNode(statusCodes.NOT_FOUND, request);
}

module.exports = TrunkNode;
