"use strict";

const {freeze, base} = require("./class");

module.exports = freeze(base(class Yieldable {
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
}));
