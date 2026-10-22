---
id: capability.workflow
type: capability
title: Workflow
summary: 'Coordinate tasks across people and systems: who does what, by when, and what happens when it''s late.'
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.notification
- type: depends_on
  target: capability.identity
operations:
- id: create
  title: Create
  description: Create a task with an assignee and a due date.
  takes:
  - work
  - assignee
  - due date
  - related record
  returns:
  - task ID
- id: assign
  title: Assign
  description: Assign or reassign a task, keeping its history.
  takes:
  - task ID
  - assignee
  returns:
  - assignment
- id: complete
  title: Complete
  description: Record a task's result.
  takes:
  - task ID
  - result
  returns:
  - completed task
- id: escalate
  title: Escalate
  description: Raise an overdue or stalled task to the right person.
  takes:
  - task ID
  - reason
  returns:
  - escalation
---


