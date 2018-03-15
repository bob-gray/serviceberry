---
id: serviceberry
title: Serviceberry
---

### *object*






Properties
----------

  - [createTrunk([options])](#createtrunkoptions)
  - [statusCodes *object*](#statuscodes)
  - [HttpError *class*](#httperror)

Reference
---------


### createTrunk([options])



Creating a trunk using this factory function is the first thing you'll do when createing a service. This is the entry
point to the framework and every request. All branches and leaves will originate from here.


  - **options** *object* [optional]
    - **port** *number* [optional]
  
    - **host** *string* [optional]
  
    - **basePath** *string* [optional]
  
    - **backlog** *number* [optional]
  
    - **timeout** *number* [optional]
  
    - **deserializers** *object* [optional]
  
    - **serializers** *object* [optional]
  
    - **callback** *function* [optional]
  



```javascript
const service = serviceberry.createTrunk({
  port: 3000,
  basePath: "api",
  timeout: 10000
});

```
### statusCodes

All the status in [http.STATUS_CODES](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_status_codes)
in addition to codes keyed by constant case status text such as `statusCodes.OK === 200` and `statusCodes.NOT_FOUND === 404`.
 

### HttpError

A constructor function for creating HTTP specific error objects. [HttpError](httperror.hml) 

