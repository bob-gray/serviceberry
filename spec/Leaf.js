/* eslint max-nested-callbacks: ["error", 3] */

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

	it("should add handler function", async () => {
		const handler = jasmine.createSpy("handler function");

		leaf.use(handler);

		await leaf.node.resolved;

		leaf.node.handlers[0]();

		expect(leaf.node.handlers.length).toBe(1);
		expect(handler).toHaveBeenCalled();
	});

	it("should add handler object", async () => {
		const handler = jasmine.createSpyObj("handler object", ["use"]);

		leaf.use(handler);

		await leaf.node.resolved;

		leaf.node.handlers[0]();

		expect(leaf.node.handlers.length).toBe(1);
		expect(handler.use).toHaveBeenCalled();
	});

	it("should add coping handler function", async () => {
		const handler = jasmine.createSpy("handler function");

		leaf.cope(handler);

		await leaf.node.resolved;

		leaf.node.coping[0]();

		expect(leaf.node.coping.length).toBe(1);
		expect(handler).toHaveBeenCalled();
	});

	it("should add coping handler object", async () => {
		const handler = jasmine.createSpyObj("handler object", ["use"]);

		leaf.cope(handler);

		await leaf.node.resolved;

		leaf.node.coping[0]();

		expect(leaf.node.coping.length).toBe(1);
		expect(handler.use).toHaveBeenCalled();
	});

	it("should reject when handler is not a function or object with use method", async () => {
		var thrown;

		leaf.use("foo");

		try {
			await leaf.node.resolved;
		} catch (error) {
			thrown = error;
		}

		expect(thrown.message).toBe("handler must be a function or an object with a `use` method");
	});

	it("should add promises that the leaf node waits for", async () => {
		var {promise} = createPromise();

		leaf.waitFor(promise);

		expect(leaf.node.waiting.length).toBe(1);
		expect(leaf.node.waiting.pop()).toBe(promise);
	});
});

function createPromise () {
	var resolve,
		reject,
		promise = new Promise((yea, nay) => {
			resolve = yea;
			reject = nay;
		});

	return {resolve, reject, promise};
}
