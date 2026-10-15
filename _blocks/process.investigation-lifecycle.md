---
id: process.investigation-lifecycle
type: process
title: Investigation Lifecycle
summary: Coordinate an investigation from receiving a concern through findings and closure.
status: published
scope: domain
domain: investigations
relationships:
  - type: uses
    target: capability.case-management
  - type: uses
    target: capability.document-management
  - type: constrained_by
    target: policy.restricted-case-access
---

## Definition

The Investigation Lifecycle coordinates the work of turning a reported concern into a documented, defensible outcome. It describes how work moves between people, when decisions are made, and what must be recorded at each point.

## Responsibilities

- Receive and record allegations or concerns consistently.
- Assess whether a matter warrants investigation, and with what priority.
- Assign investigators and track progress against expectations.
- Gather, preserve, and analyze evidence.
- Reach, review, and record findings.
- Close the matter and preserve the record.

## Boundaries

This process coordinates work; it doesn't own the case record or the documents. It *uses* {% include ref.html id="capability.case-management" %} to keep case state and {% include ref.html id="capability.document-management" %} to keep the evidence file.

Organizations name and divide these stages differently. The stages shown in the {% include ref.html id="mission.investigations" text="Investigations blueprint" %} are illustrative, not a required sequence.

## Considerations

- Decisions with significant consequences, such as screening a matter out or approving findings, should have a clearly accountable human decision-maker.
- Record the reason for each decision, not just the decision, so the process can be audited.
- Expect matters to move backwards: new evidence can reopen triage or investigation.
