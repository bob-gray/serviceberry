---
id: getting-started
title: Getting Started
---

This guide will walk you through creating a simple "Hello World" HTTP service with Serviceberry.

Install Node.js and Serviceberry
--------------------------------

Serviceberry is a framework for [Node.js](https://nodejs.org). If you don't have Node installed,
visit the Node [website](https://nodejs.org) to download and install the latest LTS version.

Once Node is installed, we'll use [npm](https://npmjs.com) (Node Package Manager) to install Serviceberry.

  - Create a folder for your service (any name)
  - Run `npm install serviceberry` in the folder

Now that Serviceberry is installed, your ready to code your service.

Hello World!
------------

Create a new file named `hello.js` in the folder where you installed Serviceberry. Copy the line of
JavaScript below into it.

```javascript
require("serviceberry").createTrunk().on("*", () => "Hello World!");
```

Run `node hello` to start your service then visit [http://localhost:3000](http://localhost:3000)
to see the response. If your service responds "Hello World!", you've successfully created your first
Serviceberry service!

Let's breakdown how we made it happen.

The first expression is loading [Serviceberry](serviceberry.html).

```javascript
require("serviceberry")
```

The next expression calls a Serviceberry function that creates the service [trunk](trunk.html).
The trunk is the entry point of the framework and all incoming requests. All branches and leaves
originate from the trunk. Calling `createTrunk()` will always be the first step to create a service
with Serviceberry.

```javascript
.createTrunk()
```

The last expression creates a new [leaf](leaf.html) at the service trunk and adds a handler for
that response with "Hello World!" to all request methods.

```javascript
.on("*", () => "Hello World!");
```

Hello World! *version 2*
------------------------

It's fun to build an HTTP service in one line, but we want to build services that are much more interesting
and powerful. It's time to add some features and create the next version of our service.

### Feature 1: *Greet By Name*

Let's greet a user by name using a parameter in the URL path. The service should respond to `GET /hello/{name}`
with `Hello {name}!`.

To do this, we'll add a new branch with `.at()` and switch from `*` (all methods) to `GET`. Our path to the
new branch will include the placeholder `{name}`. Serviceberry will parse this path parameter out of the URL
when routing the request to our new branch. The value of the parameter will be available through the `request`
object passed as the first argument to our handler.

`hello.js` should now look like this:

```javascript
require("serviceberry")
    .createTrunk()
    .at("hello/{name}")
    .on("GET", request => `Hello ${request.getParam("name")}!`);
```

Run `node hello` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 2: *Respond with JSON*

Let's send our response serialized as a JSON object.

To do this we'll declare options with an object instead of the string shorthand `"GET"`. We'll also return an object
instead of a string. Serviceberry has built-in support for JSON serializing and deserializing. By declaring the
leaf produces JSON in the options, Serviceberry knows to serialize the response as JSON.

```javascript
.on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));
```

To help keep our code organized, we'll also refactor a bit by storing the Serviceberry object and the trunk in variables.

`hello.js` should now look like this:

```javascript
const serviceberry = require("serviceberry");
const service = serviceberry.createTrunk();

service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));
```

Run `node hello` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 3: *Token Authentication*

Let's secure our service so only authorized users can access it. To do this, we'll add a handler to
the trunk with `.use()`. This handler will validate a query string token parameter.

Create a new file named `token.txt` in your service folder and save `d0189daeb2097` as its contents.
We'll read this string from `token.txt` to validate the token in the query string. Since we don't want
our service to wait while the file is read, we'll read the file asynchronously and call `request.proceed()`
when the request is authenticated and `request.fail()` when the token is missing or invalid.

We'll read the file using Node's [File Systems](https://nodejs.org/dist/latest-v9.x/docs/api/fs.html)
module `fs`.

`hello.js` should now look like this:

```javascript
const serviceberry = require("serviceberry");
const fs = require("fs");
const service = serviceberry.createTrunk().use(authenticate);

service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));

function authenticate (request) {
	const token = request.getParam("token");

    if (!token) {
        request.fail("Token required!", 401);
    }

    fs.readFile("token.txt", "utf8", (error, secret) => {
        if (error) {
            request.fail(error);
        } else if (token !== secret.trim()) {
            request.fail("Token is not valid!", 403);
        } else {
        	request.proceed();
        }
    });
}
```

Run `node hello` to start your service and visit [http://localhost:3000/hello/bob?token=d0189daeb2097](http://localhost:3000/hello/bob?token=d0189daeb2097)
to see the response. Try it without the token or with a bad token to see a failing repsonse.

Now that you know how to build a basic HTTP service using Serviceberry, check out the next guide
to learn all about handler.