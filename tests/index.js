"use strict";

var serviceberry = require("../src/"),
	meta = require("solv/src/meta"),
	service = serviceberry.createTrunk({
		port: 3000
	}),
	widgets = service.at("/widgets"),
	widget = widgets.at("/{id}"),
	auth = {
		use: function (request, response) {
			var authorization = request.getHeader("authorization");

			if (authorization) {
				request.proceed();

			} else {
				//response.unauthorized();
				//console.log("unauthorized");
				request.proceed();
			}
		}	
	};

service.use(auth).catch(serverError);

widgets.on(
	meta({
		method: "GET",
		produces: "application/json"
	}),
	getWidgets
);

widgets.on(
	meta({
		method: "POST",
		consumes: "application/json",
		produces: "application/json"
	}),
	createWidget
);

widget.on(
	meta({
		method: "GET",
		produces: "application/json"
	}),
	getWidget
);

service.start();

function serverError (request, response) {
	console.log(request.error.getMessage());
	throw request.error;
}

function getWidgets (request, response) {
	response.send({
		body: "Hello Widgets!"
	});
}

function getWidget (request, response) {
	var content = "Hello Widget (id: " + request.getPathParam("id") + ")";

	response.send({
		headers: {
			"Content-Type": "text/plain;utf-8",
			"Content-Length": content.length
		},
		body: content
	})
}

function createWidget (request, response) {
	var widget = {
			name: "baz"
		}; //,
		//content = JSON.stringify(widget);

	response.send({
		status: 201,
		headers: {
			"Content-Type": "application/json;utf-8",
			"Content-Length": content.length
		},
		body: content
	});
}