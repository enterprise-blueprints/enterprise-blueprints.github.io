---
id: capability.reporting
type: capability
title: Reporting
summary: Provide measures and views of the work from authoritative data, such as workload, age, status, and results, with consistent definitions.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.identity
operations:
- id: get
  title: Get
  description: Return a measure or view, filtered to what the requester may see.
  takes:
  - measure
  - filters
  returns:
  - results
- id: schedule
  title: Schedule
  description: Produce a report on a schedule and deliver it.
  takes:
  - measure
  - filters
  - schedule
  - recipients
  returns:
  - schedule ID
---


