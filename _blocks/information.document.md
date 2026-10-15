---
id: information.document
type: information
title: Document
summary: A unit of recorded content, with the metadata needed to find, trust, and retain it.
status: published
scope: shared
domain: cross-cutting
relationships: []
---

## Definition

A document is recorded content that the organization needs to keep, find, and rely on: a form, letter, report, image, recording, or attachment. The concept covers both the content and the metadata that gives it meaning, such as its type, author, dates, version, and classification.

## Why it matters

Documents are often the evidence that a decision was made properly. When each application stores files its own way, the organization loses track of which version is authoritative, who has seen it, and how long it must be kept. A shared definition makes documents findable and trustworthy across experiences.

## Core information

- A stable document identifier and version.
- Document type and a human-readable title.
- Content, or a pointer to where the content is stored.
- Provenance: who created or submitted it, and when.
- Sensitivity classification and retention category.
- The records it relates to, such as a case or an application.

## Boundaries

This block describes the information concept, not the system that stores it. Storing, versioning, and retaining documents is the job of {% include ref.html id="capability.document-management" %}. Domain-specific kinds of document, such as investigative evidence, are modeled as specializations.
