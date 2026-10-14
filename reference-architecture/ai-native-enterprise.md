---
id: "reference-architecture:ai-native-enterprise"
title: "AI-Native Enterprise Reference Architecture"
type: "reference-architecture"
status: "draft"
summary: "A layered logical architecture connects adaptable experiences, governed capabilities, orchestration, and enterprise entities and state."
related:
  - "foundation:ai-native-enterprise"
  - "foundation:enterprise-capability-map"
  - "capability:catalog"
  - "use-case:public-sector-case-management"
---

# AI-Native Enterprise Reference Architecture

**Build Experiences. Share Capabilities.**

An AI-native enterprise allows people and agents to discover, compose, and operate governed capabilities. Experiences can change quickly while business meaning, authority, and records remain durable.

This reference architecture describes the responsibilities that make that possible. A blueprint applies them to a particular problem. An implementation explains how selected technologies fulfill them and provides evidence that they work.

## Purpose and boundaries

The model starts with public-sector work and is intended to apply across the enterprise. It builds on [The Enterprise Capability Map](../foundations/enterprise-capability-map.md) and the provisional stack in [Charter v0.5](../charter/project-charter-v0.5.md).

Mission outcomes, business responsibilities, personas, and process establish the context above the stack. [Use cases](../use-cases/README.md) and [mission models](../missions/README.md) describe that context. The layers explain how the enterprise supports the work.

The capability map expands the Enterprise Capabilities layer into business and shared capabilities and connects them to Enterprise Entities and State. This reference architecture places that focused view within the full stack, adding Experiences and Orchestration. Both views use the same cross-cutting controls and separate technology implementation view.

This is a proposed logical model. Layers identify responsibilities; they do not prescribe separate products, services, databases, or deployment tiers. Calls can skip orchestration when an action is simple. Events and results can travel between layers. One component can fulfill several responsibilities, and several components can share one responsibility.

## The layered model

{% assign architecture_diagram = site.pages | where: 'path', 'assets/diagrams/ai-native-enterprise-stack.html' | first %}
{% capture diagram_link_prefix %}href="{{ '/' | relative_url }}{% endcapture %}
{{ architecture_diagram.content | replace: 'href="/', diagram_link_prefix }}

The stack separates four responsibilities: Experiences, Enterprise Capabilities, Orchestration, and Enterprise Entities and State. Security, Trust, and Policy govern every layer. Operations and Assurance sustain the whole model. Technology realizations map to all four layers and both sets of controls.

### Experiences

**Help a person or agent understand and carry out the work.**

Examples include a public form, a staff workspace, an assisted service channel, a generated interface, and a conversational assistant. An agent can also consume capabilities without a visual interface.

Experiences present information, collect intent, and request permitted actions. They support accessibility, clear outcomes, and recovery when work cannot complete. A generated experience needs an owner, a permitted scope, and a lifecycle before it handles enterprise work.

An experience may maintain presentation state or a draft. Authoritative changes go through governed capabilities. Hiding a button does not enforce authorization, and a generated interface cannot grant itself new permissions.

### Enterprise Capabilities

**Provide owned, reusable responsibilities through explicit contracts.**

The [Capability Catalog](../capabilities/catalog.md) distinguishes business capabilities, such as Case Management, from shared capabilities, such as Document Management, Notification, and Approval. Both belong here. Sharing does not eliminate the rules that belong to a program.

A capability contract should describe its operations, inputs, outputs, events, authorized actors, preconditions, policy obligations, failure behavior, and ownership. Consumers also need versioning and service commitments. The current catalog supplies starter responsibilities and operations; it does not yet establish complete executable contracts.

APIs, events, workflows, and agent tools can expose a capability. Discovering an action in a catalog does not authorize its use. A tool description helps a model select an action; enforcement at the capability boundary determines whether it may execute.

