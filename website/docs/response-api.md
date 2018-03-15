---
id: response
title: Response
---

### *class*

This object is created internally by Serviceberry and passed as the second argument to handler functions.
It is a wrapper object around `http.ServerResponse`.




Methods
-------

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
  - [send(status, headers, body)](#sendstatus-headers-body)


Reference
---------

### is(status)

Returns *a boolean*



  - **status** *string|number* 


### getStatus()

Returns *an object*




### getStatusCode()

Returns *a number*




### getStatusText()

Returns *a string*




### setStatus(status)





  - **status** *object|number* 
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

  - **value** *string|number|array* 


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




### send(status, headers, body)





  - **status** *object|number* 
    - **code** *number* 
  
    - **text** *string* 
  

  - **headers** *object* 

  - **body** *any* 



