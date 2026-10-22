# Enterprise Blueprints

An open reference library for designing the AI-native enterprise.

**Build Experiences. Share Capabilities.** As AI makes software easier to create, the enterprise needs durable shared information, capabilities, governance, and contracts, so new apps, workflows, and agents don't keep reinventing the organization's responsibilities.

The site is one connected architecture, not a set of separate articles:

- **Building blocks** are reusable definitions. Each one has a permanent ID, a type, and typed relationships.
- **Mission Blueprints** compose those blocks by ID and record the part each block plays in that mission.
- **Reverse references are generated.** A block page lists every block that points to it and every mission that uses it. Nobody maintains those lists by hand.

The guiding principle is *define once, reference everywhere, compose as needed.*

It's a plain Jekyll site: Markdown and YAML front matter, Liquid templates, one CSS file, and a little vanilla JavaScript. There are no Jekyll plugins, no database, and no client-side framework.

---

## Contents

- [Quick start](#quick-start)
- [Publish on GitHub Pages](#publish-on-github-pages)
- [Repository layout](#repository-layout)
- [How content is structured](#how-content-is-structured)
- [Add a building block](#add-a-building-block)
- [Add a Mission Blueprint](#add-a-mission-blueprint)
- [Add a relationship type](#add-a-relationship-type)
- [Other registries: types, domains, statuses, scopes](#other-registries)
- [Link to records from prose](#link-to-records-from-prose)
- [Implementation Guides](#implementation-guides)
- [Validation](#validation)
- [How generated references work](#how-generated-references-work)
- [Design and accessibility](#design-and-accessibility)
- [Scope of version 0.1](#scope-of-version-01)
- [License](#license)

---

## Quick start

You'll need:

- **Ruby 3.1 or later** with Bundler (`gem install bundler`)
- **Python 3.10 or later**

```sh
# Install dependencies (once)
bundle install
pip install -r requirements-dev.txt

# Check the content, then preview the site at http://localhost:4000
python scripts/validate_content.py
bundle exec jekyll serve --livereload
```

Common commands:

| Task | Command |
| --- | --- |
| Validate content | `python scripts/validate_content.py` |
| Validate, treating warnings as errors | `python scripts/validate_content.py --strict` |
| Run the validator's tests | `python -m unittest discover -s scripts -p "test_*.py"` |
| Preview the site | `bundle exec jekyll serve --livereload` |
| Build the site | `bundle exec jekyll build` |
| Check internal links in a build | `python scripts/check_links.py _site` |
| Check a project-site build | `bundle exec jekyll build --baseurl /my-repo -d _site_check` then `python scripts/check_links.py _site_check --baseurl /my-repo` |
| Create a planned block stub | `python scripts/new_block.py capability my-capability "My Capability"` |

> **Windows and Git Bash:** Git Bash rewrites arguments that look like paths, so `--baseurl /my-repo` arrives as `C:/Program Files/Git/my-repo`. Run those commands from PowerShell or Command Prompt, or prefix them with `MSYS_NO_PATHCONV=1`.

---

## Publish on GitHub Pages

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) validates content, builds the site, checks every internal link, and deploys from `main`.

1. Create a GitHub repository and push this code to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the workflow by hand from the **Actions** tab.

You don't need to edit `_config.yml` for the URL. The workflow asks GitHub for the correct base path and passes it to Jekyll:

- A repository named `OWNER.github.io` is a user or organization site, served at the root (`https://OWNER.github.io/`).
- Any other repository name is a project site, served under the repository name (`https://OWNER.github.io/REPO/`).

Every template uses Jekyll's `relative_url` filter, and CI checks links under a test base path on every run, so both cases work.

**Optional:** set `repository_url` in `_config.yml` (for example `https://github.com/OWNER/REPO`) to show "Suggest an edit" links on every page.

What the workflow does:

| Job | Runs on | Steps |
| --- | --- | --- |
| `validate` | every push and pull request | Validate content, then run the validator's tests. |
| `build` | after `validate` passes | Build with the Pages base path, check links, build again under `/baseurl-check` and check links, then upload the artifact (not on pull requests). |
| `deploy` | pushes to `main` only | Deploy the artifact to GitHub Pages. |

---

## Repository layout

```text
.
├── _config.yml                 Site settings and collections
├── index.html                  Homepage
├── architecture.md             The Architecture
├── vocabulary.html             Vocabulary reference, generated from _data/
├── blocks.html                 Building Blocks index, with type filter
├── missions.html               Mission Blueprints index
├── implementations.html        Implementation Guides index
├── about.md                    About
├── _blocks/                    One file per building block (all types)
├── _missions/                  One file per Mission Blueprint
├── _implementations/           Implementation Guides (empty in v0.1)
├── _data/
│   ├── block_types.yml         Block types, grouping, and mission page layout
│   ├── relationship_types.yml  Relationship vocabulary and endpoint rules
│   ├── statuses.yml            planned, draft, published
│   ├── scopes.yml              shared, domain
│   ├── domains.yml             Domains used as metadata
│   └── navigation.yml          Main navigation
├── _layouts/                   default, page, block, mission, implementation
├── _includes/                  Reference links, badges, cards, architecture diagram
├── assets/                     site.css, site.js, favicon
├── scripts/
│   ├── validate_content.py     Content validator (CI runs it before building)
│   ├── test_validate_content.py
│   ├── check_links.py          Internal link checker for a built site
│   └── new_block.py            Creates a planned block stub
├── templates/                  Copy-and-edit templates for new records
├── redirects/                  Old URLs that forward to renamed pages
├── notes/                      Working notes and design proposals (not published)
└── .github/workflows/pages.yml
```

Adding content never requires changes to layouts, includes, routing, or configuration.

---

## How content is structured

### IDs

Every record has a globally unique, permanent `id`:

| Record | ID format | File |
| --- | --- | --- |
| Building block | `<type>.<slug>`, such as `capability.case-management` | `_blocks/capability.case-management.md` |
| Mission Blueprint | `mission.<slug>`, such as `mission.investigations` | `_missions/investigations.md` |
| Implementation Guide | `implementation.<slug>` | `_implementations/<slug>.md` |

The filename **must** match the ID; the validator enforces this. That isn't just tidiness. Jekyll reserves `id` on collection documents for its own use, so templates resolve references through the filename instead. Keeping the two equal is what makes ID-based linking reliable.

IDs never change once published. Don't set `permalink` or `slug` in front matter; URLs are generated from the ID (`capability.case-management` → `/blocks/capability-case-management/`).

### Building blocks

All block types live in one `_blocks/` collection:

| `type` | Meaning | Shown under |
| --- | --- | --- |
| `entity` | A distinct thing the enterprise needs to identify, describe, and keep information about | Entities |
| `capability` | What an organization can reliably do | Capabilities |
| `process` | How work is coordinated to achieve an outcome | Processes |
| `experience` | How people or agents engage with capabilities and processes | Experiences |
| `policy` | A rule, obligation, or constraint | Governance |
| `control` | A safeguard that satisfies a policy | Governance |
| `pattern` | A reusable design or composition approach | Patterns |

Front matter fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Matches the filename. Starts with the type. |
| `type` | yes | A key in `_data/block_types.yml`. |
| `title` | yes | Readable name. |
| `summary` | yes | One sentence. Shown on cards and under the title. |
| `status` | yes | `planned`, `draft`, or `published`. |
| `scope` | yes | `shared` (reusable across domains) or `domain` (meaningful within its domain). |
| `domain` | yes | A key in `_data/domains.yml`. |
| `relationships` | no | A list of `{type, target, note}`. Intrinsic relationships only. A control's `enforces` relationship can also list `obligations: [ids]` from the policy it enforces. |
| `attributes` | entities only | A list of `{name, description}`, shown as a table under Key attributes. |
| `trigger` | processes only | One sentence: what starts the process. Shown at the top of the Flow. |
| `steps` | processes only | A list of `{id, title, role, description, uses, decisions, waits, subprocess}`, in order. `uses` lists capability IDs, which must also be `uses` relationships. Each capability's page links back to the steps that use it. `decisions` is a list of `{decision, accountable, records}`. `waits` says what the work waits on there. `subprocess` names a finer process that describes the step in more detail; that process's page links back to the step. |
| `outcome` | processes only | One sentence: what the process has produced when it ends. Shown at the bottom of the Flow. |
| `exceptions` | processes only | A list of `{title, description, continues_at}`. `continues_at` is the id of the step where work picks up again. |
| `requirements` | processes only | Template requirements: what most solutions for this work need. A list of `{id, title, statement, category, steps, capabilities, policies}`. `category` is `functional`, `nfr`, or `constraint`, from `requirement_categories` in `_data/block_types.yml`. `steps` names this process's steps; with none, it applies to the whole process. `policies` names policies, or one obligation as `policy.x#obligation-id`. Solution Studio offers these when a step changes. |
| `operations` | capabilities only | A list of `{id, title, description, automation, takes, returns, authority}`. `automation` is `allowed`, `with-review`, or `people-only`, from `automation_levels` in `_data/block_types.yml`. Each operation's row also shows the state moves it makes and the events it raises. The optional `takes`, `returns`, and `authority` fields give the operation a light contract; see [Capability contracts](#capability-contracts). |
| `every_operation` | capabilities only | A list of sentences that are true of every operation, such as "Records who performed it, when, and why." Start each with a verb: the page joins them into one sentence under the Operations heading, beginning "Every operation". |
| `states`, `transitions` | capabilities only | `states` is a list of `{id, name, description}` in their usual order. `transitions` is a list of `{from, to, via}`: two state ids and the id of the operation that makes the move. |
| `events` | capabilities only | A list of `{id, name, description, raised_by}`: what the capability announces. `raised_by` is the id of the operation that raises it; leave it out for events such as a deadline passing. |
| `measures` | capabilities only | A list of `{id, name, description}`. The `id` is optional, but a mission outcome can only reference a measure that has one. Each measure lists the mission outcomes that reference it. |
| `maturity` | capabilities only | A list of `{level, description, questions}`, lowest level first. `questions` help an organization tell whether it has reached the level. Capabilities keep their questions here, so they leave out the shared Questions to ask section. |
| `obligations` | policies only | A list of `{id, level, statement}`. `level` is `must`, `must-not`, or `should`, from `obligation_levels` in `_data/block_types.yml`. Start each statement with a verb, because it reads after its level. The policy page shows which control enforces each obligation, and which have none yet. |
| `waivers` | policies only | A list of `{title, description, approved_by}`: when the policy can be set aside, and who approves it. |
| `checks` | controls only | A list of `{title, description}`, in order: what the control does, step by step. |
| `evidence` | controls only | A list of `{name, description}`: the records the control leaves. |
| `tests` | controls only | A list of `{title, expected}`: a situation to try, and the result that shows the control works. |
| `personas` | experiences only | A list of `{name, summary, ideas}`: who uses the experience, and ideas for what it could include for them. `ideas` are plain sentences, not a specification, so the experience doesn't have to change whenever the blocks underneath it grow. |
| `channels` | experiences only | A list of `{name, description}`: where people reach it. |
| `principles` | experiences only | A list of sentences: the accessibility and design commitments it keeps. |
| `participants` | patterns only | A list of `{name, type, description}`: the roles the pattern arranges. `type` is the kind of building block that usually plays the role, or `person` or `agent` for roles that people or agents play directly. |
| `approach` | patterns only | A list of `{title, description}`, in order: how the pattern works. |
| `use_when`, `avoid_when` | patterns only | Lists of sentences: when the pattern fits, and when it doesn't. |
| `kind` | controls only | `preventive`, `detective`, or `corrective`, from `kinds` in `_data/block_types.yml`. Shown as a badge. |

The body is Markdown. The layout already shows the title and summary, so start with `##` headings. A `planned` stub may have an empty body. Draft and published blocks need one.

### Sections

Every block starts with **Definition** and ends with a shared set of sections, including **Boundaries**. In between, each type has its own sections. A process has Flow and Exceptions and rework, for example, while a control has Objective, How it works, Evidence it produces, and How to test it. The full list, with a writing prompt for each section, is `block_sections` and `type_sections` in [`_data/block_types.yml`](_data/block_types.yml). The vocabulary page shows the same list.

Entities are the exception to the shared ending. An entity describes data only: its Definition, its Key attributes, and its Boundaries. It makes no assumptions about how it will be used, so it leaves out In practice, Agents and automation, and Questions to ask (see `omit_sections`). How the data is managed, used, or governed belongs to the capabilities, processes, and policies built on it.

Use the headings exactly as written there, in that order. The validator warns about a missing required section, an unknown heading, or sections out of order.

Some sections show structured front matter instead of prose, listed as the section's `fields`. A process's Flow, for example, comes from `trigger`, `steps`, and `outcome`. Put the section's include, such as `{% include block-flow.html %}`, under its heading. Keep content like this in front matter wherever it has a regular shape, so tools and apps can read it as data, not just people.

### Intrinsic and contextual relationships

This distinction is at the heart of how the library works:

- **Intrinsic** relationships belong on the block, because they're part of what the block means everywhere. *Case Management `manages` Case.*
- **Contextual** relationships belong on the mission, in that mission's `components`. *In Investigations, Document Management maintains the evidence file.*

Don't add a relationship to a block just because one mission uses the block that way. Put it in that mission's `purpose` instead.

Relationships are written **once, on the source record**. Never add the reverse relationship to the target; the site generates it.

### Specialization

"Define once" means one definition per concept *within a clear scope*. If a domain's meaning genuinely differs, create a separate block that `specializes` the general one. For example, `entity.investigative-document` specializes `entity.document`.

### Capability contracts

A capability's operations together form its contract: what anyone, whether a person, an app, or an agent, can ask the capability to do. Most of the contract comes from fields that are already there:

| Part of the contract | Where it comes from |
| --- | --- |
| What the operation does | `description` |
| What it needs, and what it gives back | `takes` and `returns`, both optional |
| When it can be used | The `from` state of its `transitions` |
| Who may do it | `every_operation` (the usual access check), `automation`, and the optional `authority` |
| What it announces | `events` whose `raised_by` names the operation |

`takes` and `returns` are short plain phrases, such as "The reason", not data types or schemas. The contract stays technology-neutral: it says what a capability promises, and leaves message formats and APIs to Implementation Guides. Add `authority` only when the operation needs more than the usual access check, such as "A records officer for the records' category".

---

## Add a building block

Either create a planned stub:

```sh
python scripts/new_block.py capability identity-verification "Identity Verification" --domain cross-cutting
```

or copy [`templates/block.md`](templates/block.md) to `_blocks/<type>.<slug>.md`. The script also writes an outline of the type's sections into the stub, inside a Liquid comment so the planned page stays clean. Then:

1. Write a one-sentence `summary`.
2. Add intrinsic `relationships` to existing IDs. Check `_data/relationship_types.yml` for which types can connect.
3. Write the body, then set `status` to `draft`.
4. Run `python scripts/validate_content.py`.

A planned stub is a real, linkable page. Use stubs freely to connect a mission to concepts that haven't been written yet. References never disappear silently.

---

## Add a Mission Blueprint

Copy [`templates/mission.md`](templates/mission.md) to `_missions/<slug>.md` and set `id: mission.<slug>`.

| Field | Required | Notes |
| --- | --- | --- |
| `id`, `title`, `summary`, `status` | yes | As for blocks. |
| `components` | yes, unless `planned` | Blocks this mission uses. See below. |
| `domains` | no | Keys from `_data/domains.yml`. A mission may draw on many domains. |
| `outcomes` | no | Mission outcomes: the public value the work creates. Each is a short sentence, or `{id, title, statement, indicators}`. See below. |
| `operational_outcomes` | no | How well the work performs. Each is a short sentence, or `{id, statement, contributes_to, measures, indicators, supported_by}`. See below. |
| `lifecycle` | no | A list of `{id, title, summary}` stages. Present them as illustrative. |
| `lifecycle_note` | no | Replaces the default "these stages are illustrative" note. |
| `lifecycle_process` | no | The ID of the process block the lifecycle summarizes. Each page then links to the other. |
| `roles` | no | A list of `{id, name, description, concerns, influence}`. Only `name` is required. The `id` lets a mission effectiveness model and tools refer to the role; `influence` is `high`, `medium`, or `low`. |
| `typical_systems` | no | Systems organizations doing this work usually have: `{id, name, kind, description, provides}`. `provides` lists capability IDs. Whether to keep or replace each one is decided per engagement, so it isn't here. |
| `experience_ideas` | no | A list of `{title, description}`: experiences someone could build for this mission. They're suggestions, not building blocks. |

Each component:

```yaml
components:
  - ref: capability.document-management   # a block ID (required)
    purpose: Maintains investigative documents and attachments.   # required
    stage: investigation                  # optional; a lifecycle stage id
    notes: Optional extra mission-specific detail.
```

The page shows each block's title, type, and summary from the block's own record, alongside this mission's `purpose`. Blocks appear in the lifecycle by stage, and in a stack arranged by what relies on what: roles at the top, then experiences (with any experience ideas), processes, capabilities, and entities, followed by governance and then patterns. The stack is defined by `mission_layout` in `_data/block_types.yml`.

List a block once. If it really plays different parts at different stages, list it once per stage, each with a distinct `stage`. The validator rejects other duplicates.

### Mission and operational outcomes

A mission describes outcomes at two levels. The outcomes a particular system or project sets out to change belong to that project, in a tool such as Solution Studio, not to the library.

**Mission outcomes** (`outcomes`) are the public value the work creates, at the level of the agency. They change rarely. Each can list example `indicators`. Indicators belong to the mission, and each agency chooses its own.

```yaml
outcomes:
  - id: wrongdoing-addressed
    title: Wrongdoing is addressed
    statement: Fraud, waste, abuse, and misconduct are found, stopped, and corrected.
    indicators:
      - name: Funds recovered or put to better use
        description: Money returned, saved, or redirected because of investigations.
```

**Operational outcomes** (`operational_outcomes`) describe how well the work performs. Each says which mission outcomes it serves, how you'd know it's achieved, and what makes it possible:

```yaml
operational_outcomes:
  - id: timely-triage
    statement: Matters are triaged promptly and prioritized by risk.
    contributes_to: [wrongdoing-addressed]          # mission outcome ids
    measures:
      - capability.case-management#time-to-accept   # a measure defined on the block
    supported_by:
      - process.investigation-lifecycle#triage      # a process's step
      - capability.case-management#accept           # a capability's operation
      - pattern.human-in-the-loop-review            # or a whole block
```

Measures are defined once, on the building block, and referenced here, so the mission never keeps its own copy. A reference is a block ID, optionally followed by `#` and the id of a measure, a step, or an operation. An operational outcome can also list `indicators` `{name, description}` for measurement specific to the mission, such as allegations awaiting triage, that no building block carries. The validator checks that each reference exists, and that `contributes_to` names the mission's own outcomes.

The mission page lists the mission outcomes with their indicators. Below that, "Operational outcomes" shows the operational outcomes grouped under the mission outcomes they serve, with links to what measures and supports them. A mission outcome with nothing under it is shown as a gap. Each measure's row on its block page lists the operational outcomes that use it. Either list can also be plain sentences.

### Mission effectiveness models

A mission can have an effectiveness model in `_data/mission_models/<mission file name>.yml`. The model explains what shapes the mission's outcomes, so an architect can find where the work most needs to improve: Solution Studio uses it to rank opportunities with a customer. The outcomes stay on the mission. The model adds what drives them:

```yaml
mission: mission.inspector-general-investigations   # must match the file name
factors:                    # conditions and behaviors
  - id: caseload
    type: condition         # condition | behavior
    title: Investigator caseload
    better: lower           # higher | lower | neutral
    signals: [What you hear when it's a problem.]
    questions: [What to ask the customer.]
    metrics: [{ name: Open cases per investigator, measurement: How it's counted. }]
    steps: [process.oig-investigative-work#assign-owner]   # where it shows up
    known_by: [sac]         # mission role ids
outcome_notes:              # optional discovery detail for the mission's outcomes
  backlog: { questions: [How long do allegations wait for triage?] }
links:                      # how factors and outcomes influence each other
  - { from: caseload, to: timely-investigations, effect: decreases, confidence: supported, rationale: Why. }
loops:                      # reinforcing or balancing loops
  - { id: closure-pressure-loop, title: …, kind: reinforcing, factors: [caseload, rework] }
interventions:              # what would change a factor, and the requirements that deliver it
  - id: workload-dashboards
    title: Workload dashboards
    kind: technology        # technology | process | policy | people | organization
    changes: [{ factor: caseload, effect: decreases }]
    requirements: [process.oig-caseload-oversight#workload-visibility]
```

The validator checks every reference: steps, roles, factors and outcomes in links and loops, and the requirements interventions name. The mission page shows the model in a collapsed "Mission effectiveness model" section.

---

## Add a relationship type

1. Add an entry to [`_data/relationship_types.yml`](_data/relationship_types.yml):

   ```yaml
   governs:
     label: Governs                 # shown on the source block
     inverse_label: Governed by     # shown on the target block
     sources: [policy]              # block types, or `any`
     targets: [capability, process] # block types, or `any`
     # same_type: true              # require source and target to share a type
     # implies_use: forward         # a mission using the source relies on the target
     description: The policy sets rules for the capability or process.
   ```

2. Use it in a block's `relationships`.
3. Run `python scripts/validate_content.py`.

Set `implies_use` only when the relationship is a real dependency: `forward` when a mission that uses the source also relies on the target, `reverse` when it's the other way around. It decides where a block shows as used indirectly (see [How generated references work](#how-generated-references-work)).

Block pages and the vocabulary page pick it up automatically. Add relationship types deliberately: each one should carry a meaning that existing types don't. Avoid generic types such as `related_to`.

`realizes` is reserved for Implementation Guides and can't be used on blocks.

## Other registries

- **Block types:** add an entry under `types` in `_data/block_types.yml`, add the type to exactly one entry under `groups`, and place it once in `mission_layout` (in `stack`, `cross_cutting`, or `applied`). Add colors for `.type-<name>` in `assets/css/site.css` if you want a distinct color; otherwise it falls back to neutral.
- **Domains:** add an entry to `_data/domains.yml` before using it.
- **Statuses and scopes:** `_data/statuses.yml` and `_data/scopes.yml`. Templates style `planned`, `draft`, and `published`, so change these rarely.

---

## Link to records from prose

Inside any Markdown body, link to a record by ID rather than by URL:

```liquid
{% include ref.html id="capability.document-management" %}
{% include ref.html id="mission.investigations" text="the Investigations blueprint" %}
```

The validator checks these IDs too. A broken one also shows a visible "Unresolved reference" warning on the page.

---

## Implementation Guides

Implementation Guides describe how a specific technology realizes logical blocks. They're kept separate so the logical architecture doesn't depend on any one technology.

Copy [`templates/implementation.md`](templates/implementation.md) to `_implementations/<slug>.md`. A guide lists the blocks it realizes with `realizes` relationships. Those blocks then link to the guide automatically. Blocks never reference guides.

Version 0.1 has no guides on purpose. The structure is in place for when they're needed.

---

## Validation

`scripts/validate_content.py` reads every record and registry and fails with a clear message for:

- Missing or duplicate IDs, IDs in the wrong format, and filenames that don't match IDs.
- Missing required fields, including a missing `purpose` on a mission component.
- Unknown block types, relationship types, statuses, scopes, or domains.
- References to IDs that don't exist, whether in relationships, mission components, or inline `ref.html` links.
- Relationships between disallowed source and target types, or that break a `same_type` rule.
- Self-references and duplicate relationships.
- Duplicate mission components, and stages that aren't in the mission's lifecycle.
- Registry mistakes, such as a group listing an unknown type.

It also warns about unknown fields, which usually means a typo, and suggests the closest match:

```text
ERROR    _blocks/capability.case-management.md: relationship #1: (manages -> entity.cas) targets ID 'entity.cas', which does not exist. Create the block (a 'planned' stub is fine) or fix the ID. Did you mean 'entity.case'?

FAILED: checked 12 blocks, 2 missions, 0 implementation guides; 1 error(s), 0 warning(s).
```

CI runs the validator and its tests before building, so invalid content never deploys.

---

## How generated references work

The site derives every reverse view at build time with Liquid. It doesn't store any reciprocal data.

- **Block → block:** a block page scans other blocks' `relationships` for its own ID and groups them by the inverse label ("Managed by", "Constrains", and so on).
- **Block → missions:** a block page scans every mission's `components` for its ID and shows each mission with that mission's purpose and stage. Those are the missions that use it **directly**.
- **Block → missions, indirectly:** a block page also follows the relationships marked `implies_use` in `_data/relationship_types.yml`, up to three steps away, to find missions that rely on it without listing it. Entity Document, for example, is used indirectly by both missions, through Document Management, which `manages` it. Each is labeled "Indirectly" and names the nearest listed blocks it comes through. Only dependencies count: `uses`, `manages`, `provides_access_to`, `depends_on`, `constrained_by`, and `specializes` carry usage forward, and `enforces` carries it from a policy to its controls. `applies_to`, `supports`, `part_of`, and `references` don't, so a mission isn't credited with everything that happens to be connected.
- **Measure → outcomes:** each measure's row lists the operational outcomes that reference it.
- **Mission → missions:** each component on a mission page lists the other missions that also use it.
- **Homepage:** blocks used by two or more missions are listed automatically.

This is fine for a library of hundreds of records. If builds become slow at a much larger scale, the next step is a build-time index generated by a script in CI, not hand-maintained links.

---

## Modeling decisions

Choices that shape the model, and why. Change them deliberately.

- **Seven building block types, no more for now.** Entity, Capability, Process, Experience, Policy, Control, and Pattern. Outcomes, measures, roles, and events are real concepts, but they live inside missions and blocks, with stable ids so they can be referenced, rather than as types of their own. Promote one only when it needs its own page and relationships.
- **Each content type has one job.** A mission holds outcomes, context, participants, an illustrative lifecycle, and its composition of blocks. A process holds steps, decisions, handoffs between roles, exceptions, and the capabilities each step uses. A capability holds operations, states, events, and measures. An experience describes who it serves and how. A mission links to its process rather than repeating it.
- **Capability contracts stay light.** An operation can say what it takes, what it returns, and who has authority to perform it, all in plain phrases. When it can be used comes from its states, and what it announces comes from its events. There are no data types or schemas: those belong to implementations. See [Capability contracts](#capability-contracts).
- **Outcomes come in two levels, and project outcomes stay out.** Mission outcomes are agency-level public value, with example indicators that belong to the mission. Operational outcomes are how well the work performs, and each one serves a mission outcome. The outcomes a particular solution sets out to change belong to the project, which links up to these.
- **Measures are defined once, on building blocks.** Operational outcomes reference them (`capability.case-management#time-to-accept`) instead of defining their own. For now only capabilities have measures. Add measures to other types when a real outcome needs one that no capability can carry. Mission indicators are different: they describe the agency's results, so they live on the mission.
- **Usage is written once and derived both ways.** A mission lists the blocks it uses directly. Indirect usage is derived by following only the relationships marked `implies_use`, up to three steps, so a mission isn't credited with every block that happens to be connected. Nobody maintains reverse references or lists of missions on blocks.
- **Intrinsic relationships go on blocks, contextual ones on missions.** A relationship that's true wherever a block is used belongs on the block. How one mission uses a block goes in that mission's `purpose`.
- **Ownership stays narrow.** Document Management keeps documents. It doesn't own a grant application's lifecycle: Application Management does, and the application's documents are documents in their own right.
- **Placeholders are welcome.** A planned block with only a summary and its relationships is enough to show where the library has gaps, such as the Grants policies and controls, and every page that links to it already works.

---

## Design and accessibility

- One stylesheet with CSS custom properties, a light theme, and a dark theme that follows the reader's system setting.
- Semantic landmarks, a skip link, visible focus states, `aria-current` navigation, and labeled filter controls.
- Every page works without JavaScript. The script only adds the type and text filter on the Building Blocks index and "Copy" buttons for IDs.
- Responsive from phone to wide desktop, with no horizontal page scrolling.
- The architecture diagram is HTML and CSS, so it stays crisp and readable by screen readers.

---

## Scope of version 0.1

Deliberately **not** included: an interactive graph explorer, a database or CMS, an ontology or inference engine, advanced search, AI generation, authentication, collaborative authoring, a comprehensive catalog, vendor-specific architectures, or a large design system.

The focus is clear content structure, typed references, validation, and good navigation. The library is meant to grow from any starting point: a mission, a capability, an entity, a governance concern, or a pattern.

---

## License

Written content, including building blocks, mission blueprints, and documentation, is licensed under [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Code, including scripts, templates, styles, and workflows, is licensed under the [MIT License](LICENSE-MIT.txt). See [LICENSING.md](LICENSING.md) for how the split applies and how to give attribution.
