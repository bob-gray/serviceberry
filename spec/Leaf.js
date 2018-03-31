"use strict";

const Leaf = require("../src/Leaf");

describe("Leaf", () => {
	var options,
		leaf;

	beforeEach(() => {
		options = {
			consumes: "application/x-www-form-urlencoded",
			produces: "application/json"
		};
		leaf = new Leaf(options);
	});

	it("should set options in constructor", () => {
		expect(leaf.options).toEqual(options);
	});

	it("should create node in constructor", () => {
		expect("node" in leaf).toBe(true);
	});

	it("should add handler function", () => {
		const handler = jasmine.createSpy("handler function");

		leaf.use(handler);
		leaf.node.handlers[0]();

		expect(leaf.node.handlers.length).toBe(1);
		expect(leaf.node.handlers.pop()).toBe(handler);
		expect(handler).toHaveBeenCalled();
	});

	it("should add handler object", () => {
		const handler = jasmine.createSpyObj("handler object", ["use"]);

		leaf.use(handler);
		leaf.node.handlers[0]();

		expect(leaf.node.handlers.length).toBe(1);
		expect(handler.use).toHaveBeenCalled();
	});

	it("should add catch function", () => {
		const handler = jasmine.createSpy("handler function");

		leaf.catch(handler);
		leaf.node.catches[0]();

		expect(leaf.node.catches.length).toBe(1);
		expect(leaf.node.catches.pop()).toBe(handler);
		expect(handler).toHaveBeenCalled();
	});

	it("should add catch object", () => {
		const handler = jasmine.createSpyObj("handler object", ["use"]);

		leaf.catch(handler);
		leaf.node.catches[0]();

		expect(leaf.node.catches.length).toBe(1);
		expect(handler.use).toHaveBeenCalled();
	});

	it("should throw when handler is not a function or object with use method", () => {
		expect(leaf.use.bind(leaf, "foo"))
			.toThrowMatching((thrown) => thrown.message === "handler must be a function or an object with a `use` method");
	});
});
