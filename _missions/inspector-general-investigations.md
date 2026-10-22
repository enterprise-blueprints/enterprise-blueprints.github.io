---
id: mission.inspector-general-investigations
title: Inspector General Investigations
summary: Receive, investigate, and resolve allegations of fraud, waste, abuse, and misconduct in an agency's programs, independently and defensibly.
status: draft
domains:
- investigations
- cross-cutting
outcomes:
- id: accountability
  title: People are held accountable
  statement: Wrongdoing is investigated well enough, and soon enough, that people and programs are held to account.
  indicators:
  - name: Investigations resulting in action
    description: Share of closed investigations that led to criminal, civil, or administrative action.
- id: public-trust
  title: Employees and the public trust the process
  statement: People believe that reporting fraud, waste, or abuse leads to action, so they keep reporting.
  indicators:
  - name: Employees who believe reporting leads to action
    description: Agreement with a survey item such as “I believe reported wrongdoing is addressed”, from an employee survey.
- id: losses-recovered
  title: Wrongdoing is stopped and losses are recovered
  statement: Investigations stop ongoing fraud and recover funds for the government.
  indicators:
  - name: Monetary results from investigations
    description: Recoveries, restitution, fines, and settlements reported per half year.
operational_outcomes:
- id: timely-investigations
  statement: Investigations progress without avoidable delay.
  contributes_to:
  - accountability
  indicators:
  - name: Median days to close an investigation
    description: Median days from case opening to closure, by case type.
  - name: Open cases older than 12 months
    description: Count of open cases more than 365 days after opening, at month end.
- id: rework
  statement: Reports and case files are right the first time.
  contributes_to:
  - accountability
  indicators:
  - name: Reports returned during review
    description: Share of draft reports returned to the investigator at least once during review.
  supported_by:
  - process.oig-reporting-and-referral#review-report
- id: backlog
  statement: Allegations and cases don’t wait for attention.
  contributes_to:
  - accountability
  indicators:
  - name: Allegations awaiting triage
    description: Count of allegations without a disposition, at month end.
  supported_by:
  - process.oig-complaint-triage#triage-allegation
  - process.oig-investigative-work#assign-owner
- id: referral-acceptance
  statement: Referrals are accepted for prosecution or action.
  contributes_to:
  - losses-recovered
  indicators:
  - name: Referral acceptance rate
    description: Referrals accepted divided by referrals made, by referral type, per half year.
  supported_by:
  - process.oig-reporting-and-referral#refer-for-action
- id: defensible-findings
  statement: Findings withstand review and challenge.
  contributes_to:
  - accountability
  - losses-recovered
  indicators:
  - name: Peer review exceptions
    description: Exceptions noted in the most recent external peer review of investigative operations.
  supported_by:
  - process.oig-reporting-and-referral#review-report
  - process.oig-reporting-and-referral#approve-findings
lifecycle_note: These stages follow the OIG Investigation process. Offices name and divide them differently, and a case can move back to an earlier stage when new information appears.
lifecycle_process: process.oig-investigation
lifecycle:
- id: intake
  title: Intake
  summary: Receive an allegation through any channel, acknowledge it, and protect the complainant's identity.
- id: triage
  title: Triage
  summary: 'Decide what happens to each allegation: investigate it, refer it to agency management or elsewhere, or close it with a reason.'
- id: investigation
  title: Investigation
  summary: 'Plan and carry out an investigation: assign it, gather records and evidence, interview the people involved, and review progress.'
- id: findings
  title: Findings
  summary: Write and review the report of investigation, approve its findings, and refer the case for prosecution or administrative action.
- id: closure
  title: Closure
  summary: Close the case once nothing is outstanding, report its results, and manage the closed record.
roles:
- id: inspector-general
  name: Inspector General
  description: Leads the office, sets priorities, and reports to the agency head and Congress.
  concerns: Independence, credibility of findings, and what the semiannual report says about results.
  influence: high
- id: aigi
  name: Assistant Inspector General for Investigations
  description: Runs the investigations program across offices.
  concerns: Case timeliness, aged cases, caseloads, and the quality of what goes to prosecutors.
  influence: high
- id: sac
  name: Special Agent in Charge
  description: Supervises a field office or team of agents.
  concerns: Seeing what cases are waiting on, reviewing cases, and balancing work across agents.
  influence: medium
- id: special-agents
  name: Special agents
  description: 'Investigate allegations: interviews, records, evidence, and reports.'
  concerns: Time spent on documentation, finding related cases, and handling evidence.
  influence: medium
- id: hotline
  name: Hotline and intake staff
  description: Receive complaints and referrals and decide where each one goes.
  concerns: Volume, consistent triage criteria, and duplicate submissions.
  influence: low
- id: counsel
  name: Counsel to the Inspector General
  description: Advises on subpoenas, legal sufficiency, and disclosure.
  concerns: Findings that hold up, evidence handling, and what can be released.
  influence: medium
