const {createTrunk} = require("serviceberry"),
	trunk = createTrunk(),
	authorize = require("./authorize");

trunk.use(authorize).at("hello/{name}").on({
	method: "GET",
	produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getPathParam("name")}!`
}));
