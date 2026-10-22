---
id: capability.payment
type: capability
title: Payment
summary: Take and make payments, and report their status, under the enterprise's financial controls.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.approval
- type: depends_on
  target: capability.identity
operations:
- id: request
  title: Request
  description: Request a payment to or from a person or organization.
  takes:
  - payer or payee
  - amount
  - purpose
  - approval
  returns:
  - payment ID
- id: get-status
  title: Get status
  description: Report whether a payment is pending, made, or failed.
  takes:
  - payment ID
  returns:
  - payment status
---


