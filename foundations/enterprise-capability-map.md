---
id: "foundation:enterprise-capability-map"
title: "The Enterprise Capability Map"
type: "foundation"
status: "draft"
summary: "A focused view of the reference architecture connects business and shared capabilities to enterprise entities and state, cross-cutting controls, and technology implementations."
related:
  - "foundation:ai-native-enterprise"
  - "use-case:public-sector-case-management"
  - "reference-architecture:ai-native-enterprise"
  - "capability:catalog"
---

# The Enterprise Capability Map

An enterprise can have hundreds of applications and still struggle to explain what it can do.

The application inventory tells us which products the organization owns. It may tell us who supports them, how much they cost, and when their contracts expire.

It rarely tells us which responsibilities those applications share.

A benefits system sends notifications. A grants system sends notifications. A licensing system sends notifications.

Each may have its own document storage, person records, approval process, and audit trail.

From the perspective of an individual application, these choices can seem reasonable.

From the perspective of the enterprise, they raise a different question:

> Which capabilities belong to a particular program, and which should the enterprise provide for many programs?

That question becomes more important as employees and agents gain the ability to create software.

The [AI-Native Enterprise](ai-native-enterprise.md) describes why easier software creation increases the need for durable architecture. A capability map gives that architecture a common starting point.

It helps us see the work the enterprise performs, the actions experiences can reuse, the information those actions depend on, and the rules that govern them.

## Start With What the Enterprise Does

A public sector organization administers benefits, manages grants, handles cases, issues licenses, reviews permits, conducts inspections, procures goods and services, and coordinates emergency response.

These are business capabilities.

They describe what the organization needs to be able to do. They do not prescribe an application, a department structure, or a particular technology.

Licensing remains a business capability whether someone applies through a website, a service counter, or an assisted process.

The interface may change.

The responsibility remains.

Business capabilities also contain rules that belong to the work itself. A licensing program determines which qualifications matter. A grants program determines which costs a grant allows. An inspection program determines what an inspector must assess.

Sharing enterprise architecture does not remove those responsibilities.

It gives programs a common foundation for carrying them out.

## A Shared Map

The map below uses public sector examples. The same relationships apply to other enterprises.

Business capabilities consume and compose shared capabilities. Both are groups within the Enterprise Capabilities layer. They operate on Enterprise Entities and State. Security, Trust, and Policy govern the work; Operations and Assurance sustain it and provide evidence. Technology implementations realize these responsibilities.

{% assign capability_map = site.pages | where: 'path', 'assets/diagrams/enterprise-capability-map.html' | first %}
{% capture diagram_link_prefix %}href="{{ '/' | relative_url }}{% endcapture %}
{{ capability_map.content | replace: 'href="/', diagram_link_prefix }}

The examples are a starting point. They do not form a complete capability catalog, and they do not imply that every organization needs one central platform.

An agency may share a capability across its programs. Several agencies may agree on a contract while operating separate implementations. A program may retain a specialized capability when its responsibilities require one.

The map makes those choices visible.

## How the Map Connects to the Reference Architecture

The [AI-Native Enterprise Reference Architecture](../reference-architecture/ai-native-enterprise.md) describes four layers: Experiences, Enterprise Capabilities, Orchestration, and Enterprise Entities and State. This map focuses on the capabilities and information that those experiences and processes rely on.

Business and shared capabilities occupy the same logical layer. The grouping highlights which responsibilities belong to a program and which actions can be reused across programs. The relationship between them expresses composition, not separate deployment tiers.

| Reference architecture responsibility | Connection to this map |
| --- | --- |
| Experiences | Public forms, staff workspaces, and agents consume the capabilities shown here. |
| Enterprise Capabilities | The map expands this layer into business and shared capability groups. |
| Orchestration | Coordination fulfills capability commitments and composes actions across capabilities. Workflow and Approval expose reusable contracts; their coordination mechanisms support this responsibility. |
| Enterprise Entities and State | The map identifies shared concepts and the authoritative state that capability actions use or change. |
| Security, Trust, and Policy | Cross-cutting controls govern actors, actions, information, and implementations. |
| Operations and Assurance | Monitoring, audit evidence, evaluation, recovery, and lifecycle management sustain the model. |
| Technology implementations | A separate realization view maps products and components to responsibilities across the model. |

