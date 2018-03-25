"use strict";

const BranchNode = require("../src/BranchNode"),
	Request = require("../src/Request"),
	httpMocks = require("node-mocks-http");

describe("BranchNode", () => {
	var branchNode;

	beforeEach(() => {
		branchNode = new BranchNode({
			path: "{name}"
		});
	});

	it("should test true if path is entire request url", () => {
		const request = createRequest({
			url: "/bob"
		});

		expect(branchNode.test(request)).toBe(true);
	});

	it("should test true if path has a leading slash", () => {
		const request = createRequest({
				url: "/bob"
			}),
			branchNode = new BranchNode({
				path: "/{name}"
			});

		expect(branchNode.test(request)).toBe(true);
	});

	it("should parse path params when transitioning request", () => {
		const request = createRequest({
			url: "/bob"
		});

		branchNode.transition(request);

		expect(request.getPathParam("name")).toBe("bob");
	});

	it("should test and transition properly - one node after another", () => {
		const items = new BranchNode({
				path: "items"
			}),
			item = new BranchNode({
				path: "{id}"
			}),
			request = createRequest({
				url: "/items/32"
			});

		expect(items.test(request)).toBe(true);
		items.transition(request);

		expect(item.test(request)).toBe(true);
		item.transition(request);

		expect(request.getPathParam("id")).toBe("32");
	});

	it("should choose next branch", () => {
		var next = new BranchNode({
				path: "foo"
			}),
			request = createRequest({
				url: "/bob/foo"
			});

		branchNode.branches.push(next);
		branchNode.transition(request);

		expect(branchNode.chooseNext(request)).toBe(next);
	});
});

function createRequest (options) {
	var incomingMessage = httpMocks.createRequest(options);

	incomingMessage.setEncoding = Function.prototype;

	return new Request(incomingMessage);
}
