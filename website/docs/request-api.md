---
id: request
title: Request
---

### *class*

This object is created internally by Serviceberry and passed as the first argument to [handler](handlers.html) functions.
It is a wrapper object around Node's [`http.IncomingMessage`](https://nodejs.org/dist/latest-v8.x/docs/api/).




Methods
-------

  - [proceed([result])](#proceedresult)
  - [fail(error[, status[, headers]])](#failerror-status-headers)
  - [getMethod()](#getmethod)
  - [getUrl()](#geturl)
  - [getAccept()](#getaccept)
  - [getContentType()](#getcontenttype)
  - [getEncoding()](#getencoding)
  - [getHeaders()](#getheaders)
  - [getHeader(name)](#getheadername)
  - [hasHeader(name)](#hasheadername)
  - [withoutHeader(name)](#withoutheadername)
  - [getParams()](#getparams)
  - [getParam(name)](#getparamname)
  - [getPathParams()](#getpathparams)
  - [getPathParam(name)](#getpathparamname)
  - [getQueryParams()](#getqueryparams)
  - [getQueryParam(name)](#getqueryparamname)
  - [getContent()](#getcontent)
  - [getBody()](#getbody)

Properties
----------

  - [incomingMessage *http.IncomingMessage*](#incomingmessage)
  - [error *HttpError*](#error)
  - [latestResult *any*](#latestresult)

Reference
---------

### proceed([result])



Call this method to transfer control of the request to the next handler. See [handlers](handlers.html) guide.


  - **result** *any* [optional]

    Set as [`latestResult`](#latestresult) property with the exception of when a request is being serialized
or deserialized. Then the result is the response content or request body respectively.
 


### fail(error[, status[, headers]])



Call this method to transfer control of the request the next handler. See [handlers](handlers.html) guide.


  - **error** *string or error* 

    Can be a error message or an error object.
 

  - **status** *number or object* [optional]

    Can be a status code or an object with properties `code` and `text`.
 **Default:** 500

  - **headers** *object* [optional]

    Response headers if fail results in the end of the request. These headers are not set on the
response if a catch handlers the fail and the request continues.
 


### getMethod()

Returns *a string*




### getUrl()

Returns *a string*




### getAccept()

Returns *a string*




### getContentType()

Returns *a string*




### getEncoding()

Returns *a string*




### getHeaders()

Returns *an object*




### getHeader(name)

Returns *a string or array*



  - **name** *string* 


### hasHeader(name)

Returns *a boolean*



  - **name** *string* 


### withoutHeader(name)

Returns *a boolean*



  - **name** *string* 


### getParams()

Returns *an object*




### getParam(name)

Returns *a string*



  - **name** *string* 


### getPathParams()

Returns *an object*




### getPathParam(name)

Returns *a string*



  - **name** *string* 


### getQueryParams()

Returns *an object*




### getQueryParam(name)

Returns *a string*



  - **name** *string* 


### getContent()

Returns *a buffer*




### getBody()

Returns *unserialized body*





### incomingMessage

The preferred way to interact with a request is the methods above, however if a need arises
that is not addressed with an existing method, then direct access to the
[`http.IncomingMessage`](https://nodejs.org/dist/latest-v8.x/docs/api/) is available here.
 

### error

Available within catch handlers. 

### latestResult

The resolved result of the latest finished handler. 

