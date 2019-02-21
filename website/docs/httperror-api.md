---
id: httperror
title: HttpError
---

### *class*

*Extends [Error](https://nodejs.org/dist/latest-v10.x/docs/api/errors.html#errors_class_error)*

An HTTP specific error class.



[new HttpError([error[, status[, headers]]])](#constructor)

  - **error** *error or string* <span class="optional">[optional]</span>

    Error object or error message.

  - **status** *object or number* <span class="optional">[optional]</span>
    - **code** *number* <span class="optional">[optional]</span>
  
    - **text** *string* <span class="optional">[optional]</span>
  

  - **headers** *object* <span class="optional">[optional]</span>


--------------------------------------------------

  - [originalError *Error*](#originalerror)

  - [clearHeaders()](#clearheaders)
  - [getHeader(name)](#getheadername)
  - [getHeaders()](#getheaders)
  - [getMessage()](#getmessage)
  - [getStatus()](#getstatus)
  - [getStatusCode()](#getstatuscode)
  - [getStatusText()](#getstatustext)
  - [hasHeader(name)](#hasheadername)
  - [is(status)](#isstatus)
  - [removeHeader(name)](#removeheadername)
  - [setHeader(name, value)](#setheadername-value)
  - [setHeaders(headers)](#setheadersheaders)
  - [setStatus(status)](#setstatusstatus)
  - [setStatusCode(code)](#setstatuscodecode)
  - [setStatusText(text)](#setstatustexttext)
  - [withoutHeader(name)](#withoutheadername)

Properties
----------

### originalError



Error passed into constructor

Methods
-------

### clearHeaders()



Removes all headers.


### getHeader(name)

Returns *a string or array*

Value is an array when header is duplicated.

  - **name** *string* 

    Case insensitive.


### getHeaders()

Returns *an object*

All headers. Names are lower case and values are arrays when names
are duplicated.



### getMessage()

Returns *a string*




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


