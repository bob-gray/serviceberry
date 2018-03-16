---
id: httperror
title: HttpError
---

### *class*

Extends Error and several methods for working with the status and headers
of the resulting response.




Methods
-------

  - [getMessage()](#getmessage)
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

Properties
----------

  - [originalError *Error*](#originalerror)

Reference
---------

### getMessage()

Returns *a string*




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







### originalError

Error passed into constructor
 

