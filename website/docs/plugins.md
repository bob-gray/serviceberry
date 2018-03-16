---
id: plugins
title: Plugins
---

This guide will walk you through creating and using a simple Serviceberry plugin.

Plugins Are Handlers
--------------------

Plugins are handlers that are designed for reuse. *If you haven't read the [Handlers](handlers.html)
guide you may want to back up and start there.* The great thing about plugins being handlers is
that creating a plugin is just as easy as creating a handler for your endpoint. To show you what
I mean, let's create a plugin.

JSON Schema Plugin
------------------

We'll create a plugin for validating a `POST` request body with a [JSON Schema](http://json-schema.org/).
All the heavy lifting will be done by [jsonschema](https://www.npmjs.com/package/jsonschema) which
we'll install using [npm](https://www.npmjs.com). Our plugin will be a thin wrapper that responds
with an appropriate error when validation fails.

Create a folder. In the folder run `npm install jsonschema`. Create a file named `validate.js` and save
it in the folder. Copy the JavaScript below into it.

```javascript
const { validate } = require("jsonschema");

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
```

Let's breakdown how this plugin works.

First our plugin requires `jsonschema` and assigns its validate function to a variable. Then it exports a
function that accepts a schema and returns a handler function. The handler function will validate the
body of each request using `jsonschema` and the schema passed in to our plugin. The request proceeds
if it's body matches the schema and fails with information about why if it does not match.

Let's create a simple service to allow us to use our plugin. Create a file named `echo.js` and save it in the
same folder as `validate.js`. Copy the JavaScript below into it.

```javascript
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
```

Run `node echo` to start your service. Send a `POST` request to http://localhost:3000/echo with a JSON body
to see the response. If your request JSON matches the schema, you should see it echoed back to you.
If it doesn't match the schema, the request should fail with a 422 status and information about why it
didn't match.

*TIP: A couple good options for sending HTTP requests are [Postman](https://www.getpostman.com)
and [curl](https://www.getpostman.com)*

Serializers and Deserializers
-----------------------------

Serializers and deserializers are plugins which means they are handlers but they have a specific mission.
Serializers transform the response body into response content. Deserializers transform the request content
into the request body. The returned or resolved value of each is set to the response content and request body
respectively. Because they are handlers, they can be asychronous and produces errors in the same ways as
other plugins. See [`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json) for an example.

One tricky detail about deserializers that is unlikely to be an issue but still worth noting is that their
control of the request is "replayed" out of sequence. This means that although the deserializer is executed
prior to any handlers in the queue, if it results in the request failing, the error will only surface if
and when `request.getBody()` is called from a handler. This allows deserializers to be asychronous and
deserializing error handling to be more intuitive. 


Authoring Plugins
-----------------

If you create a plugin for Serviceberry that you think could be useful to someone else please consider
publishing it on [npm](https://npmjs.com) with a package name that's prefixed with `serviceberry-` (such as
[`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json)). In the future I'd like to show
a list of plugins on this site.

Searching npm for Serviceberry plugins is a good way to see examples of plugins as a reference when
creating your own.