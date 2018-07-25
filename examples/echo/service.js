const {createTrunk} = require("serviceberry"),
    validate = require("./validate"),
    schema = require("./person"),
    trunk = createTrunk();

trunk.at("echo").use(validate(schema)).on({
    method: "POST",
    consumes: "application/json",
    produces: "application/json"
}, request => request.getBody());
