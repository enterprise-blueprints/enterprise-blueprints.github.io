---
id: capability.organization-information
type: capability
title: Organization Information
summary: Provide an authorized view of an organization, such as a company, vendor, grantee, or agency, from the authoritative records, and match new information to it.
status: planned
scope: shared
domain: cross-cutting
relationships: []
operations:
- id: lookup
  title: Lookup
  description: Find organizations that match identifying details.
  takes:
  - identifying details
  returns:
  - candidate matches
- id: get
  title: Get
  description: Return the view of an organization that the requester may see.
  takes:
  - organization ID
  - purpose
  returns:
  - authorized organization view
- id: match
  title: Match
  description: Say whether new details belong to an existing organization.
  takes:
  - organization details
  returns:
  - match
  - confidence
---


