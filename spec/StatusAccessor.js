/* eslint-env jasmine */

"use strict";

const StatusAccessor = require("../src/StatusAccessor");

describe("StatusAccessor", () => {
	var statusAccessor;

	beforeEach(() => {
		statusAccessor = Object.create(StatusAccessor);
		statusAccessor.initStatus();
	});

	it("should have a default OK status", () => {
		expect(statusAccessor.getStatus()).toEqual({
			code: 200,
			text: "OK"
		});
	});

	it("should get status code", () => {
		expect(statusAccessor.getStatusCode()).toBe(200);
	});

	it("should get status text", () => {
		expect(statusAccessor.getStatusText()).toBe("OK");
	});

	it("should set status code", () => {
		statusAccessor.setStatusCode(201);
		expect(statusAccessor.getStatusCode()).toBe(201);
	});

	it("should set status text", () => {
		statusAccessor.setStatusText("Not Found");
		expect(statusAccessor.getStatusText()).toBe("Not Found");
	});

	it("should set custom status text", () => {
		statusAccessor.setStatusText("Widget Not Found");
		expect(statusAccessor.getStatusText()).toBe("Widget Not Found");
	});

	it("should set status by code", () => {
		const status = {
			code: 418,
			text: "I'm a teapot"
		};

		statusAccessor.setStatus(status.code);
		expect(statusAccessor.getStatus()).toEqual(status);
	});

	it("should set status with object", () => {
		const status = {
			code: 503,
			text: "Boom!"
		};

		statusAccessor.setStatus(status);
		expect(statusAccessor.getStatus()).toEqual(status);
	});

	it("should set status standard text", () => {
		const status = {
			code: 202,
			text: "Accepted"
		};

		statusAccessor.setStatus(status.text);
		expect(statusAccessor.getStatus()).toEqual(status);
	});

	it("should test status with code", () => {
		expect(statusAccessor.is(200)).toBe(true);
	});

	it("should test status with code", () => {
		expect(statusAccessor.is("OK")).toBe(true);
	});

	it("should test false for wrong status with code", () => {
		expect(statusAccessor.is(400)).toBe(false);
	});

	it("should test false for wrong status with text (case insensitive)", () => {
		expect(statusAccessor.is("UNAUTHORIZED")).toBe(false);
	});

	it("should initialize with passed in status code", () => {
		statusAccessor = Object.create(StatusAccessor);
		statusAccessor.initStatus(403);
		expect(statusAccessor.getStatusCode()).toEqual(403);
	});

	it("should initialize with passed in status code", () => {
		statusAccessor = Object.create(StatusAccessor);
		statusAccessor.initStatus("No Content");
		expect(statusAccessor.is(204)).toBe(true);
	});
});
