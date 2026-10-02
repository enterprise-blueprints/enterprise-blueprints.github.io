# Enterprise Blueprints
## Project Charter v0.4

**Tagline:** Open architecture for the AI-native enterprise  
**Scope:** Public sector first. Applicable across the enterprise.  
**Core thesis:** Thin Apps. Thick Platforms.

---

## 1. Purpose

**Enterprise Blueprints** is an open architecture initiative for designing organizations and systems for an era in which humans and AI agents can create applications, automate work, and compose software capabilities on demand.

Its primary focus is not how to generate applications faster.

Its focus is the enterprise architecture required to make dynamically generated software safe, coherent, reusable, governable, interoperable, and sustainable.

The initiative is organized around a central question:

> **Which enterprise capabilities, entities, policies, and architectural constraints should every AI-created application inherit rather than recreate?**

Enterprise Blueprints develops practical, vendor-neutral architecture for the AI-native enterprise, using public-sector use cases as its primary proving ground.

---

## 2. Mission

Enterprise Blueprints exists to help architects, technologists, leaders, and builders understand and implement the architectural foundations required for AI-native organizations.

The initiative will:

- develop vendor-neutral logical architecture;
- define reusable enterprise entities, capabilities, policies, and patterns;
- apply those concepts to real public-sector use cases;
- create reusable reference architectures and blueprints;
- map logical architecture to multiple implementation technologies;
- build practical reference implementations;
- document architectural tradeoffs and decisions;
- test architecture through implementation;
- and progressively make architecture understandable by both people and machines.

The initiative's core knowledge is intended to remain freely available as an industry resource.

---

## 3. Scope

### Public sector first

Public-sector use cases are the initiative's primary proving ground.

Government environments provide particularly useful architecture challenges because systems frequently must account for:

- identity;
- privacy;
- accessibility;
- records management;
- auditability;
- complex authorization;
- human decision-making;
- appeals and due process;
- organizational boundaries;
- interoperability;
- procurement constraints;
- continuity of operations;
- and long system lifecycles.

Initial domains may include:

- Case Management
- Grants Management
- Permitting
- Licensing
- Inspections
- Benefits Administration
- Constituent Services
- Procurement
- Public Records
- Emergency Management
- Asset Management

### Applicable across the enterprise

Enterprise Blueprints is not limited to government technology.

The initiative's underlying concepts—shared capabilities, canonical entities, durable state, policy inheritance, delegated authorization, composable services, and machine-readable architecture—may apply across industries.

Public-sector use cases are the primary environment in which these ideas will be developed, tested, and taught.

---

## 4. Core Thesis

Software creation is becoming dramatically cheaper.

Enterprise coherence is not.

As AI makes it possible for individuals, departments, and agents to generate applications and workflows on demand, organizations risk multiplying:

- incompatible data models;
- duplicated business logic;
- inconsistent security;
- fragmented records;
- inaccessible applications;
- unmanaged integrations;
- redundant automation;
- conflicting business rules;
- unowned production systems;
- and competing definitions of organizational reality.

The response should not be to prevent people from creating software.

The response should be to make dynamically created software inherit a strong enterprise foundation.

This leads to the initiative's central architectural idea:

# Thin Apps. Thick Platforms.

User experiences, workflows, and applications can become increasingly dynamic and disposable.

Enterprise semantics, state, capabilities, identity, policy, and governance should remain durable and intentional.

---

## 5. The AI-Native Enterprise

Within Enterprise Blueprints, an **AI-native enterprise** is not merely an organization that uses AI tools.

It is an organization whose architecture assumes that humans and AI systems may dynamically discover, compose, and operate governed enterprise capabilities.

This implies an environment in which:

- enterprise capabilities are explicitly defined;
- important business concepts have stable semantics;
- systems of record remain authoritative;
- access is controlled through explicit identity and authorization;
- policies can travel with data and capabilities;
- agents can discover approved actions;
- software experiences can be generated dynamically;
- and architectural constraints can increasingly be understood by machines.

A simplified architectural direction is:

```text
User or Agent Intent
        │
        ▼
Generated Experience
App / UI / Workflow / Agent
        │
        │ composes
        ▼
Enterprise Capabilities
        │
        │ operate on
        ▼
Enterprise Entities & Data
        │
        │ governed by
        ▼
Identity, Policy & Trust
        │
        │ connected to
        ▼
Authoritative Systems of Record
```

