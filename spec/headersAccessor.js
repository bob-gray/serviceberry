/* eslint-env jasmine */

"use strict";

const headersAccessor = require("../src/headersAccessor");

describe("headersAccessor", () => {
	var accessor;

	beforeEach(() => {
		accessor = Object.create({
			...headersAccessor.getters,
			...headersAccessor.setters
		});
		accessor.initHeaders();
	});

	it("should start headers as empty object", () => {
		expect(accessor.getHeaders()).toEqual({});
	});

	it("should set header", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.getHeaders()).toEqual({
			[name]: value
		});
	});

	it("should remove header if set to null", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		accessor.setHeader(name, null);
		expect(accessor.getHeaders()).toEqual({});
	});

	it("should remove header", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		accessor.removeHeader(name);
		expect(accessor.getHeaders()).toEqual({});
	});

	it("should remove all headers", () => {
		accessor.setHeader("Content-Size", 32405);
		accessor.setHeader("Content-Type", "application/json");
		accessor.clearHeaders();
		expect(accessor.getHeaders()).toEqual({});
	});

	it("should set headers", () => {
		const headers = {
			Authorization: "Bearer asghawlgaslkdjg",
			Accept: "application/json"
		};

		accessor.setHeaders(headers);
		expect(accessor.getHeaders()).toEqual(headers);
	});

	it("should get header", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.getHeader(name)).toBe(value);
	});

	it("should get header (case insensitive)", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.getHeader(name.toUpperCase())).toBe(value);
	});

	it("should test if a header exists", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.hasHeader(name)).toBe(true);
	});

	it("should test if a header exists (case insensitive)", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.hasHeader(name.toLowerCase())).toBe(true);
	});

	it("should test if a header doesn't exists", () => {
		expect(accessor.withoutHeader("Allow")).toBe(true);
	});

	it("should test false for a header that doesn't exists (hasHeader)", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.hasHeader("Other-Header")).toBe(false);
	});

	it("should test false for a header does exists (withoutHeader)", () => {
		const name = "Allow",
			value = "GET,POST";

		accessor.setHeader(name, value);
		expect(accessor.withoutHeader(name)).toBe(false);
	});

	it("should accept an array for a value", () => {
		const name = "Set-Cookie",
			value = [
				"foo=baz",
				"sessionId=asdgasdg"
			];

		accessor.setHeader(name, value);
		expect(Array.isArray(accessor.getHeader(name))).toBe(true);
		expect(accessor.getHeader(name).length).toBe(2);
	});

	it("should return array by value not by reference", () => {
		var name = "Set-Cookie",
			value = [
				"foo=baz",
				"sessionId=asdgasdg"
			];

		accessor.setHeader(name, value);
		value.push("not by reference");
		value = accessor.getHeader(name);
		expect(value.length).toBe(2);
		value.push("not by reference");
		expect(accessor.getHeader(name).length).toBe(2);
	});
});
