---
id: capability.identity
type: capability
title: Identity
summary: Establish who or what is acting, whether staff, a member of the public, a partner, or an agent, and with what level of assurance.
status: planned
scope: shared
domain: cross-cutting
relationships: []
operations:
- id: authenticate
  title: Authenticate
  description: Sign a person, system, or agent in.
  takes:
  - credentials
  returns:
  - authenticated identity
  - assurance level
- id: verify
  title: Verify
  description: Check evidence that a person is who they claim to be.
  takes:
  - person details
  - evidence
  returns:
  - verification result
  - assurance level
- id: get-attributes
  title: Get attributes
  description: Return the attributes of an identity that a consumer may use, such as role and organization.
  takes:
  - identity
  - purpose
  returns:
  - attributes
---


