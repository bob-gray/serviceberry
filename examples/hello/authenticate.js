const fs = require("fs");

function authenticate (request) {
    const token = request.getQueryParam("token");

    if (!token) {
        request.fail("Token required!", "Unauthorized");
    }

    fs.readFile("token.txt", "utf8", testToken);
}

function testToken (error, secret) {
    if (error) {
        request.fail(error);
    } else if (token !== secret.trim()) {
        request.fail("Token is not valid!", "Forbidden");
    } else {
        request.proceed();
    }
}

module.exports = authenticate;