Capabilities describe what the enterprise provides. Orchestration below them coordinates the work needed to fulfill those commitments. For example, opening a case may coordinate checks, assignment, and notifications while preserving the meaning, authority, and result of the case capability's contract.

### Orchestration

**Coordinate steps, dependencies, and human decisions to fulfill capability commitments.**

Workflows, agent plans, task coordination, and event-driven processes carry out the work behind capability contracts. Coordination needs explicit process state, responsibility for the next step, waiting conditions, deadlines, and recovery behavior. These steps can evolve while the capability's contract remains stable.

Orchestration can also compose several capabilities toward a broader outcome. An experience or agent may initiate that coordination, but each invoked capability retains its own contract and enforcement boundary. The layer's position describes a responsibility; it does not require all calls to travel downward through the stack.

An agent may propose the next action. The orchestrator must check whether that action is permitted before invoking it, and the receiving capability must enforce its own boundary. Consequential decisions remain with authorized people in this draft, consistent with the current case management use case and Approval capability.

Orchestration is a responsibility, not a requirement for one enterprise workflow engine. [Workflow and Approval](../capabilities/catalog.md) remain reusable capabilities with contracts at the capability boundary; their coordination mechanisms fulfill orchestration responsibilities. A case process composes those services with case-specific rules without creating a second owner for their records or decisions.

### Enterprise Entities and State

**Preserve shared business meaning, authoritative state, and history under accountable ownership.**

Entities such as Case, Person, Document, Task, and Decision need defined meaning, identifiers, relationships, lifecycle rules, provenance, and authority. Contracts and events should preserve those meanings across system boundaries.

Within this layer, shared semantics explain what a concept means; authoritative state identifies its accepted values and who controls them. Each record or field needs an identified authoritative source and rules for changes, retention, correction, and reconciliation. The authoritative case history, document record, decision record, and financial record may live in different systems.

The layer also includes governed data views, reference data, analytical data products, and derived search representations. An AI retrieval index or generated summary is derived information. Its sources, freshness, access restrictions, and permitted uses must be known. Permission to retrieve a summary must not expose source information the actor cannot access. A model's output becomes an authoritative record only through an explicitly authorized recording process.

The logical architecture defines meaning and authority. Implementation guidance identifies the databases, platforms, and systems of record that maintain them. A shared logical model can span several physical systems without requiring one enterprise schema or a duplicate master database.

Capabilities mediate authoritative changes. State and history can reside inside a capability implementation. The diagram does not require another network call or database tier beneath every capability.

## Controls across the stack

### Security, Trust, and Policy

Security protects information and actions against unauthorized access, disclosure, modification, and disruption. Trust establishes identities, provenance, and delegated authority. Policy defines permitted behavior and obligations, including privacy, records requirements, accessibility, and human oversight. These responsibilities apply across all four layers and their technology implementations.

An agent's identity and delegated authority must be distinguishable from those of the person or organization it assists. Each capability must enforce the scope of that authority when it receives a request.

| Layer | Example security responsibilities |
| --- | --- |
| Experiences | Secure sessions and safe presentation of sensitive information |
| Enterprise Capabilities | Authorization, request validation, and constraints on agent actions |
| Orchestration | Delegated scope across steps and protection of workflow state |
| Enterprise Entities and State | Protection of authoritative state, restricted derived views, and data integrity |

Policy definition, distribution, enforcement, and review are separate responsibilities. A control plane can manage rules and permitted configurations; the components carrying out the work must enforce applicable rules and produce evidence. Some obligations remain human procedures.

Place each control where it can reliably enforce the requirement. Accessibility in experiences, capability authorization, and record retention need different enforcement points. Shared controls support local obligations without removing the program owner's accountability.

The charter's provisional diagram places Trust and Policy in the stack. This draft names the concern Security, Trust, and Policy and shows it alongside the layers to make its reach explicit. That placement is a proposal for refinement, not a change to the preserved charter.

### Operations and Assurance

