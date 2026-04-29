![Serviceberry](https://serviceberry.js.org/img/serviceberry.svg)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/bob-gray/serviceberry/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/bob-gray/serviceberry/tree/master)
[![Code Coverage](https://qlty.sh/gh/bob-gray/projects/serviceberry/coverage.svg)](https://qlty.sh/gh/bob-gray/projects/serviceberry)
[![Maintainability](https://qlty.sh/gh/bob-gray/projects/serviceberry/maintainability.svg)](https://qlty.sh/gh/bob-gray/projects/serviceberry)
[![npm version](https://badge.fury.io/js/serviceberry.svg)](https://badge.fury.io/js/serviceberry)

[Documentation](https://serviceberry.js.org)

A focused HTTP service framework for Node.js

```javascript
require("serviceberry").createTrunk().on("*", () => "Hello World!");
```

Handlers
--------

Serializers, deserializer, plugins and endpoints all handle requests in the same way.


Plugins
-------

Powerful plugins that are easy to use and easy to create.

Tree
----

Flexible tree structure reduces duplication by allowing plugins at any node.

The Best API for Building HTTP APIs
-----------------------------------

Serviceberry is designed to be flexible, extensible and easy to use. It doesn't mandate
boilerplate or configuration or demand to marry your application. It helps you do HTTP well by facilitating
a thin HTTP frontend to your backend where statuses, methods and headers have meaning.
