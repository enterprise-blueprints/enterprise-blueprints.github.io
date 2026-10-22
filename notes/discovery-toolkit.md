# Discovery as a toolkit

How Solution Studio's discovery information fits together, what a project must have before Define, and how the rest stays optional. Written October 22, 2026, after a design discussion; the decisions here are agreed.

## The idea

Engagements discover in different ways. One works from meeting notes alone. Another runs a workshop from a questionnaire. Another walks the customer through a library mission and rates its effectiveness model. Studio should support all of these without making any of them the price of entry.

So discovery is a toolkit. A project uses the tools that fit, and Define builds on whatever they produce. Only one thing is required: **at least one confirmed outcome.** Outcomes are the north star. Every requirement traces to one, they're what a statement of work commits to, and every tool can produce them.

## Three kinds of discovery information

| Kind | What it is | Pieces |
| --- | --- | --- |
| **Evidence** | Where knowledge comes from | Notes, question answers, workshop records, the quotes behind mission ratings |
| **Findings** | What Define builds on | Outcomes and their metrics, stakeholders, current-state systems, process steps and their pain points, constraints, open questions |
| **Scaffolds** | Library starting points that propose findings | A mission (its outcomes, roles, systems, and processes), its effectiveness model, and the question bank |

Scaffolds propose findings as *assumed*. Evidence makes them *known*. That's what lets every tool be optional: a mission can seed a project's outcomes and steps, and notes or answers then confirm, correct, or replace them.

The library's mission outcomes and operational outcomes are scaffolds. The customer's outcomes are findings. A customer outcome can *be* one of the mission's operational outcomes, or *improve* factors in the effectiveness model. Indicators in the library suggest candidate metrics.

## How findings feed Define

| Finding | Feeds Define today | Could also feed |
| --- | --- | --- |
| Outcomes | Every requirement's "why"; Suggest requirements; outcomes no requirement supports | n/a |
| Process steps | Steps that change or are new need requirements; template requirements per step | n/a |
| Effectiveness model | Ratings rank template requirements; interventions become requirements | n/a |
| Metrics | Nothing directly | Targets become quality requirements, such as "triage within 2 days" |
| Stakeholders | The AI's context only | Concerns become constraints or quality requirements |
| Current state | Design, not Define | Integration and migration requirements, and constraints |
| Questions | Answers are the AI's context only | Answers become evidence, like notes |

## What's required, recommended, and optional

- **Required: at least one confirmed outcome.** An outcome can be one sentence, typed in directly, or found by any tool: a note through Analyze, a workshop answer, or a confirmed mission goal. Discover warns until there's one.
- **Recommended:** a metric with a target for each outcome, and a stakeholder who owns it. These count toward readiness, but nothing waits on them.
- **Optional: everything else.** Readiness counts only the tools a project uses. "Questions answered" applies only to a project with questions.

## Tools in Studio

Each Discover section is a tool, except Outcomes & metrics, which every project has. A project shows only its tools:

- A section with anything in it, or with Studio suggestions waiting in it, always shows. So when Analyze proposes stakeholders, Stakeholders appears.
- A chosen mission shows Mission.
- The architect adds any other tool from the sidebar, and can hide an empty one again.
- New and existing projects start with Notes.

## The question bank

Questions for situations, kept in the library so every engagement can use them:

- **Standalone question sets** for common situations: kickoff, current-state systems, security and compliance, data and migration, integration.
- **Mission-specific sets**, for questions only one line of work needs. The effectiveness model's factor questions are one such source already.

Each question stays light: its `text`; `why`, meaning what the answer changes; `ask`, the role IDs to ask; and `informs`, what the answer feeds (an outcome, a stakeholder, a system, a process step, a constraint, or a mission factor).

In Studio, the architect adds questions from the bank for the situation, sends them ahead as a questionnaire, or works through them in a workshop. A set of answers is saved as a source, of kind questionnaire or workshop. That way Analyze, evidence quotes, and "came from" links work on answers exactly as they do on notes.

## Plan

1. **Tools and outcome-first readiness** in Studio: sections hidden per project, added from the sidebar; readiness and next actions built around outcomes, not notes. *Started October 22, 2026.*
2. **Answers as evidence:** a set of answers becomes a source Analyze can read.
3. **The question bank:** its format in the library, the validator's checks, a kickoff set, and mission-specific sets. Then Studio's picker.
4. **Later, one at a time:** metric targets, stakeholder concerns, and current-state systems as starting points for requirements.