Applications should increasingly become consumers of enterprise architecture rather than isolated containers of enterprise architecture.

---

## 6. Primary Audience

Enterprise Blueprints is intended for people involved in designing, governing, building, or modernizing enterprise technology.

Its primary audience includes:

- enterprise architects;
- solution architects;
- application architects;
- data architects;
- security and identity architects;
- cloud and platform architects;
- software engineers;
- low-code developers;
- technical leads;
- product and platform teams;
- CIO, CTO, CDO, and AI leadership organizations;
- government modernization teams;
- program and technology leaders;
- consultants and systems integrators;
- and technically inclined public-sector practitioners.

Material should be rigorous enough to help experienced architects while remaining understandable to practitioners who do not work primarily in formal enterprise architecture.

---

## 7. Architectural Principles

### 7.1 Architecture Before Implementation

Logical architecture should be defined independently of any specific technology vendor or product.

Products implement architecture.

Products do not define the architecture.

Technology-specific terminology should not determine the logical model unless the concept genuinely belongs at the implementation layer.

### 7.2 Capabilities Before Applications

Organizations should identify reusable things the enterprise needs to be able to do rather than repeatedly implementing those functions inside individual applications.

Examples include:

- identify a person;
- retrieve a case;
- store a document;
- request an approval;
- send a notification;
- verify eligibility;
- retrieve payment status.

Applications and agents should compose these capabilities wherever practical.

### 7.3 Shared Semantics Before Local Data Models

Important organizational concepts should have explicit definitions.

Examples include:

- Person
- Organization
- Case
- Document
- Payment
- Grant
- Contract
- Employee
- Vendor
- Location

Individual applications should not casually invent competing definitions of canonical enterprise concepts.

### 7.4 Durable State, Disposable Experiences

User experiences may increasingly be generated dynamically.

Authoritative organizational state should not be.

Systems of record, identifiers, lifecycle rules, provenance, and retention requirements should remain explicit and governed.

### 7.5 Policy Should Travel With Capability

Applications should not be expected to independently remember every enterprise requirement.

Where feasible, shared capabilities should enforce or carry required policy concerning:

- authorization;
- privacy;
- audit;
- records management;
- accessibility;
- data classification;
- human approval;
- segregation of duties;
- and other organizational constraints.

The governed path should be the easiest path.

### 7.6 Identity Follows the Actor

Software and agents should operate through explicit identity and authorization models.

An agent's ability to act should be understandable in terms of:

- who initiated the action;
- which identity is executing it;
- what authority has been delegated;
- what purpose the action serves;
- what data may be accessed;
- and which actions require human confirmation.

Broad, opaque service-account authority should not be the default model for agentic systems.

### 7.7 Humans and Agents Are Both Enterprise Actors

Future architecture should assume that business capabilities may be invoked by:

- humans;
- traditional applications;
- workflows;
- AI assistants;
- autonomous or semi-autonomous agents;
- and other enterprise services.

Capabilities should therefore have explicit contracts, authorization, observability, and policy boundaries.

### 7.8 Search Before Build

A dynamically generated solution should ideally discover existing enterprise:

- entities;
- capabilities;
- APIs;
- tools;
- workflows;
- policies;
- and applications

before creating something new.

Reuse should increasingly be supported by enterprise platforms and AI rather than relying entirely on individual developer awareness.

### 7.9 Architecture Should Support Graduation

Not every generated application requires enterprise-scale governance on its first day.

Architecture should support progression such as:

```text
Personal
   ↓
Team
   ↓
Department
   ↓
Enterprise / Mission Critical
```

Controls should become stronger as scope, sensitivity, dependency, and organizational importance increase.

### 7.10 Architecture Must Be Testable Through Implementation

Reference architecture should not exist only as diagrams.

Important concepts should eventually be tested through working reference implementations.

Implementation experience should be allowed to reveal weaknesses in the logical architecture.

### 7.11 Implementation Diversity Is a Feature

The same logical architecture should be capable of being realized through different technology stacks.

Possible implementations may include:

- Microsoft Power Platform;
- custom application development;
- Salesforce;
- ServiceNow;
- cloud-native services;
- open-source technologies;
- and future platforms.

A successful logical architecture should survive changes in implementation technology.

### 7.12 Architecture Should Become Machine-Readable

Over time, important parts of the architecture should be represented in structured formats that software and AI agents can consume.

