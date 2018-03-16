const serviceberry = require("../src/main");
const validate = require("./serviceberryJsonSchema");
const service = serviceberry.createTrunk();

service.at("echo").on({
    method: "POST",
    consumes: "application/json",
    produces: "application/json"
})
.use(validate({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1
        },
        age: {
            type: "integer",
            minimum: 0
        },
        email: {
            type: "string"
        }
    }
}))
.use(request => request.getBody());