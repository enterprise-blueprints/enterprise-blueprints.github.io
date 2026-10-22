---
id: capability.address-validation
type: capability
title: Address Validation
summary: Check that an address exists and is deliverable, and return it in a standard form.
status: planned
scope: shared
domain: cross-cutting
relationships: []
operations:
- id: validate
  title: Validate
  description: Check and standardize an address.
  takes:
  - address
  returns:
  - standardized address
  - validation result
---


