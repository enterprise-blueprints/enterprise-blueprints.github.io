---
id: mission.investigations
title: Investigations
summary: Receive, assess, investigate, and resolve allegations fairly, promptly, and defensibly.
status: draft
domains: [investigations, cross-cutting]

outcomes:
  - Concerns are recorded consistently and acknowledged promptly, however they arrive.
  - Matters are prioritized by risk, so serious concerns get attention first.
  - Evidence is preserved with clear provenance and is available to those authorized to see it.
  - Findings are reviewed, recorded with their reasoning, and can withstand later scrutiny.
  - Sensitive information about complainants and subjects stays restricted throughout.

lifecycle_note: >-
  These five stages illustrate a common way to organize investigative work.
  Organizations name and divide the stages differently, and matters can move
  back to an earlier stage when new information appears.
lifecycle:
  - id: intake
    title: Intake
    summary: A concern is received, recorded, and acknowledged.
  - id: triage
    title: Triage
    summary: The matter is assessed for jurisdiction, risk, and priority, and either assigned or screened out.
  - id: investigation
    title: Investigation
    summary: Investigators gather and analyze evidence and interview the people involved.
  - id: findings
    title: Findings
    summary: Conclusions are drafted, reviewed, and approved by an accountable decision-maker.
  - id: closure
    title: Closure
    summary: The outcome is communicated as appropriate and the record is preserved.

roles:
  - name: Reporting party
    description: The person or organization that raises the concern. They may ask to remain confidential.
  - name: Intake analyst
    description: Records concerns, checks completeness, and prepares matters for triage.
  - name: Investigator
    description: Plans and carries out the investigation and drafts findings.
  - name: Supervisor
    description: Assigns work, reviews progress, and approves key decisions.
  - name: AI agent
    description: Assists with summarizing, classifying, and suggesting next steps, under human review.

use_cases:
  - title: Record a concern
    description: Capture a new allegation from any channel and open a case for it.
  - title: Triage and assign
    description: Assess risk and priority, with any AI-assisted recommendation reviewed by a person.
  - title: Build the evidence file
    description: Collect, label, and preserve documents and other evidence against the case.
  - title: Approve findings
    description: Review draft findings and their reasoning before they become final.
  - title: Close and retain
    description: Record the outcome, close the case, and retain the record on schedule.

components:
  - ref: process.investigation-lifecycle
    purpose: Coordinates the matter from intake through closure, and is where stage-by-stage decisions are made.
  - ref: information.case
    purpose: The single record of the matter, including what was alleged, decided, and done.
  - ref: policy.restricted-case-access
    purpose: Restricts sensitive investigative information, including the identity of reporting parties and subjects.
  - ref: control.case-authorization-check
    purpose: Enforces case-level access on every request, including requests made by AI agents.
  - ref: capability.case-management
    purpose: Opens a case for each accepted concern and tracks its status, assignment, and history.
    stage: intake
  - ref: pattern.human-in-the-loop-review
    purpose: Any automated or AI-assisted triage recommendation, such as priority or screening out, is reviewed by an accountable person before it takes effect.
    stage: triage
  - ref: experience.investigator-workspace
    purpose: Gives investigators one place to work assigned cases, review evidence, and record actions.
    stage: investigation
  - ref: capability.document-management
    purpose: Maintains investigative documents and attachments, with versions and provenance preserved.
    stage: investigation
  - ref: information.investigative-document
    purpose: Identifies documents that serve as evidence and the handling they require.
    stage: investigation
  - ref: pattern.human-in-the-loop-review
    purpose: Draft findings, including any AI-assisted summaries, are approved by an accountable decision-maker.
    stage: findings
  - ref: capability.document-management
    purpose: Retains the closed case file under the applicable retention schedule and any holds.
    stage: closure
---

## Overview

Investigations turn a reported concern into a documented, defensible outcome. Whether the concern is about fraud, misconduct, safety, or a regulatory breach, the mission shares a common shape. Something is reported, someone decides whether and how to look into it, evidence is gathered, a conclusion is reached, and a record is kept.

The stakes are unusually high. Investigations handle sensitive information about people who may not know they are under review. They often rely on judgement, and their conclusions may be challenged years later. That makes consistent records, restricted access, and clear human accountability central to the mission, not optional extras.

## Design notes

- **Build on shared blocks.** Case Management and Document Management are defined once and shared with other missions. This blueprint adds only what's specific to investigations, such as the stages where each block matters and the specialized Investigative Document.
- **Enforce access below the interface.** Restricted access applies to every experience and agent that can reach a case. That's why the authorization check is part of the composition, not just a feature of the Investigator Workspace.
- **Keep people accountable for consequential decisions.** AI assistance is welcome in triage and in drafting findings. Human-in-the-Loop Review appears at both points, so each recommendation is reviewed before it affects anyone.
