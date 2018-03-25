"use strict";

const OptionsNode = require("../src/OptionsNode");

describe("OptionsNode", () => {
	it("should respond with 204 and Allow header", () => {
		const status = 204,
			headers = {
				Allow: "GET,POST,OPTIONS"
			},
			optionsNode = new OptionsNode(headers.Allow),
			response = createResponse({

			});

		run(optionsNode, response);

		expect(response.send).toHaveBeenCalledWith({status, headers})
	});
});

function run (optionsNode, response) {
	const handler = optionsNode.handlers.pop();
	handler(null, response);
}

function createResponse () {
	return jasmine.createSpyObj("Response", ["send"]);
}
