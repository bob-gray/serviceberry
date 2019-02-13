/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const {HttpError} = require("../src/main");

describe("HttpError", () => {
	var httpError;

	beforeEach(() => {
		httpError = new HttpError("Boom!", "I'm a teapot", {
			Warning: "112 - \"cache down\""
		});
	});

	it("should return message from getMessage()", () => {
		expect(httpError.getMessage()).toBe("Boom!");
	});

	it("should return message from getStatus()", () => {
		expect(httpError.getStatus()).toEqual({
			code: 418,
			text: "I'm a teapot"
		});
	});

	it("should return header value from getHeader()", () => {
		expect(httpError.getHeader("Warning")).toBe("112 - \"cache down\"");
	});

	it("should have a default status of 500", () => {
		httpError = new HttpError();

		expect(httpError.is("Internal Server Error")).toBe(true);
	});

	it("should have default Content-Type of text/plain", () => {
		httpError = new HttpError();

		expect(httpError.getHeader("Content-Type")).toBe("text/plain; charset=utf-8");
	});

	it("should accept an error object which is assigned to originalError property", () => {
		var error = new Error("Oh snap!");

		httpError = new HttpError(error);

		expect(httpError.originalError).toBe(error);
	});

	it("should get message from originalError", () => {
		var error = new Error("Oh snap!");

		httpError = new HttpError(error);

		expect(httpError.getMessage()).toBe("Oh snap!");
	});

	it("should copy a HttpError", () => {
		var error = new HttpError(httpError);

		expect(error).toEqual(httpError);
		expect(error).not.toBe(httpError);
	});
});
