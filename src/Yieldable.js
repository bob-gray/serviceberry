"use strict";

const {freeze, base} = require("./class");

module.exports = freeze(base(class Yieldable {
	#yielding;
	#yielded;

	constructor () {
		// eslint-disable-next-line no-return-assign
		this.#yielding = new Promise(resolve => this.yield = value => {
			this.#yielded = true;
			setImmediate(resolve.bind(null, value));
		});

		Object.freeze(this);
	}

	get yielding () {
		return this.#yielding;
	}

	get yielded () {
		return this.#yielded;
	}
}));
