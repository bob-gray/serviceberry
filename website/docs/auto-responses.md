---
id: auto-responses
title: Auto Responses
---

To help you do HTTP well, Serviceberry responds automatically in the following sitations.

Auto Error Statuses
-------------------

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
To override these auto methods, implement your own `OPTI0NS` and `HEAD` handlers.

  - **OPTIONS**

    Any request path that implements methods will respond to `OPTIONS`
    requests with a status of `204 No Content` and an `Allow` header.
    All plugins and catches in the queue will be executed as usual.

  - **HEAD**

    Any request path that implements a `GET` method will respond to `HEAD`
    requests with the head written while executing the `GET` queue.
    All plugins, catches and handlers in the `GET` queue will be
    executed.