![Serviceberry](https://raw.githubusercontent.com/bob-gray/serviceberry/master/website/static/img/serviceberry.svg)

[![CircleCI](https://circleci.com/gh/bob-gray/serviceberry.svg?style=svg)](https://circleci.com/gh/bob-gray/serviceberry)

[Documentation](https://bob-gray.github.io/serviceberry) [![JS.ORG](http://logo.js.org/dark_tiny.png)](https://js.org)

A simple HTTP service framework for Node.js

```javascript
require("serviceberry").createTrunk().on("*", () => "Hello World!");
```