Use the map to identify reusable responsibilities. Use the reference architecture to place them alongside experiences, coordination, information, and controls. A blueprint then applies both views to a particular use case.

## Shared Capabilities Provide Reusable Actions

A business process often needs actions that many other processes also need.

Retrieve information about a person.

Validate an address.

Store a document.

Send a notification.

Request an approval.

Retrieve payment status.

These actions are candidates for shared enterprise capabilities.

An application, workflow, or agent should be able to use them through a clear contract. That contract describes what the capability accepts, what it returns, who may use it, and what happens when it cannot complete the action.

The implementation may use an API, a workflow, an event, a service, or an agent tool.

The capability describes the responsibility that these mechanisms fulfill.

A notification capability, for example, could accept a recipient, an approved message, and a delivery preference. It could return a delivery identifier and expose delivery status. The consuming experience would not need to implement each delivery channel itself.

But reuse requires more than making an action available.

Someone must own the capability. Consumers need to understand its limits. Changes need to preserve the commitments on which other systems depend.

A shared capability creates a shared responsibility.

## Entities Give Capabilities Their Meaning

Person is not an action.

Neither is Organization, Address, or Case.

These are entities: concepts that the enterprise needs to define and understand.

A capability acts on those concepts.

Person Information may retrieve an authorized view of a person record. Address Validation may assess an address. Case Management may create a case or assign responsibility for it.

The distinction matters.

An organization can expose a person lookup service while still having incompatible definitions of Person. It can share a document service while leaving unclear which document is the official record.

Shared access alone does not establish shared meaning.

The enterprise needs to define identifiers, relationships, lifecycle rules, ownership, and authoritative sources. It also needs to explain which information a consumer may see and which actions may change it.

Authoritative state does not require one database for the whole enterprise.

One system may own contact details. Another may own a program's eligibility determination. A third may own the financial record of a payment.

The architecture must make that authority explicit and explain how the records relate.

Otherwise, a new experience can create another competing version of the truth without anyone intending it.

## Security, Trust, and Policy Across the Architecture

Every part of the map needs protection, an explicit basis for trust, and rules for permitted behavior.

Security protects information and actions against unauthorized access, disclosure, modification, and disruption. Trust establishes identities, provenance, and delegated authority. Authorization determines which actions an actor may perform. Privacy constrains how information is collected, used, and disclosed.

Reusable capabilities such as Identity can support these controls. Their presence in the capability group describes services the enterprise provides; the cross-cutting panel describes obligations every relevant consumer and implementation must meet.

Records requirements shape what the organization must retain. Audit requirements shape the evidence it must preserve. Security, accessibility, AI policy, and data governance affect both the shared capabilities and the experiences that use them.

These concerns cross architectural boundaries.

A shared document capability can enforce access restrictions and record retrievals. The application that presents those documents still needs to provide an accessible experience and avoid disclosing information through its interface.

A payment capability can enforce approval requirements. The business program still needs to establish who has authority to approve a particular payment.

The enterprise should place each control where it can enforce the requirement reliably. Some controls belong inside a capability. Others belong in an experience, a system of record, an operational platform, or a human process.

The map helps us ask where each responsibility belongs.

It does not make that decision for us.

Operations and Assurance provide monitoring, audit evidence, evaluation, incident response, recovery, and lifecycle management across the same responsibilities. Audit evidence can demonstrate whether a control worked; it must also follow access, privacy, and records requirements. The reference architecture develops both sets of controls in more detail.

## Where Control Planes Fit

A capability map describes what the enterprise can do.

A control plane describes how the enterprise directs and governs the systems that do it.

