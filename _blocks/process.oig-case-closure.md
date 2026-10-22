---
id: process.oig-case-closure
type: process
title: OIG Case Closure
summary: Close the case once nothing is outstanding, report its results, and manage the closed record.
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.workflow
- type: uses
  target: capability.case-management
- type: uses
  target: capability.reporting
- type: uses
  target: capability.document-management
trigger: Work on the case is finished.
steps:
- id: check-completion
  title: Check for outstanding work
  role: Special agents
  description: Confirm that tasks, actions, and communications are complete, or record what continues as follow-up.
  uses:
  - capability.workflow
  decisions:
  - decision: Is the case ready to close?
    accountable: Special agents
- id: close-case
  title: Record the outcome and close
  role: Special agents
  description: Record the final outcome and close the case. Closing keeps the full history.
  uses:
  - capability.case-management
- id: report-results
  title: Report results
  role: Data analytics and reporting staff
  description: Count the investigation's results for the semiannual report and other reporting.
  uses:
  - capability.reporting
- id: manage-record
  title: Manage the closed record
  role: Records management officer
  description: Retain, restrict, transfer, or dispose of the case record according to its schedule.
  uses:
  - capability.document-management
outcome: The case is closed, its results are counted, and the record is kept for as long as it must be.
requirements:
- id: check-before-closing
  title: Check for outstanding work before closing
  statement: Show open tasks, actions, and communications before a case closes, and record any that continue as follow-up.
  category: functional
  steps:
  - check-completion
  - close-case
  capabilities:
  - capability.workflow
- id: retain-records
  title: Retain and dispose of records by schedule
  statement: Apply a records schedule to each case, keep the record after closure, and dispose of it or transfer it only as the schedule allows.
  category: constraint
  steps:
  - manage-record
  - close-case
  capabilities:
  - capability.document-management
- id: semiannual-statistics
  title: Report statistics from case data
  statement: Produce semiannual report statistics directly from case data with consistent categories, without manual reconciliation.
  category: functional
  steps:
  - report-results
  capabilities:
  - capability.reporting
---

## Definition

OIG Case Closure is part of the {% include ref.html id="process.oig-investigation" %}. Close the case once nothing is outstanding, report its results, and manage the closed record.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
