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
  An intentionally skeletal outline. Only the first stages are composed so
  far; later stages will be added as the blueprint develops.
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

components:
  - ref: information.grant-application
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

Grants Management covers the work of offering funding, choosing who receives it, and making sure it's used as intended. This blueprint is deliberately skeletal. It exists to show that a second mission can build on the same canonical building blocks as Investigations without redefining them.

## What it reuses

- **Document Management** is the same canonical record that Investigations uses. Here it holds application packages instead of evidence. That difference lives in this mission's composition, not in the block's definition.
- **Human-in-the-Loop Review** is the same pattern that Investigations applies to triage and findings. Here it guards automated screening and scoring.

The grants-specific concepts, Grant Application and Grant Application Review, are planned stubs. They reserve a place in the model until someone writes their definitions.
