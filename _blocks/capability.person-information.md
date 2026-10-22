---
id: capability.person-information
type: capability
title: Person Information
summary: Provide an authorized view of a person from the authoritative records, and match new information to a person the enterprise already knows.
status: planned
scope: shared
domain: cross-cutting
relationships: []
operations:
- id: lookup
  title: Lookup
  description: Find people who match identifying details.
  takes:
  - identifying details
  - purpose
  returns:
  - candidate matches
- id: get
  title: Get
  description: Return the view of a person that the requester may see for a stated purpose.
  takes:
  - person ID
  - purpose
  returns:
  - authorized person view
- id: match
  title: Match
  description: Say whether new details belong to an existing person, and how confident the match is.
  takes:
  - person details
  returns:
  - match
  - confidence
---


