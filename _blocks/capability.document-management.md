---
id: capability.document-management
type: capability
title: Document Management
summary: Capture, keep, find, and retain documents, with every version and every change on record.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: entity.document

every_operation:
  - Checks the requester's access to the document before doing anything.
  - Records who performed it, when, and why. The history is never rewritten.

operations:
  - id: capture
    title: Capture
    description: Add a document, with its content and metadata, from a person, a system, or an agent. It starts as Active.
    automation: allowed
    takes: [The content, Its title and type, The records it relates to]
    returns: [The document's permanent identifier]
  - id: add-version
    title: Add a version
    description: Add a new version of an active document. Earlier versions are kept, and the newest becomes the current one.
    automation: allowed
    takes: [The document identifier, The new content]
    returns: [The new version's number]
  - id: update-metadata
    title: Update metadata
    description: Change a document's title, type, or related records.
    automation: allowed
    takes: [The changed metadata]
  - id: classify
    title: Classify
    description: Set or change the document's sensitivity and retention category.
    automation: with-review
    takes: [The sensitivity, The retention category]
  - id: declare
    title: Declare as a record
    description: Lock the document's content, so it can no longer change, and start its retention period.
    automation: with-review
    takes: [The document identifier]
  - id: place-hold
    title: Place a hold
    description: Stop changes and disposal because of a legal or administrative hold, with the reason recorded.
    automation: people-only
    takes: [The documents it covers, The reason, Who issued it]
    authority: Someone authorized to issue holds, such as legal counsel or a records officer.
  - id: release-hold
    title: Release a hold
    description: Lift a hold once it no longer applies.
    automation: people-only
    takes: [The hold, The reason it no longer applies]
    authority: Whoever issued the hold, or someone with the same authority.
  - id: dispose
    title: Dispose
    description: Destroy or transfer a record whose retention period has ended, keeping a record of what was done and under which rule.
    automation: people-only
    takes: [The records, The retention rule that applies]
    authority: A records officer for the records' category.
  - id: search
    title: Search
    description: Find documents by their metadata and, where it's allowed, by their content.
    automation: allowed
    takes: [What to look for]
    returns: [The matching documents the requester may see]
  - id: retrieve
    title: Retrieve
    description: Get a document, any of its versions, and its history.
    automation: allowed
    takes: [The document identifier, Optionally a version]
    returns: [The document, The requested version, Its history]

states:
  - id: active
    name: Active
    description: The document is in use, and new versions can be added.
  - id: declared
    name: Declared
    description: The document is locked as a record. Its content can't change, and its retention period is running.
  - id: on-hold
    name: On hold
    description: A hold stops the document from being changed or disposed of until it's released.
  - id: disposed
    name: Disposed
    description: The document was destroyed or transferred at the end of its retention period. Only the record of its disposal remains.

transitions:
  - { from: active, to: declared, via: declare }
  - { from: active, to: on-hold, via: place-hold }
  - { from: declared, to: on-hold, via: place-hold }
  - { from: on-hold, to: declared, via: release-hold }
  - { from: declared, to: disposed, via: dispose }

events:
  - id: captured
    name: Document captured
    description: A new document has been added.
    raised_by: capture
  - id: version-added
    name: Version added
    description: A document has a new current version.
    raised_by: add-version
  - id: reclassified
    name: Document reclassified
    description: A document's sensitivity or retention category changed.
    raised_by: classify
  - id: declared
    name: Document declared
    description: A document has been locked as a record.
    raised_by: declare
  - id: hold-placed
    name: Hold placed
    description: A document can no longer be changed or disposed of.
    raised_by: place-hold
  - id: hold-released
    name: Hold released
    description: A hold on a document has been lifted.
    raised_by: release-hold
  - id: retention-ended
    name: Retention ended
    description: A record's retention period has ended, so it's due for disposal.
  - id: disposed
    name: Document disposed
    description: A record has been destroyed or transferred.
    raised_by: dispose

measures:
  - id: time-to-find
    name: Time to find
    description: How long it takes to find a specific document and its current version.
  - id: unclassified-documents
    name: Unclassified documents
    description: Documents with no sensitivity or retention category. This should be zero.
  - id: overdue-disposals
    name: Overdue disposals
    description: Records past the end of their retention period that haven't been disposed of.
  - id: holds-broken
    name: Holds broken
    description: Documents on hold that were changed or disposed of anyway. This should be zero.
  - id: duplicate-copies
    name: Duplicate copies
    description: Documents stored more than once, in different places, instead of being referenced.

maturity:
  - level: Basic
    description: Documents are kept in shared, access-controlled locations with basic metadata, but each team organizes and keeps them its own way.
    questions:
      - Is every document kept somewhere that's backed up and access-controlled?
      - Can you find the current version of a document without asking who has it?
  - level: Established
    description: Document types, metadata, and retention categories are shared across the organization, and every document is classified when it's captured.
    questions:
      - Is every document classified when it's captured?
      - Can you tell which version of a document is the current one?
      - Are records disposed of when their retention ends, with a record kept of what was done?
  - level: Advanced
    description: Every system and agent captures and retrieves documents through the shared operations, holds take effect everywhere at once, and disposal is scheduled automatically and confirmed by a person.
    questions:
      - Does a hold stop changes and disposal in every system that holds a copy?
      - Do other systems keep references to documents, rather than copies of their own?
      - Can you show what was disposed of, when, and under which rule?
---

## Definition

Document Management is the organization's ability to capture documents, keep them secure and findable, track their versions, and retain or dispose of them on schedule. It holds the authoritative copy and history of every {% include ref.html id="entity.document" %}, so every experience sees the same document and the same current version.

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

Agents are well suited to the routine parts of document work: capturing documents from email, forms, or uploads, extracting their metadata, finding related records, and summarizing long documents. They can suggest a classification or flag a document that looks ready to declare, for a person to confirm. Holds and disposal stay with people, because both have legal consequences.

## Boundaries

Document Management handles documents in general. It doesn't decide *why* a document matters to a particular mission: an investigation treats a file as evidence, and a grants program treats it as part of an application. Those meanings belong to the mission, or to a specialized entity such as {% include ref.html id="entity.investigative-document" %}.

It also doesn't decide how long each kind of record must be kept. Retention rules come from the organization's records schedules. Document Management applies them.

## Considerations

- Classify documents when they're captured. Applying sensitivity labels afterwards is unreliable.
- Keep retention rules configurable rather than built in. They vary by jurisdiction and record type, and they change.
- Make holds apply to every copy and every system at once. A hold that only covers one system doesn't protect the record.

## Related standards

- ISO 15489-1 sets out the concepts and principles of records management, including how records are captured, kept, and disposed of.
- ISO 16175 describes functional requirements for software that manages records.
