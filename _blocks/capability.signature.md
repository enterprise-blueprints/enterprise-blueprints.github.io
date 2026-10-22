---
id: capability.signature
type: capability
title: Signature
summary: Collect signatures on documents and decisions, and let anyone with access verify them later.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.identity
- type: depends_on
  target: capability.document-management
operations:
- id: request
  title: Request
  description: Ask one or more people to sign a document.
  takes:
  - document ID
  - signers
  - order
  returns:
  - signature request ID
- id: verify
  title: Verify
  description: Confirm who signed a document and that it hasn't changed since.
  takes:
  - document ID
  returns:
  - verification result
---


