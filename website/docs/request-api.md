---
id: request
title: Request
---

### *class*

This object is created internally by Serviceberry and passed as the first argument to [Handlers](handlers.html).
It is a wrapper object around Node's [`http.IncomingMessage`](https://nodejs.org/dist/latest-v8.x/docs/api/).

Extends [`EventEmitter`](https://nodejs.org/dist/latest-v8.x/docs/api/).




Methods
-------

  - [proceed([result])](#proceedresult)
  - [fail(error[, status[, headers]])](#failerror-status-headers)
  - [getId()](#getid)
  - [getElapsedTime()](#getelapsedtime)
  - [getIp()](#getip)
  - [getProtocol()](#getprotocol)
  - [getHost()](#gethost)
  - [getPort()](#getport)
  - [getMethod()](#getmethod)
  - [getUrl()](#geturl)
  - [getFullUrl()](#getfullurl)
  - [getContentType()](#getcontenttype)
  - [getEncoding()](#getencoding)
  - [getHeaders()](#getheaders)
  - [getHeader(name)](#getheadername)
  - [hasHeader(name)](#hasheadername)
  - [withoutHeader(name)](#withoutheadername)
  - [getPathParams()](#getpathparams)
  - [getPathParam(name)](#getpathparamname)
  - [getQueryParams()](#getqueryparams)
  - [getQueryParam(name)](#getqueryparamname)
  - [getBody()](#getbody)
  - [getBodyParam(name)](#getbodyparamname)
  - [getParams()](#getparams)
  - [getParam(name)](#getparamname)
  - [getContent()](#getcontent)

Properties
----------

  - [incomingMessage *http.IncomingMessage*](#incomingmessage)
  - [error *HttpError*](#error)
  - [latestResult *any*](#latestresult)

Reference
---------

### proceed([result])



Call this method to pass control of the request to the next handler. Handlers receiving `Request` may
optionally pass control by their `return` value in lieu of calling `proceed`. See [Handlers](handlers.html) guide.


  - **result** *any* [optional]

    Set as [`latestResult`](#latestresult) property with the exception of when a request is being serialized
or deserialized. When serializing or deserializing the result is the response content or request
body respectively.
 


### fail(error[, status[, headers]])



Call this method to pass control of the request the nearest catch handler. Handlers receiving `Request` may
optionally pass control by throwing an exception or by their `return` value in lieu of calling `fail`.
See [handlers](handlers.html) guide.


  - **error** *string or error* 

    Can be a error message or an error object.
 

  - **status** *number, string or object* [optional]

    Can be a status code, well know status text or an object with properties `code` and `text`. See
`HttpError` methods [`setStatusCode`](httperror.html#setstatuscodecode), [`setStatusText`](httperror.html#setstatustexttext),
and [`setStatus`](httperror.html#setstatusstatus).
 **Default:** 500

  - **headers** *object* [optional]

    Response headers if fail results in the end of the request. These headers are not set on the
response if a catch handler recovers from the fail and the request continues.
 


### getId()

Returns *a string*

Unique identifier for the request.


### getElapsedTime()

Returns *a number*

Number of milliseconds since the start of processing the request.

*Starts in the `Request` constructor and is not the same as time since the client sent
the request.*



### getIp()

Returns *a string*

Remote IP address of the client making the request.


### getProtocol()

Returns *a string*

Protocol of the request such as `http` or `https`. Will be the
`X-Forwarded-Proto` header value when available.



### getHost()

Returns *a string*

`Host` header value.



### getPort()

Returns *a number*

Port number of the request.


### getMethod()

Returns *a string*

HTTP method (verb) such as GET, POST, PUT, DELETE...


### getUrl()

Returns *an object*

Parsed URL object. See [`url`](https://nodejs.org/dist/latest-v8.x/docs/api/).


### getFullUrl()

Returns *a string*

Full URL including protocol, host, path and query string.

*Relies on `Host` header.*



### getContentType()

Returns *a string*

Content mime type without encoding charset, such as `application/json`.


### getEncoding()

Returns *a string*

Name of encoding such as `utf-8`.


### getHeaders()

Returns *an object*

All headers. Names are lower case and values are arrays when names
are duplicated.



### getHeader(name)

Returns *a string or array*

Value is an array when header is duplicated.

  - **name** *string* 

    Case insensitive. 


### hasHeader(name)

Returns *a boolean*

`true` when the header is in the request.


  - **name** *string* 

    Case insensitive. 


### withoutHeader(name)

Returns *a boolean*

`true` when the header is **NOT** in the request.


  - **name** *string* 

    Case insensitive. 


### getPathParams()

Returns *an object*

All path params. Names are lower case.


### getPathParam(name)

Returns *a string*

The value of a path param.

  - **name** *string* 


### getQueryParams()

Returns *an object*

All query string params. Names are lower case and values are
arrays when names are duplicated.



### getQueryParam(name)

Returns *a string*

The value of a query string param.

  - **name** *string* 

    Case insensitive. 


### getBody()

Returns *any (probably an object - determined by the deserializer)*

Deserialized request content. Casing of param names is determined
by the deserializer. Deserializers are encouraged to preserve case.



### getBodyParam(name)

Returns *any*

The value of a body param.

  - **name** *string* 

    Case insensitive. 


### getParams()

Returns *an object*

All params deserialized from the path, the query string
and the request body. Will throw an exception if deserializing the params
results in an exception.

When params exist in more than one location such as both the path and
the query string, the order of priority is path, then query string, then request
body. Because of this ambiguity, it is usually preferable to use [`getPathParms`](#getpathparams),
[`getQueryParams`](#getqueryparams), or [`getBody`](#getbody) instead of `getParams`.



### getParam(name)

Returns *any*

Param deserialized from the path, the query string or the request body.
Will throw an exception if deserializing the params results in an exception.

When a param exists in more than one location such as both the path and the
query string, the order of priority is path, then query string, then request
body. Because of this ambiguity, it is usually preferable to use [`getPathParm`](#getpathparamname),
[`getQueryParam`](#getqueryparamname), or [`getBodyParam`](#getbodyparamname) instead of `getParam`.


  - **name** *string* 

    Case insensitive. 


### getContent()

Returns *a buffer*

Raw request content. Most likely use case is within a deserializer.



### incomingMessage

The preferred way to interact with a request is the methods above, however if a need arises
that is not addressed with an existing method, then direct access to the
[`http.IncomingMessage`](https://nodejs.org/dist/latest-v8.x/docs/api/) is available here.
 

### error

Available within catch handlers. 

### latestResult

The resolved result of the latest finished handler. 

