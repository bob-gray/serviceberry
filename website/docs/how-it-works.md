---
id: how-it-works
title: How It Works
---

This guide is an overview of how Serviceberry works internally. This knowledge is not a
prerequisite to building Serviceberry services, but it could be helpful and may be
of some interest.

Serviceberry can be broken down into three phases.

  - [Phase 1:](#phase1) You build your service tree and start your service using Serviceberry's API
  - [Phase 2:](#phase2) Serviceberry walks your service tree and builds a queue of [handlers](handlers.html)
  - [Phase 3:](#phase3) Serviceberry calls your handlers one after another giving each control of the request

Phase 1
-------

*You calling Serviceberry*

Phase 1 happens only once each time your service is started.
It would include code such as requiring Serviceberry,
calling [`createTrunk()`](serviceberry.html#createtrunk-options) and using the [trunk](trunk.html), [branches](branch.html) and [leaves](leaf.html)
to build a tree of [handlers](handlers.html).

Phase 2
-------

*A client calling Serviceberry*

After phase 1, your service is listening for incoming requests from clients.
Phase 2 happens once for each of those requests. When a request is made Serviceberry walks the
service tree and builds a queue of handlers. None of
your code executes in this phase. This work is done soley by Serviceberry.

Phase 3
-------

*Serviceberry calling your handlers*

Phase 3 begins immediately after phase 2 and likewise happens once per request. Serviceberry
runs through the handler queue and passes control of the request to each handler as it's called.
The request ends when one of the handlers decides to send a response. If Serviceberry reaches
the end of the queue an implicit response will be sent and the request ended.
