---
id: process.grant-application-review
type: process
title: Grant Application Review
summary: Coordinate the screening, evaluation, and recommendation of grant applications.
status: draft
scope: domain
domain: grants-management
relationships:
  - type: uses
    target: capability.document-management

trigger: An applicant submits an application to an open funding opportunity.

steps:
  - id: receipt
    title: Receipt
    role: Program officer
    description: Confirm the application arrived before the deadline, acknowledge it, and record it with its attachments.
    uses: [capability.document-management]
  - id: eligibility
    title: Eligibility screening
    role: Program officer
    description: Check the application against the program's eligibility rules and its list of required contents.
    decisions:
      - decision: Find the application eligible or ineligible
        accountable: Program officer
        records: The rules applied, and the reason for any ineligibility
  - id: merit-review
    title: Merit review
    role: Reviewer
    description: Read each eligible application and evaluate it against the program's published criteria.
    uses: [capability.document-management]
    decisions:
      - decision: Score the application
        accountable: Reviewer
        records: A score and comments for each criterion
  - id: recommendation
    title: Recommendation
    role: Program officer
    description: Combine the reviewers' scores, rank the applications, and prepare funding recommendations for an award decision.
    decisions:
      - decision: Recommend applications for funding
        accountable: Program officer
        records: The ranking, the recommendation, and the basis for it

outcome: Every application has a documented eligibility finding, and every eligible application has reviewer scores and a funding recommendation, ready for an award decision.

exceptions:
  - title: A late or incomplete application
    description: Many programs reject late applications outright. Some allow missing items to be supplied by a set date.
    continues_at: eligibility
  - title: A reviewer's conflict of interest
    description: The reviewer steps aside from that application, the conflict is recorded, and another reviewer takes it.
    continues_at: merit-review
  - title: Widely differing scores
    description: When reviewers disagree sharply, the program officer arranges a discussion or an additional review.
    continues_at: merit-review
  - title: A disputed eligibility finding
    description: If the program allows it, someone who didn't make the original finding reconsiders it.
    continues_at: eligibility
---

## Definition

Grant Application Review coordinates the work of deciding which applications a program should recommend for funding. It covers checking that applications are eligible, evaluating them on their merits, and turning the results into recommendations, with a clear record of each step.

## Flow

{% include block-flow.html %}

## Exceptions and rework

{% include block-exceptions.html %}

## Agents and automation

Automation is well suited to the routine checks: whether an application arrived on time, whether required attachments are present, and whether basic eligibility rules are met. Agents can also summarize applications for reviewers or point out inconsistencies. Eligibility findings, scores, and recommendations stay with people. Apply {% include ref.html id="pattern.human-in-the-loop-review" %} wherever an automated check or an agent's suggestion could affect whether an application moves forward.

## Boundaries

This process ends with a recommendation. The award decision, the agreement, and oversight of the grant come after it. The process works on {% include ref.html id="entity.grant-application" %} records and uses {% include ref.html id="capability.document-management" %} to receive and keep the application packages.

## Considerations

- Publish the criteria and how they're weighted before applications open, and review against exactly those.
- Give reviewers a shared understanding of each criterion before they score, so scores mean the same thing across reviewers.
- Ask every reviewer to declare conflicts before they see the applications they'll review.

## Questions to ask

- Can you show, for any application, why it was found eligible or ineligible?
- Did every reviewer score against the same published criteria?
- Can you see each reviewer's scores and comments, not just the combined result?
- When an automated check screened out an application, did a person confirm it?
