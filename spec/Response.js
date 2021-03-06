/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Response = require("../src/Response"),
	EventEmitter = require("events");

describe("Response", () => {
	var response;

	beforeEach(() => {
		response = createResponse();
	});

	it("should have property serverResponse", () => {
		expect("serverResponse" in response).toBe(true);
	});

	it("should return content type without encoding from getContentType()", () => {
		response.setHeader("Content-Type", "application/json; charset=utf-8");

		expect(response.getContentType()).toBe("application/json");
	});

	it("should return undefined content type from getContentType()", () => {
		expect(response.getContentType()).toBeUndefined();
	});

	it("should set and get body", () => {
		response.setBody(5);

		expect(response.getBody()).toBe(5);
	});

	it("should return false from isBodyStreamable() when body doesn't have pipe method", () => {
		response.setBody(5);

		expect(response.isBodyStreamable()).toBe(false);
	});

	it("should return false from isBodyStreamable() when body does have pipe method", () => {
		response.setBody({
			pipe: Function.prototype
		});

		expect(response.isBodyStreamable()).toBe(true);
	});

	it("should set and get encoding", () => {
		response.setEncoding("ascii");

		expect(response.getEncoding()).toBe("ascii");
	});

	it("should set status", () => {
		const status = 204;

		response.set({status});

		expect(response.is(status)).toBe(true);
	});

	it("should set headers", () => {
		const headers = {
			"Content-Type": "text/xml"
		};

		response.set({headers});

		expect(response.getHeaders()).toEqual(headers);
	});

	it("should set encoding", () => {
		const encoding = "base64";

		response.set({encoding});

		expect(response.getEncoding()).toBe(encoding);
	});

	it("should set body", () => {
		const body = {
			awesome: true
		};

		response.set({body});

		expect(response.getBody()).toEqual(body);
	});

	it("should set finish listener", (done) => {
		const finish = jasmine.createSpy("finish handler");

		response.set({finish});
		response.on("finish", () => {
			expect(finish).toHaveBeenCalled();
			done();
		});
		response.serverResponse.emit("finish");
	});
});

function createResponse () {
	const serverResponse = new EventEmitter();

	return new Response(serverResponse);
}
