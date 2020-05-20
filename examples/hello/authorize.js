const {promises: {readFile}} = require("fs");

module.exports = async function (request) {
	const token = request.getQueryParam("auth_token");

	if (!token) {
		request.fail("Authorization token is required", "Unauthorized");
	}

	if (token !== await readFile("token.txt", "utf8")) {
		request.fail("Authorizaion token is not valid", "Forbidden");
	}
};