Our six building block types are not all peers. Some describe what exists or happens in an enterprise. Others describe the rules that govern those things or the patterns for composing them.

Recognizing that distinction can make the model substantially cleaner.

# Enterprise Blueprints — Building Block Metamodel v0.2

## 1. Start with the six fundamental questions

I'd retain our six proposed building block types for now, but give each a more precise responsibility.

| Building block   | Question it answers                                             | Example                  |
| ---------------- | --------------------------------------------------------------- | ------------------------ |
| Information      | What does the enterprise know or manage?                        | Case, Document, Person   |
| Capability       | What is the enterprise able to do?                              | Case Management          |
| Process          | How does work happen to achieve a result?                       | Conduct Investigation    |
| Experience       | How do people or agents interact with the enterprise?           | Investigator Workspace   |
| Policy / Control | What must be permitted, required, prevented, or enforced?       | Restricted Case Access   |
| Pattern          | How should components be arranged to solve a recurring problem? | Human-in-the-Loop Review |

But I see three fundamentally different roles for these elements:

CORE ENTERPRISE ELEMENTS

Information

What exists and means

Capability

What can be done

Process

How work proceeds

Experience

How work is accessed

Governed by

Policy & Control

Cross-cutting rules, constraints, safeguards, and obligations.

Structured using

Architecture Patterns

Reusable guidance for combining elements and addressing architectural concerns.

This is a conceptual classification, not a new stack diagram. Governance applies across the enterprise, and a pattern may span several types of elements.

An important consequence: a Pattern is different from a Capability.

Case Management is something an organization can do. Human-in-the-Loop Review is a reusable approach for designing how certain decisions are handled. They shouldn't be modeled as equivalent kinds of things.

Similarly, Information and Capabilities form a particularly close relationship, while Processes and Experiences make those capabilities useful in specific contexts.

This direction is compatible with established business architecture thinking: capabilities, information, value streams, and processes provide complementary perspectives rather than forming a single hierarchy.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.businessarchitectureguild.org\&sz=32)

businessarchitectureguild.org

+1



## 2. The central relationship model

Here's how I would initially connect our six types.

Conceptual relationship graph

