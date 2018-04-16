"use strict";

const BranchNode = require("../src/BranchNode"),
	LeafNode = require("../src/LeafNode"),
	Request = require("../src/Request"),
	httpMocks = require("node-mocks-http"),
	headersAccessor = require("../src/headersAccessor");

describe("BranchNode", () => {
	var branchNode;

	beforeEach(() => {
		branchNode = new BranchNode({
			path: "{name}"
		});
	});

	it("should create branch with an empty string path if no options passed", () => {
		branchNode = new BranchNode();

		expect(branchNode.options.path).toBe("");
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

	it("should choose next leaf", () => {
		var next = new LeafNode(),
			request = createRequest({
				url: "/bob"
			});

		branchNode.leaves.push(next);
		branchNode.transition(request);

		expect(branchNode.chooseNext(request)).toBe(next);
	});

	it("should choose GET leaf for HEAD request", () => {
		var next = new LeafNode({
				method: "GET"
			}),
			request = createRequest({
				method: "HEAD",
				url: "/bob"
			});

		branchNode.leaves.push(next);
		branchNode.transition(request);

		expect(branchNode.chooseNext(request)).toBe(next);
	});

	it("should create a 404 error node when path not found", () => {
		var leaf = new LeafNode(),
			request = createRequest({
				url: "/bob/foo"
			}),
			next;

		branchNode.leaves.push(leaf);
		branchNode.transition(request);
		next = branchNode.chooseNext(request);

		expect(run(next, request)).toThrowMatching(thrown(404));
	});

	it("should create a 404 error node when no leaf at path", () => {
		var request = createRequest({
				url: "/bob"
			}),
			next;

		branchNode.transition(request);
		next = branchNode.chooseNext(request);

		expect(run(next, request)).toThrowMatching(thrown(404));
	});

	it("should create a 405 error node when method not allowed", () => {
		var leaf = new LeafNode({
				method: "POST"
			}),
			request = createRequest({
				url: "/bob"
			}),
			next;

		branchNode.leaves.push(leaf);
		branchNode.transition(request);
		next = branchNode.chooseNext(request);

		expect(run(next, request)).toThrowMatching(thrown(405));
	});

	it("should create an auto options node", () => {
		var leaf = new LeafNode({
				method: [
					"GET",
					"POST"
				]
			}),
			request = createRequest({
				method: "OPTIONS",
				url: "/bob"
			}),
			response = createResponse(),
			next;

		branchNode.leaves.push(leaf);
		branchNode.transition(request);
		next = branchNode.chooseNext(request, response);

		execute(next, request, response);

		expect(response.send).toHaveBeenCalledWith({
			status: 204,
			headers: {
				Allow: "GET, HEAD, OPTIONS, POST"
			}
		});
	});

	it("should create a 406 error node when not acceptable", () => {
		var leaf = new LeafNode({
				produces: "text/plain"
			}),
			request = createRequest({
				url: "/bob",
				headers: {
					Accept: "application/json"
				}
			}),
			response = createResponse(),
			next;

		branchNode.leaves.push(leaf);
		branchNode.transition(request);
		next = branchNode.chooseNext(request, response);

		expect(run(next, request)).toThrowMatching(thrown(406));
	});

	it("should create a 415 error node when not supported", () => {
		var leaf = new LeafNode({
				method: "POST",
				consumes: "application/x-www-form-urlencoded"
			}),
			request = createRequest({
				method: "POST",
				url: "/bob",
				headers: {
					"Content-Type": "application/json"
				}
			}),
			next;

		branchNode.leaves.push(leaf);
		branchNode.transition(request);
		next = branchNode.chooseNext(request);

		expect(run(next, request)).toThrowMatching(thrown(415));
	});
});

function createRequest (options) {
	const incomingMessage = httpMocks.createRequest(options);

	incomingMessage.setEncoding = Function.prototype;

	return new Request(incomingMessage);
}

function createResponse () {
	const response = Object.create({
		...headersAccessor.getters,
		...headersAccessor.setters
	});

	response.initHeaders();
	response.setHeader("Content-Type", "text/plain");
	response.send = jasmine.createSpy("response send");

	return response;
}

function run (next, ...args) {
	const handler = next.handlers.pop();

	return () => handler(...args);
}

function execute (next, ...args) {
	const handler = next.handlers.pop();

	handler(...args);
}

function thrown (code) {
	return error => error.is(code);
}
