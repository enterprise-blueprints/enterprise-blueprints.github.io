---
id: policy.restricted-case-access
type: policy
title: Restricted Case Access
summary: Access to a case and its records is limited to people and agents with an authorized need.
status: published
scope: shared
domain: cross-cutting
relationships: []

obligations:
  - id: need-to-know
    level: must
    statement: Grant access to a case only according to the requester's role, their assignment to the case, and the case's sensitivity.
  - id: every-channel
    level: must
    statement: Apply the same restrictions to every experience, interface, service, and agent that can reach the case.
  - id: agent-identity
    level: must
    statement: Give every agent its own identity, and act on behalf of a named person wherever a person directed the work.
  - id: prompt-removal
    level: must
    statement: Remove access promptly when it's no longer needed, such as when an assignment ends or a conflict of interest is declared.
  - id: access-record
    level: must
    statement: Keep a record of who viewed or changed a restricted case, and when.
  - id: confidential-reporters
    level: must-not
    statement: Reveal the identity of a reporting party who asked for confidentiality to anyone without a need to know, except where the law requires it.
  - id: regular-review
    level: should
    statement: Review who has access to restricted cases at regular intervals.

waivers:
  - title: Emergency access
    description: Someone without normal access needs a case urgently, for example to protect a person from harm.
    approved_by: A designated senior official, with every use reviewed afterwards
  - title: Oversight and audit
    description: Auditors or an oversight body need to review cases as part of their role.
    approved_by: The head of the organization, for a defined scope and period
  - title: Legal disclosure
    description: A court order or other legal obligation requires information to be disclosed.
    approved_by: Legal counsel
---

## Definition

Restricted Case Access is a policy that limits who may view or change a case and its associated records. Access depends on a person's or agent's role, their assignment to the case, and the case's sensitivity, not simply on having access to the system that holds it.

## Intent

Cases often hold sensitive information about people. Investigations in particular may involve people who reported a concern in confidence, subjects who haven't been told they're under review, or information that could compromise the outcome if it got out. Access beyond those who need it can cause real harm and undermine trust in the organization.

## Obligations

{% include block-obligations.html %}

Where an obligation shows "No control yet," nothing in this library enforces it so far. That's a gap to close, either with a control or with a process that checks it.

## Source of authority

Restrictions like these usually come from privacy and data protection law, from laws that protect people who report wrongdoing, and from the organization's own information security policy. The specific roles and classifications are set by each organization. This library doesn't prescribe a particular legal or regulatory standard.

## Exceptions and waivers

{% include block-waivers.html %}

Every exception is recorded, with who approved it, why, and for how long.

## Agents and automation

Agents are bound by this policy exactly as people are. They need their own identity, access only to the cases their work requires, and a record of everything they read or change. An agent working for an investigator should never see more than that investigator could.

## Boundaries

This policy states the obligations. How they're enforced is described by controls such as {% include ref.html id="control.case-authorization-check" %}, which shows which obligations it covers.

## Questions to ask

- Could anyone, or any agent, read a restricted case without being assigned to it?
- Do every interface and every agent go through the same access rules?
- How quickly is access removed when an assignment ends?
- Can you show who viewed a restricted case last month?

## Related standards

- NIST SP 800-53 sets out access control requirements in its Access Control (AC) family, including least privilege and access enforcement.
- ISO/IEC 27001 includes access control among the controls in its Annex A.
