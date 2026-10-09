---
id: "architecture-decision:0003-add-machine-readable-mission-models"
title: "Add machine-readable mission models"
type: "architecture-decision"
status: "draft"
summary: "Add Missions as a content type whose models are structured data that the site renders and tools can read."
related:
  - "use-case:public-sector-case-management"
  - "mission:inspector-general-investigations"
---

# Add machine-readable mission models

## Context

Use cases explain a domain's people, process, and intended outcomes. They don't explain why an organization performs the way it does, or which changes would improve it most.

The Mission Effectiveness Graph idea addresses that gap. It connects the conditions and behaviors in a line of work to the operational and mission outcomes they produce. Each connection is a hypothesis that evidence can strengthen or contradict. Interventions show what could change a factor.

Solution architects need this knowledge during discovery, inside their own tools. Prose alone can be read and quoted, but a tool can't follow its relationships, rank opportunities, or turn a factor into an outcome with metrics.

## Decision

Add **Missions** as a library section. Each mission has two parts:

- A YAML model in `_data/missions/<slug>.yml`, holding factors, relationships, loops, and interventions. This is the source of truth.
- A Markdown article in `missions/<slug>.md` that introduces the mission and renders the model through `_includes/mission-model.html`.

The site also publishes every model as JSON at `/missions/index.json`. Tools can read the YAML from a local clone or the JSON from the site.

Mission models include every kind of intervention: technology, process, policy, people, and organization. Only technology interventions are candidates for a solution. The others are kept for discussion and completeness.

Inspector General Investigations is the first mission.

## Alternatives

- **Prose only, like other artifacts.** Simpler to author, but tools would have to guess the structure.
- **A separate repository or service for the graph.** Keeps the graph independent, but splits the library and its reading surface. It can be revisited if the graph grows beyond what static files serve well.
- **A full graph database.** Unnecessary at this size, and it would make the content harder to review and version.

## Consequences

Missions are the library's first machine-readable content. The format is documented in the [Missions index](../missions/README.md), and templates exist for both files. Formal schema validation remains deferred. Authors keep IDs stable because tools and past engagements refer to them.

Relationships start as hypotheses. Marking one `supported` or `established` requires evidence in the model.

Customer-specific findings stay in the engagement. Only generalized lessons come back to the library.
