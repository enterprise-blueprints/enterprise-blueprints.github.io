---
id: entity.case
type: entity
title: Case
summary: A single matter the organization keeps information about, such as a complaint, an application, or an incident.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: references
    target: entity.document
    note: A case refers to the documents that relate to it.
attributes:
  - name: Case identifier
    description: A unique, permanent reference for the case.
  - name: Case type
    description: The category the case belongs to.
  - name: Title
    description: A short name for the matter.
  - name: Description
    description: A plain statement of what the matter is about.
  - name: Status
    description: The case's current status.
  - name: Opened
    description: The date and time the case was opened.
  - name: Last updated
    description: The date and time the case last changed.
  - name: Closed
    description: The date and time the case was closed, if it has been.
  - name: Due dates
    description: Any dates by which something about the case is due.
  - name: Owner
    description: The person or team currently responsible for the case.
  - name: Participants
    description: People or teams with a role on the case, and the role each one has.
  - name: Parties
    description: People or organizations the case is about, and how each one is involved.
  - name: Outcome
    description: How the case was resolved, and the reason, if it has been.
  - name: Related cases
    description: Other cases connected to this one, and how they're connected.
  - name: Related documents
    description: Documents connected to the case.
  - name: Sensitivity
    description: The case's sensitivity or access classification.
---

## Definition

A case is a single matter an organization keeps information about, such as a complaint, an application, an appeal, or an incident. It gives the matter one identity and holds the core facts about it: what it is, who is involved, and where it stands.

## Key attributes

{% include block-attributes.html %}

## Boundaries

A case holds information about a matter. It doesn't describe the work done on the matter, the rules that apply to it, or who may see it. Those belong to the capabilities, processes, and policies that use the case, such as {% include ref.html id="capability.case-management" %}.

A case also isn't a document. It refers to documents, which are their own entity, {% include ref.html id="entity.document" %}.

When a domain needs more specific information, define a separate entity that *specializes* this one, rather than adding domain-specific attributes here. An investigative case, for example, might add allegations, subjects, and findings.

## Considerations

- Keep the attributes general. If an attribute only makes sense in one domain, it belongs in a specialization.
- Store the owner, participants, and parties as references to people, teams, or organizations, rather than as copied names.
- Keep the identifier separate from any number shown to people, so the display format can change without changing the case's identity.
