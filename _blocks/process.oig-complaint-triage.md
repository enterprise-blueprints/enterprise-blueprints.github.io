---
id: process.oig-complaint-triage
type: process
title: OIG Complaint Triage
summary: 'Decide what happens to each allegation: investigate it, refer it to agency management or elsewhere, or close it with a reason.'
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.search
- type: uses
  target: capability.case-management
- type: uses
  target: capability.workflow
- type: uses
  target: capability.notification
- type: uses
  target: capability.document-management
trigger: A recorded allegation is ready for triage.
steps:
- id: check-related
  title: Check for existing and related cases
  role: Hotline and intake staff
  description: Search earlier matters, cases, and participants for the same or a related matter.
  uses:
  - capability.search
  - capability.case-management
  decisions:
  - decision: Is this a new matter, an update to an existing case, or related to one?
    accountable: Hotline and intake staff
- id: triage-allegation
  title: Apply the triage criteria
  role: Hotline and intake staff
  description: Check jurisdiction, credibility, seriousness, and priority against the office's written criteria.
  uses:
  - capability.case-management
  - capability.workflow
  decisions:
  - decision: Is it within our jurisdiction, and how serious and credible is it?
    accountable: Hotline and intake staff
- id: request-information
  title: Request missing information
  role: Hotline and intake staff
  description: Ask the initiator or another party for what is missing, and record who must respond and by when.
  uses:
  - capability.notification
  - capability.workflow
  waits: The response to the request.
- id: decide-disposition
  title: Decide the disposition
  role: Hotline and intake staff
  description: Open an investigation, refer to agency management for action, refer to another office of inspector general or agency, or close with no action, and record the reason.
  uses:
  - capability.case-management
  - capability.workflow
  decisions:
  - decision: Investigate, refer to management, refer elsewhere, or close?
    accountable: Hotline and intake staff
- id: refer-to-management
  title: Refer to agency management
  role: Hotline and intake staff
  description: Send the complaint to agency management for review and action, with a due date for a response.
  uses:
  - capability.document-management
  - capability.notification
- id: track-management-response
  title: Track management's response
  role: Hotline and intake staff
  description: Follow up until management responds, and decide whether the response resolves the complaint.
  uses:
  - capability.workflow
  - capability.notification
  decisions:
  - decision: Does the response resolve the complaint?
    accountable: Hotline and intake staff
  waits: Agency management's response.
- id: close-case
  title: Record the outcome and close
  role: Hotline and intake staff
  description: Record the final outcome and close the case. Closing keeps the full history.
  uses:
  - capability.case-management
outcome: Every allegation has a recorded disposition, and referrals to agency management are tracked until they're resolved.
requirements:
- id: link-cases
  title: Link related cases
  statement: Link related matters and cases while each keeps its own history.
  category: functional
  steps:
  - check-related
  - decide-disposition
  capabilities:
  - capability.case-management
- id: record-routing
  title: Record each routing decision and its reason
  statement: Record whether a matter opened a case, updated one, was referred, or needed no action, with the reason and who decided.
  category: functional
  steps:
  - decide-disposition
  capabilities:
  - capability.case-management
  - capability.workflow
- id: configurable-triage
  title: Apply configurable triage criteria
  statement: Apply the office's written triage criteria for jurisdiction, credibility, seriousness, and priority, and record the result for each allegation.
  category: functional
  steps:
  - triage-allegation
  - decide-disposition
  capabilities:
  - capability.case-management
  - capability.workflow
- id: track-management-referrals
  title: Track referrals to agency management
  statement: Refer complaints to agency management with a due date for a response, track the response, and follow up when it is late.
  category: functional
  steps:
  - refer-to-management
  - track-management-response
  capabilities:
  - capability.workflow
  - capability.notification
- id: subject-search
  title: Search allegations, cases, and subjects across offices
  statement: Search allegations, cases, subjects, and entities across offices and years, and flag possible related cases when a new allegation or case is created.
  category: functional
  steps:
  - check-related
  capabilities:
  - capability.search
---

## Definition

OIG Complaint Triage is part of the {% include ref.html id="process.oig-investigation" %}. Decide what happens to each allegation: investigate it, refer it to agency management or elsewhere, or close it with a reason.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
