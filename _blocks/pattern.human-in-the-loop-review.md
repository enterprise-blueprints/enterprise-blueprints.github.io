---
id: pattern.human-in-the-loop-review
type: pattern
title: Human-in-the-Loop Review
summary: An accountable person reviews and decides before an automated or AI-assisted recommendation takes effect.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: applies_to
    target: process.investigation-lifecycle
    note: Investigations involve consequential decisions about people, such as screening out a concern or approving findings.
---

## Problem

AI agents and automated rules can prioritize, summarize, and recommend faster than people can. But some decisions carry consequences for individuals, money, or rights. When those decisions take effect without a person's judgement, errors go unnoticed and accountability becomes unclear.

## Approach

Place an explicit review point between a recommendation and its effect:

1. The automated step produces a recommendation, with the information and reasoning behind it.
2. An accountable person reviews it, and can accept, change, or reject it.
3. The decision, the reviewer, and the reason are recorded.
4. Only then does the decision take effect.

## When to use it

Use this pattern when a decision is consequential, hard to reverse, or affects someone's rights or obligations. It's less useful for low-risk, easily reversed actions, where review becomes a rubber stamp.

## Considerations

- Show reviewers enough context to disagree. A review screen with only "approve" is not meaningful review.
- Track how often recommendations are changed or rejected; it's a useful signal about the automation's quality.
- Make sure the review step can't be bypassed by another interface or agent.