This may include:

- entity definitions;
- capability contracts;
- relationships;
- operations;
- events;
- policies;
- architectural constraints;
- and implementation mappings.

A long-term goal is to explore whether coding agents can generate software that conforms to an explicit enterprise architecture rather than inventing architecture during generation.

---

## 8. Content Model

Enterprise Blueprints organizes knowledge into distinct artifact types.

### Foundations

Durable architectural ideas and principles.

Examples:

- The AI-Native Enterprise
- Thin Apps, Thick Platforms
- Build Capabilities, Not Applications
- Durable State, Disposable Experiences

### Reference Architecture

The overall logical model describing the major layers and responsibilities of an AI-native enterprise.

### Use Cases

Introductions to recognizable public-sector and enterprise use cases that establish business context before describing supporting architecture.

A Use Case describes:

- **Overview:** the need, domain context, intended outcomes, and scope;
- **Personas:** the people and organizations involved, their goals, responsibilities, and needs;
- **Process:** the typical trigger, major steps, handoffs, decisions, and outcome;
- relevant constraints, variations, assumptions, and open questions.

Use Cases remain understandable without architecture or product knowledge. They introduce the work; Blueprints describe the logical architecture that supports it. Use Cases and their supporting Blueprints should link to one another as they develop.

### Entities

Canonical business concepts and their meaning, lifecycle, identifiers, relationships, and governance considerations.

Entities represent concepts, not physical database tables.

### Capabilities

Reusable things the enterprise can do.

Capabilities describe responsibilities, operations, events, dependencies, and policy requirements without assuming a specific implementation platform.

### Patterns

Reusable architectural approaches to recurring problems.

Examples may include:

- human-in-the-loop decisions;
- delegated agent authorization;
- event-driven processing;
- generated interfaces over governed data;
- personal-to-production graduation;
- approval before agent action.

### Policies

Architectural implications of concerns such as:

- identity;
- authorization;
- privacy;
- audit;
- records;
- accessibility;
- security;
- data governance;
- human oversight.

Enterprise Blueprints provides architectural guidance rather than legal advice.

### Blueprints

A **Blueprint** is a composed logical architecture for a recognizable business or technical problem.

A Blueprint combines:

```text
Entities
+
Capabilities
+
Patterns
+
Policies
=
Blueprint
```

Examples may include:

- Public Sector Case Management Blueprint
- Permitting Blueprint
- Grants Management Blueprint

Blueprints remain vendor-neutral. Each Blueprint should link to its related Use Case when available for the overview, personas, and process that establish its business context.

### Implementations

Technology-specific mappings that demonstrate how a logical Blueprint or architecture can be realized using particular products or development approaches.

Implementation content must identify the logical architecture it implements.

### Labs

Hands-on exercises and runnable examples used to demonstrate implementation.

### Architecture Decisions

Explicit records of important architectural choices, rationale, tradeoffs, and alternatives.

---

## 9. Reference Architecture Direction

The initial Enterprise Blueprints reference architecture will explore layers such as:

```text
┌──────────────────────────────────────────────┐
│ EXPERIENCE                                   │
│ Apps │ Generated UI │ Assistants │ Agents    │
├──────────────────────────────────────────────┤
│ ORCHESTRATION                                │
│ Workflow │ Agents │ Rules │ Human Decisions │
├──────────────────────────────────────────────┤
│ ENTERPRISE CAPABILITIES                      │
│ Case │ Document │ Payment │ Notification... │
├──────────────────────────────────────────────┤
│ SEMANTICS & DATA                             │
│ Entities │ Relationships │ MDM │ Data Products│
├──────────────────────────────────────────────┤
│ TRUST & POLICY                               │
│ Identity │ Authorization │ Audit │ Privacy   │
├──────────────────────────────────────────────┤
│ SYSTEMS OF RECORD                            │
│ ERP │ CRM │ Case │ HR │ Grants │ Finance    │
└──────────────────────────────────────────────┘
```

Cross-cutting concerns may include:

- Observability
- Security
- Governance
- Lifecycle
- Accessibility
- Records Management
- Evaluation
- FinOps
- DevSecOps

This model is provisional and will evolve through application to real use cases.

---

## 10. Vendor Neutrality

The logical architecture is vendor-neutral.

Technology vendors may appear in:

