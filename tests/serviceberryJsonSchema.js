const validate = require("jsonschema").validate;
const serviceberry = require("../src/main");

module.exports = schema => request => {
    const result = validate(request.getBody(), schema);

    if (result.valid) {
        request.proceed();
    } else {
        throw new serviceberry.HttpError(result.errors, 422, {
            "Content-Type": "application/json"
        });
    }
};