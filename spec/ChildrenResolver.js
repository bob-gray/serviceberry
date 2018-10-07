"use strict";

const ChildrenResolver = require("../src/ChildrenResolver");

describe("ChildrenResolver", () => {
	var resolver,
		leaves,
		branches;

	beforeEach(() => {
		resolver = new ChildrenResolver();
		leaves = createChildren();
		branches = createChildren();

		Object.assign(resolver, {
			handlers: [],
			catches: [],
			waiting: [],
			leaves: leaves.map(leaf => leaf.child),
			branches: branches.map(branch => branch.child)
		});
	});

	it("should not be resolved until its children are resolved", (done) => {
		const spy = jasmine.createSpy("resolved");

		resolver.resolved.then(spy);

		setTimeout(() => {
			leaves.forEach(leaf => leaf.resolve());
			expect(spy).not.toHaveBeenCalled();
		}, 50);

		setTimeout(() => {
			expect(spy).not.toHaveBeenCalled();
			done();
		}, 100);
	});

	it("should resolve when its children are resolved", (done) => {
		const spy = jasmine.createSpy("resolved");

		resolver.resolved.then(spy);

		leaves.forEach(leaf => leaf.resolve());
		branches.forEach(branch => branch.resolve());

		setImmediate(() => {
			expect(spy).toHaveBeenCalled();
			done();
		});
	});
});

function createChildren () {
	const max = 10,
		count = Math.random() * max,
		children = [];

	for (let i = 0; i < count; i += 1) {
		children.push(createChild());
	}

	return children;
}

function createChild () {
	const {resolve, reject, promise} = createPromise(),
		child = {
			resolved: promise
		};

	return {resolve, reject, child};
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