- implementation guidance;
- reference implementations;
- comparisons;
- examples;
- labs;
- and discussions of available capabilities.

Vendor terminology should not determine the definitions of logical enterprise entities, capabilities, Blueprints, or architectural layers.

Vendor-specific implementations are examples, not endorsements.

Enterprise Blueprints should clearly distinguish:

**what the architecture requires**

from

**how a particular technology can implement it.**

---

## 11. Open Knowledge

Enterprise Blueprints exists as a free industry resource.

Its public architecture should provide substantive value regardless of whether a reader ever engages commercially with its creator.

Where practical, project artifacts should be:

- publicly accessible;
- linkable;
- versioned;
- reusable;
- adaptable;
- open to critique;
- and open to community contribution.

The initiative should not operate as a gated marketing funnel.

---

## 12. Licensing Philosophy

Enterprise Blueprints should make reuse straightforward.

The provisional licensing model is:

### Software and Machine-Readable Artifacts

Code, reference implementations, example software, machine-readable schemas, and similar software artifacts will generally be released under the:

**MIT License**

The intention is to allow organizations and individuals to reuse, modify, distribute, and incorporate these artifacts with minimal restriction.

### Documentation and Diagrams

Written architecture content, diagrams, educational materials, and similar creative works will generally be released under:

**Creative Commons Attribution 4.0 International — CC BY 4.0**

The intention is to allow agencies, enterprises, educators, architects, and others to reuse and adapt the material while preserving attribution.

Specific repositories or artifacts may clarify their applicable license where necessary.

Licensing decisions should support the initiative's broader goal:

> **Make useful architecture easy to use.**

---

## 13. Project Identity

The public initiative is named:

# Enterprise Blueprints

Its primary tagline is:

> **Open architecture for the AI-native enterprise**

Its scope statement is:

> **Public sector first. Applicable across the enterprise.**

Its signature architectural question is:

> **Which enterprise capabilities, entities, and policies should every AI-created application inherit rather than recreate?**

Its central architectural thesis is:

> **Thin Apps. Thick Platforms.**

---

## 14. GitHub Identity

Enterprise Blueprints uses the independent GitHub organization:

**`enterprise-blueprints`**

The organization is distinct from:

- the creator's personal GitHub identity;
- Civgentic;
- and individual technology vendors.

The initial initiative should favor a small number of repositories—potentially a single primary repository—rather than prematurely splitting the work across many repositories.

The initial repository may contain structures such as:

```text
foundations/
reference-architecture/
use-cases/
entities/
capabilities/
patterns/
policies/
blueprints/
implementations/
labs/
decisions/
schemas/
site/
```

Repository boundaries may evolve as reference implementations and machine-readable specifications become more substantial.

---

## 15. YouTube Identity

The public YouTube channel is named:

**Enterprise Blueprints**

YouTube serves as the teaching, storytelling, and demonstration layer of the initiative.

The initial programming structure is:

### Architecture Ahead

Foundational and future-facing enterprise architecture concepts.

### Public Sector Blueprints

Vendor-neutral architecture of specific public-sector domains.

Individual domains such as Case Management, Grants Management, and Permitting may become seasons.

### Build the Blueprint

Hands-on implementation of logical Blueprints using real technologies.

### Architecture Review

A later non-serial format for timely technology developments with meaningful architecture implications.

The channel should not function as a sales funnel. Its purpose is to freely teach, demonstrate, and develop the ideas represented by Enterprise Blueprints.

---

## 16. Relationship to Civgentic

**Civgentic** is the independent consulting business established by the initiative's creator.

Enterprise Blueprints and Civgentic are related but serve different purposes.

### Enterprise Blueprints exists to:

- develop ideas;
- teach;
- document architecture;
- provide open resources;
- create reference models;
- build reference implementations;
- enable discussion;
- and contribute to the industry.

### Civgentic exists to:

- provide commercial advisory services;
- help organizations apply architectural ideas to their specific environments;
- perform assessments;
- design future-state architectures;
- support modernization planning;
- provide solution and enterprise architecture expertise;
- and assist with implementation architecture where appropriate.

Commercial work does not determine the logical architecture or editorial conclusions of Enterprise Blueprints.

Enterprise Blueprints should not contain routine consulting sales calls to action.

A simple disclosure of the creator's relationship to Civgentic and a link for readers who independently want professional services is sufficient.

Civgentic may point to Enterprise Blueprints as evidence of its founder's architectural work.