\#chatgpt-mermaid-\_r_1bo\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(13, 13, 13);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_1bo\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_1bo\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_1bo\_ .error-icon{fill:rgb(243, 243, 243);}#chatgpt-mermaid-\_r_1bo\_ .error-text{fill:rgb(13, 13, 13);stroke:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_1bo\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_1bo\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_1bo\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_1bo\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_1bo\_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_1bo\_ .marker.cross{stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_1bo\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_1bo\_ p{margin:0;}#chatgpt-mermaid-\_r_1bo\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .cluster-label text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .cluster-label span{color:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_1bo\_ .label text,#chatgpt-mermaid-\_r_1bo\_ span{fill:rgb(13, 13, 13);color:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .node rect,#chatgpt-mermaid-\_r_1bo\_ .node circle,#chatgpt-mermaid-\_r_1bo\_ .node ellipse,#chatgpt-mermaid-\_r_1bo\_ .node polygon,#chatgpt-mermaid-\_r_1bo\_ .node path{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .rough-node .label text,#chatgpt-mermaid-\_r_1bo\_ .node .label text,#chatgpt-mermaid-\_r_1bo\_ .image-shape .label,#chatgpt-mermaid-\_r_1bo\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_1bo\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .rough-node .label,#chatgpt-mermaid-\_r_1bo\_ .node .label,#chatgpt-mermaid-\_r_1bo\_ .image-shape .label,#chatgpt-mermaid-\_r_1bo\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_1bo\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_1bo\_ .root .anchor path{fill:rgb(143, 143, 143)!important;stroke-width:0;stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_1bo\_ .arrowheadPath{fill:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_1bo\_ .edgePath .path{stroke:rgb(143, 143, 143);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .flowchart-link{stroke:rgb(143, 143, 143);fill:none;}#chatgpt-mermaid-\_r_1bo\_ .edgeLabel{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-\_r_1bo\_ .edgeLabel p{background-color:rgb(252, 252, 252);}#chatgpt-mermaid-\_r_1bo\_ .edgeLabel rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-\_r_1bo\_ .labelBkg{background-color:rgba(252, 252, 252, 0.5);}#chatgpt-mermaid-\_r_1bo\_ .cluster rect{fill:rgb(243, 243, 243);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .cluster text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ .cluster span{color:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(243, 243, 243);border:1px solid rgba(0, 0, 0, 0.1);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_1bo\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_1bo\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_1bo\_ .icon-shape,#chatgpt-mermaid-\_r_1bo\_ .image-shape{background-color:rgb(252, 252, 252);text-align:center;}#chatgpt-mermaid-\_r_1bo\_ .icon-shape p,#chatgpt-mermaid-\_r_1bo\_ .image-shape p{background-color:rgb(252, 252, 252);padding:2px;}#chatgpt-mermaid-\_r_1bo\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_1bo\_ .image-shape .label rect{opacity:0.5;background-color:rgb(252, 252, 252);fill:rgb(252, 252, 252);}#chatgpt-mermaid-\_r_1bo\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_1bo\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_1bo\_ .node .neo-node{stroke:rgb(83, 154, 248);}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_1bo\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_1bo\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node .neo-line path{stroke:rgb(83, 154, 248);filter:none;}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_1bo\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_1bo\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_1bo\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_1bo\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_1bo\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(0, 79, 153);}#chatgpt-mermaid-\_r_1bo\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(0, 79, 153);}#chatgpt-mermaid-\_r_1bo\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_1bo\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_1bo\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .node rect,#chatgpt-mermaid-\_r_1bo\_ .node circle,#chatgpt-mermaid-\_r_1bo\_ .node ellipse,#chatgpt-mermaid-\_r_1bo\_ .node polygon,#chatgpt-mermaid-\_r_1bo\_ .node path{fill:rgb(229, 243, 255);stroke:rgba(0, 0, 0, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_1bo\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_1bo\_ .node.mermaid-decision .label-container{fill:rgb(245, 250, 255);stroke:rgb(206, 219, 229);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_1bo\_ .edgePaths .flowchart-link{stroke:rgb(143, 143, 143);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_1bo\_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_1bo\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}#chatgpt-mermaid-\_r_1bo\_ .core rect{fill:rgb(219, 234, 254)!important;color:rgb(30, 58, 138)!important;stroke:rgb(147, 197, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .core polygon{fill:rgb(219, 234, 254)!important;color:rgb(30, 58, 138)!important;stroke:rgb(147, 197, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .core ellipse{fill:rgb(219, 234, 254)!important;color:rgb(30, 58, 138)!important;stroke:rgb(147, 197, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .core circle{fill:rgb(219, 234, 254)!important;color:rgb(30, 58, 138)!important;stroke:rgb(147, 197, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .core path{fill:rgb(219, 234, 254)!important;color:rgb(30, 58, 138)!important;stroke:rgb(147, 197, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .core tspan{fill:rgb(30, 58, 138)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance rect{fill:rgb(254, 243, 199)!important;color:rgb(120, 53, 15)!important;stroke:rgb(252, 211, 77)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance polygon{fill:rgb(254, 243, 199)!important;color:rgb(120, 53, 15)!important;stroke:rgb(252, 211, 77)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance ellipse{fill:rgb(254, 243, 199)!important;color:rgb(120, 53, 15)!important;stroke:rgb(252, 211, 77)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance circle{fill:rgb(254, 243, 199)!important;color:rgb(120, 53, 15)!important;stroke:rgb(252, 211, 77)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance path{fill:rgb(254, 243, 199)!important;color:rgb(120, 53, 15)!important;stroke:rgb(252, 211, 77)!important;}#chatgpt-mermaid-\_r_1bo\_ .governance tspan{fill:rgb(120, 53, 15)!important;}#chatgpt-mermaid-\_r_1bo\_ .design rect{fill:rgb(237, 233, 254)!important;color:rgb(76, 29, 149)!important;stroke:rgb(196, 181, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .design polygon{fill:rgb(237, 233, 254)!important;color:rgb(76, 29, 149)!important;stroke:rgb(196, 181, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .design ellipse{fill:rgb(237, 233, 254)!important;color:rgb(76, 29, 149)!important;stroke:rgb(196, 181, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .design circle{fill:rgb(237, 233, 254)!important;color:rgb(76, 29, 149)!important;stroke:rgb(196, 181, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .design path{fill:rgb(237, 233, 254)!important;color:rgb(76, 29, 149)!important;stroke:rgb(196, 181, 253)!important;}#chatgpt-mermaid-\_r_1bo\_ .design tspan{fill:rgb(76, 29, 149)!important;}ExperienceProcessCapabilityInformationPolicy / ControlPatternsupportsinvokesusescreates / changesmanagesconstrainsgovernsgovernsprotectsguides compositionguides composition

