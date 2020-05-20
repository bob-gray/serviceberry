---
id: handlers
title: Handlers
---

Understanding *handlers* is central to creating a service using Serviceberry. All things that
interact with service requests do so through a common *handler* API. This means your endpoints,
plugins, error coping, serializers and deserializers are all created in the same way. This
makes creating services easier and it makes creating plugins easier.

A *handler* can be a [function](#handler-functions), or an [object](#handler-objects),
or a [promise](#handler-promise) that resolves to a *handler* [function](#handler-functions)
or [object](#handler-objects). *Handler* objects can be any object with a `use` method that is a *handler* function.

Handler Functions
-----------------

*Handler* functions all have the same arguments signature `(request, response)` and ability to control requests.
[Request](request) and [response](response) are wrapper objects for the
[http.IncomingRequest](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_incomingmessage)
and [http.ServiceResponse](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_serverresponse)
arguments passed to the underlining [http.Server](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_server)
`request` event listener.

  - [request](request) *object*
  - [response](response) *object*

*Handlers* are added to the [trunk](trunk), [branches](branch), and [leaves](leaf)
of your service using methods `use`, `cope` and `on`. When Serviceberry routes each request through your service,
it builds a queue of *handlers*. Each *handler* in the queue is then called one after the other. Each given control of the
[request](request) and [response](response) until control is yielded to the next *handler*. *Handlers* yield
control through [request](request) and [response](response) methods, by the value they return, or by throwing
an error.

### Three Possible Outcomes

Each *handler* has exactly one opportunity to control the [request](request) and [response](response). Once
action has been taken there are three possible outcomes.

  1. Proceed with the request (typical for a plugin, serializer, or deserializer).
  2. Complete the request and send a response to the client (typical for an endpoint).
  3. Fallback to the nearest error coping *handler*.

*Proceeding (1) or falling back (3) could implicitly result in sending a response when there are no more handlers in
the queue*

### Controlling the Outcome

Which outcome occurs depends primarily on the value returned from a *handler*. A *handler* can control the
[request](request) and [response](response) by the following actions.

  - Return nothing and call [`request.proceed([result])`](request.html#proceed-value-).
  - Return the *result*.
  - Return a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    for the *result* (*any thennable should work*).

Calling [`request.proceed([result])`](request#proceed-value-), returning anything else other than an error, and
returning a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves
to the result are all functionally equivalent. They all cause the request to proceed. The next *handler* in the queue
will be called and control will be given to it. If the queue has no more *handlers*, the request will end and
[`response.send([options])`](response.html#send-options-) is call implicitly.

  - Return nothing and call [`response.send([options])`](response.html#send-options-).

Returning nothing and calling [`response.send([options])`](response.html#send-options-) will complete the request (*as far
as the handler queue is concerned*) and begin the process of serializing the writing the response to the client.

  - Return nothing and call [`request.fail(error[, status[, headers]])`](request.html#failerror-status-headers-). ***Throws
    the resulting error halting execution of the handler.***
  - Return, resolve to, or reject with an error.
  - Throw an error.

Calling [`request.fail(error[, status[, headers]])`](request.html#failerror-status-headers-), returning an error, throwing
an error, or returning a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
that is rejected with an error or resolves to an error are all functionally equivalent. They all cause control to fallback
to the nearest error coping *handler*. If no error coping *handler* is found, the request will be end and
[`response.send([options])`](response.html#send-options-) is call implicitly sending the error to the client. Errors are
available in error coping *handlers* at [`request.error`](request.html#error).

The first of any of the actions above after a *handler* is called and the *handler's* control is yielded. When control
is yielded, [`request.proceed([result])`](request.html#proceed-value-), [`request.fail(error[, status[, headers]])`](request.html#failerror-status-headers-),
and [`response.send([options])`](response.html#send-options-) methods given to the *handler* are all rendered useless. 

[`request.proceed([result]))`](request.html#proceed-value-), [`request.fail(error[, status[, headers]])`](request.html#failerror-status-headers-),
and [`response.send([options]))`](response.html#send-options-) can all be called asynchronously as long as a *handler* returns nothing
or a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise). Additionally none
are required to be called with context so each can be safely passed directly as callbacks - such as
`.then(request.proceed, request.fail)`. 

Handler Objects
---------------

Everywhere a *handler* is accepted as an argument, an object can be used. It can be any object that has a `use`
method that is a *handler* function. When Serviceberry is passed a *handler* object it binds the object's `use` method to
the object so that handlers can be stateful. This can be particularly useful for plugins.

Handler Promises
----------------

Everywhere a *handler* is accepted as a argument, a [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
can be used. The [`promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) must
resolve to a *handler* [function](#handler-function) or a *handler* [object](#handler-promises). The service [trunk](trunk.html)
will wait until all handlers are resolved before starting.

To learn about using and creating [plugins](plugins.html), checkout the [next guide](plugins.html).
