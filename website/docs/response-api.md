---
id: response
title: Response
---

### *class*

*Extends [EventEmitter](https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter)*

This object is created internally by Serviceberry and passed as the second argument to [Handlers](handlers).
It is a wrapper object around Node's [`http.ServerResponse`](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_serverresponse).




--------------------------------------------------

  - [clearHeaders()](#clearheaders)
  - [getBody()](#getbody)
  - [getContentType()](#getcontenttype)
  - [getEncoding()](#getencoding)
  - [getHeader(name)](#getheadername)
  - [getHeaders()](#getheaders)
  - [getStatus()](#getstatus)
  - [getStatusCode()](#getstatuscode)
  - [getStatusText()](#getstatustext)
  - [hasHeader(name)](#hasheadername)
  - [is(status)](#isstatus)
  - [removeHeader(name)](#removeheadername)
  - [send([options])](#send-options-)
  - [setBody(body)](#setbodybody)
  - [setEncoding(encoding)](#setencodingencoding)
  - [setHeader(name, value)](#setheadername-value)
  - [setHeaders(headers)](#setheadersheaders)
  - [setStatus(status)](#setstatusstatus)
  - [setStatusCode(code)](#setstatuscodecode)
  - [setStatusText(text)](#setstatustexttext)
  - [withoutHeader(name)](#withoutheadername)


Methods
-------

### clearHeaders()



Removes all headers.


### getBody()

Returns *any*

The body, as set by the request, prior to serialization.


### getContentType()

Returns *a string*

Content mime type without encoding charset, such as `application/json`.


### getEncoding()

Returns *a string*

Name of encoding such as `utf-8`.


### getHeader(name)

Returns *a string or array*

Value is an array when header is duplicated.

  - **name** *string* 

    Case insensitive.


### getHeaders()

Returns *an object*

All headers. Names are lower case and values are arrays when names
are duplicated.



### getStatus()

Returns *an object*

Status code and text if known. May have `code` and/or `text`. May be an empty object.


### getStatusCode()

Returns *a number or undefined*




### getStatusText()

Returns *a string or undefined*




### hasHeader(name)

Returns *a boolean*

`true` when the header is in the request.


  - **name** *string* 

    Case insensitive.


### is(status)

Returns *a boolean*

`true` when status matches.


  - **status** *string or number* 

    Status code or standard status text to test against. Case insensitive.


### removeHeader(name)



Causes a header not to be sent. Causes `hasHeader` method to return `false`.

  - **name** *string* 

    Case insensitive.


### send([options])



Sends a response back to the client - ending the request. A response can also be implicity sent when the request proceeds and
there are no more handlers in the queue.


  - **options** *object* <span class="optional">[optional]</span>

    Sets response options before finishing request and sending response.
    - **status** *number, string or object* <span class="optional">[optional]</span>
  
      <span class="default">Default 200</span>
  
      Can be a status code, standard status text or an object with properties `code` and `text`. See
      methods [`setStatusCode`](#setstatuscodecode), [`setStatusText`](#setstatustexttext),
      and [`setStatus`](#setstatusstatus).
  
    - **headers** *object* <span class="optional">[optional]</span>
  
    - **body** *any* <span class="optional">[optional]</span>
  
    - **encoding** *string* <span class="optional">[optional]</span>
  
      <span class="default">Default utf8</span>
  
    - **finish** *function* <span class="optional">[optional]</span>
  
      Listener for `http.ServerResponse`'s `finish` event.
  


### setBody(body)



The body prior to serialization.

  - **body** *any* 


### setEncoding(encoding)



Name of encoding such as `utf-8`.

  - **encoding** *string* 


### setHeader(name, value)





  - **name** *string* 

  - **value** *string, number or array* 


### setHeaders(headers)



Sets headers from an object. Does **NOT** clear headers. Does override headers.

  - **headers** *object* 


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


### withoutHeader(name)

Returns *a boolean*

`true` when the header is **NOT** in the request.


  - **name** *string* 

    Case insensitive.


