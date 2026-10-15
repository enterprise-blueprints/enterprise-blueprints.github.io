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

personas:
  - name: Investigator
    summary: Works a handful of cases at a time, often over months, and needs to pick each one back up quickly.
    ideas:
      - A home view of assigned cases, sorted by what's due and what has changed.
      - One page per case, with its details, parties, history, and documents together.
      - Quick capture of interview notes, calls, and photos, straight into the case.
      - An evidence list that shows where each document came from and who has handled it.
      - A space for drafting findings that links each conclusion to the evidence behind it.
  - name: Supervisor
    summary: Oversees a team's cases and makes the decisions the process reserves for them.
    ideas:
      - A queue of decisions waiting for them, such as findings to approve.
      - A review view that shows draft findings beside their evidence, with a way to send them back with comments.
      - Signs of trouble across the team's cases, such as matters that have stalled at one step.
  - name: Assistant agent
    summary: Works inside the workspace for the person using it, and never beyond that person's access.
    ideas:
      - A summary of what's new in a case since the person last looked, with links to the sources.
      - Suggested next steps that the investigator can accept or dismiss.
      - Draft interview notes from a recording, marked as AI-written until a person confirms them.

channels:
  - name: Web, on a desktop
    description: The main channel. Investigators work in long sessions, often with several documents open side by side.
  - name: Mobile
    description: Limited to viewing assigned cases and capturing evidence in the field, such as photos and notes.

principles:
  - Meets WCAG 2.2 at level AA, including working with a keyboard alone and with screen readers.
  - Shows only the cases a person is authorized to see, as decided by the shared access check, never by hiding things on screen.
  - Labels anything an AI agent produced or suggested, and makes its sources easy to check.
  - Helps people pick a case back up after weeks away, with a clear summary of what changed.
---

## Definition

The Investigator Workspace is the experience investigators use day to day. It brings together their assigned cases, the evidence, tasks, and decision points, so they can work a matter without switching between unrelated tools.

## Who it's for

{% include block-personas.html %}

These are ideas, not a specification. Each organization will shape the workspace around its own people and the way it runs investigations.

## Channels

{% include block-channels.html %}

## Accessibility and design principles

{% include block-principles.html %}

## Agents and automation

The assistant works within the investigator's own access, never beyond it. It takes only the actions that the capabilities mark "Agents may," such as updating case details. Anything else, it prepares for the investigator to confirm.

## Boundaries

The workspace is an experience: it *provides access to* shared capabilities rather than keeping its own copy of case or document data. Every change it makes goes through {% include ref.html id="capability.case-management" %} and {% include ref.html id="capability.document-management" %}, so if the workspace were replaced tomorrow, the case record and the evidence would remain intact.

## Considerations

- Design for interruption. Investigators often return to a case after weeks, and what changed matters more than what's there.
- Keep the workspace focused on investigators. Supervisors' caseload views and public reporting are better as their own experiences.

## Questions to ask

- Can an investigator see everything about a case in one place, without switching tools?
- Does every change made in the workspace go through the shared capabilities?
- Can people tell, at a glance, what an AI agent wrote or suggested?

## Related standards

- The W3C's Web Content Accessibility Guidelines (WCAG) 2.2 set out how to make web content accessible to people with disabilities.
