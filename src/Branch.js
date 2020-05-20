"use strict";

const BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

class Branch extends Leaf {
	createNode (options) {
		this.node = new BranchNode(options);
	}

	// TODO: allow options for serializers and deserializers
	at (path, ...handlers) {
		const branch = new Branch({path});

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

module.exports = Branch;
