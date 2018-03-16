---
id: branch
title: Branch
---

### *class*

Created by calling method `.at()` on the service [trunk](trunk.html) or any service branch.



Methods
-------

  - [use(handler)](#usehandler)
  - [catch(handler)](#catchhandler)
  - [at(path)](#atpath)
  - [on(options[, handler])](#onoptions-handler)
  - [on(method[, handler])](#onmethod-handler)


Reference
---------

### use(handler)

Returns *this branch*

Adds a plugin [handler](handlers.html) to this branch.

  - **handler** *function or object* 


### catch(handler)

Returns *this branch*

Adds an error [handler](handlers.html) to this branch.

  - **handler** *function or object* 


### at(path)

Returns *new branch*

Routes requests at a path (segment) down a new [branch](branch.html). Path paramaters are delimited using
a pair of curly braces. Such as `foo/baz/{id}/`. The branch will parse the path parameters. They are
available to all handlers through the request object.


  - **path** *string* 


### on(options[, handler])

Returns *new [leaf](leaf.html)*

Routes requests filtered by options to a new leaf.

  - **options** *object* 
    - **method** *string or array* [optional]
  
      HTTP method(s) to handle (`GET`, `POST`...). If not specified or is "*", all methods are handled. 
  
    - **consumes** *string or array* [optional]
  
      Request content type(s) to handle (application/json, text/xml...). If not specified all request content types are handled. 
  
    - **produces** *string or array* [optional]
  
      Response content type(s) to handle (application/json, text/xml...). If not specified all response content types are handled. 
  
    - **serializers** *object* 
  
      Property names must be content types (such as `application/json`) and values must be [serializers](plugins.html#serializers-and-deserializers) plugins. 
  
    - **deserializers** *object* 
  
      Property names must be content types (such as `application/json`) and values must be [deserializers](plugins.html#serializers-and-deserializers) plugins. 
  

  - **handler** *function or object* [optional]


### on(method[, handler])

Returns *new [leaf](leaf.html)*

Routes requests filtered by method to a new leaf.

  - **method** *string or array* 

    HTTP method(s) to handle (`GET`, `POST`...). If "*", all methods are handled.
 

  - **handler** *function or object* [optional]



