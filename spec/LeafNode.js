/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const LeafNode = require("../src/LeafNode"),
	Request = require("../src/Request"),
	httpMocks = require("node-mocks-http");

describe("LeafNode", () => {
	it("should be allowed if method matches request", () => {
		var leafNode = new LeafNode({
				method: "GET"
			}),
			request = createRequest({
				method: "GET"
			});

		expect(leafNode.isAllowed(request)).toBe(true);
	});

	it("should be allowed if method includes request method", () => {
		var leafNode = new LeafNode({
				method: [
					"GET",
					"POST"
				]
			}),
			request = createRequest({
				method: "POST"
			});

		expect(leafNode.isAllowed(request)).toBe(true);
	});

	it("should be allowed if method is *", () => {
		var leafNode = new LeafNode({
				method: "*"
			}),
			request = createRequest({
				method: "PUT"
			});

		expect(leafNode.isAllowed(request)).toBe(true);
	});

	it("should be allowed if method is undefined", () => {
		var leafNode = new LeafNode(),
			request = createRequest({
				method: "PATCH"
			});

		expect(leafNode.isAllowed(request)).toBe(true);
	});

	it("should not be allowed if method doesn't match request", () => {
		var leafNode = new LeafNode({
				method: "POST"
			}),
			request = createRequest({
				method: "PATCH"
			});

		expect(leafNode.isAllowed(request)).toBe(false);
	});

	it("should not be allowed if method doesn't include request method", () => {
		var leafNode = new LeafNode({
				method: [
					"POST",
					"DELETE"
				]
			}),
			request = createRequest({
				method: "PATCH"
			});

		expect(leafNode.isAllowed(request)).toBe(false);
	});

	it("should be supported if content type matches request", () => {
		var leafNode = new LeafNode({
				consumes: "application/x-www-form-urlencoded"
			}),
			request = createRequest({
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			});

		expect(leafNode.isSupported(request)).toBe(true);
	});

	it("should be supported if content type includes request content type", () => {
		var leafNode = new LeafNode({
				consumes: [
					"application/json",
					"application/x-www-form-urlencoded"
				]
			}),
			request = createRequest({
				headers: {
					"Content-Type": "application/json"
				}
			});

		expect(leafNode.isSupported(request)).toBe(true);
	});

	it("should be supported if it doesn't have a content type", () => {
		var leafNode = new LeafNode(),
			request = createRequest({
				headers: {
					"Content-Type": "application/json"
				}
			});

		expect(leafNode.isSupported(request)).toBe(true);
	});

	it("should be supported if it doesn't have a content type and neither does the request", () => {
		var leafNode = new LeafNode(),
			request = createRequest();

		expect(leafNode.isSupported(request)).toBe(true);
	});

	it("should not be supported if content type does not matches request", () => {
		var leafNode = new LeafNode({
				consumes: "application/x-www-form-urlencoded"
			}),
			request = createRequest({
				headers: {
					"Content-Type": "application/json"
				}
			});

		expect(leafNode.isSupported(request)).toBe(false);
	});

	it("should not be supported if content type does not include request content type", () => {
		var leafNode = new LeafNode({
				consumes: [
					"application/json",
					"application/x-www-form-urlencoded"
				]
			}),
			request = createRequest({
				headers: {
					"Content-Type": "text/csv"
				}
			});

		expect(leafNode.isSupported(request)).toBe(false);
	});

	it("should not be supported if it has a content type and the request does not", () => {
		var leafNode = new LeafNode({
				consumes: [
					"application/json",
					"application/x-www-form-urlencoded"
				]
			}),
			request = createRequest();

		expect(leafNode.isSupported(request)).toBe(false);
	});

	it("should be acceptable if it produces the right content type", () => {
		var leafNode = new LeafNode({
				produces: "application/json,text/plain"
			}),
			request = createRequest({
				Accept: "application/json,text/plain"
			}),
			response = createResponse(true);

		expect(leafNode.isAcceptable(request, response)).toBe(true);
	});

	it("should be acceptable if it produces the right content type", () => {
		var leafNode = new LeafNode({
				produces: [
					"application/json"
				]
			}),
			request = createRequest({
				Accept: "application/json"
			}),
			response = createResponse(true);

		expect(leafNode.isAcceptable(request, response)).toBe(true);
	});

	it("should be acceptable if request doesn't specify what it accepts", () => {
		var leafNode = new LeafNode({
				produces: "application/json"
			}),
			request = createRequest(),
			response = createResponse(true);

		expect(leafNode.isAcceptable(request, response)).toBe(true);
	});

	it("should not be acceptable if it doesn't produces a content type that the request accepts", () => {
		var leafNode = new LeafNode({
				produces: "application/json"
			}),
			request = createRequest({
				headers: {
					Accept: "text/csv"
				}
			}),
			response = createResponse(true);

		expect(leafNode.isAcceptable(request, response)).toBe(false);
	});

	it("should be acceptable if produces is not specified", () => {
		var leafNode = new LeafNode();

		expect(leafNode.isAcceptable()).toBe(true);
	});

	it("should not return a next node", () => {
		var leafNode = new LeafNode();

		expect(leafNode.chooseNext()).toBeUndefined();
	});

	it("should not alter the request on transition", () => {
		var leafNode = new LeafNode();

		expect(leafNode.transition()).toBeUndefined();
	});
});

function createRequest (options = {}) {
	var incomingMessage = httpMocks.createRequest({
		url: "/",
		...options
	});

	Object.assign(incomingMessage, {
		socket: {
			remoteAddress: options.ip,
			localPort: options.port
		},
		connection: {
			encrypted: options.protocol === "https"
		}
	});

	return new Request(incomingMessage);
}

function createResponse (hasContentType) {
	var response = jasmine.createSpyObj("Response", ["setHeader"]);

	response.withoutHeader = () => hasContentType;

	return response;
}
