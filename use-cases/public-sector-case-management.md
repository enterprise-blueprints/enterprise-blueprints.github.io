---
id: "use-case:public-sector-case-management"
title: "Public Sector Case Management"
type: "use-case"
status: "draft"
summary: "How an organization manages a matter from an internal or external source through resolution."
related: []
---

# Public Sector Case Management

## Overview

Case management helps an organization resolve a matter over time. A case brings together the people, information, tasks, decisions, and actions needed to handle that matter.

A case can start inside or outside the organization. An employee may raise an issue. A team may identify work that needs attention. A person or another organization may submit a request, report, or referral.

The organization records the matter, assigns responsibility, gathers information, and carries out the work. It records the outcome and closes the case when the work reaches an agreed endpoint.

This use case describes core case management. Public-sector organizations provide the starting context, but the same concepts can support casework across an enterprise.

### Intended outcomes

- Participants know how to raise a matter and what happens next.
- Staff can find the case history, current owner, and outstanding work.
- Teams can transfer work without losing information or responsibility.
- Decision-makers can explain their decisions.
- The organization keeps a record of its actions and the outcome.

### Boundaries

The core process covers the work from receipt through closure. It also supports related cases, follow-up work, and review of an outcome.

Each organization defines when to open a case, who may act, and what counts as completion. Specialized case types add their own rules. A benefits application, an employee concern, and a service request can share case management concepts without sharing every process step.

A message or task does not always create a new case. Staff may add a message to an existing case or complete a task as part of that case.

### Example

An employee or an external participant reports an issue. Staff record it and check whether an existing case covers the same matter. A coordinator assigns an owner. The owner gathers information and asks another team to complete a task. Staff record the result, update the relevant participants, and close the case.

The source of the report may change who participates and what information they can see. The core need remains the same: keep the work, information, and responsibility connected.

## Personas

These roles describe the people involved. An organization may combine roles or require different people to perform them.

| Persona | Responsibilities | Needs |
| --- | --- | --- |
| Initiator | Raise a matter and provide information, from inside or outside the organization | Clear instructions, confirmation of receipt, and updates |
| Participant | Provide information or respond to work that affects them | A way to contribute and access the information they may see |
| Representative | Act for another participant | Clear authority and limits on what they may submit or receive |
| Intake staff | Record the matter, check completeness, and direct it to the right team | Intake guidance and relevant case history |
| Case owner or coordinator | Manage the case and coordinate the work | Current information, tasks, responsibility, and progress |
| Specialist or supporting team | Assess an issue or complete assigned work | A clear task and enough information to complete it |
| Decision-maker or reviewer | Make or review a decision | Evidence, decision criteria, and a record of the reasons |
| Supervisor | Manage workload and resolve delays or escalations | Visibility into ownership, outstanding work, and outcomes |
| Records or oversight staff | Review the history and support records handling | Reliable records and appropriate access |

## Process

These stages describe common work. They do not prescribe case statuses or a fixed sequence. Teams may repeat stages or work on several tasks at once.

| Stage | Work | Result |
| --- | --- | --- |
| 1. Receive | Staff record a matter from an internal or external source | A record of the matter and its source |
| 2. Review and route | Staff check responsibility, urgency, missing information, and related cases | A new case, an update to an existing case, a request for information, or a referral |
| 3. Assign | A coordinator identifies an owner and supporting teams | Clear responsibility for the case and its tasks |
| 4. Assess | Staff gather information, consult participants, and identify the work needed | An assessment and next steps |
| 5. Decide and act | Authorized people make decisions and carry out the work | Recorded decisions, actions, and reasons |
| 6. Communicate | Staff explain progress, outcomes, and outstanding work to relevant participants | Updates and recorded responses |
| 7. Close | The owner checks completion and records the outcome | A closed case and any follow-up work |

Staff communicate throughout the process. Closing a case does not delete its history. Participants may disagree with an outcome or request further review.

### Variations

- **Missing information:** Staff request what they need and record who must respond.
- **Related matters:** Staff link related cases or reports and preserve their histories.
- **Referral:** Staff direct the matter to another team or organization and record the reason.
- **Reassignment:** The current owner transfers the case with its information and outstanding work. The organization identifies who takes responsibility.
- **Withdrawal or cancellation:** Staff record why the work stopped and identify any remaining obligations.
- **Review or reopening:** A reviewer examines the outcome. Staff preserve earlier decisions and record new work in the same case or a linked case.
- **Parallel work:** Several teams complete different tasks within the case. The owner tracks the overall outcome.

## Constraints and open questions

### Core requirements

The organization needs clear ownership and authority to act. An internal source does not automatically grant access to every case. An external source does not always require an online account. Staff must support the channels and access rules that apply to the work.

Each case type defines its privacy, accessibility, records, deadlines, and review requirements. The core model must support those requirements without imposing one set of rules on every case.

AI tools may help staff organize information or draft updates. People remain responsible for consequential decisions in this draft. Any delegated action needs a defined scope, authority, and record of what happened.

### Questions for the supporting architecture

1. What information must a case hold, regardless of its source or type?
2. What distinguishes a case from a message, task, or related matter?
3. How does the organization establish ownership and transfer responsibility?
4. Who may open, view, contribute to, act on, or review a case?
5. How does the case record decisions, actions, changes, and outcomes?
6. How do case types add their own process steps and rules?
7. How does the organization manage the record after closure?

### Scenarios to check

The blueprint should support cases from both internal and external sources. It should also support missing information, reassignment, related cases, different access rights, parallel tasks, and review of an outcome. Each scenario should show who owns the case, what work remains, and why people took each action.

## Related architecture

The supporting blueprint and reusable definitions remain to be written. Concepts to explore include Case, Participant, Interaction, Task, Document, Assignment, and Decision.

The [Blueprints](../blueprints/README.md) section will describe the logical design. [Implementations](../implementations/README.md) will describe product choices and technology mappings.

This draft follows [Charter v0.5](../charter/project-charter-v0.5.md). Return to the [Use Cases index](README.md).
