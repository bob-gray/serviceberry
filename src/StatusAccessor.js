"use strict";

require("solv/src/object/copy");

const createClass = require("solv/src/class");
const meta = require("solv/src/meta");
const http = require("http");
const statusCodes = require("./statusCodes");

const StatusAccessor = createClass(
	meta({
		"name": "StatusAccessor",
		"type": "class",
		"arguments": []
	})
);

StatusAccessor.method(
	meta({
		"name": "init",
		"static": true,
		"arguments": [{
			"name": "status",
			"type": "number|object",
			"required": false
		}]
	}),
	init
);

StatusAccessor.method(
	meta({
		"name": "is",
		"arguments": [{
			"name": "text",
			"type": "string"
		}]
	}),
	isText
);

StatusAccessor.method(
	meta({
		"name": "is",
		"arguments": [{
			"name": "code",
			"type": "number"
		}]
	}),
	isCode
);

StatusAccessor.method(
	meta({
		"name": "getStatus",
		"arguments": [],
		"returns": "object"
	}),
	getStatus
);

StatusAccessor.method(
	meta({
		"name": "getStatusCode",
		"arguments": [],
		"returns": "number"
	}),
	getStatusCode
);

StatusAccessor.method(
	meta({
		"name": "getStatusText",
		"arguments": [],
		"returns": "string"
	}),
	getStatusText
);

StatusAccessor.method(
	meta({
		"name": "setStatus",
		"arguments": [{
			"name": "status",
			"type": "object"
		}]
	}),
	setStatus
);

StatusAccessor.method(
	meta({
		"name": "setStatus",
		"arguments": [{
			"name": "code",
			"type": "number"
		}]
	}),
	setStatusByCode
);

StatusAccessor.method(
	meta({
		"name": "setStatusCode",
		"arguments": [{
			"name": "code",
			"type": "number"
		}]
	}),
	setStatusCode
);

StatusAccessor.method(
	meta({
		"name": "setStatusText",
		"arguments": [{
			"name": "text",
			"type": "string"
		}]
	}),
	setStatusText
);

function init (status) {
	this.status = {};
	this.setStatus(status || statusCodes.OK);
}

function isText (text) {
	return text.toLowerCase() === this.status.text.toLowerCase() ||
		statusCodes[text.toUpperCase()] === this.status.code;
}

function isCode (code) {
	return code === this.status.code;
}

function getStatus () {
	return Object.copy(this.status);
}

function getStatusCode () {
	return this.status.code;
}

function getStatusText () {
	return this.status.text;
}

function setStatus (status) {
	this.status.code = status.code;
	this.status.text = status.text;
}

function setStatusByCode (code) {
	this.setStatus({
		code: code,
		text: http.STATUS_CODES[code]
	});
}

function setStatusCode (code) {
	this.status.code = code;
}

function setStatusText (text) {
	this.status.text = text;
}

module.exports = StatusAccessor;