In this series, we will use that term for the mechanisms that define and distribute rules, configure permitted behavior, and oversee their operation. The systems performing the work must then enforce the applicable rules and produce evidence of what happened.

Consider authorization.

The enterprise defines who may access a restricted case. It distributes that policy to the relevant systems. A capability evaluates a request before returning the case. The system records enough evidence to support review.

Defining the rule, enforcing the rule, and reviewing the result are related responsibilities.

They may involve different components and different owners.

We should describe those responsibilities before deciding whether one platform or several products will fulfill them.

The Security, Trust, and Policy area in the map represents the concerns these controls address. Operations and Assurance help evaluate their behavior in practice. The map does not claim that every concern has its own control plane, or that every policy can become an automated check.

## Technology Realizes the Architecture

Power Platform, Salesforce, ServiceNow, custom applications, cloud services, and SaaS products can implement parts of this architecture.

A single product may support several business and shared capabilities, as well as experiences, orchestration, state, and controls. One capability may also depend on several products. The technology panel is a separate realization view of the whole model.

The map does not require a one-to-one relationship.

It asks us to explain the mapping.

Which responsibilities does the product fulfill?

Which authoritative records does it maintain?

Which policies does it enforce?

Where does it leave gaps?

A logical approval capability can remain recognizable even when its implementation changes. Its consumers still need to know who may request approval, who may decide, which outcomes are possible, and where the decision becomes part of the record.

The product supports those commitments.

The commitments give us a way to assess the product.

## Follow a Case Through the Map

Consider the [core Case Management use case](../use-cases/public-sector-case-management.md).

A case can begin with an external submission or an internal request. The enterprise receives it, determines what work is required, assigns responsibility, gathers information, reaches an outcome, communicates it, and closes the case.

The business capability owns the purpose of that work and the rules of the case type.

The experience could be a public form, an internal application, a staff workspace, or an agent assisting an authorized employee.

Each experience may compose the same underlying capabilities.

It may retrieve participant information, store supporting documents, schedule an appointment, request an approval, or send a notification.

Orchestration coordinates the steps behind those capability commitments and can compose several capabilities into a broader case process. Workflow and Approval retain their contracts and authority boundaries when that process uses them.

Those capabilities operate on entities such as Case, Person, Organization, Document, Task, and Decision. The architecture identifies where their authoritative state lives and who may change it.

Security, Trust, and Policy apply throughout. Operations and Assurance preserve evidence, track failures, and support recovery.

Receiving a submission does not automatically establish the submitter's identity or authority. Access to one case does not automatically grant access to another. An agent's ability to prepare a recommendation does not automatically authorize it to make the decision.

The technology implementation must preserve those boundaries.

The same case might use several systems. That can work when the responsibilities, identifiers, contracts, and authoritative records are clear.

The user should not need to understand those systems to complete the work.

## Use the Map to Make Better Decisions

The capability map gives teams a way to examine a proposed experience before creating another application.

Start with the business responsibility.

Identify the actions the experience needs. Look for existing capabilities that can provide them. Establish the entities and authoritative records involved. Determine which policies apply and where the architecture must enforce them.

Then select or extend the technology implementation.

Sometimes the right decision will be to reuse a capability. Sometimes it will be to improve one. Sometimes the organization will need a new capability or a program-specific implementation.

Sharing has costs. A common capability needs dependable ownership, support, and change management. It can also create a dependency that several programs must plan around.

The goal is to share responsibilities that benefit from shared ownership while preserving the differences that matter to the work.

This draft leaves several choices open: how organizations establish capability ownership, how consumers discover available contracts, how separate implementations maintain shared meaning, and how controls produce evidence across system boundaries.

The next foundation articles will develop those questions through experiences, authoritative state, policy and control planes, and capability contracts.

The map gives them a common frame.

The [AI-Native Enterprise Reference Architecture](../reference-architecture/ai-native-enterprise.md) develops this frame into a proposed stack of logical responsibilities and a separate view of technology implementations.

**Build Experiences. Share Capabilities.**
