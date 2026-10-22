---
id: capability.approval
type: capability
title: Approval
summary: Route a decision to a person with the authority to make it, and record the decision, the reasons, and who made it.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.workflow
- type: depends_on
  target: capability.identity
operations:
- id: request
  title: Request
  description: Ask for a decision from someone with the authority to make it.
  takes:
  - subject
  - decision needed
  - criteria
  - supporting evidence
  returns:
  - request ID
- id: decide
  title: Decide
  description: Record an approver's decision and reasons.
  takes:
  - request ID
  - outcome
  - reasons
  returns:
  - decision ID
- id: get-status
  title: Get status
  description: Report where a request stands and who it is waiting on.
  takes:
  - request ID
  returns:
  - status
---


