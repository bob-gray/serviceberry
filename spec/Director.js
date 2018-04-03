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
});

function createRequest (options) {
	const incomingMessage = httpMocks.createRequest({
		url: "/",
		...options
	});

	incomingMessage.setEncoding = Function.prototype;

	return new Request(incomingMessage);
}

function createResponse (hasContentType) {
	const serverResponse = httpMocks.createResponse({
		eventEmitter: EventEmitter
	});

	return new Response(serverResponse);
}

function createRoute (request, response) {
	const root = jasmine.createSpyObj("root", ["test", "transition", "chooseNext"]);
	Object.assign(root, {
		handlers: [],
		catches: [],
		options: {}
	});
	root.test.and.returnValue(false);

	return new Route(root, request, response);
}
