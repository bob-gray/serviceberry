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

Create a folder `echo`. Run `npm install jsonschema` in `echo/`. Create a new file `echo/validate.js` and save the JavaScript below as its contents.

```javascript
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
```

### Let's Break It Down

First our plugin requires `jsonschema` and assigns its validate function to a variable. Then it exports a
function that accepts a schema and returns a handler function. The handler function will validate the
body of each request using `jsonschema` and the schema passed into our plugin. The request proceeds
if it's body matches the schema and it fails if it does not match. Failed requests will send the reason for the fail in the response.

### Using Our Plugin

Let's create a simple service to allow us to use our plugin.

First create a new file `echo/person.json` and save the JSON below as its contents.

```
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

Next create a new file `echo\service.js` and save the JavaScript below as its contents.

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

Serializers and Deserializers
-----------------------------

Serializers and deserializers are plugins which means they are [handlers](handers.html) but they have a specific mission.
Serviceberry loads a JSON serializer by default. All other serializers will be loaded by your service.
Serializers transform the [response](response.html) body into [response](response.html) content. Deserializers transform the [request](request.html) content
into the [request](request.html) body. The returned or resolved value of each is set to the [response](response.html) content and [request](request.html) body
respectively. Because they are [handlers](handlers.html), they can be asynchronous and produces errors in the same ways as
other plugins. See [`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json) for an example.

One tricky detail about deserializers is that their control of the request is "replayed" out of sequence. This is unlikely to be an issue but still worth noting. It means that although the deserializer is executed
prior to any handlers in the queue, if it results is an error, the error will only surface if
and when `request.getBody()` is called from a handler. This allows deserializers to be asychronous and
deserializing error handling to be more intuitive.


Authoring Plugins
-----------------

If you create a plugin for Serviceberry that you think could be useful to someone else please consider
publishing it on [npm](https://npmjs.com) with a package name that's prefixed with `serviceberry-` (such as
[`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json)). In the future I'd like to show
a list of plugins on this site.

Searching [npm](https://www.npmjs.org) for Serviceberry plugins is a good way to see examples of plugins as a reference when
creating your own.
