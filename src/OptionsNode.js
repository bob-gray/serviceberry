"use strict";

const LeafNode = require("./LeafNode");

class OptionsNode extends LeafNode {
	constructor (allow) {
		super({
			method: "OPTIONS"
		});

		this.handlers.push((request, response) => {
			response.send({
				status: 204,
				headers: {
					Allow: allow
				}
			});
		});
	}
}

module.exports = OptionsNode;