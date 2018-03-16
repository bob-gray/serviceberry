---
id: response
title: Response
---

### *class*

This object is created internally by Serviceberry and passed as the second argument to [handler](handlers.html) functions.
It is a wrapper object around Node's [`http.ServerResponse`](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_serverresponse).




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
  - [setHeaders(headers)](#setheadersheaders)
  - [setHeader(name, value)](#setheadername-value)
  - [hasHeader(name)](#hasheadername)
  - [withoutHeader(name)](#withoutheadername)
  - [removeHeader(name)](#removeheadername)
  - [clearHeaders()](#clearheaders)
  - [getBody()](#getbody)
  - [setBody(body)](#setbodybody)
  - [getEncoding()](#getencoding)
  - [setEncoding(encoding)](#setencodingencoding)
  - [getContentType()](#getcontenttype)
  - [getContent()](#getcontent)


Reference
---------

### send([options])



Sends a response back to the client. A response can also be implicity sent when the request proceeds and
there are no more handlers in the queue.


  - **options** *object* [optional]

    Sets response options before finishing request and sending response.
 
    - **status** *number or object* [optional]
  
    - **headers** *object* [optional]
  
    - **body** *any* [optional]
  
    - **encoding** *string* [optional]
  
    - **finish** *function* [optional]
  
      Listener for `http.ServerResponse` event `finish`
   
  


### is(status)

Returns *a boolean*



  - **status** *string or number* 


### getStatus()

Returns *an object*




### getStatusCode()

Returns *a number*




### getStatusText()

Returns *a string*




### setStatus(status)





  - **status** *object or number* 
    - **code** *number* 
  
    - **text** *string* 
  


### setStatusCode(code)





  - **code** *number* 


### setStatusText(text)





  - **text** *string* 


### getHeaders()

Returns *an object*




### getHeader(name)

Returns *a string or array*



  - **name** *string* 


### setHeaders(headers)





  - **headers** *object* 


### setHeader(name, value)





  - **name** *string* 

  - **value** *string or number or array* 


### hasHeader(name)

Returns *a boolean*



  - **name** *string* 


### withoutHeader(name)

Returns *a boolean*



  - **name** *string* 


### removeHeader(name)





  - **name** *string* 


### clearHeaders()






### getBody()

Returns *unserialized body*




### setBody(body)





  - **body** *any* 


### getEncoding()

Returns *a string*




### setEncoding(encoding)





  - **encoding** *string* 


### getContentType()

Returns *a string*




### getContent()

Returns *a buffer*





