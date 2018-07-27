---
id: leaf
title: Leaf
---

### *class*

Created by calling `.on()` method on the service trunk or any service [branch](branch.html).



Methods
-------

  - [use(handler)](#usehandler)
  - [catch(handler)](#catchhandler)
  - [waitFor(setup)](#waitforsetup)


Reference
---------

### use(handler)

Returns *this leaf*

Adds a plugin [handler](handlers.html) to this leaf.

  - **handler** *function or object* 


### catch(handler)

Returns *this leaf*

Adds an error [handler](handlers.html) to this leaf.

  - **handler** *function or object* 


### waitFor(setup)

Returns *this branch*

A hook for asynchronous setup task. The service won't be started until all
asynchronous setup is complete.


  - **setup** *promise* 



