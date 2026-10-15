---
id: mission.grants-management
title: Grants Management
summary: Solicit, review, award, and oversee grant funding so it reaches intended outcomes.
status: draft
domains: [grants-management, cross-cutting]

outcomes:
  - id: submit-once
    statement: Applicants can submit complete applications and supporting documents once.
    supported_by:
      - process.grant-application-review#receipt
      - capability.application-management
      - capability.document-management#capture
  - id: consistent-review
    statement: Applications are reviewed consistently, with any automated scoring checked by a person.
    supported_by:
      - process.grant-application-review#eligibility
      - process.grant-application-review#merit-review
      - policy.grant-eligibility
      - pattern.human-in-the-loop-review
  - id: independent-review
    statement: Every application is judged by reviewers with no conflict of interest, and every finding, score, and recommendation can be explained later.
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
