/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Binder = require("../src/Binder"),
	EventEmitter = require("events");

describe("Binder", () => {
	var binder,
		steward;

	beforeEach(() => {
		binder = Object.assign(new Binder(), {
			walk: jasmine.createSpy("walk"),
			run: jasmine.createSpy("run")
		});

		steward = new EventEmitter();
	});

	it("should allow chaining of bind method", () => {
		const result = binder.bind(steward, "run");

		expect(result).toBe(binder);
	});

	it("should allow binding more than one function", () => {
		binder.bind(steward, "walk")
			.bind(steward, "run");

		steward.run();

		expect(binder.run).toHaveBeenCalled();
	});

	it("should allow binding more then one steward", () => {
		var run = jasmine.createSpy("run"),
			secondSteward = {};

		binder.bind(steward, "walk")
			.bind(secondSteward, "run", run);

		secondSteward.run();

		expect(run).toHaveBeenCalled();
	});

	it("should allow binding by a method name", () => {
		binder.bind(steward, "run");

		steward.run();

		expect(binder.run).toHaveBeenCalled();
	});

	it("should forward arguments to bound function", () => {
		const callback = jasmine.createSpy("callback");

		binder.bind(steward, "run", callback);

		steward.run(1, 2, 3);

		expect(callback).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should guard against calling the bound function more than once", () => {
		const callback = jasmine.createSpy("callback");

		binder.bind(steward, "run", callback);

		steward.run();
		steward.run();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should guard across all bound functions", () => {
		const callback = jasmine.createSpy("callback");

		binder.bind(steward, "run", callback)
			.bind(steward, "walk", callback);

		steward.run();
		steward.walk();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should guard across all stewards", () => {
		const callback = jasmine.createSpy("callback"),
			secondSteward = {};

		binder.bind(secondSteward, "run", callback)
			.bind(steward, "walk", callback);

		secondSteward.run();
		steward.walk();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should trigger 'No Control' on steward if bound function is called more then once", () => {
		const handler = jasmine.createSpy("handler");

		binder.bind(steward, "run");

		steward.on("No Control", handler);

		steward.run();
		steward.run();

		expect(handler).toHaveBeenCalled();
	});
});
