/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const YieldableProxy = require("../src/YieldableProxy"),
	{createSpyObj} = jasmine;

describe("YieldableProxy", () => {
	var yielder,
		yieldable,
		proxy;

	beforeEach(() => {
		yielder = createSpyObj("yielder", ["yielding", "anotherYielding", "hidden", "other"]);

		yielder.yielding.and.returnValue("yielding return");
		yielder.foo = "baz";

		({yieldable, proxy} = new YieldableProxy(
			yielder,
			["yielding", "anotherYielding", "nope"],
			["hidden", "missing"]
		));
	});

	it("should allow access to yielder properties", () => {
		expect(proxy.foo).toBe(yielder.foo);
	});

	it("should allow calling other methods more than once", () => {
		expect(() => {
			proxy.other();
			proxy.other();
			proxy.other();
		}).not.toThrow();
	});

	it("should hide hidden methods", () => {
		expect(yielder.hidden).toBeDefined();
		expect(proxy.hidden).toBeUndefined();
	});

	it("should hide missing hidden methods", () => {
		expect(proxy.missing).toBeUndefined();
	});

	it("should throw when yielding method is called a second time", () => {
		proxy.yielding();
		expect(proxy.yielding).toThrow();
	});

	it("should throw when calling another yielding method after call yielding", () => {
		proxy.yielding();
		expect(proxy.anotherYielding).toThrow();
	});

	it("should not throw when calling other methods after yielding", () => {
		proxy.yielding();
		expect(proxy.other).not.toThrow();
	});

	it("should not throw when calling other methods before yielding", () => {
		proxy.other();
		expect(proxy.yielding).not.toThrow();
	});

	it("should hide yielding method", () => {
		({proxy} = new YieldableProxy(
			yielder,
			["yielding"],
			["yielding"]
		));

		expect(proxy.yielding).toBeUndefined();
	});

	it("should throw after calling yieldable yield method", () => {
		yieldable.yield();
		expect(proxy.yielding).toThrow();
	});

	it("should resolve yieldable yielding with value passed to proxy yielding", async () => {
		proxy.yielding();

		expect(await yieldable.yielding).toBe("yielding return");
	});

	it("should not allow a property to be overridden", () => {
		expect(() => {
			proxy.foo = 5;
		}).toThrow();
	});

	it("should allow new properties to be set", () => {
		expect(() => {
			proxy.baz = 5;
		}).not.toThrow();
	});

	it("should always have yielder for the context of yielding methods", () => {
		const yielding = proxy.yielding;

		yielding();

		expect(yielder.yielding.calls.mostRecent().object).toBe(yielder);
	});
});
