HTTP Service Framework
======================

  - URL Routing
      - Path paramaters {}
      - Pattern matching (with some regex capabilites?)
      - 404 when not found

  - HTTP Methods
      - Match against implemented methods
      - Auto simple OPTIONS response with Allow header (can be overridden)
      - Auto HEAD response when GET implemented (can be overridden)
      - 405 when no matching method with Allow header

  - Content Type
      - 415 when request body Content-Type is unsupported
      - Negotiate acceptable response Content-Type (jshttp/accepts or jshttp/negotiator)
      - 406 when no acceptable response Content-Type

  - Authorization
      - Middleware to allow "pluggable strategy"
      - 401 when no credentials or broken credentials
      - 403 when valid credentials and insufficient privileges

  - Parameters
      - Parse path, query string and body parameters
      - Maybe stock middleware to be used or not (how does that work with URL routing and path parameters?)
      - Validation by middleware (maybe stock as above? ...422, 404 if path param)

  - Error Handling
      - Simple try/catch with Error.code and Error.message (custom HttpError class)
      - Chained catch (similar to promises)
      - 500 when plain error
      - Ability to catch framework generated (404, 405, 415, 406, etc...)

  - Caching
      - Stock middleware provided by the framework

  - Logging
      - None provided by framework (look into console and iisnode)
      - Can be accomplished by middleware

API
===
A mix of declarative and imperative
  - Declarative enough for static documentation generation (api-meta)
  - Imperative enough for easy, flexible middleware hooks

Classes
-------
  - Trunk (main entry)
  - Branch (opaque)
  - Leaf (opaque)
  - Request (opaque)
  - Response (opaque)

Interfaces
----------
  - middleware: handler|usable
  - handler: function (request, response)
  - usable: {use: handler}

Trunk(options)
--------------
  - #use(middleware)
      - returns serviceTrunk

  - #catch(handler)
      - returns serviceTrunk

  - #at(options)
      - returns new branch

Branch(node)
------------
  - #use(middleware)
      - returns branch

  - #catch(handler)
      - returns branch

  - #at(path)
      - returns new branch

  - #on(method, handler?)
      - returns new leaf

  - #on(options, handler?)
      - returns new leaf

Leaf(node)
----------
  - #use(middleware)
      - returns leaf

  - #catch(handler)
      - returns leaf

Request(incomingMessage)
------------------------
Always async - middleware and handlers must call `request.proceed()` for the
request to continue

  - #negotiateContent()
      - throws 406 when no acceptable response Content-Type

  - #proceed()
      - continue request 

Response(serverResponse)
------------------------
  - #writeHead()
  - #end()



```javascript
var Service = require("gingko/service"),
    JwtAuth = require("gingko/auth/jwt"),
    products = new Service(
        meta({
            "path": "/products",
            "type": "service",
            "description": "Read and update available products"
        })
    ),
    authorize = new JwtAuth(
        meta({
            "scheme": "Bearer Token",
            "scopes": [
                "admin"
            ]
        })
    ),
    furniture;

products.use(authorize);

furniture = products.at(
    meta({
        "path": "/furniture"
    })
});

furniture.on(
    meta({
        "method": "GET",
        "query": {
            "search": "string",
            "size": "number"
        },
        "produces": [
            "application/json"
        ]
    }),
    get
);

furniture.on(
    meta({
        "method": "POST",
        "consumes": [
            "application/json"
        ],
        "body": {
            [[schema]]
        }
    }),
    post
);

furniture.catch(handleError);

furniture.at({
    meta({
        "path": "/{id}"
    })
);
```