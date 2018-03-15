---
id: trunk
title: Trunk
---

### *class*

Should be created using `serviceberry.createTrunk()`.
It is the root of the service and the entry point of the framework. All branches and leaves originate at the trunk.




Methods
-------

  - [use(handler)](#usehandler)
  - [catch(handler)](#catchhandler)
  - [at(path)](#atpath)
  - [on(options[, handler])](#onoptions-handler)
  - [on(method[, handler])](#onmethod-handler)
  - [start([callback])](#startcallback)


Reference
---------

### use(handler)

Returns *this trunk*

Adds a handler to this trunk.

  - **handler** *function or object* 


### catch(handler)

Returns *this trunk*

Adds an error handler to this trunk.

  - **handler** *function or object* 


### at(path)

Returns *new branch*

Routes requests at a path (segment) down a new branch. Path paramaters are delimited using a set of curly braces.
Such as `foo/baz/{id}/`. The branch will parse the path parameters. They are available to all handlers on
the request object.


  - **path** *string* 


### on(options[, handler])

Returns *new leaf*

Routes requests filtered by options to a new leaf.

  - **options** *object* 
    - **method** *string or array* [optional]
  
      HTTP method(s) to handle (GET, POST...). If not specified all methods are handled. 
  
    - **consumes** *string or array* [optional]
  
      Request content type(s) to handle (application/json, text/xml...). If not specified all request content types are handled. 
  
    - **produces** *string or array* [optional]
  
      Response content type(s) to handle (application/json, text/xml...). If not specified all response content types are handled. 
  

  - **handler** *function or object* [optional]


### on(method[, handler])

Returns *new leaf*

Routes requests filtered by method to a new leaf.

  - **method** *string or array* 

    HTTP method(s) to handle (GET, POST...). If &quot;*&quot; all methods are handled.
 

  - **handler** *function or object* [optional]


### start([callback])



Begin listening for requets.

  - **callback** *function* [optional]



