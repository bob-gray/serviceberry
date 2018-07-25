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
Node Package Manager will be installed with Node.

  - Create a folder named hello
  - In the `hello/` run the following two commands:
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

The first expression loads [Serviceberry](serviceberry.html).

```javascript
.createTrunk()
```

The next expression calls the Serviceberry function `createTrunk` which creates the service [trunk](trunk.html).
The [trunk](trunk.html) is the entry point of the framework and all incoming requests. All [branches](branch.html) and [leaves](leaf.html)
originate from the [trunk](trunk.html). Calling `createTrunk` is always be the first step in creating a service
with Serviceberry.

`createTrunk` takes an optional [options](serviceberry.html#createtrunk-options) argument that configures
the behavior of the service. For this service the default options will work fine.

```javascript
.on("*", () => "Hello World!");
```

The last expression creates a new [leaf](leaf.html) on the [trunk](trunk.html) and adds a [handler](handlers.html)
that responds with "Hello World!" to all request methods.

Hello World! *version 2*
------------------------

It's fun to build an HTTP service in one line, but we want to build services that are much more interesting
and powerful than Hello World above. It's time to add some features and create the next version of our service.

### Feature 1: *Greet By Name*

Let's greet a user by name using a parameter in the URL path. The service should respond to `GET /hello/{name}`
with "Hello *name*!".

To do this, we'll add a new [branch](branch.html) with `.at()` and switch from `*` (all methods) to `GET`. Our path to the
new [branch](branch.html) will include the placeholder `{name}`. Serviceberry will parse this path parameter value out of the URL
when routing the request to our new [branch](branch.html). Path parameter placeholders are delimited with curly braces. The value of the parameter will be available through the [request](request.html)
object passed as the first argument to our [handler](handers.html).

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

To do this we'll pass in [leaf](leaf.html) options as an object instead of just a string. This lets
us tell Serviceberry this leaf produces JSON. Next we'll change the [handler](handlers.html) to return an object
instead of a string.

Serviceberry has built-in support for JSON serializing and deserializing. By declaring the
leaf produces JSON, Serviceberry knows to serialize the response using the JSON serializer.

```javascript
.on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getPathParam("name")}!`
}));
```

To help keep our code organized, we'll also refactor a bit by storing the Serviceberry object and the [trunk](trunk.html) in variables.

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

### Feature 3: *Token Authentication*

Let's secure our service so only authorized users can access it. To do this, we'll create a
plugin and add it to the [trunk](trunk.html) with `.use()`. This plugin will validate a query string token parameter.

Create a new file `hello/token.txt` and save `d0189daeb2097` as its contents.
We'll read this string from `token.txt` to validate the token in the query string. Since we don't want
our service to wait while the file is read, we'll read the file asynchronously and call [`request.proceed()`](request.html#proceed-result)
when the request is authenticated and [`request.fail()`](request.html#failerror-status-headers) when the token is missing or invalid.

We'll read the file using Node's [File Systems](https://nodejs.org/dist/latest-v9.x/docs/api/fs.html)
module `fs`.

*There are better ways of authenticating our service but this quick and dirty example helps
quickly and easily demonstrate how to use plugins.*

Create a new file `hello/authenticate.js` and save the JavaScript below as its contents.

```javascript
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
```

*`hello/service.js` should now look like this:*

```javascript
const {createTrunk} = require("serviceberry"),
    trunk = createTrunk(),
    authenticate = require("./authenticate");

trunk.use(authenticate).at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
    greeting: `Hello ${request.getPathParam("name")}!`
}));
```

Run `node service` in `hello/` to start your service and visit [http://localhost:3000/hello/bob?token=d0189daeb2097](http://localhost:3000/hello/bob?token=d0189daeb2097)
to see the response. Try it without the token or with a bad token to see a failing response.

Code for this Hello World service can be found at [https://github.com/bob-gray/serviceberry/tree/master/examples/hello](https://github.com/bob-gray/serviceberry/tree/master/examples/hello).

Now that you know how to build a basic HTTP service using Serviceberry, check out the next guide
to learn all about [handlers](handlers.html).
