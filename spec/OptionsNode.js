/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const OptionsNode = require("../src/OptionsNode");

describe("OptionsNode", () => {
	it("should respond with 204 and Allow header", () => {
		const status = 204,
			headers = {
				Allow: "GET, POST, OPTIONS"
			},
			optionsNode = new OptionsNode(),
			request = createRequest(headers.Allow),
			response = createResponse();

		run(optionsNode, request, response);

		expect(response.send).toHaveBeenCalledWith({status, headers});
	});
});

function run (optionsNode, request, response) {
	const handler = optionsNode.handlers.pop();

	handler(request, response);
}

function createRequest (allowed) {
	return {
		getAllowedMethods () {
			return allowed;
		}
	};
}

function createResponse () {
	return jasmine.createSpyObj("Response", ["send"]);
}
