"use strict";

const statusCodes = require("./statusCodes");

module.exports = {
	initStatus (status = statusCodes.OK) {
		this.status = {};
		this.setStatus(status);
	},

	is (test) {
		var result;

		if (isNaN(test)) {
			test = String(test);

			result = test.toUpperCase() === this.status.text.toUpperCase() ||
				statusCodes[test.toUpperCase()] === this.status.code;
		} else {
			result = Number(test) === this.status.code;
		}

		return result;
	},

	getStatus () {
		return {...this.status};
	},

	getStatusCode () {
		return this.status.code;
	},

	getStatusText () {
		return this.status.text;
	},

	setStatus (status) {
		var code,
			text;

		if (typeof status === "object") {
			({code, text} = status);
		} else if (typeof status === "number") {
			code = status;
		} else {
			text = status;
		}

		if (!code) {
			code = statusCodes[text.toUpperCase()];
		}

		if (!text) {
			text = statusCodes[code];
		}

		this.setStatusCode(code);
		this.setStatusText(text);
	},

	setStatusCode (code) {
		if (isNaN(code)) {
			throw new Error(`${this.constructor.name} status code cannot be ` +
				`set to "${code}". Status code must be a number.`);
		}

		this.status.code = Number(code);
	},

	setStatusText (text) {
		this.status.text = String(text);
	}
};
