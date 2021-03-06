/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const Route = require("../src/Route");

describe("Route", () => {
	var root,
		child,
		route;

	beforeEach(() => {
		root = jasmine.createSpyObj("root", ["test", "transition", "chooseNext"]);

		Object.assign(root, {
			handlers: [3],
			coping: [1, 2],
			options: {
				root: true
			}
		});

		child = Object.assign(jasmine.createSpyObj("child", ["transition", "chooseNext"]), {
			handlers: [5, 6],
			coping: [4],
			options: {
				child: true
			}
		});

		root.test.and.returnValue(true);
		root.chooseNext.and.returnValue(child);

		route = new Route();
		route.plot(root, "arg1", "arg2");
	});

	it("should return one handler at a time in sequence from getNextHandler()", () => {
		expect(route.getNextHandler()).toBe(3);
		expect(route.getNextHandler()).toBe(5);
		expect(route.getNextHandler()).toBe(6);
	});

	it("should return undefined from getNextHandler() when handler queue is empty", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();

		expect(route.getNextHandler()).toBeUndefined();
	});

	it("should not return coping from getNextCoping() before moving to child handlers", () => {
		route.getNextCoping();
		route.getNextCoping();

		expect(route.getNextCoping()).toBeUndefined();
	});

	it("should return one fail handler at a time in reverse sequence from getNextCoping()", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();

		expect(route.getNextCoping()).toBe(4);
		expect(route.getNextCoping()).toBe(2);
	});

	it("should return undefined from getNextCoping() when fail handler queue is empty", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextHandler();
		route.getNextCoping();
		route.getNextCoping();
		route.getNextCoping();

		expect(route.getNextCoping()).toBeUndefined();
	});

	it("should requeue coping handlers if getNextHandler() is called", () => {
		route.getNextHandler();
		route.getNextHandler();
		route.getNextCoping();
		route.getNextHandler();

		expect(route.getNextCoping()).toBe(4);
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

	it("should have root options even if root tests false", () => {
		root.test.and.returnValue(false);
		route = new Route();
		route.plot(root);

		expect(route.options.root).toBe(true);
	});
});
