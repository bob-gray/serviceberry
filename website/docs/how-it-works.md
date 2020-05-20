---
id: how-it-works
title: How It Works
---

This guide is an overview of how Serviceberry works internally. This knowledge is not a
prerequisite to building Serviceberry services, but it could be helpful and may be
of some interest.

Serviceberry can be broken down into three phases.

  - [Phase 1:](#phase-1) You build your service tree and start your service using Serviceberry's API
  - [Phase 2:](#phase-2) Serviceberry walks your service tree and builds a queue of [handlers](handlers) on each request
  - [Phase 3:](#phase-3) Serviceberry calls your handlers one after another giving each control of the request

Phase 1
-------

*You calling Serviceberry*

*Phase 1* happens only once each time your service is started. It would include code such as requiring
[Serviceberry](serviceberry), calling [`createTrunk([options])`](serviceberry#createtrunk-options-) and using the
[trunk](trunk), [branches](branch), and [leaves](leaf) to build a [tree](service-tree).

Phase 2
-------

*A client calling Serviceberry*

After [phase 1](#phase-1), your service is listening for incoming requests from clients. *Phase 2* happens once
per request. When a request is made Serviceberry walks the service [tree](service-tree) and builds a queue of
[handlers](handlers). None of your code executes in this phase. This work is done entirely by Serviceberry.

Phase 3
-------

*Serviceberry calling your handlers*

*Phase 3* begins immediately after [phase 2](#phase-2) and likewise happens once per request. Serviceberry
runs through the [handlers](handlers) queue and passes control of the request to each handler as it's called.
The request ends when one of the [handlers](handlers) sends the response or Serviceberry reaches
the end of the queue and implicitly sends the response using [request.latestResult](request#latestresult).

To learn about all the classes, properties, and methods available in the API, checkout the API Reference starting with
the main [Serviceberry](serviceberry) object.
