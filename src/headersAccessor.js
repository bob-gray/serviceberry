"use strict";

require("solv/src/object/clone");
require("solv/src/object/for-each");

const Base = require("solv/src/abstract/base"),

	getters =  {
		...Base.prototype,

		getHeaders () {
			return Object.clone(this.headers);
		},

		getHeader (name) {
			var value = this.headers[this.invoke(findName, name)];

			if (Array.isArray(value)) {
				value = [...value];
			}

			return value;
		},

		hasHeader (name) {
			return this.invoke(findName, name) !== undefined;
		},

		withoutHeader (name) {
			return !this.hasHeader(name);
		}
	},

	setters = {
		...Base.prototype,

		initHeaders (headers = {}) {
			this.clearHeaders();
			this.setHeaders(headers);
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

module.exports = {getters, setters};