Enterprise Blueprints should not need Civgentic in order to justify its existence.

---

## 17. Relationship to Vendors and Sponsors

Enterprise Blueprints should remain intellectually independent of technology vendors.

If vendor relationships, sponsorships, commercial affiliations, or other material relationships ever exist, they should be disclosed clearly.

Such relationships should not determine:

- architectural conclusions;
- logical models;
- product placement;
- implementation recommendations;
- editorial coverage;
- or whether competing approaches can be discussed.

The initiative's credibility depends on preserving a clear distinction between architecture and promotion.

---

## 18. Relationship to Contributors

Enterprise Blueprints should be designed so that other practitioners can eventually contribute.

Contributors may add:

- corrections;
- architectural discussion;
- use-case expertise;
- new patterns;
- implementation mappings;
- platform-specific reference implementations;
- diagrams;
- examples;
- structured specifications;
- and technical improvements.

Contributors should not need to endorse or participate in Civgentic's commercial activities.

The open initiative should be capable of becoming larger than any one individual, implementation technology, or consulting firm.

---

## 19. Editorial Principles

Enterprise Blueprints material should strive to be:

### Practical

Architecture should help someone make a design decision or build something better.

### Explicit

Important assumptions, tradeoffs, boundaries, dependencies, and architectural decisions should be visible.

### Understandable

Avoid unnecessary architecture jargon where simpler language works.

### Durable

Favor concepts that remain useful as individual products, vendors, and AI models change.

### Vendor-Neutral at the Logical Layer

Use technology products to demonstrate architecture rather than allowing products to define it.

### Evidence-Seeking

Use implementation experience, public-sector realities, standards, research, and practitioner feedback to improve the architecture.

### Revisable

Architecture is not scripture.

Models should be versioned and changed when real use cases demonstrate that they are incomplete or wrong.

### Open

The initiative's default posture should favor sharing, reuse, adaptation, and discussion.

---

## 20. Anti-Goals

Enterprise Blueprints is not intended to become:

### A Power Platform Tutorial Site

Power Platform may provide early reference implementations because of the creator's experience, but it does not define the architecture.

### An AI News Channel

Current developments may be discussed where they affect architecture, but the initiative should not depend on constant AI product news.

### A Vendor Comparison Site

Technology comparisons may support architecture decisions, but ranking products is not the initiative's primary purpose.

### A Formal Enterprise Architecture Methodology

The initiative may borrow useful ideas from established disciplines, but its purpose is to help people design systems rather than require adherence to a particular certification or methodology.

### A Complete Encyclopedia Created in Advance

The body of knowledge should grow through real use cases and implementations.

### A Consulting Sales Funnel

Public material should provide substantive value independently of Civgentic or any commercial service.

### A Vendor-Owned Framework

The initiative should remain portable across implementation technologies.

---

## 21. Development Method

Enterprise Blueprints will grow iteratively.

The preferred architecture cycle is:

```text
Investigate a real domain
        ↓
Model its concepts
        ↓
Define logical capabilities
        ↓
Identify policy requirements
        ↓
Design architecture
        ↓
Extract reusable patterns
        ↓
Implement enough to test it
        ↓
Teach and publish
        ↓
Receive feedback
        ↓
Refine
```

The taxonomy should emerge from architecture work rather than architecture work being forced into a predetermined taxonomy.

---

## 22. Initial Focus

The first Use Case and major Blueprint will address:

# Public Sector Case Management

The Use Case will introduce the domain, personas, and process. Its supporting Blueprint will test and expand the framework through concepts such as:

- Case
- Person
- Organization
- Case Participant
- Interaction
- Task
- Document
- Assignment
- Decision
- Audit
- Authorization
- Records Management
- Human decision-making
- AI assistance
- agent actions
- event-driven processing

The initial reference implementation will primarily use Microsoft Power Platform technologies because of the creator's current implementation experience.

The Power Platform implementation will remain explicitly separate from the logical architecture.

---

## 23. Publishing Model

Enterprise Blueprints will use three complementary public surfaces.

### Knowledge Site

The canonical source for the living architecture.

It should contain:

- Foundations
- Reference Architecture
- Use Cases
- Entities
- Capabilities
- Patterns
- Policies
- Blueprints
- Implementations
- Architecture Decisions
- Glossary
- links to Labs and source artifacts

### YouTube

