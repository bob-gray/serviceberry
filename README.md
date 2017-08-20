Serviceberry
============

Simple HTTP service framework for Node.js

  - #createTrunk(options)
      - returns new trunk

``` javascript
const serviceberry = require("service-berry");
const service = serviceberry.createTrunk({
    port: 3000
});
const widgets = service.at("/widgets")
    .use(require("some/middleware/auth"));
const widget = widgets.at("/{id}");

widgets.on("GET", getWidgets);
widgets.on("POST", createWidget);
widget.on("GET", getWidget);

service.catch(onError);
service.use(require("some/middleware/logger"));
service.start();

...
```

Routing
-------
Handler queues are cummulative. Each new branch builds onto the queue. If a request method,
path, content type and accepted response type match the service implementation, all
queued middleware and handlers will be executed in sequence. If an error occurs while
executing the queue it will be caught and fallback to the nearest catch.

Each handler is executed asynchronously in the queue must call `request.proceed()` or `response.send()` 

Auto Error Statuses
-------------------
Serviceberry can respond automatically with 404 Not Found, 405 Method Not Allowed,
406 Not Acceptable and 415 Unsupported Media Type.

Auto Methods
------------
Serviceberry can respond automatically to OPTIONS and HEAD requests.
To override these auto responses implement your own

  - OPTIONS

    Any request path that implements methods will respond to OPTIONS
    requests with a status of 204 No Content and an Allow header.
    All middleware and catches in the queue will be executed as usual.

  - HEAD

    Any request path that implements a GET method will respond to HEAD
    requests with the head written while executing the GET queue.
    All middleware, catches and handlers in the GET queue will be
    executed.


Classes
=======

Trunk(options)
--------------
  - options
      - port <number>
      - host <string>
      - backlog <number>

  - #start(callback)

  - #use(middleware)
      - returns this trunk

  - #catch(middleware)
      - returns this trunk

  - #at(path)
      - returns new branch

Branch(node)
------------
  - #use(middleware)
      - returns this branch

  - #catch(middleware)
      - returns this branch

  - #at(path)
      - returns new branch

  - #on(method, middleware?)
      - returns new leaf

  - #on(options, middleware?)
      - options
          - method <string>
          - consumes <string>
          - produces <string>
      - returns new leaf

Leaf(node)
----------
  - #use(middleware)
      - returns this leaf

  - #catch(middleware)
      - returns this leaf

Request(incomingMessage)
------------------------
Always async - middleware and handlers must call `request.proceed()` for the
request to continue

  - #getMethod()
      - returns string

  - #getHeaders()
      - returns object of header names and values - names are lower case

  - #getHeader(name)
      - returns value - can be string or array

  - #getParams()
      - returns object - path and query string - path params take precedence - values
        are strings

  - #getParam(name)
      - returns string value

  - #getPathParams()
      - returns object

  - #getPathParam(name)
      - returns string value

  - #getQueryParams()
      - returns object - parsed from query string

  - #getQueryParam(name)
      - returns string value

  - #proceed()
      - each handler must call proceed before the request proceeds to the
        next handler in the queue

Response(serverResponse)
------------------------
  - #writeHead(statusCode, statusMessage?, headers?)
  - #send(data?, encoding?, callback?)
  - #notFound()
  - #notAllow()
  - #unsupported()
  - #unacceptable()
  - #unauthorized()
  - #forbidden()


Interfaces
==========

middleware
----------
Any "usable" object or a handler function. A usable object is an object with
a property name "use" that is a handler function.

  - usable: {use: handler}
  - handler: function (request, response)