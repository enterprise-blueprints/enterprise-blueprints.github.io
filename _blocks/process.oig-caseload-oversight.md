---
id: process.oig-caseload-oversight
type: process
title: OIG Caseload Oversight
summary: Watch workload and progress across the office's cases, and resolve delays before they become backlogs.
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.reporting
- type: uses
  target: capability.workflow
- type: uses
  target: capability.notification
trigger: Supervisors review caseloads, as they do regularly.
steps:
- id: monitor-workload
  title: Monitor workload and progress
  role: Special Agent in Charge
  description: Watch who owns what, how old each case is, and what each case is waiting on.
  uses:
  - capability.reporting
- id: resolve-delay
  title: Resolve a delay or escalation
  role: Special Agent in Charge
  description: Step in when a case or task stalls, and record what was done.
  uses:
  - capability.workflow
  - capability.notification
  decisions:
  - decision: Escalate, reassign, add help, or wait?
    accountable: Special Agent in Charge
outcome: Work is balanced across investigators, and stalled cases have a decision about what happens next.
requirements:
- id: workload-visibility
  title: Show ownership, outstanding work, and case age
  statement: Show supervisors who owns each case, how old it is, what it's waiting on, and each person's workload.
  category: functional
  steps:
  - monitor-workload
  capabilities:
  - capability.reporting
- id: flag-stalled-work
  title: Flag stalled and overdue work
  statement: Flag cases and tasks that are overdue or haven't moved within an expected time, and notify the owner and supervisor.
  category: functional
  steps:
  - monitor-workload
  - resolve-delay
  capabilities:
  - capability.workflow
  - capability.notification
---

## Definition

OIG Caseload Oversight is part of the {% include ref.html id="process.oig-investigation" %}. Watch workload and progress across the office's cases, and resolve delays before they become backlogs.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
