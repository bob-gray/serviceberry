/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const mock = require("mock-require"),
	EventEmitter = require("events"),
	mockRequest = {},
	mockResponse = {},
	mockDirector = {
		run: jasmine.createSpy("director run")
	},
	mockRoute = {},
	MockRequest = jasmine.createSpy("MockRequest"),
	MockResponse = jasmine.createSpy("MockResponse"),
	MockDirector = jasmine.createSpy("MockDirector"),
	MockRoute = jasmine.createSpy("MockRoute");

mock("http", {createServer});
mock.reRequire("http");

MockRequest.and.returnValue(mockRequest);
mock("../src/Request", MockRequest);
mock.reRequire("../src/Request");

MockResponse.and.returnValue(mockResponse);
mock("../src/Response", MockResponse);
mock.reRequire("../src/Response");

MockDirector.and.returnValue(mockDirector);
mock("../src/Director", MockDirector);
mock.reRequire("../src/Director");

MockRoute.and.returnValue(mockRoute);
mock("../src/Route", MockRoute);
mock.reRequire("../src/Route");

// eslint-disable-next-line one-var
const Trunk = mock.reRequire("../src/Trunk");

describe("Trunk", () => {
	var trunk;

	beforeEach(() => {
		trunk = new Trunk();
		trunk.server.listen();
	});

	afterAll(() => {
		mock.stopAll();
	});

	it("should run respond", (done) => {
		trunk.server.on("listening", () => trunk.server.emit("request"));
		setTimeout(respond, 500, trunk, done);
	});

	it("should have a node", () => {
		expect("node" in trunk).toBe(true);
	});

	it("should have a root node", () => {
		expect("node" in trunk.root).toBe(true);
	});

	it("should have a server", () => {
		expect("server" in trunk).toBe(true);
	});

	it("should auto start", (done) => {
		trunk = new Trunk({
			callback: jasmine.createSpy("trunk callback")
		});

		setTimeout(() => {
			expect(trunk.server.listen).toHaveBeenCalled();
			expect(trunk.options.callback).toHaveBeenCalled();
			done();
		}, 200);
	});

	it("should be able to start later", (done) => {
		trunk = new Trunk({
			autoStart: false,
			callback: jasmine.createSpy("trunk callback")
		});

		setTimeout(() => {
			expect(trunk.server.listen).not.toHaveBeenCalled();
			expect(trunk.options.callback).not.toHaveBeenCalled();
			trunk.start();
		}, 200);

		setTimeout(() => {
			expect(trunk.server.listen).toHaveBeenCalled();
			expect(trunk.options.callback).toHaveBeenCalled();
			done();
		}, 300);
	});

	it("should close on stop", () => {
		trunk.stop();

		expect(trunk.server.close).toHaveBeenCalled();
	});

	it("should create a trunk with a path", () => {
		trunk = Trunk.create({
			path: "products"
		});

		expect(trunk.root.node).not.toBe(trunk.node);
	});

	it("should add a handler with use()", () => {
		trunk.use(jasmine.createSpy("handler"));

		expect(trunk.root.node.handlers.length).toBe(1);
	});

	it("should add a error handler with catch()", () => {
		trunk.catch(jasmine.createSpy("handler"));

		expect(trunk.root.node.catches.length).toBe(1);
	});

	it("should add a root handler with use()", () => {
		trunk = Trunk.create({
			path: "products"
		});
		trunk.use(jasmine.createSpy("handler"));

		expect(trunk.root.node.handlers.length).toBe(1);
	});

	it("should add a root error handler with catch()", () => {
		trunk = Trunk.create({
			path: "products"
		});
		trunk.catch(jasmine.createSpy("handler"));

		expect(trunk.root.node.catches.length).toBe(1);
	});
});

function createServer () {
	const mockServer = new EventEmitter();

	Object.assign(mockServer, {
		listen: jasmine.createSpy("mockServer listen"),
		close: jasmine.createSpy("mockServer close")
	});

	mockServer.listen.and.callFake(listen);

	return mockServer;
}

function listen () {
	this.emit("listening");
}

function respond (trunk, done) {
	expect(MockRequest).toHaveBeenCalled();
	expect(MockResponse).toHaveBeenCalled();
	expect(MockDirector).toHaveBeenCalledWith(mockRequest, mockResponse);
	expect(MockRoute).toHaveBeenCalledWith(trunk.root.node, mockRequest, mockResponse);
	expect(mockDirector.run).toHaveBeenCalledWith(mockRoute);
	done();
}
