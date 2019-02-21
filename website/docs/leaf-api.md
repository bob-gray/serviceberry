---
id: leaf
title: Leaf
---

### *class*


Created by calling .on() method on the service [trunk](trunk.html) or any service [branch](branch.html).



--------------------------------------------------

  - [cope(...handlers)](#copehandlers)
  - [use(...handlers)](#usehandlers)
  - [waitFor(setup)](#waitforsetup)


Methods
-------

### cope(...handlers)

Returns *this leaf*

Adds error [handlers](handlers.html) to this leaf.

  - **handlers** *function or object* 

    See [Handlers](handlers.html) guide.


### use(...handlers)

Returns *this leaf*

Adds plugin [handlers](handlers.html) to this leaf.

  - **handlers** *function or object* 

    See [Handlers](handlers.html) guide.


### waitFor(setup)

Returns *this leaf*

A hook for asynchronous setup tasks. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 


