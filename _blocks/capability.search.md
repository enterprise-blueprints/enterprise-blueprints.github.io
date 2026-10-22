---
id: capability.search
type: capability
title: Search
summary: Find records, documents, people, and organizations across the enterprise, limited to what the requester may see.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.identity
operations:
- id: query
  title: Query
  description: Search within a scope, returning only results the requester may see.
  takes:
  - terms
  - scope
  returns:
  - results
- id: find-related
  title: Find related
  description: Suggest records that may be related to a given one.
  takes:
  - record
  returns:
  - possible matches
---


