"use strict";

const {createTrunk} = require("serviceberry"),
    logger = require("serviceberry-logger"),
	Authentication = require("./Authentication"),
    auth = new Authentication("Todos"),
	lists = require("./lists"),
	users = require("./users"),
    trunk = createTrunk({
        path: "todos",
        autoStart: false
    });

/*auth.init().then(() => {
    auth.createUser({
        name: "bob",
        password: "secret"
    });
});*/

/*auth.init().then(() => {
    auth.createUser({
        name: "joe",
        password: "foo"
    });
});*/

Promise.all([
    logger(),
    auth.init(),
    users(trunk.at("users")),
    lists(trunk.at("{username}").use(auth))
]).then(start);

function start ([logging]) {
    trunk.use(logging)
        .catch(logger.error);

    trunk.start();
}
