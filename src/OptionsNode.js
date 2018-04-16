"use strict";

const LeafNode = require("./LeafNode");

class OptionsNode extends LeafNode {
	constructor () {
		super({
			method: "OPTIONS"
		});

		this.handlers.push((request, response) => {
			response.send({
				status: 204,
				headers: {
					Allow: request.getAllowedMethods()
				}
			});
		});
	}
}

module.exports = OptionsNode;
