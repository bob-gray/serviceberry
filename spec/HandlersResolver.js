/* eslint max-nested-callbacks: ["error", 3] */

"use strict";

const HandlersResolver = require("../src/HandlersResolver");

describe("HandlersResolver", () => {
	var resolver,
		handlers,
		coping,
		waiting;

	beforeEach(() => {
		resolver = new HandlersResolver();
		handlers = createHandlers();
		coping = createHandlers();
		waiting = createHandlers();

		Object.assign(resolver, {
			handlers: handlers.map(handler => handler.promise),
			coping: coping.map(handler => handler.promise),
			waiting: waiting.map(handler => handler.promise)
		});
	});

	it("should not be resolved until its handlers are resolved", (done) => {
		const spy = jasmine.createSpy("resolved");

		resolver.resolved.then(spy);

		setTimeout(() => {
			// eslint-disable-next-line max-nested-callbacks
			handlers.forEach(handler => handler.resolve(Function.prototype));
			expect(spy).not.toHaveBeenCalled();
		}, 50);

		setTimeout(() => {
			expect(spy).not.toHaveBeenCalled();
			done();
		}, 100);
	});

	it("should resolve when its children are resolved", async () => {
		const spy = jasmine.createSpy("resolved");

		handlers.concat(coping)
			.concat(waiting)
			.forEach(handler => handler.resolve(Function.prototype));

		await resolver.resolved.then(spy);

		expect(spy).toHaveBeenCalled();
	});

	it("should set resolved handler functions", async () => {
		const spy = jasmine.createSpy("handler");

		handlers.concat(coping)
			.concat(waiting)
			.forEach(handler => handler.resolve(spy));

		await resolver.resolved;

		resolver.handlers.concat(resolver.coping)
			// eslint-disable-next-line max-nested-callbacks
			.forEach(handler => handler());

		expect(spy.calls.count()).toBe(handlers.length + coping.length);
	});

	it("should set resolved handler objects", async () => {
		var spy = jasmine.createSpyObj("handler", ["use"]),
			all;

		handlers.concat(coping)
			.concat(waiting)
			.forEach(handler => handler.resolve(spy));

		await resolver.resolved;

		all = resolver.handlers.concat(resolver.coping);

		// eslint-disable-next-line max-nested-callbacks
		all.forEach(handler => handler());

		expect(spy.use).toHaveBeenCalledTimes(all.length);
	});
});

function createHandlers () {
	const max = 10,
		count = Math.random() * max,
		handlers = [];

	for (let i = 0; i < count; i += 1) {
		handlers.push(createPromise());
	}

	return handlers;
}

function createPromise () {
	var resolve,
		reject,
		promise = new Promise((yea, nay) => {
			resolve = yea;
			reject = nay;
		});

	return {resolve, reject, promise};
}
