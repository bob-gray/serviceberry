"use strict";

const Trunk = require("./Trunk");

module.exports = {
	createTrunk: function (options) {
		return new Trunk(options);
	},
	statusCodes: require("./statusCodes"),
	HttpError: require("./HttpError")
};