---
layout: category
title: "Missions"
description: "How conditions, behaviors, and outcomes shape a mission's effectiveness."
section: missions
artifact: false
permalink: /missions/
---

# Missions

Mission models describe what drives success in a recognizable line of work, such as Inspector General investigations or grants management. Each model connects four kinds of factors:

- **Conditions:** what enables or inhibits the work.
- **Behaviors:** what people actually do.
- **Operational outcomes:** how the work performs.
- **Mission outcomes:** the public value the work creates.

Relationships between factors are hypotheses about how one influences another. Feedback loops show where an obvious fix could make things worse. Interventions show what could change a factor, whether through technology, process, policy, people, or organization.

Architects use a mission model in discovery to walk customers through how their organization operates and find the biggest opportunities for improvement. Those opportunities become the outcomes and metrics that a solution commits to. [Decision 0003](../decisions/0003-add-machine-readable-mission-models.md) records why missions exist and why they are machine-readable.

## Artifacts

| Mission | Status |
| --- | --- |
| [Inspector General Investigations](inspector-general-investigations.md) | Draft |

## Format

Each mission has two files:

- `_data/missions/<slug>.yml` holds the model. Tools such as Solution Studio read it directly, and the site publishes all models as JSON at [`/missions/index.json`](index.json).
- `missions/<slug>.md` introduces the mission in prose and renders the model with `{% raw %}{% include mission-model.html mission=page.mission %}{% endraw %}`. Its front matter sets `mission: "<slug>"`.

Start from the [mission template](../templates/mission.md) and [mission data template](../templates/mission.yml). The YAML file uses these fields:

| Field | Meaning |
| --- | --- |
| `id`, `title`, `status`, `summary`, `related` | The same metadata as other artifacts. `id` is `mission:<slug>`. |
| `version` | A whole number. Increase it when factor or intervention IDs change meaning. |
| `factors[]` | `id`, `type` (`condition`, `behavior`, `operational-outcome`, or `mission-outcome`), `title`, `description`, and `better` (`higher`, `lower`, or `neutral`). Optional: `goal`, `pattern`, `signals`, `questions`, and `metrics`. |
| `factors[].goal` | The factor stated as a goal, when its title names a problem. For example, “Case backlog” has the goal “Allegations and cases don’t wait for attention.” |
| `factors[].pattern` | A shared organizational pattern the factor is an instance of, such as `decision-rights` or `capacity`. Patterns let lessons carry across missions. |
| `factors[].signals` | What you might hear or see when the factor is a problem. |
| `factors[].questions` | Questions to ask the customer. |
| `factors[].metrics[]` | Candidate metrics: `name`, `measurement`, and `better`. |
| `factors[].activities` | The process activities where the factor shows up. Leave it out for factors measured across a whole process, such as timeliness. |
| `relationships[]` | `from`, `to`, `effect` (`increases` or `decreases`), `confidence` (`hypothesis`, `supported`, or `established`), and `rationale`. Optional: `lag`, `applies_when`, and `evidence` (a list of `source` and `note`). |
| `loops[]` | `id`, `title`, `kind` (`reinforcing` or `balancing`), `factors` (in order around the loop), `description`, and optional `watch_for`. |
| `roles[]` | Typical roles: `id`, `title`, `description`, `concerns`, `influence` (`high`, `medium`, or `low`), `factors` (the factor IDs they know best), and `personas` (the use case personas the role acts as). Tools offer them as starting stakeholders. |
| `systems[]` | Typical current-state systems: `id`, `title`, `kind`, `fate` (`keep`, `integrate`, `replace`, or `retire`), `description`, `notes`, and `provides` (the capability IDs it provides today). Tools offer them as a starting current state. |
| `interventions[]` | `id`, `title`, `kind` (`technology`, `process`, `policy`, `people`, or `organization`), `description`, and `changes` (a list of `factor` and `effect`). Technology interventions add `need`, what a system would have to do in vendor-neutral terms, and `requirements`, the requirement IDs that deliver it. |
| `processes[]` | How the mission's work flows: `id`, `title`, `use_case` (the use case whose process it specializes), `description`, and `phases`. |
| `processes[].phases[]` | `id`, `title`, `stage` (the use case phase it maps to), and `activities`. Each activity is either a use case activity's ID, used as written, or a full activity with the use case's activity fields. A full activity with `extends` specializes a use case activity and keeps its requirements; one without it is new to the mission. Its `actor` and `participants` are role IDs. |
| `requirements[]` | Requirements the mission adds, with the use case's requirement fields. Optional `extends` names a use case requirement this one specializes; tools show the specialization in its place. |

Keep IDs stable. Projects that used a mission refer to its factors, interventions, activities, and requirements by ID. Activity and requirement IDs must not repeat the IDs of the use cases the mission runs on. See the [Use Cases index](../use-cases/README.md) for the process model format.

Mark a relationship `supported` or `established` only when its `evidence` says why. Unconfirmed relationships stay hypotheses. Record customer-specific findings in the engagement, not here. Contribute back only generalized lessons that no longer identify a customer.

Return to the [repository overview](../README.md).