- id: analytics
  name: Data analytics and reporting staff
  description: Produce statistics, the semiannual report, and analysis that finds new cases.
  concerns: Complete, consistent case data and less manual reconciliation.
  influence: low
- id: oig-it
  name: OIG IT and security
  description: Run the office's systems, often separately from the agency's to protect independence.
  concerns: Security, hosting, identity, integration, and support.
  influence: medium
- id: records-officer
  name: Records management officer
  description: Owns retention schedules and how records move between systems.
  concerns: Retention, migration of legacy records, and disposal.
  influence: low
- id: prosecutors
  name: Prosecutors and partner agencies
  description: External partners who accept referrals and act on findings.
  concerns: Complete referral packages and early involvement.
  influence: low
typical_systems:
- id: case-management
  name: Legacy case management system
  kind: service
  description: Records allegations, cases, subjects, and activities. Often 10 to 20 years old, with limited reporting and integration.
  provides:
  - capability.case-management
  - capability.workflow
  - capability.search
  - capability.reporting
- id: hotline-intake
  name: Hotline intake (web form, phone, email)
  kind: channel
  description: Where complaints and referrals arrive. Submissions are often re-keyed into the case system.
- id: evidence-storage
  name: Evidence logs and file shares
  kind: data
  description: Where evidence and its custody records are kept. Often spreadsheets, paper logs, and shared drives.
  provides:
  - capability.document-management
- id: statistics-spreadsheets
  name: Statistics spreadsheets
  kind: analytics
  description: Where case statistics are reconciled for the semiannual report.
  provides:
  - capability.reporting
- id: records-management
  name: Document and records management
  kind: data
  description: Holds official records and applies retention.
  provides:
  - capability.document-management
- id: email
  name: Email and calendar
  kind: external
  description: Where much case correspondence happens.
  provides:
  - capability.notification
  - capability.scheduling
- id: identity
  name: Identity provider (PIV and single sign-on)
  kind: identity
  description: Signs staff in with agency credentials. Some offices run their own to protect independence.
  provides:
  - capability.identity
- id: forensics
  name: Digital forensics tools
  kind: service
  description: Collect and analyze digital evidence.
- id: agency-hr
  name: Agency HR and personnel system
  kind: external
  description: Source of employee details for subjects and witnesses. Access is usually read-only and tightly controlled.
  provides:
  - capability.person-information
- id: agency-finance
  name: Agency financial and grants systems
  kind: external
  description: Data for fraud analytics and for valuing losses.
components:
- ref: process.oig-investigation
  purpose: Takes each allegation from intake to a closed case, in the office's own roles and steps.
- ref: process.oig-complaint-intake
  purpose: Receive an allegation through any channel, acknowledge it, and protect the complainant's identity.
  stage: intake
- ref: process.oig-complaint-triage
  purpose: 'Decide what happens to each allegation: investigate it, refer it to agency management or elsewhere, or close it with a reason.'
  stage: triage
- ref: process.oig-investigative-work
  purpose: 'Plan and carry out an investigation: assign it, gather records and evidence, interview the people involved, and review progress.'
  stage: investigation
- ref: process.oig-reporting-and-referral
  purpose: Write and review the report of investigation, approve its findings, and refer the case for prosecution or administrative action.
  stage: findings
- ref: process.oig-case-closure
  purpose: Close the case once nothing is outstanding, report its results, and manage the closed record.
  stage: closure
- ref: process.oig-caseload-oversight
  purpose: Keeps caseloads balanced and stalled cases moving.
- ref: capability.case-management
  purpose: Holds every allegation and investigation as a case, with its status, owner, and history.
  stage: intake
- ref: capability.document-management
  purpose: Keeps evidence, interview records, and reports with their versions and chain of custody.
  stage: investigation
- ref: entity.investigative-document
  purpose: Identifies the documents that serve as evidence and the handling they need.
  stage: investigation
- ref: experience.investigator-workspace
  purpose: Gives special agents one place to work their cases.
  stage: investigation
- ref: pattern.human-in-the-loop-review
  purpose: Findings, including any AI-assisted summaries, are approved by an accountable official.
  stage: findings
- ref: policy.restricted-case-access
  purpose: Restricts investigative information, including the identity of complainants and whistleblowers.
- ref: control.case-authorization-check
  purpose: Enforces case-level access on every request, including requests from AI agents.
---

## Overview

An Office of Inspector General investigates allegations of fraud, waste, abuse, and misconduct in its agency's programs and operations. It works independently of the agency it oversees, reports to the agency head and to Congress, and refers what it finds for prosecution or administrative action.

The work follows the shape of any {% include ref.html id="mission.investigations" text="investigation" %}, with demands of its own: allegations arrive in volume through a hotline, complainants and whistleblowers need their identities protected, cases often wait on records and subpoenas from others, and findings must stand up in court and in the office's semiannual report.

The mission effectiveness model behind this blueprint, its conditions, behaviors, and the links between them, is what Solution Studio uses to help an architect find where the work most needs to improve.
