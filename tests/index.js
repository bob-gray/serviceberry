"use strict";

require("solv/src/function/curry");

var serviceberry = require("../src/"),
	meta = require("solv/src/meta"),
	service = serviceberry.createTrunk({
		port: 3000
	}),
	widgets = service.at("/widgets"),
	widget = widgets.at("/{id}"),
	auth = {
		use: function (request, response) {
			var authorization = request.getHeader("Authorization");

			if (authorization) {
				request.proceed();

			} else {
				throw new serviceberry.HttpError("Please log in", 401, {
					Authorization: "Bearer"
				});
				//request.proceed();
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

service.start(console.log.curry("Service started!"));

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
	};

	response.send({
		status: 201,
		body: widget
	});
}