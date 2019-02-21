---
id: serviceberry
title: Serviceberry
---

### *object*


When you require "serviceberry" this is the object that you receive. The most
important property is the factory function [createTrunk()](#createtrunk). It
is the entry point of the framework.

A service is created by creating a [trunk](trunk.html) then [branches](branch.html)
and [leaves](leaf.html) are added using [.at()](trunk.html#atpath-handlers-) and
[.on()](trunk.html#onmethod-handlers-). Each [branch](branch.html)
can have it's own [branches](branch.html) and [leaves](leaf.html) allowing
[plugins](plugins.html) and error handlers to be added at any levels with methods
[.use()](trunk.html#usehandlers) and [.cope()](trunk.html#copehandlers) on the
[trunk](trunk.html) or any [branch](branch.html) or [leaf](leaf.html).




--------------------------------------------------

  - [createTrunk([options])](#createtrunk-options-)
  - [HttpError *class*](#httperror)
  - [statusCodes *object*](#statuscodes)

Properties
----------

### createTrunk([options])



Creating a [trunk](trunk.html) using this factory function is the first thing
you'll do when creating a service. This is the entry point of the framework.

```javascript
const service = serviceberry.createTrunk({
  port: 3000,
  basePath: "api",
  callback: () => console.log("Sevice started!")
});

```

  - **options** *object* <span class="optional">[optional]</span>
    - **autoStart** *boolean* <span class="optional">[optional]</span>
  
      <span class="default">Default true</span>
  
      If false, the service won't begin handling requests until [.start()](#startcallback)
      is called.
  
    - **backlog** *number* <span class="optional">[optional]</span>
  
      <span class="default">Default 511</span>
  
      Maximum number of queued pending connections.
      See [nodejs.org](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen).
  
    - **callback** *function* <span class="optional">[optional]</span>
  
      Listener for server's listening event.
  
    - **deserializers** *object* <span class="optional">[optional]</span>
  
      Property names must be content types such as "application/json" and
      values must be [deserializer plugins](plugins.html#serializers-and-deserializers).
  
      When requests need deserialized, a deserializer matching the request's
      content type will be used.
  
    - **host** *string* <span class="optional">[optional]</span>
  
      <span class="default">Default all hosts</span>
  
      The host to listen on.
      See [nodejs.org](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen).
  
    - **path** *string* <span class="optional">[optional]</span>
  
      <span class="default">Default empty string</span>
  
      Base path of the [trunk](trunk.html). All request handled by the service
      must begin with this path.
  
    - **port** *number* <span class="optional">[optional]</span>
  
      <span class="default">Default 3000</span>
  
      The port to listen on.
      See [nodejs.org](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen).
  
    - **serializers** *object* <span class="optional">[optional]</span>
  
      Property names must be content types such as "application/json"
      and values must be [serializer plugins](plugins.html#serializers-and-deserializers).
  
      When responses need serialized, a serializer matching the response's
      content type will be used.
  
    - **timeout** *number* <span class="optional">[optional]</span>
  
      <span class="default">Default 10000</span>
  
      Number of milliseconds to wait before aborting requests.
  


### HttpError



A class for creating HTTP specific error objects. It isn't strictly necessary
for creating Serviceberry services. It is here for your convenience.

The [HttpError](httperror.html) constructor has the same arguments signature as
[request.fail()](request.html#failerror-status-headers) and is instanced
internally by Serviceberry when a request fails. [HttpError](httperror.html)
instances are the error objects available at request.error inside of error
handlers.
### statusCodes



This is a helper for avoiding magic numbers and helping your services and [plugins](plugins.html)
be more legible. It isn't strictly necessary for creating Serviceberry services.
It is here for your convenience.

It includes all the statuses in Node.js's [http.STATUS_CODES](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_status_codes).
It has status codes as properties at constant case status names such as statusCodes.OK
and status codes as properties at status text names such as statusCode["Not Found"].

