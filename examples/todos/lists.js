"use strict";

const {HttpError} = require("serviceberry"),
    auth = require("./authentication"),
    storage = require("node-persist"),
	data = storage.create({
        dir: "data/lists",
		expiredInterval: 24 * 60 * 60 * 1000
    }),
	whitespace = /\s+/g,
	nonwords = /[^\w-]+/g;

function lists (collection) {
	const resource = collection.at("{id}");

    collection.use(auth())
        .waitFor(data.init());

	collection.on({
		method: "GET",
		produces: "application/json"
	}, getLists);

	collection.on({
		method: "POST",
		consumes: "application/json",
		produces: "application/json"
	}, createList);

	resource.on({
		method: "GET",
		produces: "application/json"
	}, getList);

	resource.on({
		method: "PUT",
		consumes: "application/json",
		produces: "application/json"
	}, updateList);

	resource.on("DELETE", removeList);
}

async function getLists (request) {
	const username = request.getPathParam("username"),
		lists = await data.getItem(username);

	return lists || [];
}

async function createList (request, response) {
	const username = request.getPathParam("username"),
		lists = await getLists(request),
		list = request.getBody(),
		name = list.name,
		id = nameToId(name),
		url = request.getFullUrl() + "/" + id,
		key = username + ":" + id;

	if (lists.find((list) => list.id === id)) {
		throw new HttpError(
			`List already exists at ${url}.`,
			"Unprocessable Entity"
		);
	}

	Object.assign(list, {id, url});

	lists.push({id, name, url});

	await data.setItem(username, lists);
	await data.setItem(key, list);

	response.setStatus("Created");

	return list;
}

async function getList (request) {
	const username = request.getPathParam("username"),
		id = request.getPathParam("id"),
		key = username + ":" + id,
		list = await data.getItem(key);

	if (!list) {
		throw new HttpError(
			`List "${id}" not found for "${username}".`,
			"Not Found"
		);
	}

	return list;
}

async function updateList (request) {
	const username = request.getPathParam("username"),
		id = request.getPathParam("id"),
		updated = request.getBody(),
		key = username + ":" + id,
		list = await data.getItem(key);

	if (!list) {
		throw new HttpError(
			`List "${id}" not found.`,
			"Not Found"
		);
	}

	if (list.id !== updated.id || list.name !== updated.name || list.url !== updated.url) {
		throw new HttpError(
			"List id, name, and url cannot be changed. Please create a new list.",
			"Unprocessable Entity"
		);
	}

	list.items = updated.items;

	await data.setItem(key, list);

	return list;
}

async function removeList (request, response) {
	const username = request.getPathParam("username"),
		id = request.getPathParam("id"),
		key = username + ":" + id,
		lists = await getLists(request),
		listIndex = lists.findIndex((list) => list.id === id);

	if (listIndex < 0) {
		throw new HttpError(
			`List "${id}" not found for "${username}".`,
			"Not Found"
		);
	}

	await data.removeItem(key);

	lists.splice(listIndex, 1);

	await data.setItem(username, lists);

	response.setStatus("No Content");

	return null;
}

function nameToId (name) {
	return name.toLowerCase()
		.replace(whitespace, "-")
		.replace(nonwords, "");
}

module.exports = lists;
