---
id: capability.case-management
type: capability
title: Case Management
summary: Record, track, and resolve matters as cases, with a dependable history of everything that happens to them.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: entity.case
  - type: constrained_by
    target: policy.restricted-case-access

every_operation:
  - Checks the requester's access to the case before doing anything.
  - Records who performed it, when, and why. The history is never rewritten.

operations:
  - id: record
    title: Record a case
    description: Create a case with a permanent identifier, a type, and a description of the matter. It starts as Received.
    automation: allowed
    takes: [The case type, A description of the matter, Where it came from]
    returns: [The case's permanent identifier]
  - id: accept
    title: Accept
    description: Take responsibility for the matter and give it an accountable owner.
    automation: with-review
    takes: [The accountable owner]
    authority: Someone who can take on matters of this case type, such as a supervisor.
  - id: screen-out
    title: Screen out
    description: Close a received case without further work, with the reason recorded. The case and its history are kept.
    automation: people-only
    takes: [The reason, Any referral made elsewhere]
    authority: Someone who can take on matters of this case type, such as a supervisor.
  - id: assign
    title: Assign
    description: Change the case's owner or participants.
    automation: with-review
    takes: [The new owner or participants]
  - id: update
    title: Update details
    description: Change the case's title, description, parties, due dates, or related records.
    automation: allowed
    takes: [The changed details]
  - id: classify
    title: Classify
    description: Set or change the case's sensitivity.
    automation: people-only
    takes: [The sensitivity, The reason]
    authority: Someone allowed to set sensitivity at that level.
  - id: pause
    title: Pause
    description: Put an open case on hold, with the reason recorded.
    automation: with-review
    takes: [The reason, When to look at it again]
  - id: resume
    title: Resume
    description: Return a case on hold to work.
    automation: with-review
  - id: resolve
    title: Resolve
    description: Record the outcome of the case and the reason for it.
    automation: people-only
    takes: [The outcome, The reasoning behind it]
    authority: The case's accountable owner, or a decision-maker the owner names.
  - id: close
    title: Close
    description: End work on a resolved case.
    automation: people-only
    takes: [Any follow-up actions, The retention category]
  - id: reopen
    title: Reopen
    description: Return a closed case to work under the same identifier, with the reason recorded.
    automation: people-only
    takes: [The reason]
  - id: retrieve
    title: Retrieve
    description: Get a case, its current state, and its history, subject to the requester's access.
    automation: allowed
    takes: [The case identifier]
    returns: [The case, Its current state, Its history]

states:
  - id: received
    name: Received
    description: The matter has been recorded but not yet assessed.
  - id: open
    name: Open
    description: The organization has accepted the matter, and it has an accountable owner.
  - id: on-hold
    name: On hold
    description: Work has paused, usually while waiting for information.
  - id: resolved
    name: Resolved
    description: An outcome has been decided and recorded. Follow-up actions may still be open.
  - id: closed
    name: Closed
    description: No further work is expected.

transitions:
  - { from: received, to: open, via: accept }
  - { from: received, to: closed, via: screen-out }
  - { from: open, to: on-hold, via: pause }
  - { from: open, to: resolved, via: resolve }
  - { from: on-hold, to: open, via: resume }
  - { from: resolved, to: closed, via: close }
  - { from: closed, to: open, via: reopen }

events:
  - id: recorded
    name: Case recorded
    description: A new case has been created.
    raised_by: record
  - id: accepted
    name: Case accepted
    description: A case has been accepted and has an owner.
    raised_by: accept
  - id: screened-out
    name: Case screened out
    description: A received case was closed without further work.
    raised_by: screen-out
  - id: assigned
    name: Case assigned
    description: A case's owner or participants changed.
    raised_by: assign
  - id: reclassified
    name: Case reclassified
    description: A case's sensitivity changed.
    raised_by: classify
  - id: resolved
    name: Case resolved
    description: A case's outcome has been recorded.
    raised_by: resolve
  - id: closed
    name: Case closed
    description: Work on a case has ended.
    raised_by: close
  - id: reopened
    name: Case reopened
    description: A closed case has returned to work.
    raised_by: reopen
  - id: overdue
    name: Case overdue
    description: One of an open case's due dates has passed.

measures:
  - name: Time to accept
    description: How long new cases wait as Received before they're accepted or screened out.
  - name: Cases without an owner
    description: Open cases with no accountable owner. This should be zero.
  - name: Overdue cases
    description: Open cases past one of their due dates.
  - name: Reopen rate
    description: The share of closed cases that are later reopened.
  - name: Recorded reasons
    description: The share of state changes that have a reason recorded.

maturity:
  - level: Basic
    description: Cases are kept in one place with an identifier, a status, and an owner, but teams use their own case types and statuses.
    questions:
      - Is every case recorded in one place, including the ones that are screened out?
      - Can you find any case's current status and owner without asking someone?
  - level: Established
    description: Case types, states, and operations are shared across the organization, and every change is recorded with a reason.
    questions:
      - Do all teams use the same case types and states?
      - Can you reconstruct, for any case, who changed what, when, and why?
      - Can you tell how long cases spend in each state?
  - level: Advanced
    description: Every system and agent works with cases only through the shared operations and events, and automation levels are enforced, not just documented.
    questions:
      - Can every system that changes a case do so only through these operations?
      - Do other systems learn about changes from events, rather than by checking for them?
      - Can you show that agents act only within their automation levels?
---

## Definition

Case Management is the organization's ability to record matters as cases, move them through a consistent set of states, and keep a dependable history of everything that happens to them. It holds the authoritative state of every {% include ref.html id="entity.case" %}, and it's the only way that state changes.

## Operations

{% include block-operations.html %}

Who may perform each operation is a default. A policy or a Mission Blueprint can be stricter, but shouldn't be looser.

## States

{% include block-states.html %}

## Events

{% include block-events.html %}

## Measures

{% include block-measures.html %}

## Maturity levels

{% include block-maturity.html %}

## Agents and automation

Agents can safely take on the operations marked "Agents may," such as recording a new case from an intake form or updating its details. Operations that change a case's standing, such as accepting, screening out, resolving, or closing, either need a person to confirm what an agent prepared or are left to people entirely. {% include ref.html id="pattern.human-in-the-loop-review" %} describes how to set up the confirmation step.

## Boundaries

Case Management holds the state of a case and the rules for changing it. It doesn't define the work a particular mission does on a case: that belongs to processes such as {% include ref.html id="process.investigation-lifecycle" %}, which *use* this capability. It also doesn't store document content, which is the job of {% include ref.html id="capability.document-management" %}.

A capability is a responsibility, not a product. One system may provide Case Management for several missions, or a mission may combine more than one system to provide it.

## Considerations

- Agree on case types and states early. Reporting and automation both depend on them.
- Keep the state model small and shared. Domain-specific detail, such as "awaiting hearing," fits better as a sub-status than as a new state.
- Offer the operations and events through governed interfaces, so new experiences and agents don't copy case data or change it directly.

## Related standards

- The Object Management Group's Case Management Model and Notation (CMMN) is a standard notation for describing case-based work.
