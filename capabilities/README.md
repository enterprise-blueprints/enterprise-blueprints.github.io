---
layout: category
title: "Capabilities"
description: "Reusable things the enterprise can do."
section: capabilities
artifact: false
permalink: /capabilities/
---

# Capabilities

Reusable things the enterprise can do, with explicit responsibilities, operations, events, dependencies, and policy boundaries.

## Artifacts

| Capability | Status |
| --- | --- |
| [Capability Catalog](catalog.md) | Draft |

Start with the [capability template](../templates/capability.md) and [authoring guide](../AUTHORING.md). Add links here as artifacts are developed, labeling their status.

## Catalog format

Each capability in the catalog is a YAML file in `_data/capabilities/<slug>.yml`. The [Capability Catalog](catalog.md) renders them all, and the site publishes them as JSON at [`/capabilities/index.json`](index.json). Use cases, missions, and tools such as Solution Studio refer to capabilities by their slug. [Decision 0005](../decisions/0005-add-a-machine-readable-capability-catalog.md) records why.

Start from the [capability data template](../templates/capability.yml). The YAML file uses these fields:

| Field | Meaning |
| --- | --- |
| `id`, `title`, `status` | The same metadata as other artifacts. `id` is `capability:<slug>`. |
| `layer` | `business` for what the enterprise does, such as Case Management, or `shared` for reusable actions, such as Notification. |
| `responsibility` | What the enterprise can do with it, and the outcome it owns. |
| `boundaries` | What is outside its responsibility, and who owns that instead. |
| `note` | Optional context, such as why it was added. |
| `operations[]` | `name` (such as `Notification.send`), `description`, `accepts`, and `returns`. Operations describe responsibilities at a logical level, not interfaces. |
| `entities` | The entities it acts on, such as `person` or `case`. |
| `policies` | Policy areas that govern it: `identity`, `authorization`, `privacy`, `audit`, `records`, `security`, `accessibility`, `ai-policy`, or `data-governance`. |
| `depends_on` | Other capabilities it uses, by slug. |
| `signs` | What you might see when the capability is missing or duplicated. |
| `questions` | Questions to ask before building a new one. |

Keep slugs stable. A capability can also have its own article, from the [capability template](../templates/capability.md), when it needs more depth than the catalog gives it.

Return to the [repository overview](../README.md).
