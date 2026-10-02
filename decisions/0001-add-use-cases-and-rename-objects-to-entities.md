---
id: "architecture-decision:0001-add-use-cases-and-rename-objects-to-entities"
title: "Add Use Cases and rename Objects to Entities"
type: "architecture-decision"
status: "published"
summary: "Introduce business context through Use Cases and name canonical business concepts Entities."
related: []
---

# Add Use Cases and rename Objects to Entities

## Context

[Charter v0.3](../charter/project-charter-v0.3.md) establishes the founding content model and uses the term Objects for canonical business concepts. The repository needs a place to introduce public-sector and enterprise use cases through their overview, personas, and process before developing the supporting architecture.

The project owner requested a Use Cases section and the more specific name Entities for the Objects category during repository incubation.

## Decision

Add [Use Cases](../use-cases/README.md) as a content category with metadata type `use-case`. Use cases introduce business context, participants, processes, outcomes, and constraints. They link to blueprints that describe supporting logical architecture.

Rename Objects to [Entities](../entities/README.md), using the directory `entities/`, template `entity.md`, metadata type `entity`, and ID prefix `entity:`. Entities retain the original meaning: canonical business concepts with identifiers, lifecycle, relationships, and governance, rather than physical database tables.

Preserve Charter v0.3 as the historical founding draft. This decision records the current additions and terminology, now incorporated into [Charter v0.4](../charter/project-charter-v0.4.md).

## Alternatives

- Put domain introductions inside blueprints. A dedicated use case gives readers business context independently of architectural detail.
- Retain Objects. Entities is the project owner's preferred term for the same canonical business concepts.
- Rewrite Charter v0.3 in place. Preserving the versioned charter and recording the change keeps its founding text intact.

## Consequences

Navigation, templates, metadata examples, and authoring guidance use Use Cases and Entities. Blueprints link to their use case context when available.

Only scaffolding and placeholder metadata existed under Objects, so this rename does not change any authored entity IDs. Future authored IDs remain stable under the authoring conventions.

The published status records an established repository decision; it does not publish or deploy a website.