Representative relationships only. Actual elements can have multiple relationships, including relationships to other elements of the same type.

The most important relationships are:

| From       | Relationship | To                     | Meaning                                                                    |
| ---------- | ------------ | ---------------------- | -------------------------------------------------------------------------- |
| Process    | `uses`       | Capability             | A process employs an enterprise ability to accomplish work                 |
| Capability | `manages`    | Information            | A capability creates, changes, maintains, or otherwise governs information |
| Experience | `invokes`    | Capability             | An interface or agent can call an exposed business operation               |
| Experience | `supports`   | Process                | An experience helps participants perform work                              |
| Policy     | `constrains` | Any applicable element | Rules impose requirements or restrictions                                  |
| Pattern    | `applies_to` | One or more elements   | A reusable design approach guides their arrangement                        |

This is just the primary relationship vocabulary. We also need relationships within individual types, such as one capability depending on another, or one information concept referencing another.

I particularly like that this makes our earlier layer concerns easier to resolve.

Orchestration is expressed through Processes, Capabilities, and the relationships between them.

Semantics are expressed through Information concepts and their relationships.

Systems of record are the implementations responsible for authoritative information, not an artificial layer beneath every Information concept.

That's a much more flexible way of describing enterprise architecture.

## 3. We also need relationships within each type

This is where the model becomes truly composable.

For example, Capabilities can relate to other Capabilities, Information concepts to other Information concepts, and Processes to other Processes.

| Type             | Relationships within the type          | Example                                                  |
| ---------------- | -------------------------------------- | -------------------------------------------------------- |
| Capability       | `part_of`, `depends_on`, `specializes` | Evidence Management uses Document Management             |
| Information      | `references`, `part_of`, `specializes` | Investigative Case references Person                     |
| Process          | `part_of`, `precedes`, `triggers`      | Triage precedes Investigation                            |
| Experience       | `part_of`, `composes`                  | Supervisor Dashboard is part of Investigator Workspace   |
| Policy / Control | `enforces`, `refines`                  | Case-level Authorization enforces Restricted Case Access |
| Pattern          | `extends`, `combines_with`             | Auditable Approval extends Human Review                  |

I'd be careful about the meaning of `part_of`, `depends_on`, and `specializes`.

For instance, Case Management may use Document Management without intrinsically depending on it. It might be entirely possible to manage cases without attachments.

That's not a universal dependency. It's a design choice made in a particular solution.

This leads to a distinction I think is absolutely essential.

## 4. Distinguish intrinsic relationships from contextual relationships

I would introduce two categories of relationships.

Intrinsic relationships

Relationships that are part of the reusable definition itself.

Case Management

manages

Case

This relationship is fundamental to the capability's definition.

Contextual relationships

Relationships that become true within a particular Mission Blueprint or solution.

Investigations

uses for evidence

Document Management

The use of Document Management for evidence is specific to this composition.

Both relationships are important, but they shouldn't be stored as though they mean the same thing.

Intrinsic relationships belong to canonical building block definitions. Contextual relationships belong to the blueprint or composition that establishes them.

This lets us reuse a capability without prescribing how every mission must use it.

It also prevents our Building Block Library from accumulating hundreds of optional, scenario-specific dependencies that make the reference model increasingly confusing.

## 5. A practical example: tracing an investigation

Let's follow one activity through the model.

An investigator needs to review evidence and record a finding.

Mission Blueprint

Composition

Investigations

Process

Behavior

Review Evidence and Record Findings

Capabilities

Evidence Management

Findings Management

Document Management

Information

Evidence Item

Finding

Document

Experience

Investigator Workspace

Supports the review process and exposes relevant operations

Policy & Control

Restricted Evidence Access

Audit Logging

Constrain and safeguard the workflow

Applicable Pattern

Human-in-the-Loop Review

