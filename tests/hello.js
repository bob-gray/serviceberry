//require("../src/main").createTrunk().on("*", () => "Hello World!");

/*const serviceberry = require("../src/main");
const service = serviceberry.createTrunk();
//service.at("hello/{name}").on("GET", request => `Hello ${request.getParam("name")}!`);


service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));*/

const serviceberry = require("../src/main");
const fs = require("fs");
const service = serviceberry.createTrunk().use(authenticate);

service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));

function authenticate (request) {
	const token = request.getParam("token");

    if (!token) {
        request.fail("Token required!", 401);
    }

    fs.readFile("token.txt", "utf8", (error, secret) => {
        if (error) {
            request.fail(error);
        } else if (token !== secret.trim()) {
            request.fail("Token is not valid!", 403);
        } else {
        	request.proceed();
        }
    });
}