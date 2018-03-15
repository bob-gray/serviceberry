---
id: request
title: Request
---

### *class*

This object is created internally by Serviceberry and passed as the first argument to handler functions.
It is a wrapper object around `http.IncomingMessage`.




Methods
-------

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

  - [incomingMessage *incomingMessage*](#incomingmessage)

Reference
---------

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



  - **name** ** 


### getContent()

Returns *a buffer*




### getBody()

Returns *unserialized body*





### incomingMessage

 

