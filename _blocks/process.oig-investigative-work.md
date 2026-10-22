---
id: process.oig-investigative-work
type: process
title: OIG Investigative Work
summary: 'Plan and carry out an investigation: assign it, gather records and evidence, interview the people involved, and review progress.'
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.workflow
- type: uses
  target: capability.reporting
- type: uses
  target: capability.document-management
- type: uses
  target: capability.notification
- type: uses
  target: capability.scheduling
trigger: The office decides to open an investigation.
steps:
- id: assign-owner
  title: Assign an owner
  role: Special Agent in Charge
  description: Give the case one accountable owner, considering workload and expertise.
  uses:
  - capability.workflow
  - capability.reporting
  decisions:
  - decision: Who owns this case?
    accountable: Special Agent in Charge
- id: plan-investigation
  title: Write the investigative plan
  role: Special agents
  description: Set out the allegations, subjects, evidence needed, and investigative steps.
  uses:
  - capability.workflow
  - capability.document-management
- id: request-records
  title: Request records and issue subpoenas
  role: Special agents
  description: Request records from agencies, companies, and partners, and issue subpoenas with counsel's review.
  uses:
  - capability.workflow
  - capability.notification
  - capability.document-management
  waits: Agencies, companies, and partners responding to requests and subpoenas.
- id: conduct-interviews
  title: Interview witnesses and subjects
  role: Special agents
  description: Plan and conduct interviews, and write up each memorandum of interview in the case file.
  uses:
  - capability.scheduling
  - capability.document-management
  waits: Witness and subject availability.
- id: collect-evidence
  title: Collect and log evidence
  role: Special agents
  description: Collect physical and digital evidence, log each item, and record every transfer in its chain of custody.
  uses:
  - capability.document-management
- id: consult-prosecutor
  title: Consult a prosecutor
  role: Special agents
  description: Talk with a prosecutor about a case with criminal potential, before referral.
  decisions:
  - decision: Is the case worth pursuing criminally, and what would it need?
    accountable: Special agents
- id: supervisory-review
  title: Review the case
  role: Special Agent in Charge
  description: A supervisor reviews the evidence, plan, and direction of the case on a schedule, and records the results and follow-up actions.
  uses:
  - capability.workflow
  - capability.reporting
  decisions:
  - decision: Continue, change direction, or close?
    accountable: Special Agent in Charge
outcome: The evidence is gathered and logged, and the case is ready for its report.
requirements:
- id: one-accountable-owner
  title: Every open case has one accountable owner
  statement: Give every open case one accountable owner at all times, and record each change of owner.
  category: functional
  steps:
  - assign-owner
  capabilities:
  - capability.workflow
- id: assign-tasks
  title: Assign tasks with due dates
  statement: Assign tasks to people and teams with due dates, and show each task's status on the case.
  category: functional
  steps:
  - plan-investigation
  capabilities:
  - capability.workflow
- id: case-record
  title: Keep the case's information together
  statement: Keep the case's documents, notes, interactions, tasks, and decisions in one record that authorized staff can review in order.
  category: functional
  steps:
  - request-records
  - conduct-interviews
  capabilities:
  - capability.case-management
  - capability.document-management
- id: schedule-meetings
  title: Schedule meetings with participants
  statement: Schedule interviews and meetings with participants, send reminders, and record what was discussed.
  category: functional
  steps:
  - conduct-interviews
  capabilities:
  - capability.scheduling
  - capability.notification
- id: track-external-requests
  title: Track records requests and subpoenas
  statement: Track records requests, subpoenas, and partner actions for each case with due dates and status, and alert the investigator and supervisor when one is overdue.
  category: functional
  steps:
  - request-records
  capabilities:
  - capability.workflow
  - capability.notification
- id: interview-memoranda
  title: Write up interviews in the case file
  statement: Draft memoranda of interview and activity records in the case file from templates, including from the field.
  category: functional
  steps:
  - conduct-interviews
  capabilities:
  - capability.document-management
  - capability.case-management
- id: field-access
  title: Work securely from the field
  statement: Let investigators work on their cases securely from the field, including on mobile devices.
  category: nfr
  steps:
  - conduct-interviews
  - collect-evidence
  capabilities:
  - capability.identity
- id: chain-of-custody
  title: Record each evidence item's chain of custody
  statement: 'Record each evidence item with a complete chain of custody: who collected it, every transfer, and where it is now.'
  category: functional
  steps:
  - collect-evidence
  capabilities:
  - capability.document-management
- id: digital-evidence-integrity
  title: Protect the integrity of digital evidence
  statement: Store digital evidence with integrity checks, and prevent changes to it.
  category: nfr
  steps:
  - collect-evidence
  capabilities:
  - capability.document-management
- id: scheduled-reviews
  title: Schedule and record supervisory reviews
  statement: Schedule periodic supervisory reviews for each case, record the findings and follow-up actions, and show overdue reviews.
  category: functional
  steps:
  - supervisory-review
  capabilities:
  - capability.workflow
  - capability.reporting
- id: record-consultations
  title: Record prosecutor consultations
  statement: 'Record each consultation with a prosecutor against the case: when, with whom, and what was advised.'
  category: functional
  steps:
  - consult-prosecutor
  capabilities:
  - capability.case-management
---

## Definition

OIG Investigative Work is part of the {% include ref.html id="process.oig-investigation" %}. Plan and carry out an investigation: assign it, gather records and evidence, interview the people involved, and review progress.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
