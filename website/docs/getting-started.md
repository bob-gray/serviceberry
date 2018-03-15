---
id: getting-started
title: Getting Started
---

This guide will walk you through a creating a simple HTTP service with Serviceberry.

Install Node.js and Serviceberry
--------------------------------

Serviceberry is a framework for [Node.js](https://nodejs.org). If you don't have Node.js installed
visit the Node.js [website](https://nodejs.org) to download and install the latest LTS version.

Once Node.js is installed we'll use npm (Node Package Manager) to install Serviceberry.
Create a folder (any name) and from within the folder run `npm install serviceberry`.

Hello World!
------------

From within the folder you installed Serviceberry create a new file named `hello.js` and copy the line of
JavaScript below into it.

```javascript
require("serviceberry").createTrunk().on("*", () => "Hello World!");
```

Now run `node hello` to start your service and visit [http://localhost:3000](http://localhost:3000)
to see the response.

Hello World! (version 2)
------------------------

Becuase we want to build services that are much more interesting and powerful than `hello.js` above,
next we'll break down what is happening by refactoring. Then we'll a some new features.

The first expression is loading [Serviceberry](serviceberry.html). We'll assign it in a variable for use next.

```javascript
const serviceberry = require("serviceberry");
```

The next expression creates the service [trunk](trunk.html). The trunk is the entry point of the framework
and the incoming requests. All branches and leaves originate at the trunk. Because it is the root path we'll
assign the trunk to a variable named `service`.

```javascript
const service = serviceberry.createTrunk();
```

For now we won't pass any arguments and just use the default options.

The last expression adds a handler for all methods to the root path of the service which in our case
will be [http://localhost:3000](http://localhost:3000).

```javascript
service.on("*", () => "Hello World!");
```

### Feature 1: *Custom Greetings*

Lets greet a user by name using a parameter in the URL path. The service should response to `GET /hello/{name}`
with `Hello {name}!`.

To do this we'll add a new branch with `at()` and switch from `*` to `GET`. Our path to the new branch will
include the placeholder for `{name}`. Serviceberry will parse this path parameter out of the URL when routing
the request. The value of the parameter will be available through the methods of the `request` object passed
to our hanlder.

```javascript
service.at("hello/{name}")
    .on("GET", request => `Hello ${request.getParam("name")}!`);
```

Now `hello.js` should look like this.

```javascript
const serviceberry = require("serviceberry");
const service = serviceberry.createTrunk();

service.at("hello/{name}")
    .on("GET", request => `Hello ${request.getParam("name")}!`);
```

Now run `node hello` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 2: *Respond with JSON*

Now lets send our response serialized as a JSON object.

To do this we'll use a options object instead of `"GET"` when adding our handler `on()` and we'll return and object
from our handler instead of a string. Serviceberry has built in support for JSON request and response body content
type and form encoded request body content type.

```javascript
service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));
```

Now `hello.js` should look like this.

```javascript
const serviceberry = require("../src/main");
const service = serviceberry.createTrunk();

service.at("hello/{name}").on({
    method: "GET",
    produces: "application/json"
}, request => ({
	greeting: `Hello ${request.getParam("name")}!`
}));
```

Now run `node hello` to start your service and visit [http://localhost:3000/hello/Bob](http://localhost:3000/hello/Bob)
to see the response.

### Feature 3: *Token Authentication*

Once our service becomes popular we'll need to secure it so we can make sure only our users
can access it. To do this we'll add a simple plugin handler to validate sent as a query string
parameter.

Save `d0189daeb2097` to `token.txt` within your service folder. To validate the token in the
query string we'll read the token from `token.txt`. Since we don't want our service to wait
while the file is read we'll read the file asynchronously and call `request.proceed()` when the
request is authenticated and `request.fail(error[, status])` when the token is missing or invalid.

```javascript
const fs = require("fs");
const service = serviceberry.createTrunk().use(authenticate);

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

Now `hello.js` should look like this.

```javascript
const serviceberry = require("../src/main");
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

Now run `node hello` to start your service and visit [http://localhost:3000/hello/bob?token=d0189daeb2097](http://localhost:3000/hello/bob?token=d0189daeb2097)
to see the response. Try it without the token and with a bad token to see the fail repsonse.