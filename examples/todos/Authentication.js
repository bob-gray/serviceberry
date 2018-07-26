"use strict";

const BasicAuth = require("serviceberry-basic-auth"),
    bcrypt = require("bcryptjs"),
    {HttpError} = require("serviceberry"),
    storage = require("node-persist"),
    data = storage.create({
        dir: "data/users",
        expiredInterval: 24 * 60 * 60 * 1000
    });

class Authentication extends BasicAuth {
    async init () {
        await data.init();
    }

    async getHash (username) {
        const {hash} = await data.getItem(username);

        return hash;
    }

    validate (request) {
        if (request.credentials.name !== request.getPathParam("username")) {
            throw new HttpError(
                `Access denied. You do not have permission to access ${request.getFullUrl()}.`,
                "Forbidden"
            );
        }

        return super.validate(request);
    }

    async createUser ({name, password}) {
        const hash = await bcrypt.hash(password, 10);

        await data.setItem(name, {hash});
    }
}

module.exports = Authentication;
