/* globals expectAsync */
/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Operator = require("../src/Operator");

describe("Operator", () => {
	var operator;

	beforeEach(() => {
		operator = new Operator();
	});

	it("should return a promise from call method", () => {
		var promise = operator.call(Function.prototype);

		expect(typeof promise).toBe("object");
		expect(typeof promise.then).toBe("function");
	});

	it("should forward arguments to the handler", () => {
		var handler = jasmine.createSpy("handler");

		operator.call(handler, [1, 2, 3]);

		expect(handler).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should return a promise from call that resolves to a simple value returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(1);

		return expectAsync(operator.call(handler)).toBeResolvedTo(1);
	});

	it("should return a promise from call that 'follows' a promise returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(Promise.resolve(1));

		return expectAsync(operator.call(handler)).toBeResolvedTo(1);
	});

	it("should return a promise from call that 'follows' a rejected promise returned from handler", () => {
		var error = new Error("Oh Snap!"),
			handler = jasmine.createSpy("handler").and.returnValue(Promise.reject(error));

		return expectAsync(operator.call(handler)).toBeRejectedWith(error);
	});

	it("should return a rejected promise from call when handler returns an error", () => {
		var error = new Error("Oh Snap!"),
			handler = jasmine.createSpy("handler").and.returnValue(error);

		return expectAsync(operator.call(handler)).toBeRejectedWith(error);
	});

	it("should return a rejected promise from call when false is returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(false);

		return expectAsync(operator.call(handler)).toBeRejected();
	});

	it("should return a rejected promise from call when handler throws an error", () => {
		var error = new Error("Oh Snap!"),
			handler = () => {
				throw error;
			};

		return expectAsync(operator.call(handler)).toBeRejectedWith(error);
	});

	it("should return a promise from call that remains unresolved when the handler returns undefined", done => {
		var next = jasmine.createSpy("next");

		operator.call(Function.prototype).then(next, next);

		setTimeout(() => {
			expect(next).not.toHaveBeenCalled();
			done();
		}, 500);
	});
});
