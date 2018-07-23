---
id: serviceberry
title: Serviceberry
---

### *object*

When you require `serviceberry` this is the object that you receive. The most important property is `createTrunk()`.
A service is created as a [trunk](trunk.html) then [branches](branch.html) and [leaves](leaf.html) are added using
`.at()` and `.on()` of the [trunk](trunk.html) and resulting branches. All parts of the tree can have plugins and error handlers attached
with `.use()` and `.catch()`.





Properties
----------

  - [createTrunk([options])](#createtrunk-options)
  - [statusCodes *object*](#statuscodes)
  - [HttpError *class*](#httperror)

Reference
---------


### createTrunk([options])



Creating a [trunk](trunk.html) using this factory function is the first thing you'll do when creating a service. This is the entry
point of the framework.


  - **options** *object* [optional]
    - **port** *number* [optional]
  
    - **host** *string* [optional]
  
    - **path** *string* [optional]
  
      Path for the [trunk](trunk.html). All request handled by the service must begin
  with this path.
   **Default:** /
  
    - **backlog** *number* [optional]
  
    - **autoStart** *boolean* [optional]
  
      If `false`, the service won't begin handling requests until `.start()`
  is called.
   **Default:** true
  
    - **timeout** *number* [optional]
  
      Number of milliseconds to wait before aborting requests. 
  
    - **serializers** *object* [optional]
  
      Property names must be content types (such as `application/json`) and values
  must be [serializer](plugins.html#serializers-and-deserializers) plugins..
   
  
    - **deserializers** *object* [optional]
  
      Property names must be content types (such as `application/json`) and values
  must be [deserializer](plugins.html#serializers-and-deserializers) plugins..
   
  
    - **callback** *function* [optional]
  
      Listener for server's `listening` event. 
  



```javascript
const service = serviceberry.createTrunk({
  port: 3000,
  basePath: "api",
  callback: () => console.log("Sevice started!")
});

```
### statusCodes

This is a helper for avoiding magic numbers and helping your services and plugins be more legible.
It isn't strictly necessary for use with Serviceberry. It is here for your convenience.

It includes all the statuses in Node's [http.STATUS_CODES](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_status_codes)
in addition to codes found at constant case property status names (such as `statusCodes.OK === 200` and `statusCodes.NOT_FOUND === 404`).
 

### HttpError

A class for creating HTTP specific error objects. Like [`statusCodes`](#statuscodes) above,
it isn't strictly necessary for use with Serviceberry.

The [HttpError](httperror.html) constructor has the same arguments signature as
[`request.fail()`](request.html#failerror-status-headers) and is instanced internally when a request fails.
It is the error object available at `request.error`.
 

