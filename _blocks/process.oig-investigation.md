---
id: process.oig-investigation
type: process
title: OIG Investigation
summary: How an Office of Inspector General takes an allegation from intake through findings and closure.
status: draft
scope: domain
domain: investigations
relationships:
- type: specializes
  target: process.investigation-lifecycle
- type: constrained_by
  target: policy.restricted-case-access
trigger: An allegation of fraud, waste, abuse, or misconduct in the agency's programs reaches the office.
steps:
- id: intake
  title: Intake
  description: Receive an allegation through any channel, acknowledge it, and protect the complainant's identity.
  subprocess: process.oig-complaint-intake
- id: triage
  title: Triage
  description: 'Decide what happens to each allegation: investigate it, refer it to agency management or elsewhere, or close it with a reason.'
  subprocess: process.oig-complaint-triage
- id: investigation
  title: Investigation
  description: 'Plan and carry out an investigation: assign it, gather records and evidence, interview the people involved, and review progress.'
  subprocess: process.oig-investigative-work
- id: findings
  title: Findings
  description: Write and review the report of investigation, approve its findings, and refer the case for prosecution or administrative action.
  subprocess: process.oig-reporting-and-referral
- id: closure
  title: Closure
  description: Close the case once nothing is outstanding, report its results, and manage the closed record.
  subprocess: process.oig-case-closure
outcome: The allegation is resolved with a recorded disposition, and any investigation ends in approved findings, a tracked referral, and a closed record.
requirements:
- id: attach-documents
  title: Accept supporting documents
  statement: Accept documents and other files with a submission or later in the case, and keep them with the case.
  category: functional
  steps:
  - intake
  - investigation
  capabilities:
  - capability.document-management
- id: record-decisions
  title: Record each decision with its reasons
  statement: Record each decision with its outcome, reasons, the evidence relied on, who made it, and when.
  category: functional
  steps:
  - triage
  - findings
  capabilities:
  - capability.case-management
- id: case-type-rules
  title: Let each case type add its own steps and rules
  statement: Let each case type define its own steps, information, deadlines, access rules, and completion criteria on the shared case model.
  category: functional
  capabilities:
  - capability.case-management
  - capability.workflow
- id: case-access-control
  title: Control who may see and act on each case
  statement: Control who may open, view, contribute to, act on, or review each case and each part of it, based on role, case type, and involvement.
  category: nfr
  capabilities:
  - capability.identity
  policies:
  - policy.restricted-case-access
- id: audit-trail
  title: Record who did what, when, and why
  statement: Record every view, change, decision, and disclosure with the person or system that made it, when, and why.
  category: nfr
  capabilities:
  - capability.case-management
- id: accessible-experiences
  title: Accessible experiences for staff and the public
  statement: Make every staff and public experience accessible, including forms, notices, and documents.
  category: constraint
- id: oig-independence
  title: Keep OIG data independent of the agency
  statement: Administer OIG data separately from the agency, so agency staff and administrators can't see or change it.
  category: constraint
  capabilities:
  - capability.identity
  policies:
  - policy.restricted-case-access
---

## Definition

The OIG Investigation is the way an Office of Inspector General handles an allegation, from the moment it arrives to the closed case. It follows the same five steps as the {% include ref.html id="process.investigation-lifecycle" %}, and each step is detailed in its own process, in the office's own roles and terms.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

These apply across the whole investigation. Requirements for a single step are on that step's process.

## Boundaries

This process covers investigations of allegations. Audits, inspections, and evaluations are separate lines of OIG work, with processes of their own.
