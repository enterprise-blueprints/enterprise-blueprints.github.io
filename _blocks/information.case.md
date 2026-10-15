---
id: information.case
type: information
title: Case
summary: A matter the organization tracks from the moment it is opened until it is resolved and closed.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: references
    target: information.document
    note: A case refers to the documents that record and support it.
  - type: constrained_by
    target: policy.restricted-case-access
---

## Definition

A case is a discrete matter that an organization takes responsibility for, works on over time, and eventually resolves. It gives scattered activity, people, and records a single identity, so everyone involved can tell what the matter is, where it stands, and who is accountable for it.

## Why it matters

Without a shared concept of a case, each application keeps its own partial record of the same matter. Status, ownership, and history drift apart, and no one can confidently answer "what happened with this?" A shared definition lets experiences, processes, and agents refer to the same matter consistently.

## Core information

- A stable case identifier.
- A case type or category, which determines how the case is handled.
- Status and key dates, such as opened, last updated, and closed.
- Accountable owner and assigned participants.
- Parties or subjects involved, where relevant.
- References to related documents and, where modeled, other cases.
- A sensitivity or access classification.

## Boundaries

A case is the matter itself, not the work steps performed on it. The sequence of work belongs to a process such as {% include ref.html id="process.investigation-lifecycle" %}. A case also isn't a document: it *references* documents, which have their own lifecycle and retention.

## Specialization

Domains often need more specific meaning. An investigative case, for example, carries allegations, subjects, and findings that a general case does not. Model such differences as separate blocks that *specialize* this one, rather than adding domain-specific fields here.
