/* eslint-env jasmine */

"use strict";

const Binder = require("../src/Binder"),
	EventEmitter = require("events");

describe("Binder", () => {
	var binder,
		steward;

	beforeEach(() => {
		binder = new Binder();
		steward = new EventEmitter();
	});

	it("should set a function property on a steward object", () => {
		binder.bind(steward, "run", Function.prototype);

		expect(typeof steward.run).toBe("function");
	});

	it("should permanently bind a function to a binder object", () => {
		var bound;

		binder.bind(steward, "run", test);

		bound = steward.run;
		bound();

		function test () {
			expect(this).toBe(binder);
		}
	});

	it("should allow chaining of bind method", () => {
		var result = binder.bind(steward, "dummy", Function.prototype);

		expect(result).toBe(binder);
	});

	it("should allow binding more than one function", () => {
		var run = jasmine.createSpy("run");

		binder.bind(steward, "dummy", Function.prototype)
			.bind(steward, "run", run);

		steward.run();

		expect(run).toHaveBeenCalled();
	});

	it("should allow binding more then one steward", () => {
		var run = jasmine.createSpy("run"),
			secondSteward = {};

		binder.bind(steward, "dummy", Function.prototype)
			.bind(secondSteward, "run", run);

		secondSteward.run();

		expect(run).toHaveBeenCalled();
	});

	it("should allow binding by a method name", () => {
		binder.run = jasmine.createSpy("run");
		binder.bind(steward, "run");

		steward.run();

		expect(binder.run).toHaveBeenCalled();
	});

	it("should forward arguments to bound function", () => {
		var run = jasmine.createSpy("run");

		binder.bind(steward, "run", run);

		steward.run(1, 2, 3);

		expect(run).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should guard against calling the bound function more than once", () => {
		const run = jasmine.createSpy("run");

		binder.bind(steward, "run", run);

		steward.run();
		steward.run();

		expect(run).toHaveBeenCalledTimes(1);
	});

	it("should guard across all bound functions", () => {
		const run = jasmine.createSpy("run");

		binder.bind(steward, "run", run)
			.bind(steward, "walk", run);

		steward.run();
		steward.walk();

		expect(run).toHaveBeenCalledTimes(1);
	});

	it("should guard across all stewards", () => {
		const run = jasmine.createSpy("run"),
			secondSteward = {};

		binder.bind(secondSteward, "run", run)
			.bind(steward, "walk", run);

		secondSteward.run();
		steward.walk();

		expect(run).toHaveBeenCalledTimes(1);
	});

	it("should trigger 'No Control' on steward if bound function is called more then once", () => {
		const handler = jasmine.createSpy("handler");

		binder.bind(steward, "run", Function.prototype);

		steward.on("No Control", handler);

		steward.run();
		steward.run();

		expect(handler).toHaveBeenCalled();
	});
});
