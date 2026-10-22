# Solution Studio and the v0.2 taxonomy

How Solution Studio (`../solution-studio`) reads the library today, what changed in the rebuild, and what each side needs so they line up again. Written October 15, 2026, against Studio's working tree (which has uncommitted work on Define and the future process) and the library at v0.2.

## Where things stand

Studio reads three folders from this repository: `_data/missions/`, `_data/use-cases/`, and `_data/capabilities/` (see `src/server/library.ts` and `missions.ts`). The rebuild removed all three, so **Studio currently finds no missions, use cases, or capabilities.** It degrades quietly: the mission picker is empty and the process and Define views have no templates.

Studio's saved database has three projects that use the old `inspector-general-investigations` mission, one process with 10 activities started from it, and 34 requirements (none from templates yet).

The old files are still in `../enterprise-blueprints.github.io-old/_data/`: one mission model (IG investigations: 27 factors, 37 relationships, 2 loops, 14 interventions, 10 roles, 10 systems, 2 processes, 16 requirements), one use case (public-sector case management: 9 personas, 8 phases, ~30 activities, 10 scenarios, 35 template requirements), and 14 capabilities.

## Concept by concept

| Concept | Old library (what Studio expects) | v0.2 library | Gap |
| --- | --- | --- | --- |
| **File format** | Plain YAML in `_data/` | Front matter in `_blocks/*.md` and `_missions/*.md`, with prose sections in the body | Studio needs a new reader, or a JSON export from the site |
| **IDs** | `capability:case-management`, referenced as `case-management` | `capability.case-management`, referenced in full | Mechanical |
| **Mission: why the work exists** | Effectiveness graph: `factors` (condition, behavior, operational outcome, mission outcome) with signals, questions, metrics, and the activities they show up at; causal `relationships` with effect and confidence; `loops`; `interventions` linked to requirements | `outcomes` (mission outcomes, with example `indicators`) and `operational_outcomes` (with `contributes_to`, `measures`, and `supported_by`) | The two outcome levels match Studio's `mission-outcome` and `operational-outcome` factors, and `contributes_to` is a first causal link. Conditions, behaviors, loops, and interventions still have no home. They drive Studio's Mission view: ratings, opportunity ranking, loops, interventions |
| **Mission: roles** | `{id, title, description, concerns, influence, factors, personas}` | `{name, description}` | No ids, concerns, influence, or link to process roles |
| **Mission: typical systems** | `{id, title, kind, fate, description, provides: [capabilities]}` | None | Studio seeds Current state from these |
| **Mission: composition** | Implicit (processes and requirements) | `components` `{ref, purpose, stage}`, lifecycle stages, experience ideas | Studio doesn't read these yet. They're useful to it |
| **Generic process** | Use case: personas, phases, activities, scenarios, template requirements | Process block (shared scope), with `specializes` for a domain version | No generic case-management process exists in v0.2 yet |
| **Mission's own process** | `processes` in the mission file, specializing use case activities (`extends`) | A domain process block, linked by `lifecycle_process` | Fits. Step-level `extends` has no equivalent |
| **Process unit** | Phase → activities (about 30 for case management) | Steps (5 for the investigation lifecycle) with decisions and exceptions | v0.2 steps are coarser. Mission lifecycle stages work like phases |
| **Activity / step details** | `actor` (persona id), `participants`, `produces` (entity ids), `uses` (capability ids), `decision` (one question), `waits`, `optional` | `role` (text), `uses` (capability ids), `decisions` `{decision, accountable, records}` | Missing: participants, produces, waits, optional. `produces` can be derived from `uses` and `manages` |
| **Scenarios** | `{id, activities (the path), check}`: what a design must show | `exceptions` `{title, description, continues_at}` | Overlap only. Studio plans to run scenarios in Validate |
| **Template requirements** | On use cases and missions: `{id, statement, category, activities, capabilities, policies, scenarios, extends}` | **None** | **The biggest content gap.** They power Studio's Define stage |
| **Capability** | `layer`, `responsibility`, `boundaries`, `operations {name, accepts, returns}`, `entities`, `policies`, `depends_on`, `signs`, `questions` | `scope`, `summary` plus Definition and Boundaries prose, `operations {id, title, description, automation, takes, returns, authority}`, states, events, measures, maturity, and `manages` / `constrained_by` / `depends_on` relationships | Maps well. `takes`/`returns` are the old `accepts`/`returns`. Boundaries is now prose, not a field. `signs` has no equivalent (Studio doesn't use it today) |
| **Capability coverage** | 14: case management, document management, approval, identity, notification, organization and person information, payment, reporting, scheduling, search, signature, workflow, address validation | 3: case, document, and application management | Content gap |
| **Entities** | Plain ids (`case`, `participant`, `interaction`) | Entity blocks with attributes | Better in v0.2 |
| **Policies** | Plain ids (`authorization`, `privacy`, `audit`) | Policy blocks with obligations, and controls that enforce them | Better in v0.2. Studio doesn't use them yet |
| **Measures** | Metrics on factors `{name, measurement, better}` | Capability measures `{id, name, description}`, referenced from outcomes | No baseline direction (`better`) on v0.2 measures |
| **Experiences, patterns** | None (Studio gets patterns from industry-blueprints) | Experience and pattern blocks | New to Studio |
| **Links back to the site** | `/missions/<slug>.html`, `/use-cases/<slug>.html`, `/capabilities/catalog.html#…` | `/missions/<slug>/`, `/blocks/<type>-<slug>/` | Mechanical |

## What the library could add

Ordered by how much Studio needs it. Each is optional, so existing content stays valid.

1. **A mission model on missions.** Bring the effectiveness graph back as optional mission fields: `factors`, `factor_links` (the causal relationships, renamed so they don't collide with block relationships), `loops`, and `interventions`. Factors would point at process steps (`process.investigation-lifecycle#triage`) rather than activities. Mission outcomes would become the graph's mission-outcome factors, so they're written once. The mission page would render the graph as its own section.
2. **Template requirements on processes.** `requirements` `{id, statement, category, steps, capabilities, policies}` on process blocks, and on missions for mission-specific ones, with `extends` for a mission's version of a process requirement. Policy obligations already cover many constraints. A requirement could reference `policy.x#obligation` instead of restating it.
3. **Role ids.** Give mission roles an `id`, plus optional `concerns` and `influence`, and let a process step's `role` match a role or an experience persona. Studio uses these ids to tie stakeholders, activities, and factors together.
4. **Typical systems on missions.** `typical_systems` `{id, name, kind, description, provides: [capability ids]}`. Fate stays a per-customer judgment in Studio.
5. **A generic case-management process.** A shared process block that Investigation Lifecycle `specializes`, carrying the old use case's steps and requirements. Possibly finer steps, or sub-processes with `part_of`, if five steps prove too coarse for discovery.
6. **The rest of the capability catalog,** as planned stubs at first: the 11 old capabilities v0.2 doesn't have yet.
7. **Smaller fields:** `better` (higher or lower) on measures, and maybe `participants` and `waits` on steps.
8. **A JSON export,** such as `/data/library.json`, built by Jekyll and checked by the validator. Studio would read one stable contract instead of parsing Markdown front matter, and other tools could use it too.

## What Studio needs to change

1. **A new library reader.** Replace `library.ts` and `missions.ts` with a reader for v0.2: either the JSON export (preferred) or `_blocks/` and `_missions/` front matter through `gray-matter`, which Studio already depends on. It would map blocks into Studio's existing types, so most of the UI keeps working:
   - process steps become activities, and lifecycle stages become phases
   - process requirements become template requirements
   - capability blocks become `Capability`, with `takes` mapped to `accepts` and `scope` to `layer`
   - mission outcomes and the mission model become factors
2. **Full IDs.** Use `capability.case-management` everywhere, and update the site URLs.
3. **Migrate saved projects.** Map `inspector-general-investigations` to `investigations`, and old activity, factor, and requirement refs to new ones. Alternatively, accept that the three test projects lose their template links. Studio already drops unknown refs with a warning.
4. **Use what's new.** Policies and obligations as constraints in Define. Controls in Validate, to check that enforcement sits where it can work. Patterns and experiences in Design. Capability states and events in Explore. Outcome measures as metric templates.
5. **Rename to match.** Studio's "use case" becomes "process", and "activity" becomes "step". This is optional, but it keeps one vocabulary across both projects.

## Open questions

- **Where does the effectiveness graph live?** Recommended: on the mission, as above. It's the mission's reasoning and should be defined once, next to its outcomes. The alternative is moving it into Studio, but then the library page can't show it.
- **How fine are process steps?** Studio's discovery works best at about 30 activities. Five steps is right for the library page. Sub-processes would let us have both.
- **Which mission does Studio's IG content become?** The IG mission is a specialization of Investigations. It could be its own mission that composes the same blocks, or its graph could go on Investigations directly.
- **Does Studio read the repository or the published site?** The JSON export works either way: a local path, or the live URL.
