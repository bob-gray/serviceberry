const serviceberry = require("serviceberry");
const validate = require("./validate");
const service = serviceberry.createTrunk();
const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1
        },
        age: {
            type: "integer",
            minimum: 0
        }
    }
};

service.at("echo").on({
    method: "POST",
    consumes: "application/json",
    produces: "application/json"
})
.use(validate(schema))
.use(request => request.getBody());
