/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Binding = require("../src/Binding"),
	EventEmitter = require("events");

describe("Binding", () => {
	var binding;

	beforeEach(() => {
		binding = new Binding();
	});

	it("should have operator", () => {
		expect("operator" in binding).toBe(true);
	});

	it("should call handler with args", () => {
		var handler = jasmine.createSpy("handler");

		binding.call(handler, 1, 2, 3);

		expect(handler).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should unbind after calling bound function", (done) => {
		var noControl = jasmine.createSpy("No Control"),
			proceed = jasmine.createSpy("proceed"),
			steward = new EventEmitter();

		binding.bind(steward, "proceed", proceed);
		steward.on("No Control", noControl);

		steward.proceed();
		steward.proceed();

		setImmediate(() => {
			expect(proceed).toHaveBeenCalledTimes(1);
			expect(noControl).toHaveBeenCalled();
			done();
		});
	});

	it("should unbind after calling proceed", (done) => {
		var noControl = jasmine.createSpy("No Control"),
			steward = new EventEmitter();

		binding.bind(steward, "proceed");
		steward.on("No Control", noControl);

		steward.proceed();
		steward.proceed();

		setImmediate(() => {
			expect(noControl).toHaveBeenCalled();
			done();
		});
	});

	it("should unbind after calling fail", (done) => {
		var noControl = jasmine.createSpy("No Control"),
			steward = new EventEmitter();

		binding.bind(steward, "fail");
		steward.on("No Control", noControl);

		steward.fail();
		steward.fail();

		setImmediate(() => {
			expect(noControl).toHaveBeenCalled();
			done();
		});
	});
});
