---
id: plugins
title: Plugins
---

This guide will walk you through creating using plugins a simple Serviceberry plugin.

Plugins Are Handlers
--------------------

Plugins are handlers that are designed for reuse. *If you haven't read the [Handlers](handlers.html)
guide you may want to back up and start there.* The great thing about plugins being handlers is
creating a plugin is no more difficult than creating a handler for your endpoint. To show you what
I mean, let's create a plugin.

JSON Schema Plugin
------------------

We'll create a plugin for validating the post request body with a [JSON Schema](http://json-schema.org/).
All the heavy lifting will be done by [jsonschema](https://www.npmjs.com/package/jsonschema) - an npm package
that we'll install. Our plugin will just be a thin wrapper that responds with an appropriate error
when validation fails.

Create a folder. From within the folder run `npm install jsonschema`. Create a file named
`serviceberryJsonSchema.js`, save it in the folder and copy the JavaScript below into it.

```javascript
const validate = require("jsonschema").validate;
const serviceberry = require("serviceberry");

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
```

First our plugin requires `jsonschema` and assigns it's validate function to a variable. Then it exports a
function that accepts a schema and returns a handler function. The handler function will validate the request
body of each request that runs through it. The request proceeds if it's body is valid or fails if it's
body does not match the schema.

Let's create a simple service to use our plugin. Create a file named `echo.js`, save it in the
same folder as `serviceberryJsonSchema.js` and copy the JavaScript below into it.

```javascript
const serviceberry = require("serviceberry");
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
```

Now run `node echo` to start your service and send a POST request to http://localhost:3000/echo with a JSON body.