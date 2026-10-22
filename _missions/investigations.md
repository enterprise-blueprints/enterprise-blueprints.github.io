---
id: mission.investigations
title: Investigations
summary: Receive, assess, investigate, and resolve allegations fairly, promptly, and defensibly.
status: draft
domains: [investigations, cross-cutting]

# Mission outcomes: the public value the work creates. The indicators are
# examples; each agency chooses its own.
outcomes:
  - id: wrongdoing-addressed
    title: Wrongdoing is addressed
    statement: Fraud, waste, abuse, and misconduct are found, stopped, and corrected, and the people responsible are held accountable.
    indicators:
      - name: Substantiated matters with corrective action
        description: The share of substantiated findings that lead to discipline, recovery, referral, or a change to the program.
      - name: Funds recovered or put to better use
        description: Money returned, saved, or redirected because of investigations.
      - name: Time from report to resolution
        description: How long matters take from the first report to a final outcome.
  - id: trust-in-reporting
    title: People trust the process
    statement: Staff and the public report concerns, because they believe they'll be taken seriously, treated fairly, and protected from retaliation.
    indicators:
      - name: Reports over time
        description: How many concerns arrive, and through which channels. A sudden drop can signal fear or fatigue.
      - name: Retaliation complaints
        description: Complaints from people who say they were harmed for reporting.
      - name: Confidence in reporting
        description: Survey results on whether staff would report a concern, and expect it to be handled well.
  - id: fair-and-defensible
    title: Conclusions are fair and hold up
    statement: Findings are fair to everyone involved, and withstand review, appeal, and court.
    indicators:
      - name: Findings overturned or reopened
        description: Findings changed on review, appeal, or because something was missed.
      - name: Referrals accepted for action
        description: The share of referrals that prosecutors or management accept and act on.
  - id: problems-prevented
    title: Problems don't recur
    statement: What investigations find feeds back into programs, so the same problems are deterred and prevented.
    indicators:
      - name: Repeat reports
        description: New reports about a program or issue that was already investigated.
      - name: Recommendations implemented
        description: The share of recommendations to programs that are carried out.

# Operational outcomes: how well the work performs. Each contributes to a
# mission outcome, and links to the measures and building blocks behind it.
# Measures are defined once, on the building block, and referenced here.
operational_outcomes:
  - id: every-concern-recorded
    statement: Every concern is recorded and acknowledged promptly, however it arrives, including those that are later screened out.
    contributes_to: [trust-in-reporting, wrongdoing-addressed]
    supported_by:
      - process.investigation-lifecycle#intake
      - capability.case-management#record
  - id: timely-triage
    statement: Matters are triaged promptly and prioritized by risk, so serious concerns get attention first.
    contributes_to: [wrongdoing-addressed]
    measures:
      - capability.case-management#time-to-accept
      - capability.case-management#unowned-cases
    supported_by:
      - process.investigation-lifecycle#triage
      - capability.case-management#accept
      - capability.case-management#screen-out
      - pattern.human-in-the-loop-review
  - id: evidence-preserved
    statement: Evidence is preserved with clear provenance and is available to those authorized to see it.
    contributes_to: [fair-and-defensible]
    measures:
      - capability.document-management#holds-broken
    supported_by:
      - process.investigation-lifecycle#investigation
      - capability.document-management#capture
      - entity.investigative-document
  - id: defensible-findings
    statement: Findings are reviewed, recorded with their reasoning, and can withstand later scrutiny.
    contributes_to: [fair-and-defensible]
    measures:
      - capability.case-management#recorded-reasons
    supported_by:
      - process.investigation-lifecycle#findings
      - capability.case-management#resolve
      - pattern.human-in-the-loop-review
  - id: restricted-information
    statement: Sensitive information about complainants and subjects stays restricted throughout.
    contributes_to: [trust-in-reporting]
    supported_by:
      - policy.restricted-case-access
      - control.case-authorization-check

lifecycle_note: >-
  These five stages illustrate a common way to organize investigative work.
  Organizations name and divide the stages differently, and matters can move
  back to an earlier stage when new information appears.
lifecycle_process: process.investigation-lifecycle
lifecycle:
  - id: intake
    title: Intake
    summary: A concern is received, recorded, and acknowledged. Every concern is recorded, even one that's screened out later.
  - id: triage
    title: Triage
    summary: The matter is assessed for jurisdiction, risk, and priority, and either assigned or screened out. A screened-out matter stays on record, with the reason.
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

experience_ideas:
  - title: Public reporting portal
    description: Lets anyone report a concern, confidentially if they choose, and check its status later.
  - title: Supervisor dashboard
    description: Shows caseloads, aging matters, and decisions waiting for approval.
  - title: Triage assistant
    description: An AI agent that summarizes each new concern and suggests a priority for a person to confirm.

components:
  - ref: process.investigation-lifecycle
    purpose: Coordinates the matter from intake through closure, and is where stage-by-stage decisions are made.
  - ref: entity.case
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
  - ref: entity.investigative-document
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
