---
id: response
title: Response
---

### *class*

This object is created internally by Serviceberry and passed as the second argument to [Handlers](handlers.html).
It is a wrapper object around Node's [`http.ServerResponse`](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_serverresponse).

Extends [`EventEmitter`](https://nodejs.org/dist/latest-v8.x/docs/api/).




Methods
-------

  - [send([options])](#sendoptions)
  - [is(status)](#isstatus)
  - [getStatus()](#getstatus)
  - [getStatusCode()](#getstatuscode)
  - [getStatusText()](#getstatustext)
  - [setStatus(status)](#setstatusstatus)
  - [setStatusCode(code)](#setstatuscodecode)
  - [setStatusText(text)](#setstatustexttext)
  - [getHeaders()](#getheaders)
  - [getHeader(name)](#getheadername)
  - [hasHeader(name)](#hasheadername)
  - [withoutHeader(name)](#withoutheadername)
  - [setHeaders(headers)](#setheadersheaders)
  - [setHeader(name, value)](#setheadername-value)
  - [removeHeader(name)](#removeheadername)
  - [clearHeaders()](#clearheaders)
  - [setBody(body)](#setbodybody)
  - [getBody()](#getbody)
  - [setEncoding(encoding)](#setencodingencoding)
  - [getEncoding()](#getencoding)
  - [getContentType()](#getcontenttype)


Reference
---------

### send([options])



Sends a response back to the client - ending the request. A response can also be implicity sent when the request proceeds and
there are no more handlers in the queue.


  - **options** *object* [optional]

    Sets response options before finishing request and sending response.
 
    - **status** *number, string or object* [optional]
  
      Can be a status code, standard status text or an object with properties `code` and `text`. See
  methods [`setStatusCode`](#setstatuscodecode), [`setStatusText`](#setstatustexttext),
  and [`setStatus`](#setstatusstatus).
   **Default:** 200
  
    - **headers** *object* [optional]
  
    - **body** *any* [optional]
  
    - **encoding** *string* [optional]
  
    - **finish** *function* [optional]
  
      Listener for `http.ServerResponse`'s `finish` event.
   
  


### is(status)

Returns *a boolean*

`true` when status matches.


  - **status** *string or number* 

    Status code or standard status text to test against. Case insensitive. 


### getStatus()

Returns *an object*

Status code and text if known. May have `code` and/or `text`. May be an empty object.


### getStatusCode()

Returns *a number or undefined*




### getStatusText()

Returns *a string or undefined*




### setStatus(status)



When code or text is not provided, an attempt will be made to derive one from
the other. For example `setStatus(200)` will set status code to `200` and
status text to `OK` and `setStatus("OK")` will set status text to `OK` and
status code to `200`.


  - **status** *number, string or object* 
    - **code** *number* 
  
    - **text** *string* 
  


### setStatusCode(code)





  - **code** *number* 


### setStatusText(text)





  - **text** *string* 


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


### setHeaders(headers)



Sets headers from an object. Does **NOT** clear headers. Does override headers.

  - **headers** *object* 


### setHeader(name, value)





  - **name** *string* 

  - **value** *string, number or array* 


### removeHeader(name)



Causes a header not to be sent. Causes `hasHeader` method to return `false`.

  - **name** *string* 

    Case insensitive. 


### clearHeaders()



Removes all headers.


### setBody(body)



The body prior to serialization.

  - **body** *any* 


### getBody()

Returns *any*

The body, as set by the request, prior to serialization.


### setEncoding(encoding)



Name of encoding such as `utf-8`.

  - **encoding** *string* 


### getEncoding()

Returns *a string*

Name of encoding such as `utf-8`.


### getContentType()

Returns *a string*

Content mime type without encoding charset, such as `application/json`.



