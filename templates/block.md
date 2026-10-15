---
# Copy to _blocks/<type>.<slug>.md. The filename must equal the id.
# For any type other than capability, `python scripts/new_block.py` writes the
# right sections for you. Each type's sections are listed in
# _data/block_types.yml (block_sections and type_sections).
id: capability.example-capability
type: capability            # entity | capability | process | experience | policy | control | pattern
title: Example Capability
summary: One sentence that says what this block is.
status: draft               # planned | draft | published
scope: shared               # shared | domain
domain: cross-cutting       # a key from _data/domains.yml
# Intrinsic relationships only: things that are true wherever this block is used.
# Mission-specific roles belong in the mission's `components` instead.
relationships:
  - type: manages           # a key from _data/relationship_types.yml
    target: entity.case
    note: Optional short explanation.

# Structured content. Tools and apps read these fields as data.
every_operation:            # optional
  - Something true of every operation, such as recording who did it.
operations:                 # required
  - id: create
    title: Create
    description: What the operation does.
    automation: with-review # allowed | with-review | people-only
states:                     # optional, with transitions
  - id: open
    name: Open
    description: What this state means.
  - id: closed
    name: Closed
    description: What this state means.
transitions:
  - { from: open, to: closed, via: create }
events:                     # optional
  - id: created
    name: Something created
    description: When it's announced.
    raised_by: create       # an operation id; leave out for events like a deadline passing
measures:                   # optional
  - name: A measure
    description: What it shows.
maturity:                   # optional, lowest level first
  - level: Basic
    description: What it looks like.
    questions:
      - A question that shows whether you're at this level?
  - level: Established
    description: What it looks like.
    questions:
      - A question that shows whether you're at this level?
  - level: Advanced
    description: What it looks like.
    questions:
      - A question that shows whether you're at this level?
---

<!-- The layout shows the title and summary, so start with a level-2 heading.
     Use the headings exactly as written, in this order. Delete the optional
     sections you don't need, along with their front matter. -->

## Definition

What this block is, in plain words, and what it's for.

## Operations

{% include block-operations.html %}

## States

{% include block-states.html %}

## Events

{% include block-events.html %}

## Measures

{% include block-measures.html %}

## Maturity levels

{% include block-maturity.html %}

## In practice

<!-- Optional. -->
Two or three short examples from different settings.

## Agents and automation

<!-- Optional. -->
Where AI agents or automation can help, and where a person must stay accountable.

## Boundaries

What this block is not, and where neighboring blocks take over.

## Considerations

<!-- Optional. -->
- Design advice, trade-offs, and common pitfalls.

## Related standards

<!-- Optional. -->
- Published standards or frameworks that cover the same ground.
