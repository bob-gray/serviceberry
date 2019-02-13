/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Branch = require("../src/Branch"),
	Leaf = require("../src/Leaf");

describe("Branch", () => {
	var path,
		branch;

	beforeEach(() => {
		path = "/path/to/some/resource";
		branch = new Branch({path});
	});

	it("should set options in constructor", () => {
		expect(branch.options.path).toBe(path);
	});

	it("should create node in constructor", () => {
		expect("node" in branch).toBe(true);
		expect(branch.node.branches.length).toBe(0);
		expect(branch.node.leaves.length).toBe(0);
	});

	it("should create a new child branch with at(path)", () => {
		const foo = branch.at("foo");

		expect(foo instanceof Branch).toBe(true);
		expect(foo).not.toBe(branch);
		expect(branch.node.branches.length).toBe(1);
	});

	it("should add handler to new child branch with at(path, handler)", () => {
		const foo = branch.at("foo", jasmine.createSpy());

		expect(foo.node.handlers.length).toBe(1);
	});

	it("should add handlers to new child branch with at(path, ...handlers)", () => {
		const foo = branch.at("foo", jasmine.createSpy(), jasmine.createSpy);

		expect(foo.node.handlers.length).toBe(2);
	});

	it("should create a new leaf with on(method)", () => {
		const leaf = branch.on("OPTIONS");

		expect(leaf instanceof Leaf).toBe(true);
		expect(branch.node.leaves.length).toBe(1);
	});

	it("should create a new leaf with on(options)", () => {
		const leaf = branch.on({
			method: "GET",
			produces: "application/json"
		});

		expect(leaf instanceof Leaf).toBe(true);
		expect(branch.node.leaves.length).toBe(1);
	});

	it("should return branch when handlers are passed to on()", () => {
		const result = branch.on("PATCH", jasmine.createSpy("handler"));

		expect(result).toBe(branch);
		expect(branch.node.leaves.length).toBe(1);
	});

	it("should add any number of handlers to leaf using on()", () => {
		const result = branch.on(
			"GET",
			jasmine.createSpy("handler"),
			jasmine.createSpy("handler")
		);

		expect(result).toBe(branch);
		expect(branch.node.leaves[0].handlers.length).toBe(2);
	});
});
