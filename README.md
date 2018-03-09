Serviceberry
============

Simple HTTP service framework for Node.js

  - #createTrunk(options)
      - returns new trunk

``` javascript
const serviceberry = require("serviceberry");
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

...

service.start();
```

Routing
-------
Using Serviceberry builds a service tree. Starting with a trunk - branches and leaves are added. Middleware
can be injected at any point. Each incoming request walks the tree to create a queue of handlers. Each matching branch
builds onto the queue.  All handlers (middleware, catches and endpoint implementations) have the same signature
`(request, response)` and each handler has equal opportunity to control the request - one after another.  

All handlers must implement [useable](#useable-objectfunction) and must exercise control in one of the following ways.

  1. Return a promise (any thennable should work).
  2. Return something other than `false` that is not thennable.
  3. Return nothing and call `request.proceed()`.
  4. Return nothing and call `response.send(options)`.
  5. Return nothing and call `request.fail(error)`.
  6. Throw an error.
  7. Return `false`.

These action will result in one of three possible outcomes. Each handler has exactly one opportunity to exercise control.
Once action has been taken, control is transferred away from the handler.

  1. Proceed with the request (typical for middleware).
  2. Complete the request and send a response to the client (typical for endpoint implementation).
  3. Failure encountered - fallback to a catch.

Throwing an error, returning `false`, returning and promise that is rejected or calling `response.fail(error)` are
all functionally equivalent. They will all result in control falling back to the nearest catch handler. Errors are
available in catch handers as `request.error`. If no catch handler is found the request will be terminated.

Returning a resolved promise, returning anything other than `false` or a thennable, or calling `request.proceed()` are
all functionally equivalent. They will all result in control moving to the next handler in the queue. If the queue is
empty proceeding with the request will result in an error.

Calling `response.send(options)` will complete the request and send the response to the client.

`request.proceed()`, `request.fail(error)` and `response.send(options)` are not required to be called with context so
they can safely be passed as callbacks - such as `.then(request.proceed, request.fail)`.

Auto Error Statuses
-------------------
Serviceberry will respond automatically to certain errors in the following situations.

  - **404 Not Found**

    When no route is found.

  - **405 Method Not Allowed**

    When an implementation of the request method does not exist.

  - **406 Not Acceptable**

    When an implementation producing an acceptable content type does not exist.

  - **415 Unsupported Media Type**

    When an implementation consuming the request content type does not exist.

  - **500 Internal Server Error**

    When an unhandled exception occurs.

  - **503 Service Unavailable**

    When a request times out. 

Auto Methods
------------
Serviceberry can respond automatically to OPTIONS and HEAD requests.
To override these auto responses implement your own

  - **OPTIONS**

    Any request path that implements methods will respond to OPTIONS
    requests with a status of 204 No Content and an Allow header.
    All middleware and catches in the queue will be executed as usual.

  - **HEAD**

    Any request path that implements a GET method will respond to HEAD
    requests with the head written while executing the GET queue.
    All middleware, catches and handlers in the GET queue will be
    executed.


Interfaces
==========

usable `<object>|<function>`
------
A handler function or any object with a property named "use" whose value is a
handler function. The handler signature is `(request, response)`. Usable
objects use methods will be invoked with the object as the calling context (`this`).


Classes
=======

Trunk(options)
--------------
  - options

        port <number>
        host <string>
        backlog <number>
        serializers <object>

  - #start(callback)

  - #use(usable)
      - returns this trunk

  - #catch(usable)
      - returns this trunk

  - #at(path)
      - returns new branch

Branch(node)
------------
  - #use(usable)
      - returns this branch

  - #catch(usable)
      - returns this branch

  - #at(path)
      - returns new branch

  - #on(method[, usable])
      - returns new leaf

  - #on(options[, usable])
      - options

            method <string>
            consumes <string>
            produces <string>

      - returns new leaf

Leaf(node)
----------
  - #use(usable)
      - returns this leaf

  - #catch(usable)
      - returns this leaf

Request(incomingMessage)
------------------------
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
  - #send([options])

        status <number>|<object>
          code <number>
          text <string>
        headers <object>
        body <any>

  - #getStatus()
      - returns status object

            code <number>
            text <string>

  - #setStatus(status)

        status <number>|<object>
            code <number>
            text <string>

  - #setStatusCode(code)

  - #setStatusText(text)

  - #getHeaders()
      - returns object

  - #getHeader(name)
      - return string or array

  - #setHeaders(headers)

  - #setHeader(name, value)

  - #getContentType()

  - #getContent()
      - returns buffer

  - #getBody()

  - #setBody(body)
      body <any>

  - #getEncoding()
      - returns string

  - #setEncoding(encoding)
 
        encoding <string>