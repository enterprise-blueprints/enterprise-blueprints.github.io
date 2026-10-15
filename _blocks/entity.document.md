---
id: entity.document
type: entity
title: Document
summary: A unit of recorded content, such as a form, letter, report, or recording, and the metadata that describes it.
status: published
scope: shared
domain: cross-cutting
relationships: []
attributes:
  - name: Document identifier
    description: A unique, permanent reference for the document.
  - name: Version
    description: Which version of the document this is.
  - name: Document type
    description: The category the document belongs to, such as a letter, a form, or a report.
  - name: Title
    description: A short name for the document.
  - name: Content
    description: The recorded content itself, or a reference to where it's stored.
  - name: Format
    description: The file format or media type of the content.
  - name: Language
    description: The language or languages the content is written or recorded in.
  - name: Author
    description: The person, team, or system that created the content.
  - name: Created
    description: The date and time the content was created.
  - name: Received
    description: The date and time the organization received the document, if it came from outside.
  - name: Last modified
    description: The date and time the document last changed.
  - name: Sensitivity
    description: The document's sensitivity or access classification.
  - name: Retention category
    description: The records category the document belongs to.
  - name: Related records
    description: Other records the document is connected to, such as a case or an application.
---

## Definition

A document is a unit of recorded content, such as a form, letter, report, image, recording, or attachment. The concept covers both the content and the metadata that describes it: what it is, who created it, when, and how sensitive it is.

## Key attributes

{% include block-attributes.html %}

## Boundaries

A document holds content and its metadata. It doesn't describe how documents are stored, versioned, searched, or kept. Those belong to the capabilities that use it, such as {% include ref.html id="capability.document-management" %}.

When a domain needs more specific information about its documents, define a separate entity that *specializes* this one. {% include ref.html id="entity.investigative-document" %}, for example, adds where a document came from and who has held it.

## Considerations

- Keep the document's metadata separate from where its content is stored, so the content can move without changing the document's identity.
- Treat each version as part of the same document, with its own version number, rather than as a new document.
- Keep the attributes general. Metadata that only makes sense in one domain belongs in a specialization.

## Related standards

- The Dublin Core Metadata Element Set (ISO 15836) defines a small, widely used set of general metadata elements, such as title, creator, date, format, and language.
