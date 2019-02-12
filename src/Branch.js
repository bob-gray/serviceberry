"use strict";

const BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

class Branch extends Leaf {
	createNode (options) {
		this.node = new BranchNode(options);
	}

	at (path, ...handlers) {
		const branch = new Branch({path});

		this.node.branches.push(branch.node);
		branch.use(...handlers);

		return branch;
	}

	on (options, ...handlers) {
		var result = this;
		const leaf = createLeaf(options);

		this.node.leaves.push(leaf.node);
		leaf.use(...handlers);

		if (!handlers.length) {
			result = leaf;
		}

		return result;
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

module.exports = Branch;