Reusable design guidance for human verification and accountable decisions

This example isn't intended to impose that exact architecture on every investigation. It demonstrates the relationships our model must be able to describe.

Now imagine a Grants Management Blueprint.

It might reuse Document Management, the Investigator Workspace's underlying task-management capability, and authorization controls, but employ them in entirely different processes with different information concepts.

The reusable definitions remain unchanged.

## 6. Patterns are potentially the most powerful building block

This deserves special attention.

I think a Pattern should be understood as a reusable composition template, not simply another component in the enterprise.

Take Human-in-the-Loop Review.

It isn't one application, process, or capability. It is a repeatable arrangement involving several different architectural elements.

Pattern: Human-in-the-Loop Review

Illustrative architectural roles

Process

Decision review workflow

Capability

Review and approval operations

Information

Decision and review record

Experience

Human reviewer interface

Policy

Approval authority rules

Control

Audit and authorization enforcement

The pattern defines responsibilities, relationships, constraints, and possible variations. It doesn't prescribe one fixed implementation.

You could apply it to:

- Investigation findings approval.
- Grant award recommendations.
- Permit review decisions.
- AI-generated actions requiring human authorization.

Each application maps the pattern's architectural roles to the concrete building blocks in that mission.

This is another reason not to treat Patterns as peers of operational capabilities: they describe arrangements of other elements.

## 7. One refinement: Policy and Control should be distinguishable

We previously grouped them as one type, which is convenient for navigation, but the metamodel needs to distinguish their meanings.

Consider:

| Concept     | Example                                                                           |
| ----------- | --------------------------------------------------------------------------------- |
| Policy      | Only authorized investigators may access restricted case information              |
| Control     | Case-level authorization is enforced and unauthorized access is denied and logged |
| Capability  | Identity and Access Management                                                    |
| Information | User, Role, Case, Access Grant                                                    |
| Process     | Review Access Privileges                                                          |
| Pattern     | Policy Enforcement at Capability Boundaries                                       |

The policy states a requirement.

The control specifies the safeguard or enforcement mechanism.

The capability provides an ability the enterprise can use to implement that safeguard.

They're related but not identical. A single policy might be enforced through several controls, and a control might help satisfy multiple policies.

For v0.1, I'd keep one Governance content family containing both `policy` and `control` subtypes. We'd preserve their precise relationships even if the website groups them together.

Likewise, a business capability is not necessarily an API or software service. At the logical level, an Experience provides access to a capability; at an implementation level, software invokes an exposed operation that realizes it.

These distinctions help keep the model vendor-neutral and consistent with domain-driven modeling, which separates business models from applications and services that coordinate or implement them.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com\&sz=32)

Microsoft Learn



## 8. Where Mission Blueprints and domains fit

I see two important organizing concepts outside our six building block types.

Domain — establishes scope and meaning

A domain or bounded context tells us where a definition applies, who owns its meaning, and which specializations are legitimate.

Mission Blueprint — establishes composition

A Mission Blueprint references building blocks, assigns them particular roles, and describes how they collectively support the mission.

The domain is a scope.

The blueprint is a composition.

An Investigations Blueprint might compose building blocks from the Investigations domain, Enterprise Identity domain, Document Management domain, and other shared domains.

A single building block can participate in many blueprints without losing its own canonical identity.

This is also why I would avoid automatically treating two similarly named information objects as the same object. Each domain may have its own valid meaning for `Case`, `Application`, or `Review`.

## 9. Turn these concepts into a minimal relationship grammar

I'd begin with the following registry. It is intentionally small enough to manage in GitHub Markdown/YAML, but explicit enough to support automatic validation later.

| Relationship         | Source → Target                  | Purpose                                     |
| -------------------- | -------------------------------- | ------------------------------------------- |
| `manages`            | Capability → Information         | Defines information responsibility          |
| `uses`               | Process → Capability             | Connects work to required abilities         |
| `provides_access_to` | Experience → Capability          | Connects interaction to function            |
| `supports`           | Experience → Process             | Connects interaction to work                |
| `constrained_by`     | Element → Policy                 | Specifies applicable obligations            |
| `enforces`           | Control → Policy                 | Identifies safeguards satisfying rules      |
| `depends_on`         | Capability → Capability          | Records a genuine logical dependency        |
| `references`         | Information → Information        | Describes an information relationship       |
| `part_of`            | Element → Element of same type   | Supports decomposition where appropriate    |
| `specializes`        | Element → Element of same type   | Defines a narrower reusable concept         |
| `applies_to`         | Pattern → Element or composition | Identifies where guidance is relevant       |
| `realizes`           | Implementation → Logical element | Connects logical architecture to technology |

