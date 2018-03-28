"use strict";

const Response = require("../src/Response"),
	EventEmitter = require("events"),
	httpMocks = require("node-mocks-http");

describe("Response", () => {
	var response;

	beforeEach(() => {
		response = createResponse();
	});

	it("should be abled to be copied", () => {
		expect(response.copy()).toEqual(response);
		expect(response.copy()).not.toBe(response);
	});

	it("should return content type without encoding from getContentType()", () => {
		response.setHeader("Content-Type", "application/json; charset=utf-8");

		expect(response.getContentType()).toBe("application/json");
	});
});

function createResponse (options) {
	const serverResponse = new EventEmitter();

	return new Response(serverResponse);
}
