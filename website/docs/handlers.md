---
id: handlers
title: Handlers
---

Understanding handlers is central to creating a service using Serviceberry. All things that
interact with service requests do so through a common handler API. This means
serializers, deserialiers, plugins and endpoint are all created in the same way.

A handlers can be a function or an object that has a `use` method that is a handler function. Handler
functions all have the same signature `(request, response)`. Request and response are wrapper objects
for the [*http.IncomingRequest*](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage)
and [*http.ServiceResponse*](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_serverresponse)
arguments passed to the underlining [*http.Server*](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server)
"request" event listener.

Handler Function
----------------

  - request *object*
  - response *object*

Handler functions are added to your service's nodes when defining the service. Then Serviceberry
routes each request through your service and builds a queue of handlers. Each handler in the queue is
then called one after the other. Each given control of the request and response until control is
passed to the next handler. Handlers communicate control decisions to Serviceberry through their
return value or by throwing an error.

  1. Return a `promise` (any thennable should work).
  2. Return something other than `false` that is not thennable.
  3. Return nothing and call `request.proceed()`.
  4. Return nothing and call `response.send(options)`.
  5. Return nothing and call `request.fail(error)`.
  6. Return `false`.
  7. Throw an `error`.

These action will result in one of three possible outcomes. Each handler has exactly one opportunity to exercise control.
Once action has been taken, control is transferred away from the handler.

  1. Proceed with the request (typical for a plugin).
  2. Complete the request and send a response to the client (typical for endpoint implementation).
  3. Failure encountered - fallback to a catch.

Throwing an `error`, returning `false`, returning a rejected `promise` or calling `response.fail(error)` are
all functionally equivalent. They will all result in control falling back to the nearest catch handler. Errors are
available in catch handers as `request.error`. If no catch handler is found the request will be ended.

Returning a resolved `promise`, returning anything other than `false` or a thennable, or calling `request.proceed()` are
all functionally equivalent. They will all result in handing control to the next handler in the queue.

Calling `response.send(options)` will complete the request and send the response to the client.

`request.proceed()`, `request.fail(error)` and `response.send(options)` are not required to be called with context so
they can safely be passed as callbacks - such as `.then(request.proceed, request.fail)`. Once control is handed to the
next handler, these request and response methods given to the prior handler are rendered useless.

Handler Object
--------------

Everywhere a handler is accepted as an argument, an object having a `use` method that is a handler function can passed.
When Serviceberry is passed a handler object it binds the object's `use` method to the object so that handlers
can easily be stateful. This plugins can be implemented as classes that are instanced and configured then passed
as handlers to Serviceberry.

```javascript
// AuthPlugin, key and service all defined above

const auth = new AuthPlugin({key, scheme: "bearer"});

service.use(auth);
```