Trace work across requests, workflow instances, capability invocations, and records. Distinguish the initiating actor, delegated agent, approving person, and executing component where applicable. Retain enough evidence to explain what happened while limiting unnecessary sensitive information in telemetry.

Owners need to manage availability, incidents, deployment, contract changes, cost, evaluation, and retirement. Monitoring, incident response, and control evaluation provide evidence that security and policy controls work. AI evaluation should exercise task quality, restricted information access, attempted actions outside delegated scope, and recovery when a model or tool fails. Runtime controls still apply when an evaluation passes.

## Mapping to technology implementations

An implementation realizes the logical architecture through selected products, configurations, custom code, integration mechanisms, and operating procedures. Technology is a separate realization view of the whole model.

The mapping is many-to-many: one product can provide an experience, orchestration, capability operations, and records; one capability can depend on several products. Replacing a product should preserve logical obligations or explicitly document the differences.

Use the [implementation template on GitHub](https://github.com/enterprise-blueprints/enterprise-blueprints.github.io/blob/main/templates/implementation.md) to identify the source architecture and revision, then describe each mapping:

| Mapping field | What an implementation must explain |
| --- | --- |
| Logical source | Stable artifact ID and source revision; capability operation or layer responsibility covered |
| Realization | Product, component, configuration, adapter, or human procedure that fulfills it |
| Contract and authority | Inputs, results, failure behavior, authoritative state, and who may act |
| Controls | Where relevant requirements are enforced and what evidence is produced |
| Coverage and gaps | Supported behavior, extensions, limitations, and departures from the logical model |
| Validation and ownership | Scenarios exercised, observed results, operational owner, and change responsibilities |

These are proposed documentation fields, not an implemented mapping schema. Initial vendor-specific mappings should begin with a small case management flow so they can test the architecture before expanding it.

## Follow a case through the layers

The [Public Sector Case Management use case](../use-cases/public-sector-case-management.md) provides the first check. These are illustrative logical responsibilities, not a completed blueprint or running implementation.

| Work | Responsibility and boundary |
| --- | --- |
| Receive a matter | An experience collects a submission through an appropriate channel. Submission alone does not establish identity or authority. |
| Open and assign a case | Case Management exposes the catalog's `Case.create` and `Case.assign` operations, enforces access, and records an accountable owner. Orchestration coordinates the steps needed to fulfill those commitments. |
| Gather information | Document Management and other capabilities provide authorized information using shared identifiers. Enterprise Entities and State defines shared meaning, authoritative sources, and provenance for derived summaries. |
| Prepare and make a decision | An agent may prepare a recommendation. Approval routes it to an authorized person; the case records reasons, evidence, and the decision-maker. |
| Notify and close | Notification reports delivery outcomes. Case Management checks closure requirements and preserves the case history. |

If notification fails after the decision is recorded, the process retains that decision and tracks communication as outstanding work. A retry must not create a second decision. If access is revoked while an agent is waiting, the next capability call must evaluate current authority before proceeding.

For each flow, name the actor, capability operation, state owner, enforcement point, and evidence produced. That makes the stack testable.

## Tradeoffs and open questions

Separating responsibilities makes reuse and authority easier to discuss, but it can obscure how much work a single platform already performs. Implementation mappings must show those overlaps. Shared capabilities also introduce dependencies that require dependable ownership and change management.

Questions for the next iteration:

1. Does placing orchestration beneath capability contracts clarify how commitments are fulfilled, including when Workflow is itself a capability?
2. How should Enterprise Entities and State express shared meaning, authority, and derived information across agencies and existing systems?
3. Which contract fields must be machine-readable before an agent can safely discover and compose actions?
4. How should delegated scope, expiry, revocation, and required human approval be represented and enforced?
5. Which failure and recovery scenarios should every implementation demonstrate?

Start by reviewing these boundaries, then compose the Case Management blueprint and map one small flow to an implementation. Feedback from that flow should refine the logical model.
