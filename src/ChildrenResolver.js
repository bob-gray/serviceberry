"use strict";

const HandlersResolver = require("./HandlersResolver");

class ChildrenResolver extends HandlersResolver {
	constructor () {
		super();

		this.resolved = this.resolved.then(this.proxy(resolveChildren));
	}
}

function resolveChildren () {
	return Promise.all([
		this.branches.map(resolve),
		this.leaves.map(resolve)
	]);
}

function resolve (child) {
	return child.resolved;
}

module.exports = ChildrenResolver;
