---
id: branch
title: Branch
---

### *class*

*Extends [Leaf](leaf.html)*

A branch is created by calling method .at() on the service
[trunk](trunk.html) or branch.




--------------------------------------------------

  - [at(path[, ...handlers])](#atpath-handlers-)
  - [cope(...handlers)](#copehandlers)
  - [on(options[, ...handlers])](#onoptions-handlers-)
  - [on(method[, ...handlers])](#onmethod-handlers-)
  - [use(...handlers)](#usehandlers)
  - [waitFor(...setup)](#waitforsetup)


Methods
-------

### at(path[, ...handlers])

Returns *a new branch*

Routes requests at a path down a new branch.

  - **path** *string* 

    Paths are cumulative. Creating a new [branch](branch.html) only requires
    the next piece of the path. For example, if a branch's path is "widgets"
    a new [branch](branch.html) created with branch.at("{id}") will recieve
    a request to "widgets/42".

    Path paramaters are delimited using a pair of curly braces. Such as {id}.
    The branch will parse the path parameters. They are available to all handlers
    through [request.getPathParam(name)](request.html#getpathparamname)
    and [request.getPathParms()](request.html#getpathparams).

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers.html) guide.


### cope(...handlers)

Returns *this branch*

Adds error [handlers](handlers.html) to this branch.

  - **handlers** *function or object* 

    See [Handlers](handlers.html) guide.


### on(options[, ...handlers])

Returns *this branch*

Routes requests to a new [leaf](leaf.html). Requests that match the options
will be handled by the new [leaf's](leaf.html) [handlers](handlers.html).


  - **options** *object* 
    - **method** *string or array* <span class="optional">[optional]</span>
  
      HTTP methods such as "GET", "POST", "PUT"... If not specified
      or is "*", all methods are matched. See nodejs.org for a list of
      [supported methods](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_methods).
  
    - **consumes** *string or array* <span class="optional">[optional]</span>
  
      Request content types such as "application/json", "text/csv"...
      If not specified all request content types are matched.
  
    - **produces** *string or array* <span class="optional">[optional]</span>
  
      Response content types such as "application/json", "text/csv"...
      If not specified all response content types are matched.
  
    - **serializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [serializer](plugins.html#serializers-and-deserializers)
      plugins.
  
    - **deserializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [deserializer](plugins.html#serializers-and-deserializers)
      plugins.
  

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers.html) guide.


### on(method[, ...handlers])

Returns *this branch*

Routes requests to a new [leaf](leaf.html). Requests that match the method
will be handled by the new [leaf's](leaf.html) [handlers](handlers.html).


  - **method** *string or array* 

    HTTP methods such as "GET", "POST", "PUT"... "*" matches all methods.
    See nodejs.org for a list of [supported methods](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_methods).

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers.html) guide.


### use(...handlers)

Returns *this branch*

Adds plugin [handlers](handlers.html) to this branch.

  - **handlers** *function or object* 

    See [Handlers](handlers.html) guide.


### waitFor(...setup)

Returns *this branch*

A hook for asynchronous setup tasks. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 


