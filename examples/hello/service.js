const {createTrunk} = require("serviceberry"),
    trunk = createTrunk(),
    authenticate = require("./authenticate");

trunk.use(authenticate).at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
    greeting: `Hello ${request.getPathParam("name")}!`
}));
