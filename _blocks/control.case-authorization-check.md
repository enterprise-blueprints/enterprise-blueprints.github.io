---
id: control.case-authorization-check
type: control
kind: preventive
title: Case Authorization Check
summary: Every request to read or change a case is checked against the requester's authorization for that specific case.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: enforces
    target: policy.restricted-case-access
    obligations: [need-to-know, every-channel, agent-identity, access-record]

checks:
  - title: Identify the requester
    description: Establish who or what is asking, and the role they're acting in. An agent acting for a person carries both identities.
  - title: Read the case's sensitivity
    description: Look up the case's current classification, not one stored with the request.
  - title: Check the relationship
    description: Find the requester's relationship to the case, such as assignment or supervision, and any declared conflict of interest.
  - title: Decide
    description: Allow or deny the request under the access rules for that sensitivity. If anything needed for the decision is missing, deny it.
  - title: Record the decision
    description: Log the request and the decision, whichever way it went.

evidence:
  - name: Access decision log
    description: For each request, who asked and on whose behalf, which case, what they asked to do, the decision, the rule that decided it, and when.
  - name: Denial alerts
    description: Repeated or unusual denials, raised for someone to review.
  - name: Rule change history
    description: Who changed the access rules, when, and why.

tests:
  - title: Someone not assigned to a restricted case asks to read it.
    expected: The request is denied, and the denial is logged.
  - title: The assigned investigator reads the case.
    expected: The request is allowed, and the access is logged.
  - title: An agent acting for that investigator reads the case.
    expected: Allowed only because the investigator is allowed. The log names both the agent and the investigator.
  - title: An investigator declares a conflict of interest on the case.
    expected: Their next request for the case is denied.
  - title: A request reaches the case through a different interface or an API.
    expected: The decision is the same as through the main interface.
  - title: The service that makes the decision can't be reached.
    expected: The request is denied. The check fails closed, never open.
---

## Definition

The Case Authorization Check is a safeguard that evaluates each attempt to read or change a case, or its records, against the requester's authorization for *that* case. It applies to people, services, and AI agents alike.

## Objective

Prevent anyone, person or agent, from reading or changing a case they aren't authorized for, whichever way their request arrives.

## Obligations it enforces

{% include block-enforced.html %}

## How it works

{% include block-checks.html %}

## Evidence it produces

{% include block-evidence.html %}

## How to test it

{% include block-tests.html %}

## Agents and automation

Agents go through the same check as people, with no shortcuts. When an agent acts for a person, the check allows only what that person could do, and the log records both. Monitoring denials is a good job for automation, as long as a person reviews what it raises.

## Boundaries

The check belongs as close to the authoritative case record as practical, so every experience is covered by the same rule. A check performed only in a user interface doesn't satisfy {% include ref.html id="policy.restricted-case-access" %}, because other interfaces and agents could bypass it.

It decides each request. It doesn't decide who should be assigned to a case, or remove access when an assignment ends. Those happen in {% include ref.html id="capability.case-management" %}, and the check simply uses the current answer.

## Considerations

- Never give an agent broad access by default. Start from no access and add only what its work needs.
- Denied requests are as useful to monitor as allowed ones.
- Review the access rules when case types or roles change.

## Related standards

- NIST SP 800-53 control AC-3, Access Enforcement, covers enforcing approved authorizations on every access.
- NIST SP 800-162 describes attribute-based access control, a common way to make decisions from the requester's role, the case's sensitivity, and their relationship to it.
