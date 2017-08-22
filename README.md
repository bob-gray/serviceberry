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
service.start();

...
```

Routing
-------
Using the Serviceberry API builds a service tree. Starting with a trunk - branches and leaves
are added. Middleware can be injected at stage. Each incoming request walks the tree to create
a queue of handlers. All handlers (middleware, catches and endpoint implementations) have the
same signature `(request, response)` and each handler has equal opportunity to control the
request and response. 

Handler queues are cummulative. Each new branch builds onto the queue. If a request method,
path, content type and accepted response type match the service tree, all queued handlers
will be executed in sequence. If an error occurs while executing the queue it will be caught
and fallback to the nearest catch. The thrown error will be available in the catch hander
as `request.error`.

Each handler in the queue must call `request.proceed()` to invoke the next handler
or `response.send()` to end the response.

Auto Error Statuses
-------------------
Serviceberry will respond automatically to certain client errors in the following situations.

  - 404 Not Found

    When no route is found.

  - 405 Method Not Allowed

    When an implementation of the request method does not exist.

  - 415 Unsupported Media Type

    When an implementation consuming the request content type does not exist.

  - 406 Not Acceptable

    When an implementation producing an acceptable content type does not exist.

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


Interfaces
==========

usable `<object>|<function>`
------
Any object with a property named "use" whose value is a handler function
or a handler function. The handler signature is `(request, response)`.
Usable objects will be invoked with the object as the calling context (`this`).


Classes
=======

Trunk(options)
--------------
  - options

        port <number>
        host <string>
        backlog <number>

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

  - #getBody()

  - #setBody(body)
      body <any>

  - #getEncoding()
      - returns string

  - #setEncoding(encoding)
      encoding <string>