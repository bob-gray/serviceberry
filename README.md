![Serviceberry](https://serviceberry.js.org/img/serviceberry.svg)

[![CircleCI](https://circleci.com/gh/bob-gray/serviceberry.svg?style=svg)](https://circleci.com/gh/bob-gray/serviceberry)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8df2be2193274eaf29a9/test_coverage)](https://codeclimate.com/github/bob-gray/serviceberry/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/8df2be2193274eaf29a9/maintainability)](https://codeclimate.com/github/bob-gray/serviceberry/maintainability)
[![npm version](https://badge.fury.io/js/serviceberry.svg)](https://badge.fury.io/js/serviceberry)

[Documentation](https://serviceberry.js.org)

A simple HTTP service framework for Node.js

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
