---
id: control.conflict-of-interest-declaration
type: control
kind: preventive
title: Conflict of Interest Declaration
summary: Reviewers declare their conflicts before they see an application, and a conflicted reviewer can't open or score it.
status: planned
scope: domain
domain: grants-management
relationships:
  - type: enforces
    target: policy.reviewer-conflicts-of-interest
---
{% comment %} Outline for a control block. When you start writing, delete this line
and the "endcomment" line at the end. Sections marked (optional) can be removed.

<!-- Add `kind:` to the front matter: preventive, detective, corrective. -->

## Definition

<!-- What this block is, in plain words, and what it's for. -->

## Objective

<!-- What the control prevents, detects, or corrects. -->

## Obligations it enforces

<!-- Shown from the `obligations` listed on the control's `enforces` relationships. Add the include; there's nothing else to write. (optional) -->

## How it works

<!-- What the control checks or does, step by step, as `checks` in front matter. -->

{% include block-checks.html %}

<!-- Add to the front matter:
checks:
  - title: First step
    description: What the control does.
-->

## Evidence it produces

<!-- The records it leaves, so others can confirm it worked, as `evidence` in front matter. (optional) -->

{% include block-evidence.html %}

<!-- Add to the front matter:
evidence:
  - name: A log
    description: What it records.
-->

## How to test it

<!-- Situations to try, and the result that shows the control works, as `tests` in front matter. Include what happens when the control itself fails. (optional) -->

{% include block-tests.html %}

<!-- Add to the front matter:
tests:
  - title: A situation to try.
    expected: The result that shows the control works.
-->

## In practice

<!-- Two or three short examples from different settings. (optional) -->

## Agents and automation

<!-- Where AI agents or automation can help, and where a person must stay accountable. (optional) -->

## Boundaries

<!-- What this block is not, and where neighboring blocks take over. -->

## Considerations

<!-- Design advice, trade-offs, and common pitfalls. (optional) -->

## Questions to ask

<!-- A short checklist an organization can use to assess itself against this block. (optional) -->

## Related standards

<!-- Published standards or frameworks that cover the same ground. Point to them without claiming compliance. (optional) -->
{% endcomment %}
