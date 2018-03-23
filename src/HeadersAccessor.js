"use strict";

require("solv/src/object/clone");
require("solv/src/object/for-each");

const Base = require("solv/src/abstract/base");

module.exports = {
	...Base.prototype,

	initHeaders (headers = {}) {
		this.clearHeaders();
		this.setHeaders(headers);
	},

	getHeaders () {
		return Object.clone(this.headers);
	},

	getHeader (name) {
		return this.headers[this.invoke(findName, name)].slice();
	},

	hasHeader (name) {
		return this.invoke(findName, name) !== undefined;
	},

	withoutHeader (name) {
		return !this.hasHeader(name);
	},

	setHeaders (headers) {
		Object.forEach(headers, (value, name) => this.setHeader(name, value));
	},

	setHeader (name, value) {
		if (value === null) {
			delete this.headers[this.invoke(findName, name)];
		} else {
			this.headers[name] = clean(value);
		}
	},

	removeHeader (name) {
		this.setHeader(name, null);
	},

	clearHeaders () {
		this.headers = {};
	}
};

function findName (name) {
	name = name.toLowerCase();

	return Object.keys(this.headers).find(key => key.toLowerCase() === name);
}

function clean (value) {
	if (Array.isArray(value)) {
		value = value.slice();
	} else {
		value = String(value);
	}

	return value;
}
