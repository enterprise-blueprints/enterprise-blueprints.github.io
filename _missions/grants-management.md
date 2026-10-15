---
id: mission.grants-management
title: Grants Management
summary: Solicit, review, award, and oversee grant funding so it reaches intended outcomes.
status: draft
domains: [grants-management, cross-cutting]

outcomes:
  - Applicants can submit complete applications and supporting documents once.
  - Applications are reviewed consistently, with any automated scoring checked by a person.

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
  - ref: entity.grant-application
    purpose: The applicant's request for funding and the information it contains.
    stage: application
  - ref: capability.document-management
    purpose: Receives and retains application packages, attachments, and supporting documentation.
    stage: application
  - ref: process.grant-application-review
    purpose: Coordinates eligibility screening and merit review of each application.
    stage: review
  - ref: pattern.human-in-the-loop-review
    purpose: Any automated eligibility screening or AI-assisted scoring is reviewed by a person before it affects a funding decision.
    stage: review
---

## Overview

Grants Management covers the work of offering funding, choosing who receives it, and making sure it's used as intended. Programs depend on complete applications, consistent and fair review, and a clear record of why each award was made.
