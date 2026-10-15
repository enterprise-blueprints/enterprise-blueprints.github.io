---
id: entity.investigative-document
type: entity
title: Investigative Document
summary: A document collected or created during an investigation, with the information about its origin and handling that investigations need.
status: draft
scope: domain
domain: investigations
relationships:
  - type: specializes
    target: entity.document
  - type: references
    target: entity.case
    note: Each investigative document belongs to a case.
attributes:
  - name: Case
    description: The case the document belongs to.
  - name: Evidence reference
    description: The document's reference within the case's evidence.
  - name: Source
    description: The person or organization the document came from.
  - name: Collected
    description: The date and time the document was collected, and who collected it.
  - name: Collection method
    description: How the document was obtained, such as submitted with a report, requested from a third party, or created during an interview.
  - name: Integrity value
    description: A fingerprint of the content, such as a cryptographic hash, recorded when the document was collected.
  - name: Chain of custody
    description: Each change in who held the document, with who, when, and why.
  - name: Related parties
    description: The parties to the case that the document concerns.
  - name: Legal restrictions
    description: Any privilege or other legal limit attached to the document.
---

## Definition

An investigative document is a {% include ref.html id="entity.document" %} that was collected or created during an investigation. Alongside everything a document holds, it records where the document came from, how it was obtained, and who has held it since.

## Key attributes

{% include block-attributes.html %}

## Boundaries

An investigative document holds information about one document. It doesn't describe how evidence is gathered, handled, or disclosed. Those belong to processes such as {% include ref.html id="process.investigation-lifecycle" %} and to the policies that apply to investigations.

It only adds what investigations need. Anything that's true of every document, such as its title, format, or author, stays on Document.

## Considerations

- Record the integrity value and chain of custody as data, not as notes in the description, so they can be checked later.
- Link the source and related parties to the case's parties, rather than copying their names.