Two additional relationship constructs are important: Mission Blueprint membership, which records that an element participates in a composition with a particular role, and Outcome support, which records why a process or capability is needed.

I wouldn't make a generic `related_to` relationship part of the main vocabulary. It's too easy for it to become a substitute for understanding what the relationship actually means.

### How we could represent this in the repository

A canonical capability record:

```

id: capability.document-management
type: capability
name: Document Management
scope: shared

relationships:
  - type: manages
    target: information.document

```

And separately, a mission composition:

```

id: mission.investigations
type: mission-blueprint
name: Investigations

components:
  - ref: capability.document-management
    purpose: Preserve investigative documents
    stage: evidence-collection

  - ref: capability.case-management
    purpose: Track investigative cases
    stage: case-management

  - ref: policy.restricted-case-access
    purpose: Govern access to case information

```

The reference points to a definition. It does not copy that definition.

The `purpose` and `stage` fields describe the relationship within that composition.

Later, we can automatically generate a Document Management page that shows all the missions where the capability is used.

## 10. Are we missing any building block types?

This is one thing I'd keep an eye on.

Our six types describe a lot of the enterprise, but they don't directly represent the reason the enterprise needs those capabilities in the first place.

Consider a mission outcome such as:

Reduce the average time required to triage an investigative complaint.

That outcome connects to the Complaint Intake process, Triage capability, Case information, Investigator Workspace, and supporting rules.

I think Outcome may eventually deserve first-class status, especially given our earlier Mission Effectiveness Graph work.

Other candidates include Role, Requirement, Event, and Metric. But we shouldn't automatically promote them all into top-level building block types.

For now, I'd use a lightweight model:

| Concept        | Initial treatment                                                                          |
| -------------- | ------------------------------------------------------------------------------------------ |
| Outcome        | Defined within a Mission Blueprint; independently addressable later                        |
| Metric         | Measures an outcome or process                                                             |
| Role           | Captured within processes and experiences                                                  |
| Requirement    | Traceable assertion associated with a blueprint or element                                 |
| Event          | Modeled as an information/event concept when it has independent architectural significance |
| Implementation | Separate content type realizing the logical model                                          |

This gives us enough structure to grow without committing prematurely to a giant ontology.

## 11. Let's test the model by composing real examples

Before calling this our definitive metamodel, I'd test it against a few architecture questions.

Metamodel validation checklist

Mark each question once its modeling approach is validated.

0/6

Can one capability serve several missions without being redefined?

Document Management appears in Investigations and Grants Management with different contextual roles.

Can we distinguish business responsibility from process flow?

Case Management remains a durable capability even when investigative workflows change.

Can we represent specialized information without assuming one universal schema?

An Investigative Case may differ from a Grants Compliance Case.

Can governance be traced to actual safeguards?

Restricted access policies map to enforcement controls and implementing capabilities.

Can a design pattern be reused across unrelated missions?

Human Review can be applied to both investigative findings and grant approvals.

Can technology change without redefining the logical architecture?

A capability moves from Power Platform to a custom service.

## Where I would land

I think our emerging model has a very useful underlying structure:

Enterprise Blueprints — Conceptual Architecture

DEFINITIONS

Building Blocks

Information, Capability, Process, Experience, Policy/Control, Pattern

CONNECTIONS

Relationships

Typed, directional, scope-aware relationships

CONTEXT

Domains

Meaning, boundaries, specialization, ownership

COMPOSITION

Mission Blueprints

Mission-specific assemblies with outcomes and roles

REALIZATION

Technology Implementations

Vendor and platform-specific ways to implement the logical design

And I'd establish this as one of the project's foundational principles:

> A building block defines a reusable architectural concept. A relationship defines how concepts interact. A domain establishes meaning and boundaries. A blueprint composes concepts for a purpose. An implementation realizes that composition in technology.

