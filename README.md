Serviceberry
============

[Documentation](https://bob-gray.github.io/serviceberry)

Serviceberry is a simple HTTP service framework.

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

Architecture
------------

Serviceberry can be thought about in three phases

```
          ----------------------------------------------------------------------------------------
         |                                                                                        |
         |        You use serviceberry's API to build a service tree (see example above).         |
Phase 1  |                                                                                        |
         |               This phase runs once each time your service is started.                  |
         |                                                                                        |
          ----------------------------------------------------------------------------------------

                    After phase 1 the service is listening for requests to respond to...

          ----------------------------------------------------------------------------------------
         |                                                                                        |
         |        Your service receives a request and serviceberry walks the service tree         |
Phase 2  |                          and builds a queue of handlers.                               |
         |                                                                                        |
         |                 This phase runs once for each incoming request.                        |
         |                                                                                        |
          ----------------------------------------------------------------------------------------
                                                     |
                                                     v
          ----------------------------------------------------------------------------------------
         |                                                                                        |
         |        Serviceberry runs through the handler queue transferring control of the         |
Phase 3  |                 request to each handler one after the other.                           |
         |                                                                                        |
         |      This phase runs once for each incoming request and immediately follows phase 2.   |
         |                                                                                        |
          ----------------------------------------------------------------------------------------

                                          -- or stated more simply --
                                                   
Phase 1: You call serviceberry to build a start a service

Phase 2: Serviceberry walks your service tree for each incoming request

Phase 3: Serviceberry calls your handlers giving each control of the request
```