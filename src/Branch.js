"use strict";

const BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

class Branch extends Leaf {
	createNode (options) {
		this.node = new BranchNode(options);
	}

	at (path) {
		const branch = new Branch({path});

		this.node.branches.push(branch.node);

		return branch;
	}

	on (options, handler) {
		const leaf = createLeaf(options);

		this.node.leaves.push(leaf.node);

		if (handler) {
			leaf.use(handler);
		}

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
