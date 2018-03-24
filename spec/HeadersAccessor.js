/* eslint-env jasmine */

"use strict";

const HeadersAccessor = require("../src/HeadersAccessor");

describe("HeadersAccessor", () => {
	var headersAccessor;

	beforeEach(() => {
		headersAccessor = Object.create(HeadersAccessor);
		headersAccessor.initHeaders();
	});

	it("should start headers as empty object", () => {
		expect(headersAccessor.getHeaders()).toEqual({});
	});

	it("should set header", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.getHeaders()).toEqual({
			[name]: value
		});
	});

	it("should remove header if set to null", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		headersAccessor.setHeader(name, null);
		expect(headersAccessor.getHeaders()).toEqual({});
	});

	it("should remove header", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		headersAccessor.removeHeader(name);
		expect(headersAccessor.getHeaders()).toEqual({});
	});

	it("should remove all headers", () => {
		headersAccessor.setHeader("Content-Size", 32405);
		headersAccessor.setHeader("Content-Type", "application/json");
		headersAccessor.clearHeaders();
		expect(headersAccessor.getHeaders()).toEqual({});
	});

	it("should set headers", () => {
		const headers = {
			Authorization: "Bearer asghawlgaslkdjg",
			Accept: "application/json"
		};

		headersAccessor.setHeaders(headers);
		expect(headersAccessor.getHeaders()).toEqual(headers);
	});

	it("should get header", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.getHeader(name)).toBe(value);
	});

	it("should get header (case insensitive)", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.getHeader(name.toUpperCase())).toBe(value);
	});

	it("should test if a header exists", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.hasHeader(name)).toBe(true);
	});

	it("should test if a header exists (case insensitive)", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.hasHeader(name.toLowerCase())).toBe(true);
	});

	it("should test if a header doesn't exists", () => {
		expect(headersAccessor.withoutHeader("Allow")).toBe(true);
	});

	it("should test false for a header that doesn't exists (hasHeader)", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.hasHeader("Other-Header")).toBe(false);
	});

	it("should test false for a header does exists (withoutHeader)", () => {
		const name = "Allow",
			value = "GET,POST";

		headersAccessor.setHeader(name, value);
		expect(headersAccessor.withoutHeader(name)).toBe(false);
	});

	it("should accept an array for a value", () => {
		const name = "Set-Cookie",
			value = [
				"foo=baz",
				"sessionId=asdgasdg"
			];

		headersAccessor.setHeader(name, value);
		expect(Array.isArray(headersAccessor.getHeader(name))).toBe(true);
		expect(headersAccessor.getHeader(name).length).toBe(2);
	});

	it("should return array by value not by reference", () => {
		var name = "Set-Cookie",
			value = [
				"foo=baz",
				"sessionId=asdgasdg"
			];

		headersAccessor.setHeader(name, value);
		value.push("not by reference");
		value = headersAccessor.getHeader(name);
		expect(value.length).toBe(2);
		value.push("not by reference");
		expect(headersAccessor.getHeader(name).length).toBe(2);
	});
});
