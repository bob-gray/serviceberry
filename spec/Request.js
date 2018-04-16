"use strict";

const Request = require("../src/Request"),
	url = require("url"),
	httpMocks = require("node-mocks-http");

describe("Request (GET)", () => {
	var options,
		request,
		pathParams,
		queryParams;

	beforeEach(() => {
		options = {
			method: "GET",
			url: "/path/to/items/105?awesome=yes",
			headers: {
				Accept: "application/json",
			}
		};

		request = createRequest(options);

		pathParams = {
			id: 105
		};

		queryParams = {
			awesome: "yes"
		};

		request.pathParams = pathParams;
	});

	it("should be abled to be copied", () => {
		expect(request.copy()).toEqual(request);
		expect(request.copy()).not.toBe(request);
	});

	it("should return id from getId()", () => {
		expect(typeof request.getId()).toBe("string");
	});

	it("should return elasped time from getElapsedTime()", (done) => {
		setTimeout(() => {
			expect(request.getElapsedTime()).toBeGreaterThan(0);
			done();
		}, 500);
	});

	it("should return method from getMethod()", () => {
		expect(request.getMethod()).toBe("GET");
	});

	it("should return parsed url object from getUrl()", () => {
		expect(request.getUrl()).toEqual(url.parse(options.url));
	});

	it("should return path params from getPathParams()", () => {
		expect(request.getPathParams()).toEqual(pathParams);
	});

	it("should return path param from getPathParam()", () => {
		expect(request.getPathParam("id")).toBe(pathParams.id);
	});

	it("should return querystring params from getQueryParams()", () => {
		expect(request.getQueryParams()).toEqual(queryParams);
	});

	it("should return querystring param from getQueryParam()", () => {
		expect(request.getQueryParam("awesome")).toBe(queryParams.awesome);
	});

	it("should return path and querystring param from getParams()", () => {
		expect(request.getParams()).toEqual({...queryParams, ...pathParams});
	});

	it("should return path param from getParam()", () => {
		expect(request.getParam("id")).toBe(pathParams.id);
	});

	it("should return query param from getParam()", () => {
		expect(request.getParam("awesome")).toBe(queryParams.awesome);
	});
});

describe("Request (POST)", () => {
	var options,
		request,
		pathParams,
		queryParams;

	beforeEach(() => {
		options = {
			method: "POST",
			url: "/path/to/items/105/things",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: {
				foo: "baz",
				total: 5
			}
		};

		request = createRequest(options);
	});

	it("should return POST from getMethod()", () => {
		expect(request.getMethod()).toBe(options.method);
	});

	it("should return content type without encoding from getContentType()", () => {
		expect(request.getContentType()).toBe("application/json");
	});

	it("should return encoding from getEncoding()", () => {
		expect(request.getEncoding()).toBe("utf-8");
	});

	it("should get and set content", () => {
		const content = JSON.stringify(options.body);

		request.setContent(content);

		expect(request.getContent()).toBe(content);
	});

	it("should get and set body", () => {
		request.setBody(options.body);

		expect(request.getBody()).toBe(options.body);
	});

	it("should get body params from getParams()", () => {
		request.setBody(options.body);

		expect(request.getParams()).toEqual(options.body);
	});

	it("should get body param from getParam()", () => {
		request.setBody(options.body);

		expect(request.getParam("foo")).toBe("baz");
	});

	it("should set param name as body if body is not an object", () => {
		request = createRequest();
		request.setBody([1,2,3]);

		expect(request.getParam("body")).toEqual([1,2,3]);
	});
});

function createRequest (options) {
	const incomingMessage = httpMocks.createRequest({
		url: "/",
		...options
	});

	incomingMessage.setEncoding = Function.prototype;

	return new Request(incomingMessage);
}
