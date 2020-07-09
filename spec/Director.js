/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Director = require("../src/Director"),
	Request = require("../src/Request"),
	Response = require("../src/Response"),
	RequestRoute = require("../src/RequestRoute"),
	httpMocks = require("node-mocks-http"),
	EventEmitter = require("events");

describe("Director", () => {
	var request,
		response,
		director,
		route;

	beforeEach(() => {
		request = createRequest();
		response = createResponse();
		director = new Director(request, response);
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
			coping: [
				req => {
					expect(req.error.getStatusText()).toBe("Service Unavailable");
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
				req => req.getBody()
			],
			coping: [
				req => {
					expect(req.error).toBeDefined();
					expect(req.error.is("Bad Request")).toBe(true);
					done();
				}
			]
		});

		director.run(route);
	});

	it("should deserialize a json request body", (done) => {
		const goodJson = {good: "json"};

		request = createRequest({
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			content: JSON.stringify(goodJson)
		});

		director = new Director(request, response);

		route = createRoute(request, response, {
			handlers: [
				req => {
					expect(req.getBody()).toEqual(goodJson);
					done();
				}
			],
			coping: []
		});

		director.run(route);
	});

	it("should send an error when serializer returns an error", (done) => {
		const serverResponse = response.serverResponse,
			contentType = "text/plain",
			error = new Error("Bad serializer");

		response.setHeader("Content-Type", contentType);
		director = new Director(request, response);

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(500);
			expect(serverResponse._getChunks().toString()).toBe(error.message);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				req => req.getBody()
			],
			coping: [],
			options: {
				serializers: {
					[contentType]: () => error
				}
			}
		});

		director.run(route);
	});

	it("should send an error when serializer throws an error", (done) => {
		const serverResponse = response.serverResponse,
			contentType = "text/plain";

		response.setHeader("Content-Type", contentType);
		director = new Director(request, response);

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(500);
			expect(serverResponse._getChunks().toString()).toBe("");
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				req => req.getBody()
			],
			coping: [],
			options: {
				serializers: {
					[contentType]: () => {
						throw new Error();
					}
				}
			}
		});

		director.run(route);
	});

	it("should send latest result when reaching the end of the handler queue", (done) => {
		const responseContent = "Plain text response",
			serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse._getChunks().toString()).toBe(responseContent);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				() => responseContent
			],
			coping: []
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
				() => responseContent
			],
			coping: []
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
				() => responseContent
			],
			coping: []
		});

		director.run(route);
	});

	it("should response with error when there are no coping handlers", (done) => {
		const serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(401);
			done();
		});

		director = new Director(request, response);

		route = createRoute(request, response, {
			handlers: [
				req => req.fail("Who are you", "Unauthorized")
			],
			coping: []
		});

		director.run(route);
	});

	it("should set status to 204 on a success response without content", (done) => {
		const serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(204);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				async (req, res) => res.send()
			],
			coping: []
		});

		director.run(route);
	});

	it("should not fail with write after end", (done) => {
		const serverResponse = response.serverResponse;

		serverResponse.on("end", () => {
			expect(serverResponse.statusCode).toBe(422);
			done();
		});

		route = createRoute(request, response, {
			handlers: [
				req => {
					req.fail("Aw Snap!", 422);
					req.fail("And again");
				}
			],
			coping: []
		});

		director.run(route);
	});
});

function createRequest (options = {}) {
	const incomingMessage = httpMocks.createRequest({
		url: "/",
		...options
	});

	Object.assign(incomingMessage, {
		setEncoding: Function.prototype,
		socket: {
			remoteAddress: options.ip,
			localPort: options.port
		},
		connection: {
			encrypted: options.protocol === "https"
		}
	});

	setImmediate(emitRequestContent, incomingMessage, options.content);

	return new Request(incomingMessage);
}

function emitRequestContent (incomingMessage, content) {
	incomingMessage.emit("data", content);
	incomingMessage.emit("end");
}

function createResponse () {
	const serverResponse = httpMocks.createResponse({
		eventEmitter: EventEmitter
	});

	return new Response(serverResponse);
}

function createRoute (request, response, rootOptions = getDefaultRootOptions()) {
	const root = jasmine.createSpyObj("root", ["test", "transition", "chooseNext"]);

	Object.assign(root, rootOptions);
	root.test.and.returnValue(true);

	return new RequestRoute(root, request, response);
}

function getDefaultRootOptions () {
	return {
		handlers: [],
		coping: [],
		options: {}
	};
}
