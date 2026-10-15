---
id: policy.restricted-case-access
type: policy
title: Restricted Case Access
summary: Access to a case and its records is limited to people and agents with an authorized need.
status: published
scope: shared
domain: cross-cutting
relationships: []
---

## Definition

Restricted Case Access is a policy that limits who may view or change a case and its associated records. Access depends on a person's or agent's role, their assignment to the case, and the case's sensitivity, not simply on having access to the system that holds it.

## Why it matters

Cases often contain sensitive information about individuals. Investigations in particular may involve whistleblowers, subjects who haven't been told they're under review, or information that could compromise the outcome if disclosed. Inappropriate access can cause real harm and undermine trust in the process.

## Obligations

- Grant access according to role, assignment, and the case's classification.
- Apply the same restriction to every experience, interface, and AI agent that can reach the case.
- Allow access to be removed promptly, for example when a conflict of interest is declared.
- Keep a record of who accessed or changed a restricted case.

## Boundaries

This policy states the obligation. How it's enforced is described by controls such as {% include ref.html id="control.case-authorization-check" %}. The specific roles and classifications are set by each organization; this library doesn't prescribe a legal or regulatory standard.
