"use strict";

const BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

class Branch extends Leaf {
	createNode (options) {
		this.node = new BranchNode(options);
	}

	at (path, ...handlers) {
		const branch = createBranch(path, handlers);

		this.node.branches.push(branch.node);
		branch.use(...handlers);

		return branch;
	}

	on (options, ...handlers) {
		const leaf = this.leaf(options);

		leaf.use(...handlers);

		return this;
	}

	leaf (options) {
		const leaf = createLeaf(options);

		this.node.leaves.push(leaf.node);

		return leaf;
	}
}

function createLeaf (options) {
	if (typeof options === "string") {
		options = {
			method: options
		};
	}

	return new Leaf(options);
}

function createBranch (path, handlers) {
	var options = {path};

	// if the first handler is not a handler it is an options object
	if (handlers.length && typeof handlers[0] !== "function" && typeof handlers[0].use !== "function") {
		Object.assign(options, handlers.shift());
	}

	return new Branch(options);
}

module.exports = Branch;
