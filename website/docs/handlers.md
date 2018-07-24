---
id: handlers
title: Handlers
---

Understanding handlers is central to creating a service using Serviceberry. All things that
interact with service requests do so through a common handler API. This means your endpoints,
plugins, error handlers, serializers and deserializers are all created in the same way.
This makes creating services and plugins easier.

A handler can be a [function](#handler-functions) or an [object](#handler-objects). Handler objects
can be any object with a `use` method that is a handler function.

Handler Functions
-----------------

Handler functions all have the same arguments signature `(request, response)`.
[Request](request.html) and [response](response.html) are wrapper objects for the
[http.IncomingRequest](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage)
and [http.ServiceResponse](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_serverresponse)
arguments passed to the underlining [http.Server](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server)
`request` event listener.

  - [request](request.html) *object*
  - [response](response.html) *object*

Handlers are added to the [trunk](trunk.html), [branches](branch.html) and [leaves](leaf.html)
of your service using Serviceberry's API. When Serviceberry routes each request through your service, it builds a queue of handlers. Each handler in the queue is then called one after the other. Each given control of the
[request](request.html) and [response](response.html) until control is exercised and transferred away. Handlers exercise control through
methods of [request](request.html) and [response](response.html), their return value or by throwing an error.

### Three Possible Outcomes

Each handler has exactly one opportunity to exercise control. Once action has been taken, control
is transferred away from the handler. There are three possible outcomes.

  1. Proceed with the request (typical for a plugin).
  2. Complete the request and send a response to the client (typical for an endpoint).
  3. Fallback to the nearest catch.

### Controlling the Outcome

Which outcome occurs depends primarily on the value returned from the handler. The handler can exercise
control over the [request](request.html) and [response](response.html) by the following actions.

  1. Return a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
     (any thennable should work).
  2. Return something other than `false` that is not thennable.
  3. Return nothing and call [`request.proceed()`](request.html#proceed-value).
  4. Return nothing and call [`response.send()`](response.html#send-options).
  5. Return nothing and call [`request.fail()`](request.html#failerror-status-headers).
  6. Return `false`.
  7. Throw an error.

Returning a `promise` that is resolved or eventually resolved, returning anything other than `false` or a
thennable, or returning nothing and calling [`request.proceed()`](request.html#proceed-value) are all functionally equivalent. They all result in the request
proceeding. Control will be given to the next handler in the queue. If the queue has no more handlers,
the request will end.

Returning nothing and calling [`response.send()`](response.html#send-options) will complete the request and send the response to the client.

Returning a `promise` that is rejected or eventually rejected, returning `false`, throwing an error, or returning
nothing and calling [`request.fail()`](request.html#failerror-status-headers) are all functionally equivalent. They all result in control falling back to the nearest catch handler. If no catch handler is found the request will be ended. Errors are available in catch handlers
at [`request.error`](request.html#error).

[`request.proceed()`](request.html#proceed-value), [`request.fail()`](request.html#failerror-status-headers) and [`response.send()`](response.html#send-options) can all be called asynchronously as long
as the handler doesn't return a value. Additionally none are required to be called with context so
each can be safely passed directly as callbacks - such as `.then(request.proceed, request.fail)`. When control is transferred to the
next handler, request and response methods given to the prior handler are rendered useless.

Handler Objects
---------------

Everywhere a handler is accepted as an argument, an object can be used. It can be any object that has a `use`
method that is a handler function. When Serviceberry is passed a handler object it binds the object's `use` method to the object so that handlers can be stateful. This can be particularly useful for plugins.

To learn about using and creating [plugins](plugins.html), checkout the next guide.
