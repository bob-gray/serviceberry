---
id: serializers-and-deserializers
title: Serializers and Deserializers
---

Serializers and deserializers are [handlers](handers) but they have a specific mission. Serializers transform the 
[response](response) body into [response](response) content. Deserializers transform the [request](request) content
into the [request](request) body. The returned or resolved value of each is set to the [response](response) content
and [request](request) body respectively. Because they are [handlers](handlers), they can be asynchronous and produce
errors in the same ways as other [plugins](plugins).

See [`serviceberry-json`](https://www.npmjs.com/package/serviceberry-json) for an example.

Plugins
-------

Because serializers and deserializers have such a focused mission, they are a natural fit for being published as plugins.
Serviceberry loads a [JSON](https://www.npmjs.com/package/serviceberry-json) serializer plugin by default and
[JSON](https://www.npmjs.com/package/serviceberry-json) and [form](https://www.npmjs.com/package/serviceberry-form)
deserializers plugins by default. If a request has a content type of `application/json` or `application/x-www-form-urlencoded`,
its body will automatically be deserialized and if a response has a content type of `application/json` its body will
automatically be serialized. All other serializers you will install and load with your service. The default serializer
and deserializers can be overridden at any node in the [service tree](service-tree) - see [Configuration](#configuration)
below.

Configuration
-------------

Serializer and deserializer [handlers](handlers) are configured by content type as part of the options passed to
[`createTrunk([options])`](serviceberry#createtrunkoptions), [`trunk.on(options, ...handlers)`](trunk#onoptions-handlers),
[`branch.on(options, ...handlers)`](branch#onoptions-handlers). [Request](request) and [response](response) content type
headers are use to find the right serializer and deserializer to use. If no serializer or deserializer is found for the
content type, serialization is skipped. This allows `text/plain` and binary content types to pass through unaltered
without needing serializers or deserializers configured.

For example, a naive CSV serialization plugin could be implemented with the following module.

```javascript
module.exports = {
    contentType: "text/csv",

    deserialize (request) {
        return request.getContent().split("\n").map(row => row.split(","));
    },

    serialize (request, response) {
        return response.getBody().map(row => row.join(",")).join("\n");
    }
};
```

And can be configured at the [trunk](trunk) with the following service code.

```javascript
const {createTrunk} = require("serviceberry"),
    csv = require("csv"); // above module

createTrunk({
    ...

    deserializers: {
        [csv.contentType]: csv.deserialize
    },

    serializers: {
        [csv.contentType]: csv.serialize
    }
});

...
```

Any leaf in this service which consumes or produces `text/csv` would be deserialized and serialized by the example
[handlers](handlers).

Caveats
-------

***Serializers and deserializers [handlers](handlers) receive a [response](response) object without a `send` method.
You cannot call `response.send()` from within a serializer or deserializer. Their only objective is to transform request
and response content or error if they are unable. They are not meant to control the request and response in other ways.***

One other technical detail about deserializers is they are executed prior to any [handlers](handlers)
in the queue but their *result* is not immediate. This is unlikely to be an issue but differs from other [handlers](handlers).
If a deserializer results in an error, the error will only surface if and when `request.getBody()` is called from a
[handler](handlers). This allows deserializer [plugins](plugins) to be asynchronous and deserializing error handling to
be more intuitive because `request.getBody()` is synchronous.

To learn how requests are routed through a [service tree](service-tree), checkout the [next guide](service-tree).
