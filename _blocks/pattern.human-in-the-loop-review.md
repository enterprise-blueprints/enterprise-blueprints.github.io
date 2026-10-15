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
  - type: applies_to
    target: process.grant-application-review
    note: Eligibility findings and scores decide whether an application can be funded.

participants:
  - name: Recommender
    type: agent
    description: Prepares the decision, with the information and reasoning behind it.
  - name: Review point
    type: experience
    description: Where the reviewer sees the recommendation, its basis, and their options.
  - name: Reviewer
    type: person
    description: An accountable person with the authority and the information to decide.
  - name: Decision record
    type: capability
    description: Keeps the recommendation, the decision, who made it, and why. The operation is one marked "Agents propose."
  - name: Enforcement point
    type: control
    description: Stops the decision from taking effect until a person has made it, whichever interface or agent asks.

approach:
  - title: Recommend
    description: The automated step produces a recommendation, with the information and reasoning behind it.
  - title: Review
    description: An accountable person reviews the recommendation and accepts, changes, or rejects it.
  - title: Record
    description: The decision, the reviewer, and the reason are recorded, along with the original recommendation.
  - title: Apply
    description: Only then does the decision take effect.

use_when:
  - The decision has significant consequences for a person, for money, or for someone's rights.
  - The decision is hard to reverse once it takes effect.
  - The automation can be wrong in ways that matter, and a person can tell.

avoid_when:
  - The action is low-risk and easy to reverse, so review would become a rubber stamp.
  - Reviewers wouldn't have the information or the time to disagree. Fix that first, or the review is only for show.
---

## Definition

Human-in-the-Loop Review places an accountable person between an automated recommendation and its effect. The automation does the preparation; a person makes the decision.

## Problem

AI agents and automated rules can prioritize, summarize, and recommend faster than people can. But some decisions carry consequences for individuals, money, or rights. When those decisions take effect without a person's judgement, errors go unnoticed and accountability becomes unclear.

## Context

The problem shows up wherever automation prepares a decision that changes someone's situation: screening out a complaint, finding an application ineligible, approving findings, or closing a case. In a capability, these are the operations marked "Agents propose."

## Participants

{% include block-participants.html %}

## Approach

{% include block-approach.html %}

## Trade-offs

Review takes time, and reviewers are a limited resource. Over time, people tend to accept whatever the automation recommends, especially when it's usually right. That habit, known as automation bias, can turn review into a formality. The pattern only works when reviewers have the context, the time, and the standing to disagree.

## When to use it

{% include block-use-when.html %}

## Boundaries

This pattern describes how a decision is reviewed. It doesn't decide which decisions need review: each capability does that with the automation level on its operations. It also doesn't enforce itself. A control, such as an authorization check, has to make sure no interface or agent can skip the review.

## Considerations

- Show reviewers enough context to disagree. A review screen with only "approve" is not meaningful review.
- Track how often recommendations are changed or rejected. It's a useful signal about the automation's quality.
- Make sure the review step can't be bypassed by another interface or agent.

## Questions to ask

- For each decision an agent prepares, who is the accountable reviewer?
- How often do reviewers change or reject recommendations?
- Could a decision take effect through another interface without the review?

## Related standards

- The EU AI Act (Article 14) requires human oversight for high-risk AI systems.
- The NIST AI Risk Management Framework (AI RMF 1.0) covers human oversight as part of managing AI risk.
