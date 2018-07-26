---
id: service-tree
title: Service Tree
---

This guide will demonstrate how services are structured into a tree of routes.

Trunk Plugins and Error Handlers
--------------------------------

Some plugins like logging are often best at the root of your service. If you call
`trunk.use(handler)` you can add plugins at the service root so that all requests into
the service pass through the these plugins. You can also call `trunk.catch(handler)` to
attach error handling to the service root.

Lets create a quick example using [`serviceberry-logger`](https://www.npmjs.com/package/serviceberry-logger).

  - Create a folder named `todos`
  - In `todos/` run the following commands:
      - `npm init --yes` to initialize a `package.json` file
      - `npm install serviceberry` to install Serviceberry
      - `npm install serviceberry-logger` to install [`serviceberry-logger`](https://www.npmjs.com/package/serviceberry-logger)
  - Create a new file `todos/service.js` and save the JavaScript below as its contents.

```JavaScript
const {createTrunk} = require("serviceberry"),
    logger = require("serviceberry-logger"),
    trunk = createTrunk({
        autoStart: false
    });

start();

async function start () {
    trunk.use(await logger())
        .on("*", request => request.getId());

    trunk.start();
}
```

Run `node service` in `todos/` to start your service then visit [http://localhost:3000](http://localhost:3000).
Your service should respond the [request](request.html#getid) id. The request will
be logged in `todos/logs/server.log`.

Next we'll add an error handler on the [trunk](trunk.html) and introduce a bug so
we can see the resulting error logged. For the error handler we'll use an error handler
provided by [`serviceberry-logger`](https://www.npmjs.com/package/serviceberry-logger).

*`todos/service.js` should now look like this:*

```javascript
const {createTrunk} = require("serviceberry"),
    logger = require("serviceberry-logger"),
    trunk = createTrunk({
        autoStart: false
    });

start();

async function start () {
    trunk.use(await logger())
        .catch(logger.error)
        .on("*", request => request.getIdd());

    trunk.start();
}
```

Run `node service` in `todos/` to start your service then visit [http://localhost:3000](http://localhost:3000).
Your service should respond the [request](request.html#getid) id. The request will
be logged in `todos/logs/server.log`.
