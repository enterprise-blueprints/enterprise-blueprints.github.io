---
id: capability.document-management
type: capability
title: Document Management
summary: Capture, store, version, find, and retain documents and their metadata.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: entity.document
---

## Definition

Document Management is the organization's ability to capture documents, keep them secure and findable, track their versions, and retain or dispose of them on schedule. It gives every experience the same trustworthy view of what a document is and which version is authoritative.

## Responsibilities

- Capture documents from people, systems, and agents, with consistent metadata.
- Store content securely and preserve its integrity.
- Manage versions and identify the authoritative version.
- Support search and retrieval by metadata and, where appropriate, by content.
- Apply retention categories and support legal or administrative holds.
- Record access and changes, so a document's history can be shown later.

## Boundaries

Document Management handles documents in general. It doesn't decide *why* a document matters to a particular mission: an investigation treats a file as evidence, and a grants program treats it as part of an application. Those meanings belong to the mission composition, or to a specialized entity.

## Considerations

- Classify documents at capture. Applying sensitivity labels afterwards is unreliable.
- Separate the document record from where its bytes are stored, so storage can change without breaking references.
- Retention rules vary by jurisdiction and record type. Keep them configurable rather than hard-coded.
