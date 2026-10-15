---
id: capability.application-management
type: capability
title: Application Management
summary: Receive grant applications and track each one's status, from submission to a funding decision.
status: planned
scope: domain
domain: grants-management
relationships:
  - type: manages
    target: entity.grant-application
  - type: constrained_by
    target: policy.grant-eligibility
---
{% comment %} Outline for a capability block. When you start writing, delete this line
and the "endcomment" line at the end. Sections marked (optional) can be removed.

## Definition

<!-- What this block is, in plain words, and what it's for. -->

## Operations

<!-- The actions the capability offers, and who may perform each one (`operations`), plus anything true of every operation, such as recording who did it (`every_operation`). Start each `every_operation` rule with a verb, because the page joins them into one sentence that begins "Every operation". -->

{% include block-operations.html %}

<!-- Add to the front matter:
every_operation:
  - Something true of every operation, such as recording who did it.
operations:
  - id: create
    title: Create
    description: What the operation does.
    automation: with-review   # allowed | with-review | people-only
    takes: [What it needs]          # optional
    returns: [What it gives back]   # optional
    authority: Who may do it, if narrower than the usual access check.   # optional
-->

## States

<!-- The states its entities move through (`states`), and which operation moves them from one to the next (`transitions`). (optional) -->

{% include block-states.html %}

<!-- Add to the front matter:
states:
  - id: open
    name: Open
    description: What this state means.
transitions:
  - { from: open, to: closed, via: close }
-->

## Events

<!-- What the capability announces when something happens, and the operation that raises each one, as `events` in front matter. (optional) -->

{% include block-events.html %}

<!-- Add to the front matter:
events:
  - id: created
    name: Something created
    description: When it's announced.
    raised_by: create   # an operation id; leave out for events like a deadline passing
-->

## Measures

<!-- How you can tell the capability is working, as `measures` in front matter. (optional) -->

{% include block-measures.html %}

<!-- Add to the front matter:
measures:
  - id: a-measure
    name: A measure
    description: What it shows.
-->

## Maturity levels

<!-- What basic, established, and advanced look like, with questions that help an organization tell which level it's at, as `maturity` in front matter. (optional) -->

{% include block-maturity.html %}

<!-- Add to the front matter:
maturity:
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
-->

## In practice

<!-- Two or three short examples from different settings. (optional) -->

## Agents and automation

<!-- Where AI agents or automation can help, and where a person must stay accountable. (optional) -->

## Boundaries

<!-- What this block is not, and where neighboring blocks take over. -->

## Considerations

<!-- Design advice, trade-offs, and common pitfalls. (optional) -->

## Related standards

<!-- Published standards or frameworks that cover the same ground. Point to them without claiming compliance. (optional) -->
{% endcomment %}
