---
id: trunk
title: Trunk
---

### *class*

Should be created using [`serviceberry.createTrunk(options)`](serviceberry.html#createtrunk-options).
All [branches](branch.html) and [leaves](leaf.html) originate from the trunk. Each
service has only one trunk.




Methods
-------

  - [use(handler)](#usehandler)
  - [catch(handler)](#catchhandler)
  - [at(path)](#atpath)
  - [on(options[, handler])](#onoptions-handler)
  - [on(method[, handler])](#onmethod-handler)
  - [start([callback])](#start-callback)


Reference
---------

### use(handler)

Returns *this trunk*

Adds a plugin [handler](handlers.html) to this trunk.

  - **handler** *function or object* 


### catch(handler)

Returns *this trunk*

Adds an error [handler](handlers.html) to this trunk.

  - **handler** *function or object* 


### at(path)

Returns *new [branch](branch.html)*

Routes requests at a path (segment) down a new [branch](branch.html). The path is cumulative.
Creating a new [branch](branch.html) only requires the next path segment. For example if a branch's
path is `/widgets` a new [branch](branch.html) created with `.at("{id}")` will have a path of `/widgets/{id}`.

Path paramaters are delimited using a pair of curly braces. Such as `foo/baz/{id}/`.
The branch will parse the path parameters. They are available to all handlers through the
[request](request.html) object's methods [getPathParms](request.html#getpathparams) and
[getPathParam](request.html#getpathparamname).


  - **path** *string* 


### on(options[, handler])

Returns *new [leaf](leaf.html)*

Routes requests filtered by options to a new [leaf](leaf.html).

  - **options** *object* 
    - **method** *string or array* [optional]
  
      HTTP method(s) to handle (`GET`, `POST`...). If not specified or is `*`, all methods are handled. 
  
    - **consumes** *string or array* [optional]
  
      Request content type(s) to handle (application/json, text/xml...). If not specified all request content types are handled. 
  
    - **produces** *string or array* [optional]
  
      Response content type(s) to handle (application/json, text/xml...). If not specified all response content types are handled. 
  
    - **serializers** *object* 
  
      Property names must be content types (such as `application/json`) and values must be [serializer](plugins.html#serializers-and-deserializers) plugins. 
  
    - **deserializers** *object* 
  
      Property names must be content types (such as `application/json`) and values must be [deserializer](plugins.html#serializers-and-deserializers) plugins. 
  

  - **handler** *function or object* [optional]

    See [Handlers](handlers.html) guide. 


### on(method[, handler])

Returns *new [leaf](leaf.html)*

Routes requests filtered by method to a new [leaf](leaf.html).

  - **method** *string or array* 

    HTTP method(s) to handle (`GET`, `POST`...). If `*`, all methods are handled.
 

  - **handler** *function or object* [optional]

    See [Handlers](handlers.html) guide. 


### start([callback])



Begin listening for requets. If trunk was created with option `autoStart`,
`start` is called automatically.


  - **callback** *function* [optional]



