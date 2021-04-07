---
id: branch
title: Branch
---

### *class*

*Extends [Leaf](leaf)*

A branch is created by calling method .at() on the service
[trunk](trunk) or branch.




--------------------------------------------------

  - [at(path[, options[, ...handlers]])](#atpath-options-handlers-)
  - [cope(...handlers)](#copehandlers)
  - [on(options[, ...handlers])](#onoptions-handlers-)
  - [on(method[, ...handlers])](#onmethod-handlers-)
  - [use(...handlers)](#usehandlers)
  - [waitFor(...setup)](#waitforsetup)


Methods
-------

### at(path[, options[, ...handlers]])

Returns *a new branch*

Routes requests at a path down a new branch.

  - **path** *string* 

    Paths are cumulative. Creating a new [branch](branch) only requires
    the next piece of the path. For example, if a branch's path is "widgets"
    a new [branch](branch) created with branch.at("{id}") will recieve
    a request to "widgets/42".

    Path paramaters are delimited using a pair of curly braces. Such as {id}.
    The branch will parse the path parameters. They are available to all handlers
    through [request.getPathParam(name)](request#getpathparamname)
    and [request.getPathParms()](request#getpathparams).

  - **options** *object* <span class="optional">[optional]</span>
    - **serializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [serializer](plugins#serializers-and-deserializers)
      plugins.
  
    - **deserializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [deserializer](plugins#serializers-and-deserializers)
      plugins.
  
    - **buffer** *boolean* <span class="optional">[optional]</span>
  
      <span class="default">Default true</span>
  
      Whether to buffer the request content. If buffer is false, the request content will be a stream instead
      of a string or buffer.
  

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers) guide.


### cope(...handlers)

Returns *this branch*

Adds error [handlers](handlers) to this branch.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### on(options[, ...handlers])

Returns *this branch*

Routes requests to a new [leaf](leaf). Requests that match the options
will be handled by the new [leaf's](leaf) [handlers](handlers).


  - **options** *object* 
    - **method** *string or array* <span class="optional">[optional]</span>
  
      HTTP methods such as "GET", "POST", "PUT"... If not specified
      or is "*", all methods are matched. See nodejs.org for a list of
      [supported methods](https://nodejs.org/dist/latest/docs/api/http.html#http_http_methods).
  
    - **consumes** *string or array* <span class="optional">[optional]</span>
  
      Request content types such as "application/json", "text/csv"...
      If not specified all request content types are matched.
  
    - **produces** *string or array* <span class="optional">[optional]</span>
  
      Response content types such as "application/json", "text/csv"...
      If not specified all response content types are matched.
  
    - **serializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [serializer](plugins#serializers-and-deserializers)
      plugins.
  
    - **deserializers** *object* 
  
      Property names must be content types such as "application/json" and
      values must be [deserializer](plugins#serializers-and-deserializers)
      plugins.
  
    - **buffer** *boolean* <span class="optional">[optional]</span>
  
      <span class="default">Default true</span>
  
      Whether to buffer the request content. If buffer is false, the request content will be a stream instead
      of a string or buffer.
  

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers) guide.


### on(method[, ...handlers])

Returns *this branch*

Routes requests to a new [leaf](leaf). Requests that match the method
will be handled by the new [leaf's](leaf) [handlers](handlers).


  - **method** *string or array* 

    HTTP methods such as "GET", "POST", "PUT"... "*" matches all methods.
    See nodejs.org for a list of [supported methods](https://nodejs.org/dist/latest/docs/api/http.html#http_http_methods).

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers) guide.


### use(...handlers)

Returns *this branch*

Adds plugin [handlers](handlers) to this branch.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### waitFor(...setup)

Returns *this branch*

A hook for asynchronous setup tasks. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 


