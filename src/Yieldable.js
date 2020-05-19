"use strict";

class Yieldable {
	#yielding;
	#yielded;

	constructor () {
		this.#yielding = new Promise(resolve => this.yield = value => {
			this.#yielded = true;
			resolve(value);
		});

		Object.freeze(this);
	}

	get yielding () {
		return this.#yielding;
	}

	get yielded () {
		return this.#yielded;
	}
}

Object.setPrototypeOf(Yieldable.prototype, null);
Object.freeze(Yieldable.prototype);

module.exports = Object.freeze(Yieldable);
