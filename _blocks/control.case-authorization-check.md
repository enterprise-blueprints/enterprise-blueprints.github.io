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
---

## Definition

The Case Authorization Check is a safeguard that evaluates each attempt to read or change a case, or its records, against the requester's authorization for *that* case. It applies to people, services, and AI agents alike.

## How it works

- Identify the requester and the role they're acting in.
- Determine the case's sensitivity and the requester's relationship to it, such as assignment, supervision, or declared conflict.
- Allow or deny the request, and record the decision.

## Boundaries

The check belongs as close to the authoritative case record as practical, so every experience is covered by the same rule. A check performed only in a user interface doesn't satisfy {% include ref.html id="policy.restricted-case-access" %}, because other interfaces and agents could bypass it.

## Considerations

- Agents should act with a defined identity and, where appropriate, on behalf of a specific person. Never give an agent broad access by default.
- Denied requests are as useful to monitor as allowed ones.
- Review authorization rules when case types or roles change.
