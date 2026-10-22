---
id: mission.grants-management
title: Grants Management
summary: Solicit, review, award, and oversee grant funding so it reaches intended outcomes.
status: draft
domains: [grants-management, cross-cutting]

# Mission outcomes: the public value the work creates. The indicators are
# examples; each agency chooses its own.
outcomes:
  - id: program-goals-met
    title: Funding achieves the program's goals
    statement: Awards go to work that delivers what the program was created to achieve.
    indicators:
      - name: Awardees meeting their targets
        description: The share of awards whose agreed performance targets are met.
      - name: Program goals met at closeout
        description: How far the program's own goals were reached across its awards.
  - id: fair-awards
    title: Awards are fair and transparent
    statement: Every applicant is judged by the same published rules, and anyone can see how decisions were made.
    indicators:
      - name: Successful appeals or protests
        description: Decisions changed after an applicant challenged them.
      - name: Applicants who found the process clear
        description: Survey results from applicants, including those who weren't funded.
  - id: funds-used-as-intended
    title: Funds are used as intended
    statement: Money is spent on what it was awarded for, and improper payments are prevented or recovered.
    indicators:
      - name: Improper payment rate
        description: The share of payments made in the wrong amount, to the wrong party, or without the right support.
      - name: Audit findings per award
        description: Problems that audits find in how awards were managed or spent.

# Operational outcomes: how well the work performs. Each contributes to a
# mission outcome. This blueprint covers application and review, so nothing
# traces to funds being used as intended yet.
operational_outcomes:
  - id: submit-once
    statement: Applicants can submit complete applications and supporting documents once.
    contributes_to: [fair-awards]
    supported_by:
      - process.grant-application-review#receipt
      - capability.application-management
      - capability.document-management#capture
  - id: consistent-review
    statement: Applications are reviewed consistently, with any automated scoring checked by a person.
    contributes_to: [fair-awards, program-goals-met]
    supported_by:
      - process.grant-application-review#eligibility
      - process.grant-application-review#merit-review
      - policy.grant-eligibility
      - pattern.human-in-the-loop-review
  - id: independent-review
    statement: Every application is judged by reviewers with no conflict of interest, and every finding, score, and recommendation can be explained later.
    contributes_to: [fair-awards]
    supported_by:
      - policy.reviewer-conflicts-of-interest
      - control.conflict-of-interest-declaration
      - control.review-audit-trail

lifecycle_note: >-
  These stages illustrate a common grants lifecycle. This blueprint currently
  covers the application and review stages.
lifecycle:
  - id: application
    title: Application
    summary: Applicants submit a request for funding and its supporting documents.
  - id: review
    title: Review
    summary: Applications are screened for eligibility and evaluated against the program's criteria.
  - id: award
    title: Award
    summary: Funding decisions are made and agreements are put in place.
  - id: oversight
    title: Oversight and closeout
    summary: Performance and spending are monitored until the grant is closed.

roles:
  - name: Applicant
    description: The organization or person requesting funding.
  - name: Program officer
    description: Runs the program, answers applicant questions, and oversees awards.
  - name: Reviewer
    description: Evaluates applications against the program's criteria.

experience_ideas:
  - title: Applicant portal
    description: Lets applicants prepare, submit, and track an application in one place.
  - title: Reviewer workspace
    description: Lets reviewers read applications and record scores and comments against the criteria.

components:
  - ref: process.grant-application-review
    purpose: Coordinates eligibility screening and merit review of each application.
    stage: review
  - ref: policy.grant-eligibility
    purpose: Holds eligibility decisions to the program's published rules, applied the same way to every applicant.
  - ref: policy.reviewer-conflicts-of-interest
    purpose: Keeps reviewers with a conflict of interest away from the applications they're conflicted on.
  - ref: control.conflict-of-interest-declaration
    purpose: Has reviewers declare conflicts before they're given applications to score.
  - ref: control.review-audit-trail
    purpose: Records each eligibility finding, score, and recommendation, so funding decisions can be explained later.
  - ref: entity.grant-application
    purpose: The applicant's request for funding and the information it contains.
    stage: application
  - ref: capability.application-management
    purpose: Receives each application and tracks its status, from submission through review to a funding decision.
    stage: application
  - ref: capability.document-management
    purpose: Keeps the documents submitted with each application, with their versions.
    stage: application
  - ref: pattern.human-in-the-loop-review
    purpose: Any automated eligibility screening or AI-assisted scoring is reviewed by a person before it affects a funding decision.
    stage: review
---

## Overview

Grants Management covers the work of offering funding, choosing who receives it, and making sure it's used as intended. Programs depend on complete applications, consistent and fair review, and a clear record of why each award was made.
