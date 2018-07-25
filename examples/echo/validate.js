const {validate} = require("jsonschema");

module.exports = schema => request => {
    const result = validate(request.getBody(), schema);

    if (result.valid) {
        request.proceed();
    } else {
        request.fail(result.errors, 422, {
            "Content-Type": "application/json"
        });
    }
};
