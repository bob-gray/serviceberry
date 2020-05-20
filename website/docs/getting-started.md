---
id: getting-started
title: Getting Started
---

This guide will walk you through creating a simple "Hello World" HTTP service using Serviceberry.

Install Node.js and Serviceberry
--------------------------------

Serviceberry is a framework for [Node.js](https://nodejs.org). If you don't have Node installed,
visit the Node [website](https://nodejs.org) to download and install the latest LTS version.

Once Node is installed, we'll use [npm](https://npmjs.com) (Node Package Manager) to install Serviceberry.
[npm](https://npmjs.com) will be installed with Node.

  - Create a folder named `hello`
  - In `hello/` run the following commands:
      - `npm init --yes` to initialize a `package.json` file
      - `npm install serviceberry` to install Serviceberry

Now that you've created your project and installed Serviceberry, you're ready to code your service.

Hello World!
------------

Create a new file `hello/service.js` and save the JavaScript below as its contents.

```javascript
require("serviceberry").createTrunk().on("*", () => "Hello World!");
```

Run `node service` in `hello/` to start your service then visit [http://localhost:3000](http://localhost:3000)
to see the response. If your service responds "Hello World!", you've successfully created your first
Serviceberry service!

### Let's Break It Down

```javascript
require("serviceberry")
```

The first expression loads [Serviceberry](serviceberry).

```javascript
.createTrunk()
```

The next expression calls the Serviceberry function `createTrunk` which creates the service [trunk](trunk).
The [trunk](trunk) is the entry point of the framework and all incoming requests. All [branches](branch) and [leaves](leaf)
originate from the [trunk](trunk). Calling `createTrunk` is always be the first step in creating a service
with Serviceberry.

`createTrunk` takes an optional [options](serviceberry#createtrunk-options) argument that configures
the behavior of the service. For this service the default options work fine.

```javascript
.on("*", () => "Hello World!");
```

The last expression creates a new [leaf](leaf) on the [trunk](trunk) and adds a [handler](handlers)
that responds with "Hello World!" to all request methods.

Hello World! *version 2*
------------------------

It's fun to build an HTTP service in one line, but we want to build services that are much more interesting
and powerful than Hello World above. It's time to create the next version of our service by adding some features that
will help show some of what Serviceberry can do.

### Feature 1: *Greet By Name*

Let's greet a user by name using a parameter in the URL path. The service should respond to `GET /hello/{name}`
with "Hello *name*!".

To do this, we'll add a new [branch](branch) with `.at()` and switch from `*` (all methods) to `GET`. Our path to the
new [branch](branch) will include the placeholder `{name}`. Serviceberry will parse this path parameter value out of the URL
when routing the request to our new [branch](branch). Path parameter placeholders are delimited with curly braces (`{` and `}`).
The value of the parameter will be available through the [request](request) object passed as the first argument to
our [handler](handlers).

*`hello/service.js` should now look like this:*

```javascript
require("serviceberry")
    .createTrunk()
    .at("hello/{name}")
    .on("GET", request => `Hello ${request.getPathParam("name")}!`);
```

Run `node service` in `hello/` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 2: *Respond with JSON*

Let's send our response serialized as a JSON object.

To do this we'll pass in [leaf](leaf) options as an object instead of just a string. This lets
us tell Serviceberry this leaf produces JSON. Next we'll change the [handler](handlers) to return an object
instead of a string.

Serviceberry has built-in support for JSON serializing and deserializing. By declaring the
leaf should produce JSON, Serviceberry knows to serialize the response using the JSON serializer.

```javascript
.on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getPathParam("name")}!`
}));
```

To help keep our code organized, we'll also refactor a bit by storing the Serviceberry object and the [trunk](trunk) in variables.

*`hello/service.js` should now look like this:*

```javascript
const serviceberry = require("serviceberry"),
    trunk = serviceberry.createTrunk();

trunk.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));
```

Run `node service` in `hello/` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 3: *Token Authorization*

Let's secure our service so only authorized users can access it. To do this, we'll create a simple
[plugin](plugins) and add it to the [trunk](trunk) with `.use()`. This [plugin](plugins) will validate a query
string auth_token parameter.

*There are better ways of authorizing service requests than this quick and dirty example, but it helps easily demonstrate
how to use [plugins](plugins).*

Create a new file `hello/token.txt` and save `d0189daeb2097` as its contents. We'll read this file to validate the token
in the query string. Since we don't want our service to wait while the file is read, we'll read the file asynchronously
using async/await and call [`request.fail(message, status)`](request#failerror-status-headers-) if the token
is missing or doesn't match the token we saved.

We'll read the file using Node's [File Systems](https://nodejs.org/dist/latest/docs/api/fs.html)
module `fs`.

Create a new file `hello/authorize.js` and save the JavaScript below as its contents.

```javascript
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
```

*`hello/service.js` should now look like this:*

```javascript
const {createTrunk} = require("serviceberry"),
    trunk = createTrunk(),
    authorize = require("./authorize");

trunk.use(authorize).at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
    greeting: `Hello ${request.getPathParam("name")}!`
}));
```

Run `node service` in `hello/` to start your service and visit [http://localhost:3000/hello/bob?auth_token=d0189daeb2097](http://localhost:3000/hello/bob?auth_token=d0189daeb2097)
to see the response. Try it without the token or with a bad token to see a failing response.

Code for this Hello World service can be found at [https://github.com/bob-gray/serviceberry/tree/master/examples/hello](https://github.com/bob-gray/serviceberry/tree/master/examples/hello).

Now that you know how to build a basic HTTP service using Serviceberry, check out the [next guide](handlers)
to learn all about [handlers](handlers).
