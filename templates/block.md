---
# Copy to _blocks/<type>.<slug>.md. The filename must equal the id.
id: capability.example-capability
type: capability            # information | capability | process | experience | policy | control | pattern
title: Example Capability
summary: One sentence that says what this block is.
status: draft               # planned | draft | published
scope: shared               # shared | domain
domain: cross-cutting       # a key from _data/domains.yml
# Intrinsic relationships only: things that are true wherever this block is used.
# Mission-specific roles belong in the mission's `components` instead.
relationships:
  - type: manages           # a key from _data/relationship_types.yml
    target: information.case
    note: Optional short explanation.
---

<!-- The layout shows the title and summary, so start with a level-2 heading. -->

## Definition

What this block is, and why it matters.

## Responsibilities

- What it is responsible for.

## Boundaries

What it is not, and where neighboring blocks take over.

## Considerations

- Design advice, trade-offs, or common pitfalls.
