"use strict";

require("solv/src/class/method");

const BranchNode = require("./BranchNode"),
	Leaf = require("./Leaf");

class Branch extends Leaf {
	createNode (options) {
		this.node = new BranchNode(options);
	}

	at (path) {
		var branch = new Branch({path});

		this.node.branches.push(branch.node);

		return branch;
	}

	on (options, usable) {
		return this.on(options, usable);
	}
}

Branch.method({
	name: "on",
	signature: "string, function|object?"
}, function (method, usable) {
	return this.on({method}, usable);
});

Branch.method({
	name: "on",
	signature: "object, function|object?"
}, function (options, usable) {
	var leaf = new Leaf(options);

	this.node.leaves.push(leaf.node);

	if (usable) {
		leaf.use(usable);
	}

	return leaf;
});

module.exports = Branch;
