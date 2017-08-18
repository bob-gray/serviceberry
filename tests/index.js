"use strict";

var Trunk = require("../src/Trunk"),
	meta = require("solv/src/meta"),
	service = new Trunk({
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

function serverError (error, request, response) {
	response.writeHead(500);
	response.end(error.message);
}

function getWidgets (request, response) {
	response.end("Hello Widgets!");
}

function getWidget (request, response) {
	console.dir(request.getParams());
	console.log(request.getHeader("content-type"));
	response.end("Hello Widget (id: " + request.getPathParam("id") + ")");
}

function createWidget (request, response) {
	var widget = {
			name: "baz"
		},
		data = JSON.stringify(widget);

	response.writeHead(201, {
		"Content-Type": "application/json;utf-8",
		"Content-Length": data.length
	});

	response.end(data);
}