The teaching, storytelling, and demonstration layer.

### GitHub

The source-controlled layer for:

- documentation;
- structured definitions;
- diagrams;
- Architecture Decision Records;
- machine-readable specifications;
- sample code;
- reference implementations;
- Labs;
- issues;
- and contribution workflows.

Each surface should point to the others without unnecessarily duplicating their purpose.

---

## 24. Content Relationship

The primary content layers should reinforce one another:

```text
Architecture Ahead
      │
      │ explains principles
      ▼
Public Sector Blueprints
      │
      │ applies principles
      ▼
Build the Blueprint
      │
      │ implements principles
      ▼
Reference Implementation
```

The Knowledge Site remains the canonical architecture source throughout this process.

YouTube teaches the architecture.

GitHub makes it inspectable and executable.

---

## 25. Initial Success Criteria

The initiative's first stage will be successful when:

1. A new visitor can quickly understand what Enterprise Blueprints is and why it exists.
2. The logical reference architecture can be explained without mentioning a particular vendor.
3. The phrase **Thin Apps. Thick Platforms.** corresponds to a clearly defined architectural model rather than remaining merely a slogan.
4. A Case Management Use Case introduces the domain, personas, and process, and its supporting Blueprint describes reusable entities, capabilities, patterns, and policies.
5. The Case Management Blueprint can be mapped cleanly to a Power Platform implementation.
6. Architecture lessons discovered during implementation can flow back into the logical framework.
7. YouTube episodes and website material reinforce the same body of knowledge.
8. A practitioner can use the core material without purchasing anything.
9. Another implementation platform can eventually realize the same logical Blueprint without redefining it.
10. Community contributors can participate without becoming contributors to Civgentic.
11. Architecture artifacts can progressively become machine-readable without requiring a fundamental redesign of the knowledge model.

---

## 26. Long-Term Direction

Enterprise Blueprints should progressively explore a future in which organizations maintain machine-readable catalogs of:

- enterprise entities;
- enterprise capabilities;
- policies;
- approved actions;
- systems of record;
- architectural constraints;
- events;
- reusable patterns;
- and implementation mappings.

AI systems could use that architecture when dynamically creating applications and workflows.

Over time, Enterprise Blueprints may explore whether an AI coding agent can consume an explicit enterprise architecture and generate software that conforms to it.

The long-term question is not simply:

> **Can AI build enterprise software?**

It is:

> **Can an enterprise make its architecture explicit enough that AI can build software without reinventing the enterprise every time?**

---

## 27. Current Project Decisions

The following decisions are provisionally established as of Charter v0.4:

- **Project name:** Enterprise Blueprints
- **Tagline:** Open architecture for the AI-native enterprise
- **Scope:** Public sector first. Applicable across the enterprise.
- **Core thesis:** Thin Apps. Thick Platforms.
- **GitHub organization:** `enterprise-blueprints`
- **YouTube channel:** Enterprise Blueprints
- **Commercial organization:** Civgentic, maintained separately
- **Content model:** Use Cases introduce business context; Entities name canonical business concepts
- **Primary logical architecture:** vendor-neutral
- **Initial proving ground:** Public Sector Case Management
- **Initial implementation ecosystem:** Microsoft Power Platform
- **Software license:** MIT
- **Documentation and diagram license:** CC BY 4.0
- **Initial repository strategy:** begin consolidated; split only when scale justifies it
- **Long-term direction:** machine-readable architecture consumable by humans and AI systems

These decisions may be revised through documented Architecture Decision Records as the initiative develops.

---

## 28. Status

**Version:** 0.4  
**Status:** Draft / Founding Charter  
**Repository foundation:** Established with category indexes, authoring guidance, content templates, metadata conventions, and licensing. Formal external contribution procedures remain deferred during solo incubation.  
**Next milestone:** Draft the Public Sector Case Management Use Case and develop its supporting vendor-neutral Blueprint.


---

## 29. Version History

- **v0.4:** Adds Use Cases as domain introductions with overview, personas, and process; renames Objects to Entities throughout the current content model; updates the repository and publishing models and Case Management direction. Records the established repository foundation and next content milestone.
- **v0.3:** Preserved as the historical founding draft in [project-charter-v0.3.md](project-charter-v0.3.md).

[Architecture Decision 0001](../decisions/0001-add-use-cases-and-rename-objects-to-entities.md) records the rationale for the content-model changes.
