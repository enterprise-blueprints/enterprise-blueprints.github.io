---
id: capability.case-management
type: capability
title: Case Management
summary: Manage matters from initiation through resolution and closure.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: information.case
  - type: constrained_by
    target: policy.restricted-case-access
---

## Definition

Case Management is the organization's ability to open, track, assign, progress, and close cases consistently. It keeps the authoritative state of each case and makes that state available to the people, processes, and agents that need it.

## Responsibilities

- Open a case with a stable identity and an initial classification.
- Record status changes, assignments, and key events as a durable history.
- Maintain participants and their roles on the case.
- Link a case to its related documents and records.
- Support closure, including recording the outcome and the reason for closure.
- Apply the access restrictions that the case's classification requires.

## Boundaries

Case Management holds the state of a case. It doesn't define the steps of any particular mission's process; those belong to process blocks that *use* this capability. It also doesn't store document content, which is the job of Document Management.

A capability is a responsibility, not a product. One system may provide Case Management for several missions, or a mission may combine more than one system to provide it.

## Considerations

- Agree on case types and status values early. They drive reporting and automation.
- Keep the case history append-only, so decisions can be reconstructed later.
- Expose case state through governed interfaces, so new experiences and agents don't copy it.
