"use strict";

const {createTrunk} = require("serviceberry"),
    logger = require("serviceberry-logger"),
	lists = require("./lists"),
	users = require("./users"),
    trunk = createTrunk({
        path: "todos"
    });

trunk.use(logger())
    .cope(logger.error);

users(trunk.at("users"));
lists(trunk.at("{username}"));
