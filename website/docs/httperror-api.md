---
id: httperror
title: HttpError
---

### *class*

Extends [Error](https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_class_error) - adding
several methods for working with the status and headers of the resulting response.



[new HttpError(error, status, headers)](#constructor)

  - **error** *error or string* [optional]

    Error object or error message. 

  - **status** *object or number* [optional]
    - **code** *number* [optional]
  
    - **text** *string* [optional]
  

  - **headers** *object* [optional]


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
  - [hasHeader(name)](#hasheadername)
  - [withoutHeader(name)](#withoutheadername)
  - [setHeaders(headers)](#setheadersheaders)
  - [setHeader(name, value)](#setheadername-value)
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



### originalError

Error passed into constructor 

