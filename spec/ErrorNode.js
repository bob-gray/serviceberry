"use strict";

const ErrorNode = require("../src/ErrorNode"),
	Request = require("../src/Request"),
	httpMocks = require("node-mocks-http"),
	HttpError = require("../src/HttpError");

describe("ErrorNode", () => {
	it("should throw a 404 HttpError", () => {
		const text = "Not Found",
			headers = {
				"Content-Type": "text/plain; charset=utf-8"
			},
			errorNode = new ErrorNode(text, headers),
			request = createRequest({
				url: "/fake/path"
			});

		expect(run(errorNode, request)).toThrowMatching(thrown(text, headers));
	});

	it("should throw a 405 HttpError", () => {
		const text = "Method Not Allowed",
			headers = {
				"Allow": "PUT,DELETE",
				"Content-Type": "text/plain; charset=utf-8"
			},
			errorNode = new ErrorNode(text, headers),
			request = createRequest({
				url: "/fake/path"
			});

		expect(run(errorNode, request)).toThrowMatching(thrown(text, headers));
	});

	it("should throw a 406 HttpError", () => {
		const text = "Not Acceptable",
			headers = {
				"Content-Type": "text/plain; charset=utf-8"
			},
			errorNode = new ErrorNode("Not Acceptable", headers),
			request = createRequest({
				url: "/fake/path",
				headers: {
					Accept: "application/json"
				}
			});

		expect(run(errorNode, request)).toThrowMatching(thrown("Not Acceptable", headers));
	});

	it("should throw a 415 HttpError", () => {
		const text = "Unsupported Media Type",
			headers = {
				"Content-Type": "text/plain; charset=utf-8"
			},
			errorNode = new ErrorNode(text, headers),
			request = createRequest({
				url: "/fake/path",
				headers: {
					"Content-Type": "application/json"
				}
			});

		expect(run(errorNode, request)).toThrowMatching(thrown(text, headers));
	});
});

function createRequest (options) {
	var incomingMessage = httpMocks.createRequest(options);

	incomingMessage.setEncoding = Function.prototype;

	return new Request(incomingMessage);
}

function run (errorNode, request) {
	return () => {
		const handler = errorNode.handlers.pop();
		handler(request);
	};
}

function thrown (text, headers = {}) {
	return error => {
		expect(error.getHeaders()).toEqual(headers);

		return error instanceof HttpError && error.is(text)
	};
}
