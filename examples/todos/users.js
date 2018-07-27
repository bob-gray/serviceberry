"use strict";

const {HttpError} = require("serviceberry"),
	authentication = require("./authentication"),
	auth = authentication();

function users (collection) {
	collection.waitFor(auth.init());

	collection.on({
		method: "POST",
		consumes: "application/json",
		produces: "application/json"
	}, createUser);
}

async function createUser (request, response) {
	var username = request.getBodyParam("name"),
		user = await data.getItem(username);

	if (user) {
		throw new HttpError(`user "${username}" already exists`, 422);
	}

	await auth.createUser(request.getBody());

	response.send({
		status: "Created"
	});
}

module.exports = users;
