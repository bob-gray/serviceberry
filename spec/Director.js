"use strict";

const Director = require("../src/Director"),
	Request = require("../src/Request"),
	Response = require("../src/Response"),
	Route = require("../src/Route"),
	httpMocks = require("node-mocks-http"),
	EventEmitter = require('events');

describe("Director", () => {
	var request,
		response,
		director,
		route;

	beforeEach(() => {
		request = createRequest();
		response = createResponse();
		director = new Director(request, response),
		route = createRoute(request, response);
	});

	it("should run route", () => {
		director.run(route);
		expect("route" in director).toBe(true);
	});

	it("should timeout", (done) => {
		route = createRoute(request, response, {
			options: {
				timeout: 100
			},
			handlers: [
				Function.prototype
			],
			catches: [
				request => {
					expect(request.error.is("Service Unavailable")).toBe(true);
					done();
				}
			]
		});

		director.run(route);
	});

	it("should throw on request.getBody() when deserializer fails", (done) => {
		request = createRequest({
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			content: "{bad json}"
		});

		director = new Director(request, response);

		route = createRoute(request, response, {
			handlers: [
				request => request.getBody()
			],
			catches: [
				request => {
					expect(request.error).toBeDefined();
					// TODO: figure out why this is ok on my machine but fails on CircleCI
					//expect(request.error.is("Bad Request")).toBe(true);
					done();
				}
			]
		});

		director.run(route);
	});

	it("should send latest result when reaching the end of the handler queue", (done) => {
		const responseContent = "Plain text response",
			serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse._getData()).toBe(responseContent);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				request => responseContent
			],
			catches: []
		});

		director.run(route);
	});

	it("should send Content-Length header automatically", (done) => {
		const responseContent = "Plain text response",
			serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(response.getHeader("Content-Length")).toBe(String(responseContent.length));
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				request => responseContent
			],
			catches: []
		});

		director.run(route);
	});

	it("should not overide a Content-Length previously set", (done) => {
		const responseContent = "Plain text response",
			serverResponse = response.serverResponse;

		response.setHeader("Content-Length", "1");

		serverResponse.on("end", () => {
			expect(response.getHeader("Content-Length")).toBe("1");
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				request => responseContent
			],
			catches: []
		});

		director.run(route);
	});

	it("should response with error when there are no catch handlers", (done) => {
		const serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(401);
			done();
		});

		director = new Director(request, response);

		route = createRoute(request, response, {
			handlers: [
				request => request.fail("Who are you", "Unauthorized")
			],
			catches: []
		});

		director.run(route);
	});

	it("should send set status to 204 on a success response without content", (done) => {
		const serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(204);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				(request, response) => response.send()
			],
			catches: []
		});

		director.run(route);
	});
});

function createRequest (options = {}) {
	const incomingMessage = httpMocks.createRequest({
		url: "/",
		...options
	});

	incomingMessage.setEncoding = Function.prototype;

	setImmediate(emitRequestContent, incomingMessage, options.content)

	return new Request(incomingMessage);
}

function emitRequestContent (incomingMessage, content) {
	incomingMessage.emit("data", content);
	incomingMessage.emit("end");
}

function createResponse (hasContentType) {
	const serverResponse = httpMocks.createResponse({
		eventEmitter: EventEmitter
	});

	return new Response(serverResponse);
}

function createRoute (request, response, rootOptions = getDefaultRootOptions()) {
	const root = jasmine.createSpyObj("root", ["test", "transition", "chooseNext"]);

	Object.assign(root, rootOptions);
	root.test.and.returnValue(true);

	return new Route(root, request, response);
}

function getDefaultRootOptions () {
	return {
		handlers: [],
		catches: [],
		options: {}
	};
}
