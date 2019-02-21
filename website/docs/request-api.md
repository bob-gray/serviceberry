---
id: request
title: Request
---

### *class*

*Extends [EventEmitter](https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_class_eventemitter)*

Request objects are created internally by Serviceberry and passed as the first
argument to [Handlers](handlers.html). They are wrapper objects around Node's
[http.IncomingMessage](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage).




--------------------------------------------------

  - [error *HttpError*](#error)
  - [incomingMessage *http.IncomingMessage*](#incomingmessage)
  - [latestResult *any*](#latestresult)

  - [fail(error[, status[, headers]])](#failerror-status-headers-)
  - [getBody()](#getbody)
  - [getBodyParam(name)](#getbodyparamname)
  - [getContent()](#getcontent)
  - [getContentType()](#getcontenttype)
  - [getElapsedTime()](#getelapsedtime)
  - [getEncoding()](#getencoding)
  - [getFullUrl()](#getfullurl)
  - [getHeader(name)](#getheadername)
  - [getHeaders()](#getheaders)
  - [getHost()](#gethost)
  - [getId()](#getid)
  - [getIp()](#getip)
  - [getMethod()](#getmethod)
  - [getPathParam(name)](#getpathparamname)
  - [getPathParams()](#getpathparams)
  - [getParams()](#getparams)
  - [getParam(name)](#getparamname)
  - [getPort()](#getport)
  - [getProtocol()](#getprotocol)
  - [getQueryParam(name)](#getqueryparamname)
  - [getQueryParams()](#getqueryparams)
  - [getUrl()](#geturl)
  - [hasHeader(name)](#hasheadername)
  - [proceed([result])](#proceed-result-)
  - [withoutHeader(name)](#withoutheadername)

Properties
----------

### error



Available within coping handlers.
### incomingMessage



The preferred way to interact with a request is through it's methods, however
if a need arises that is not addressed with an existing method, then direct access to the
[http.IncomingMessage](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage)
is available.
### latestResult



The resolved result of the latest finished handler.

Methods
-------

### fail(error[, status[, headers]])



Call this method to pass control of the request the nearest coping handler. Handlers receiving Request may
optionally pass control by throwing an exception or by their return value in lieu of calling fail.
See [handlers](handlers.html) guide.


  - **error** *string or error* 

    Can be a error message or an error object.

  - **status** *number, string or object* <span class="optional">[optional]</span>

    <span class="default">Default 500</span>

    Can be a status code, well know status text or an object with properties code and text. See
    HttpError methods [setStatusCode](httperror.html#setstatuscodecode), [setStatusText](httperror.html#setstatustexttext),
    and [setStatus](httperror.html#setstatusstatus).

  - **headers** *object* <span class="optional">[optional]</span>

    Response headers if fail results in the end of the request. These headers are not set on the
    response if a coping handler recovers from the fail and the request continues.


### getBody()

Returns *any (probably an object - determined by the deserializer)*

Deserialized request content. Casing of param names is determined
by the deserializer. Deserializers are encouraged to preserve case.



### getBodyParam(name)

Returns *any*

The value of a body param.

  - **name** *string* 

    Case insensitive.


### getContent()

Returns *a buffer*

Raw request content. Most likely use case is within a deserializer.


### getContentType()

Returns *a string*

Content mime type without encoding charset, such as application/json.


### getElapsedTime()

Returns *a number*

Number of milliseconds since the start of processing the request.

*Starts in the Request constructor and is not the same as time since the client sent
the request.*



### getEncoding()

Returns *a string*

Name of encoding such as utf-8.


### getFullUrl()

Returns *a string*

Full URL including protocol, host, path and query string.

*Relies on Host header.*



### getHeader(name)

Returns *a string or array*

Value is an array when header is duplicated.

  - **name** *string* 

    Case insensitive.


### getHeaders()

Returns *an object*

All headers. Names are lower case and values are arrays when names
are duplicated.



### getHost()

Returns *a string*

Host header value.



### getId()

Returns *a string*

Unique identifier for the request.


### getIp()

Returns *a string*

Remote IP address of the client making the request.


### getMethod()

Returns *a string*

HTTP method (verb) such as GET, POST, PUT, DELETE...


### getPathParam(name)

Returns *a string*

The value of a path param.

  - **name** *string* 


### getPathParams()

Returns *an object*

All path params. Names are lower case.


### getParams()

Returns *an object*

All params deserialized from the path, the query string
and the request body. Will throw an exception if deserializing the params
results in an exception.

When params exist in more than one location such as both the path and
the query string, the order of priority is path, then query string, then request
body. Because of this ambiguity, it is usually preferable to use [getPathParms](#getpathparams),
[getQueryParams](#getqueryparams), or [getBody](#getbody) instead of getParams.



### getParam(name)

Returns *any*

Param deserialized from the path, the query string or the request body.
Will throw an exception if deserializing the params results in an exception.

When a param exists in more than one location such as both the path and the
query string, the order of priority is path, then query string, then request
body. Because of this ambiguity, it is usually preferable to use [getPathParm](#getpathparamname),
[getQueryParam](#getqueryparamname), or [getBodyParam](#getbodyparamname) instead of getParam.


  - **name** *string* 

    Case insensitive.


### getPort()

Returns *a number*

Port number of the request.


### getProtocol()

Returns *a string*

Protocol of the request such as http or https. Will be the
X-Forwarded-Proto header value when available.



### getQueryParam(name)

Returns *a string*

The value of a query string param.

  - **name** *string* 

    Case insensitive.


### getQueryParams()

Returns *an object*

All query string params. Names are lower case and values are
arrays when names are duplicated.



### getUrl()

Returns *an object*

Parsed URL object. See [url](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_url_strings_and_url_objects).


### hasHeader(name)

Returns *a boolean*

true when the header is in the request.


  - **name** *string* 

    Case insensitive.


### proceed([result])



Call this method to pass control of the request to the next handler. Handlers
may optionally pass control by their return value in lieu of calling proceed.
See [Handlers](handlers.html) guide. Proceed is bound to request


  - **result** *any* <span class="optional">[optional]</span>

    Set as [latestResult](#latestresult) property with the exception of when a request is being serialized
    or deserialized. When serializing or deserializing the result is the response content or request
    body respectively.


### withoutHeader(name)

Returns *a boolean*

true when the header is **NOT** in the request.


  - **name** *string* 

    Case insensitive.


