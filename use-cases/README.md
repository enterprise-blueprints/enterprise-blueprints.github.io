---
layout: category
title: "Use Cases"
description: "The people, needs, and processes behind the architecture."
section: use-cases
artifact: false
permalink: /use-cases/
---

# Use Cases

Introductions to recognizable public-sector and enterprise use cases: what the work involves, who participates, and how the process unfolds.

Use cases establish business context for architecture. A use case explains the domain, personas, process, and desired outcomes; a blueprint describes the logical architecture that supports them. Link the two as they develop.

## Artifacts

| Use case | Status |
| --- | --- |
| [Public Sector Case Management](public-sector-case-management.md) | Draft |

Start with the [use case template](../templates/use-case.md) and [authoring guide](../AUTHORING.md). Add links here as artifacts are developed, labeling their status.

## Process models

A use case can add a machine-readable model of its process: the activities in each phase, the scenarios a design must handle, and template requirements. Missions that run on the same kind of work share it, and tools such as Solution Studio read it directly. [Decision 0004](../decisions/0004-add-machine-readable-use-case-processes.md) records why.

- `_data/use-cases/<slug>.yml` holds the model. The site publishes all models as JSON at [`/use-cases/index.json`](index.json).
- The use case article sets `use_case: "<slug>"` in its front matter and renders the model with `{% raw %}{% include use-case-model.html use_case=page.use_case %}{% endraw %}`.

Start from the [use case data template](../templates/use-case.yml). The YAML file uses these fields:

| Field | Meaning |
| --- | --- |
| `id`, `title`, `status`, `summary`, `related` | The same metadata as other artifacts. `id` is `use-case:<slug>`. |
| `version` | A whole number. Increase it when activity, scenario, or requirement IDs change meaning. |
| `personas[]` | `id`, `title`, `description`, and `needs`. Missions map their roles to these personas. |
| `phases[]` | `id`, `title`, `description`, and `activities`. Optional: `throughout: true` for work that runs alongside every phase, such as oversight. |
| `phases[].activities[]` | `id`, `title`, `description`, and `actor` (a persona ID). Optional: `participants` (persona IDs), `produces` (entity IDs), `uses` (capability IDs), `decision` (the question decided here), `waits` (what the work waits on here), and `optional: true` when only some scenarios reach the activity. |
| `scenarios[]` | `id`, `title`, `description`, `activities` (the path through the process, in order), and `check` (what a design must show). |
| `requirements[]` | `id`, `title`, `statement`, `category` (`functional`, `nfr`, or `constraint`), `activities` (the activities it supports, or an empty list for requirements across the process), and `capabilities`. Optional: `policies` (policy areas such as `privacy`, `records`, or `audit`) and `scenarios`. |

Keep the process light: phases, activities, and scenarios. It describes common work, not required statuses or a fixed sequence.

Write requirements in vendor-neutral terms. They are starting points that an architect confirms with a customer, not mandatory requirements. Capability and entity IDs follow [The Enterprise Capability Map](../foundations/enterprise-capability-map.md) until those artifacts exist. Keep IDs stable, because missions and tools refer to them.

Return to the [repository overview](../README.md).
