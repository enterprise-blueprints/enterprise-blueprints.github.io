# Enterprise Blueprints

**Open architecture for the AI-native enterprise**  
Public sector first. Applicable across the enterprise.

Enterprise Blueprints develops practical, vendor-neutral architecture for organizations in which humans and AI agents can discover, compose, and operate governed enterprise capabilities.

Its central question is: **Which enterprise capabilities, entities, policies, and architectural constraints should every AI-created application inherit rather than recreate?**

## Build Experiences. Share Capabilities.

Create apps, workflows, and agents that fit the work. Build on shared enterprise capabilities.

Those capabilities operate on shared enterprise entities and authoritative state. Identity, policy, and governance define who may act and under what conditions. Experiences can change while the enterprise foundations remain durable.

This initiative is for architects, engineers, platform teams, technology leaders, and public-sector practitioners designing or modernizing enterprise systems.

## Explore the architecture

Start with the [current charter](charter/project-charter-v0.5.md). [Decision 0001](decisions/0001-add-use-cases-and-rename-objects-to-entities.md) records the addition of Use Cases and the current Entities terminology.

[Decision 0002](decisions/0002-build-experiences-share-capabilities.md) records the signature principle, Build Experiences. Share Capabilities.

| Content | Purpose |
| --- | --- |
| [Foundations](foundations/README.md) | Durable ideas and architectural principles |
| [Reference architecture](reference-architecture/README.md) | Logical layers, responsibilities, and relationships |
| [Use Cases](use-cases/README.md) | Business context, personas, and processes |
| [Entities](entities/README.md) | Canonical business concepts, meaning, and lifecycle |
| [Capabilities](capabilities/README.md) | Reusable things the enterprise can do |
| [Patterns](patterns/README.md) | Approaches to recurring architectural problems |
| [Policies](policies/README.md) | Architectural implications of governance requirements |
| [Blueprints](blueprints/README.md) | Composed, vendor-neutral architectures for recognizable problems |
| [Implementations](implementations/README.md) | Technology-specific mappings to logical architecture |
| [Architecture decisions](decisions/README.md) | Choices, rationale, alternatives, and consequences |

[Diagrams](assets/diagrams/README.md) support these artifacts. See the [repository map](structure.md) for the complete layout.

## First proving ground

The [Public Sector Case Management Use Case](use-cases/public-sector-case-management.md) is the first content draft. It introduces the domain, personas, and process; its planned blueprint will develop reusable entities, capabilities, patterns, and policies to support it. Microsoft Power Platform is the planned initial implementation ecosystem; the logical blueprint remains vendor-neutral.

Implementation experience should feed back into the architecture. The knowledge site will become the canonical reading surface, YouTube will teach and demonstrate the ideas, and GitHub will make the source inspectable and executable.

## Current status and authoring

This repository is in **founding draft / solo incubation**, governed by Charter v0.5. The AI-Native Enterprise foundation and core Case Management use case are drafts. A custom Jekyll site renders the content for local review; no completed blueprint or runnable reference implementation is established yet.

See [site development](SITE.md) to run the preview and work on the theme.

Use the [authoring guide](AUTHORING.md) and [artifact templates](templates/README.md) to develop content. Formal external contribution procedures will be established later.

Enterprise Blueprints is an open industry resource. Civgentic is the creator's separate consulting business; its commercial work does not determine the initiative's architecture or editorial conclusions.

## Licensing

Documentation, diagrams, and educational material use **CC BY 4.0**. Software and machine-readable artifacts use **MIT**. See [licensing and attribution](LICENSING.md) for applicability and full license texts.
