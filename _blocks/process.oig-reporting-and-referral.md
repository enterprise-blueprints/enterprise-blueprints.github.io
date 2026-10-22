---
id: process.oig-reporting-and-referral
type: process
title: OIG Reporting and Referral
summary: Write and review the report of investigation, approve its findings, and refer the case for prosecution or administrative action.
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.document-management
- type: uses
  target: capability.workflow
- type: uses
  target: capability.approval
- type: uses
  target: capability.signature
- type: uses
  target: capability.case-management
trigger: The investigative work is complete enough to report.
steps:
- id: draft-report
  title: Write the report of investigation
  role: Special agents
  description: Set out the allegations, findings, evidence, and recommendations.
  uses:
  - capability.document-management
- id: review-report
  title: Review the report
  role: Special Agent in Charge
  description: Supervisory and legal sufficiency review of the report, returning it for more work when needed.
  uses:
  - capability.workflow
  - capability.document-management
  decisions:
  - decision: Is the report ready, or does it need more work?
    accountable: Special Agent in Charge
  waits: Reviewers.
- id: approve-findings
  title: Approve the findings
  role: Assistant Inspector General for Investigations
  description: An authorized official approves the findings and recommendations.
  uses:
  - capability.approval
  - capability.signature
  decisions:
  - decision: Are the findings supported?
    accountable: Assistant Inspector General for Investigations
  waits: The decision-maker's review.
- id: refer-for-action
  title: Refer for prosecution or administrative action
  role: Special agents
  description: Send a referral package to a prosecutor or to agency management for action.
  uses:
  - capability.document-management
  decisions:
  - decision: Accept or decline the referral? (The prosecutor or agency decides.)
    accountable: Special agents
  waits: The prosecutor's or agency's decision.
- id: track-referral-outcome
  title: Track the outcome
  role: Special agents
  description: Record charges, pleas, judgments, administrative actions, and monetary results as they happen.
  uses:
  - capability.workflow
  - capability.case-management
  waits: Court and agency proceedings.
outcome: The findings are approved, and any referral has a recorded outcome.
requirements:
- id: route-for-approval
  title: Route decisions to someone with authority
  statement: Send decisions that need approval to a person with the authority to make them, and record the approval.
  category: functional
  steps:
  - approve-findings
  capabilities:
  - capability.approval
  policies:
  - policy.restricted-case-access
- id: people-decide
  title: People make consequential decisions
  statement: AI may organize information or draft a recommendation, but an authorized person makes and records each consequential decision.
  category: constraint
  steps:
  - draft-report
  - approve-findings
  capabilities:
  - capability.approval
  policies:
  - policy.restricted-case-access
- id: report-review-history
  title: Track report reviews and returns
  statement: Route each report through supervisory and legal review, and record each return for more work and why.
  category: functional
  steps:
  - review-report
  capabilities:
  - capability.workflow
  - capability.document-management
- id: referral-package
  title: Assemble referral packages
  statement: Assemble a referral package from the report, evidence, and exhibits, and record each referral and the decision on it.
  category: functional
  steps:
  - refer-for-action
  capabilities:
  - capability.document-management
- id: record-judicial-results
  title: Record judicial, administrative, and monetary results
  statement: Record charges, pleas, judgments, administrative actions, and monetary results against the case, with dates.
  category: functional
  steps:
  - track-referral-outcome
  capabilities:
  - capability.case-management
---

## Definition

OIG Reporting and Referral is part of the {% include ref.html id="process.oig-investigation" %}. Write and review the report of investigation, approve its findings, and refer the case for prosecution or administrative action.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
