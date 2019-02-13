/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const {statusCodes} = require("../src/main");

describe("statusCodes", () => {
	it("should have status codes at constant case status text", () => {
		expect(statusCodes.OK).toBe(200);
		expect(statusCodes.NO_CONTENT).toBe(204);
		expect(statusCodes.MOVED_PERMANENTLY).toBe(301);
		expect(statusCodes.NOT_MODIFIED).toBe(304);
		expect(statusCodes.FORBIDDEN).toBe(403);
		expect(statusCodes.NOT_FOUND).toBe(404);
		expect(statusCodes.INTERNAL_SERVER_ERROR).toBe(500);
		expect(statusCodes.SERVICE_UNAVAILABLE).toBe(503);
	});

	it("should have status codes at upper case status text", () => {
		/* eslint-disable dot-notation */
		expect(statusCodes["CREATED"]).toBe(201);
		expect(statusCodes["ACCEPTED"]).toBe(202);
		expect(statusCodes["FOUND"]).toBe(302);
		expect(statusCodes["TEMPORARY REDIRECT"]).toBe(307);
		expect(statusCodes["BAD REQUEST"]).toBe(400);
		expect(statusCodes["METHOD NOT ALLOWED"]).toBe(405);
		expect(statusCodes["NOT IMPLEMENTED"]).toBe(501);
		expect(statusCodes["BAD GATEWAY"]).toBe(502);
	});

	it("should have status text at status codes", () => {
		expect(statusCodes[100]).toBe("Continue");
		expect(statusCodes[200]).toBe("OK");
		expect(statusCodes[300]).toBe("Multiple Choices");
		expect(statusCodes[400]).toBe("Bad Request");
		expect(statusCodes[500]).toBe("Internal Server Error");
	});
});
