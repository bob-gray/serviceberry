---
id: trunk
title: Trunk
---

### *class*

*Extends [Branch](branch)*

A trunk should be created using [serviceberry.createTrunk(options)](serviceberry#createtrunk-options).
All [branches](branch) and [leaves](leaf) originate from the trunk.
A service has only one trunk.




--------------------------------------------------

  - [at(path[, ...handlers])](#atpath-handlers-)
  - [cope(...handlers)](#copehandlers)
  - [leaf()](#leaf)
  - [on(options, ...handlers)](#onoptions-handlers)
  - [on(method, ...handlers)](#onmethod-handlers)
  - [start(callback)](#startcallback)
  - [use(...handlers)](#usehandlers)
  - [waitFor(...setup)](#waitforsetup)


Methods
-------

### at(path[, ...handlers])

Returns *a new [branch](branch)*

Routes requests at a path down a new [branch](branch).

  - **path** *string* 

    Paths are cumulative. Creating a new [branch](branch) only requires
    the next piece of the path. For example, if a branch's path is "widgets"
    a new [branch](branch) created with branch.at("{id}") will recieve
    a request to "widgets/42".

    Path paramaters are delimited using a pair of curly braces. Such as {id}.
    The branch will parse the path parameters. They are available to all handlers
    through [request.getPathParam(name)](request#getpathparamname)
    and [request.getPathParms()](request#getpathparams).

  - **handlers** *function or object* <span class="optional">[optional]</span>

    See [Handlers](handlers) guide.


### cope(...handlers)

Returns *this trunk*

Adds error [handlers](handlers) to this trunk.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### leaf()

Returns *new leaf*

*The use case for this function is rare. Most of the time you probably want
[.on()](#onoptions-handlers-).

Routes request to a new [leaf](leaf). Works the same as [.on()](#onoptions-handlers-)
expect it returns the new [leaf](leaf) instead of this trunk.



### on(options, ...handlers)

Returns *this trunk*

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
  

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### on(method, ...handlers)

Returns *this trunk*

Routes requests to a new [leaf](leaf). Requests that match the method
will be handled by the new [leaf's](leaf) [handlers](handlers).


  - **method** *string or array* 

    HTTP methods such as "GET", "POST", "PUT"... "*" matches all methods.
    See nodejs.org for a list of [supported methods](https://nodejs.org/dist/latest/docs/api/http.html#http_http_methods).

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### start(callback)



Begin listening for requets. If the trunk was created with the option autoStart,
start is called automatically.


  - **callback** *function* 


### use(...handlers)

Returns *this trunk*

Adds plugin [handlers](handlers) to this trunk.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### waitFor(...setup)

Returns *this branch*

A hook for asynchronous setup tasks. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 


