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

		operator.call(handler, 1, 2, 3);

		expect(handler).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should return a promise from call that resolves to a simple value returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(1);

		return operator.call(handler).then((value) => expect(value).toBe(1));
	});

	it("should return a promise from call that 'follows' a promise returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(Promise.resolve(1));

		return operator.call(handler).then((value) => expect(value).toBe(1));
	});

	it("should return a promise from call that 'follows' a rejected promise returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(Promise.reject(new Error("Oh Snap!")));

		return operator.call(handler).catch((error) => expect(error.message).toBe("Oh Snap!"));
	});

	it("should return a rejected promise from call when false is returned from handler", () => {
		var handler = jasmine.createSpy("handler").and.returnValue(false);

		return operator.call(handler).catch((error) => expect(error).toBe(false));
	});

	it("should return a rejected promise from call when handler throws an error", () => {
		var handler = () => {
			throw new Error("Oh Snap!")
		};

		return operator.call(handler).catch((error) => expect(error.message).toBe("Oh Snap!"));
	});

	it("should return a promise from call that remains unresolved when the handler returns undefined", () => {
		var handler = jasmine.createSpy("handler");

		operator.call(Function.prototype).then(handler);		

		expect(handler).not.toHaveBeenCalled();
	});
});