---
id: leaf
title: Leaf
---

### *class*


Created by calling .on() method on the service [trunk](trunk) or any service [branch](branch).



--------------------------------------------------

  - [cope(...handlers)](#copehandlers)
  - [use(...handlers)](#usehandlers)
  - [waitFor(...setup)](#waitforsetup)


Methods
-------

### cope(...handlers)

Returns *this leaf*

Adds error [handlers](handlers) to this leaf.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### use(...handlers)

Returns *this leaf*

Adds plugin [handlers](handlers) to this leaf.

  - **handlers** *function or object* 

    See [Handlers](handlers) guide.


### waitFor(...setup)

Returns *this leaf*

A hook for asynchronous setup tasks. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 


