---
id: "architecture-decision:0004-add-machine-readable-use-case-processes"
title: "Add machine-readable use case processes"
type: "architecture-decision"
status: "draft"
summary: "Give use cases a structured process, scenarios, and template requirements that the site renders and tools can read."
related:
  - "architecture-decision:0003-add-machine-readable-mission-models"
  - "use-case:public-sector-case-management"
  - "foundation:enterprise-capability-map"
---

# Add machine-readable use case processes

## Context

Use cases describe a domain's personas and process in prose. Missions describe what drives effectiveness in a line of work. Neither says which requirements a solution usually needs, or which shared capabilities could fulfill them.

Solution architects keep rebuilding the same starting requirements for familiar kinds of work, such as case management. Tools can't help them reuse those requirements while they exist only as prose.

A process also connects the other kinds of content. Mission factors show up at particular activities. Requirements support particular activities. Activities use shared capabilities from [The Enterprise Capability Map](../foundations/enterprise-capability-map.md). Missions that run on the same kind of work can share its process, requirements, and capabilities.

## Decision

Give use cases an optional machine-readable model, following the pattern of [mission models](0003-add-machine-readable-mission-models.md):

- A YAML file in `_data/use-cases/<slug>.yml` holds personas, phases with their activities, scenarios, and template requirements. It is the source of truth for that content.
- The use case article keeps its prose overview and renders the model through `_includes/use-case-model.html`.
- The site publishes every use case model as JSON at `/use-cases/index.json`.

Each activity names its actor, what it produces, what it decides or waits on, and the capabilities it uses. Each requirement names the activities it supports, the capabilities that could fulfill it, and the policy areas that apply. Scenarios are paths through the activities that a design must handle.

The process stays light: phases, activities, and scenarios, without gateway notation or swimlanes. Capability and entity IDs refer to the capability map until those artifacts exist.

Public Sector Case Management is the first use case with a model.

## Alternatives

- **Requirements on each mission.** Simpler for one mission, but every mission that runs on case management would repeat the same requirements. Missions will instead name the use cases they run on and add their own specializations.
- **BPMN process definitions.** A recognized standard, but far heavier to author and review than this content needs. An export can be added later.
- **Prose tables only.** Readable, but tools would have to guess the structure.

## Consequences

The format is documented in the [Use Cases index](../use-cases/README.md), with a [data template](../templates/use-case.yml). Authors keep activity, scenario, and requirement IDs stable, because missions and tools refer to them.

Template requirements are starting points to confirm with a customer, not mandatory requirements.

Missions name the use cases they run on through `processes`, which specialize a use case's process with the mission's own activities and requirements. Factors name the activities where they show up, technology interventions name the requirements that deliver them, roles name the personas they act as, and systems name the capabilities they provide. A starter capability catalog will give the capability IDs their own artifacts.
