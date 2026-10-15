---
id: process.investigation-lifecycle
type: process
title: Investigation Lifecycle
summary: Coordinate an investigation from receiving a concern through findings and closure.
status: published
scope: domain
domain: investigations
relationships:
  - type: uses
    target: capability.case-management
  - type: uses
    target: capability.document-management
  - type: constrained_by
    target: policy.restricted-case-access

trigger: A concern or allegation reaches the organization through any channel, such as a reporting portal, a phone line, a referral from another agency, or a finding from an audit.

steps:
  - id: intake
    title: Intake
    role: Intake analyst
    description: Record the concern, who raised it, and how it arrived. Acknowledge it, check it's complete, and capture any material that came with it.
    uses: [capability.case-management, capability.document-management]
  - id: triage
    title: Triage
    role: Supervisor
    description: Assess whether the matter is within the organization's jurisdiction, how serious it is, and how urgently it needs attention.
    uses: [capability.case-management]
    decisions:
      - decision: Accept or screen out the concern
        accountable: Supervisor
        records: The reason, and any referral elsewhere
      - decision: Set the priority and assign an investigator
        accountable: Supervisor
        records: The priority, the assignee, and the conflict check
  - id: investigation
    title: Investigation
    role: Investigator
    description: Plan the work, gather and preserve evidence, interview the people involved, and keep the case record current as the picture develops.
    uses: [capability.case-management, capability.document-management]
    decisions:
      - decision: Expand or narrow the scope
        accountable: Supervisor
        records: What changed, and why
  - id: findings
    title: Findings
    role: Investigator
    description: Draft conclusions, with the evidence and reasoning behind them, for review.
    uses: [capability.case-management, capability.document-management]
    decisions:
      - decision: Approve the findings
        accountable: Supervisor or designated decision-maker
        records: The approved findings and their basis
  - id: closure
    title: Closure
    role: Supervisor
    description: Communicate the outcome as appropriate, complete any follow-up actions, and preserve the file under its retention schedule.
    uses: [capability.case-management, capability.document-management]
    decisions:
      - decision: Close the case
        accountable: Supervisor
        records: The outcome, follow-up actions, and retention category

outcome: The matter is closed with a recorded outcome and reasoning, any follow-up actions are assigned, and the complete file is preserved for as long as it must be kept.

exceptions:
  - title: New evidence
    description: New information can send a matter back for more investigation, or reopen a closed case. Reopening keeps the same case and its history.
    continues_at: investigation
  - title: A conflict of interest
    description: Someone without the conflict takes over the matter, and the conflict is recorded.
    continues_at: triage
  - title: A referral
    description: The matter goes to another agency or team. The case records where it went, and closes unless the organization keeps a role.
    continues_at: closure
  - title: A withdrawn concern
    description: Withdrawal doesn't always end the work. A supervisor decides whether the matter continues on its own merits.
---

## Definition

The Investigation Lifecycle coordinates the work of turning a reported concern into a documented, defensible outcome. It describes how work moves between people, when decisions are made, and what must be recorded at each point.

## Flow

{% include block-flow.html %}

## Exceptions and rework

{% include block-exceptions.html %}

## Agents and automation

Agents can take on much of the reading and writing in this process. They can summarize an incoming concern, suggest a priority, organize evidence, draft interview notes, or outline findings. The decisions in the flow stay with people. Apply {% include ref.html id="pattern.human-in-the-loop-review" %} wherever an agent's suggestion could change a decision, such as screening out a concern or shaping the findings.

## Boundaries

This process coordinates work. It doesn't own the case record or the documents. It *uses* {% include ref.html id="capability.case-management" %} to keep case state and {% include ref.html id="capability.document-management" %} to keep the evidence file.

Organizations name and divide these steps differently. The {% include ref.html id="mission.investigations" text="Investigations blueprint" %} shows them as an illustrative lifecycle, not a required sequence.

## Considerations

- Every decision in the flow affects real people, so each one names who is accountable. Keep it that way even when an agent prepares the recommendation.
- Record the reason for each decision, not just the decision, so the process can be audited.
- Track how long matters spend at each step. Matters that stall in triage are a common, quiet failure.
- Keep the reporting party informed where it's appropriate. Silence often leads to repeat reports and lost trust.

## Questions to ask

- Is every concern recorded, including the ones that are screened out?
- Can you show who approved each set of findings, and on what basis?
- Do you know how many matters are waiting at each step, and for how long?
- When an agent suggests a decision, can you tell whether a person confirmed it?

## Related standards

- The Council of the Inspectors General on Integrity and Efficiency (CIGIE) publishes *Quality Standards for Investigations*, which cover planning, execution, and reporting for U.S. federal offices of inspector general.
