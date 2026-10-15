---
id: experience.investigator-workspace
type: experience
title: Investigator Workspace
summary: A focused place where investigators see their cases, work the evidence, and record decisions.
status: draft
scope: domain
domain: investigations
relationships:
  - type: supports
    target: process.investigation-lifecycle
  - type: provides_access_to
    target: capability.case-management
  - type: provides_access_to
    target: capability.document-management
  - type: constrained_by
    target: policy.restricted-case-access
---

## Definition

The Investigator Workspace is the experience investigators use day to day. It brings together their assigned cases, the evidence file, tasks, and decision points, so they can work a matter without switching between unrelated tools.

## Responsibilities

- Show an investigator the cases they are assigned to and what needs attention.
- Present case details, history, and related documents in one view.
- Let investigators add notes, upload evidence, and record actions.
- Route decisions that need review to the right person.
- Make AI assistance, such as summaries or suggested next steps, clearly labeled and easy to verify.

## Boundaries

The workspace is an experience: it *provides access to* shared capabilities rather than keeping its own copy of case or document data. If the workspace were replaced tomorrow, the case record and evidence file would remain intact in the foundation.

## Considerations

- Show only the cases a person is authorized to see. Don't rely on hiding fields in the interface.
- Make it obvious when content was produced or suggested by an AI agent.
- Design for interruption: investigators often return to a case after weeks.
