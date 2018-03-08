"use strict";

const Route = require("../src/Route");

describe("Route", () => {
	var root,
		child,
		route;

	beforeEach(() => {
		root = Object.assign(jasmine.createSpyObj("root", ["transition", "chooseNext"]), {
			handlers: [1],
			catches: [2, 3],
			options: {
				root: true
			}
		});

		child = Object.assign(jasmine.createSpyObj("child", ["transition", "chooseNext"]), {
			handlers: [4, 5],
			catches: [],
			options: {
				child: true
			}
		});		

		root.chooseNext.and.returnValue(child);

		route = new Route(root, "arg1", "arg2");
	});

	it("should return one handler at a time in sequence from getNextHandler()", () => {
		expect(route.getNextHandler()).toBe(1);
		expect(route.getNextHandler()).toBe(4);
		expect(route.getNextHandler()).toBe(5);
	});

	it("should return undefined from getNextHandler() when handler queue is empty", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();

		expect(route.getNextHandler()).toBeUndefined();
	});

	it("should return undefined from getNextFailHandler() before passing by catches", () => {
		expect(route.getNextFailHandler()).toBeUndefined();
	});

	it("should return one fail handler at a time in reverse sequence from getNextFailHandler()", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();

		expect(route.getNextFailHandler()).toBe(3);
		expect(route.getNextFailHandler()).toBe(2);
	});

	it("should return undefined from getNextFailHandler() when fail handler queue is empty", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();
		route.getNextFailHandler();
		route.getNextFailHandler();

		expect(route.getNextFailHandler()).toBeUndefined();
	});

	it("should requeue catches if getNextHandler() is called", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextFailHandler();
		route.getNextHandler();

		expect(route.getNextFailHandler()).toBe(3);
	});

	it("should transition node when ploting route", () => {
		expect(root.transition).toHaveBeenCalledTimes(1);
		expect(root.transition).toHaveBeenCalledWith("arg1", "arg2");
	});

	it("should ask node to choose next when ploting route", () => {
		expect(root.chooseNext).toHaveBeenCalledTimes(1);
		expect(root.chooseNext).toHaveBeenCalledWith("arg1", "arg2");
	});

	it("should have options accumulated from nodes", () => {
		expect(route.options.root).toBe(true);
		expect(route.options.child).toBe(true);
	});
});
