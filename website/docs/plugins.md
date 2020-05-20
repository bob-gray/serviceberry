---
id: plugins
title: Plugins
---

This guide will walk you through creating and using a simple Serviceberry *plugin*.

Plugins are Handlers
--------------------

*Plugins* are [handlers](handlers) that are designed for reuse. *If you haven't read the [Handlers](handlers)
guide you may want to back up and start there.* The great thing about *plugins* being [handlers](handlers) is
that creating a *plugin* is just as easy as creating a [handler](handlers) for your endpoint. To show you what
I mean, let's create a *plugin*.

JSON Schema Plugin
------------------

We'll create a *plugin* for validating a `POST` request body with a [JSON Schema](http://json-schema.org/).
All the heavy lifting will be done by [jsonschema](https://www.npmjs.com/package/jsonschema) which
we'll install using [npm](https://www.npmjs.com). Our *plugin* will be a thin wrapper that responds
with an appropriate error when validation fails.

  - Create a folder named `echo`
  - In `echo/` run the following commands:
      - `npm init --yes` to initialize a `package.json` file
      - `npm install jsonschema` to install [jsonschema](https://www.npmjs.com/package/jsonschema)
  - Create a new file `echo/validate.js` and save the JavaScript below as its contents.

```javascript
const {validate} = require("jsonschema");

module.exports = schema => request => {
    const result = validate(request.getBody(), schema);

    if (!result.valid) {
        request.fail(result.errors, 422, {
            "Content-Type": "application/json"
        });
    }

    request.proceed();
};
```

### Let's Break It Down

First our *plugin* requires `jsonschema` and assigns its validate function to a variable. Then it exports a
function that accepts a schema and returns a [handler](handlers#handler-functions) function. The
[handler](handlers#handler-functions) function will validate the body of each request using `jsonschema` and the
schema passed into our *plugin*. The request fails if it's body does not match the schema and proceeds if it does.
Failed requests will send the reason for the fail in the response.

### Using Our Plugin

Let's create a simple service to allow us to use our *plugin*.

First create a new file `echo/person.json` and save the JSON below as its contents.

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1
        },
        "age": {
            "type": "integer",
            "minimum": 0
        }
    }
}
```

Next run `npm install serviceberry` in `echo/`.

Next create a new file `echo/service.js` and save the JavaScript below as its contents.

```javascript
const {createTrunk} = require("serviceberry"),
    validate = require("./validate"),
    schema = require("./person"),
    trunk = createTrunk();

trunk.at("echo").use(validate(schema)).on({
    method: "POST",
    consumes: "application/json",
    produces: "application/json"
}, request => request.getBody());
```

Run `node service` in `echo/` to start your service. Send a `POST` request to http://localhost:3000/echo with a JSON body
to see the response. If your request JSON matches the schema, you should see it echoed back to you.
If it doesn't match the schema, the request should fail with a 422 status and information about why it
didn't match.

*TIP: A couple good options for sending HTTP requests are [Postman](https://www.getpostman.com)
and [curl](https://curl.haxx.se)*

Code for this echo service can be found at [https://github.com/bob-gray/serviceberry/tree/master/examples/echo](https://github.com/bob-gray/serviceberry/tree/master/examples/echo).

Authoring Plugins
-----------------

If you create a *plugin* for Serviceberry that you think could be useful to someone else, please consider
publishing it on [npm](https://npmjs.com) with a package name that's prefixed with `serviceberry-` (such as
[`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json)). In the future I'd like to show
a list of *plugins* on this site.

Searching [npm](https://www.npmjs.org) for Serviceberry *plugins* is a good way to see examples of *plugins* as a reference
when creating your own.

To learn about serializer *plugins* and deserializer *plugins*, checkout the [next guide](serializers-and-deserializers).
