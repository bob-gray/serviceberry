/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const statusAccessor = require("../src/statusAccessor");

describe("statusAccessor", () => {
	var accessor;

	beforeEach(() => {
		accessor = Object.create(statusAccessor);
		accessor.initStatus();
	});

	it("should have a default OK status", () => {
		expect(accessor.getStatus()).toEqual({
			code: 200,
			text: "OK"
		});
	});

	it("should get status code", () => {
		expect(accessor.getStatusCode()).toBe(200);
	});

	it("should get status text", () => {
		expect(accessor.getStatusText()).toBe("OK");
	});

	it("should set status code", () => {
		accessor.setStatusCode(201);
		expect(accessor.getStatusCode()).toBe(201);
	});

	it("should throw if status code is not a number", () => {
		const error = () => accessor.setStatusCode("foo");

		expect(error).toThrow();
	});

	it("should set status text", () => {
		accessor.setStatusText("Not Found");
		expect(accessor.getStatusText()).toBe("Not Found");
	});

	it("should set custom status text", () => {
		accessor.setStatusText("Widget Not Found");
		expect(accessor.getStatusText()).toBe("Widget Not Found");
	});

	it("should set status by code", () => {
		const status = {
			code: 418,
			text: "I'm a Teapot"
		};

		accessor.setStatus(status.code);
		expect(accessor.getStatus()).toEqual(status);
	});

	it("should set status with object", () => {
		const status = {
			code: 503,
			text: "Boom!"
		};

		accessor.setStatus(status);
		expect(accessor.getStatus()).toEqual(status);
	});

	it("should set status standard text", () => {
		const status = {
			code: 202,
			text: "Accepted"
		};

		accessor.setStatus(status.text);
		expect(accessor.getStatus()).toEqual(status);
	});

	it("should throw if setting status by unknown text", () => {
		const error = () => accessor.setStatus("foo");

		expect(error).toThrow();
	});

	it("should test status with code", () => {
		expect(accessor.is(200)).toBe(true);
	});

	it("should test status with code", () => {
		expect(accessor.is("OK")).toBe(true);
	});

	it("should test false for wrong status with code", () => {
		expect(accessor.is(400)).toBe(false);
	});

	it("should test false for wrong status with text (case insensitive)", () => {
		expect(accessor.is("UNAUTHORIZED")).toBe(false);
	});

	it("should initialize with passed in status code", () => {
		accessor = Object.create(statusAccessor);
		accessor.initStatus(403);
		expect(accessor.getStatusCode()).toEqual(403);
	});

	it("should initialize with passed in status code", () => {
		accessor = Object.create(statusAccessor);
		accessor.initStatus("No Content");
		expect(accessor.is(204)).toBe(true);
	});
});
