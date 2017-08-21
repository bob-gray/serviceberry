"use strict";

require("solv/src/object/copy");

var StatusAccessor,
	createClass = require("solv/src/class"),
	meta = require("solv/src/meta"),
	http = require("http");

StatusAccessor = createClass(
	meta({
		"name": "StatusAccessor",
		"type": "class",
		"arguments": []
	})
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

function getStatus () {
	return Object.copy(this.status);
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