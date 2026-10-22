---
id: process.oig-complaint-intake
type: process
title: OIG Complaint Intake
summary: Receive an allegation through any channel, acknowledge it, and protect the complainant's identity.
status: draft
scope: domain
domain: investigations
relationships:
- type: part_of
  target: process.oig-investigation
- type: uses
  target: capability.case-management
- type: uses
  target: capability.document-management
- type: uses
  target: capability.notification
- type: uses
  target: capability.identity
- type: uses
  target: capability.person-information
trigger: A complaint, hotline submission, or referral reaches the office.
steps:
- id: receive-allegation
  title: Receive the allegation
  role: Hotline and intake staff
  description: Record a complaint, hotline submission, or referral from any channel, including anonymous and whistleblower submissions.
  uses:
  - capability.case-management
  - capability.document-management
- id: acknowledge-receipt
  title: Acknowledge receipt
  role: Hotline and intake staff
  description: Confirm receipt and explain what happens next, when the initiator can be contacted.
  uses:
  - capability.notification
- id: protect-complainant
  title: Protect the complainant's identity
  role: Hotline and intake staff
  description: Note whether the complainant asked for confidentiality or is a whistleblower, and restrict who can see their identity.
  uses:
  - capability.identity
  - capability.person-information
  decisions:
  - decision: Does this complainant's identity need protection?
    accountable: Hotline and intake staff
outcome: The allegation is on record, acknowledged where the complainant can be contacted, and any identity that needs protection is restricted.
requirements:
- id: receive-any-channel
  title: Receive matters from every supported channel
  statement: Record matters from every supported channel, internal or external, with the source, channel, and time received.
  category: functional
  steps:
  - receive-allegation
  capabilities:
  - capability.case-management
- id: submit-without-account
  title: Accept submissions without an account
  statement: Accept external submissions without an online account, and anonymously where the case type allows, while recording what is known about the submitter.
  category: functional
  steps:
  - receive-allegation
  capabilities:
  - capability.identity
- id: acknowledge-receipt
  title: Confirm receipt and explain next steps
  statement: Send the initiator a confirmation with a reference and what happens next, when they can be contacted.
  category: functional
  steps:
  - acknowledge-receipt
  capabilities:
  - capability.notification
- id: protect-complainant-identity
  title: Protect complainant and whistleblower identities
  statement: Restrict complainant, whistleblower, and confidential witness identities to the people who need them, and record every disclosure.
  category: constraint
  steps:
  - protect-complainant
  - receive-allegation
  capabilities:
  - capability.identity
  - capability.person-information
  policies:
  - policy.restricted-case-access
---

## Definition

OIG Complaint Intake is part of the {% include ref.html id="process.oig-investigation" %}. Receive an allegation through any channel, acknowledge it, and protect the complainant's identity.

## Flow

{% include block-flow.html %}

## Requirements

{% include block-requirements.html %}

## Boundaries

This process describes the work as an Office of Inspector General usually does it. Offices name and divide these steps differently.
