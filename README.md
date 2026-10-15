# Enterprise Blueprints

An open, vendor-neutral reference library for designing the AI-native enterprise.

**Build Experiences. Share Capabilities.** As AI makes software easier to create, the enterprise needs durable shared information, capabilities, governance, and contracts, so new apps, workflows, and agents don't keep reinventing the organization's responsibilities.

The site is one connected architectural model, not a set of separate articles:

- **Building blocks** are canonical, reusable definitions. Each one has a stable ID, a type, and typed relationships.
- **Mission Blueprints** compose those blocks by ID and record the part each block plays in that mission.
- **Reverse references are generated.** A block page lists every block that points to it and every mission that uses it. Nobody maintains those lists by hand.

The guiding principle is *define once, reference everywhere, compose as needed.*

It's a plain Jekyll site: Markdown and YAML front matter, Liquid templates, one CSS file, and a little vanilla JavaScript. There are no Jekyll plugins, no database, and no client-side framework.

---

## Contents

- [Quick start](#quick-start)
- [Publish on GitHub Pages](#publish-on-github-pages)
- [Repository layout](#repository-layout)
- [The content model](#the-content-model)
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
├── model.md                    The Model
├── vocabulary.html             Vocabulary reference, generated from _data/
├── blocks.html                 Building Blocks index, with type filter
├── missions.html               Mission Blueprints index
├── implementations.html        Implementation Guides index
├── about.md                    About
├── _blocks/                    One file per building block (all types)
├── _missions/                  One file per Mission Blueprint
├── _implementations/           Implementation Guides (empty in v0.1)
├── _data/
│   ├── block_types.yml         Block types and how they're grouped
│   ├── relationship_types.yml  Relationship vocabulary and endpoint rules
│   ├── statuses.yml            planned, draft, published
│   ├── scopes.yml              shared, domain
│   ├── domains.yml             Domains used as metadata
│   └── navigation.yml          Main navigation
├── _layouts/                   default, page, block, mission, implementation
├── _includes/                  Reference links, badges, cards, model diagram
├── assets/                     site.css, site.js, favicon
├── scripts/
│   ├── validate_content.py     Content validator (CI runs it before building)
│   ├── test_validate_content.py
│   ├── check_links.py          Internal link checker for a built site
│   └── new_block.py            Creates a planned block stub
├── templates/                  Copy-and-edit templates for new records
└── .github/workflows/pages.yml
```

Adding content never requires changes to layouts, includes, routing, or configuration.

---

## The content model

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
| `information` | A meaningful enterprise information concept | Information |
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
| `relationships` | no | A list of `{type, target, note}`. Intrinsic relationships only. |

The body is Markdown. The layout already shows the title and summary, so start with `##` headings such as Definition, Responsibilities, Boundaries, and Considerations. A `planned` stub may have an empty body. Draft and published blocks need one.

### Intrinsic and contextual relationships

This distinction is the core of the model:

- **Intrinsic** relationships belong on the block, because they're part of what the block means everywhere. *Case Management `manages` Case.*
- **Contextual** relationships belong on the mission, in that mission's `components`. *In Investigations, Document Management maintains the evidence file.*

Don't add a relationship to a block just because one mission uses the block that way. Put it in that mission's `purpose` instead.

Relationships are written **once, on the source record**. Never add the reverse relationship to the target; the site generates it.

### Specialization

"Define once" means one canonical definition per concept *within a clear scope*. If a domain's meaning genuinely differs, create a separate block that `specializes` the general one. For example, `information.investigative-document` specializes `information.document`.

---

## Add a building block

Either create a planned stub:

```sh
python scripts/new_block.py capability identity-verification "Identity Verification" --domain cross-cutting
```

or copy [`templates/block.md`](templates/block.md) to `_blocks/<type>.<slug>.md`. Then:

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
| `outcomes` | no | A list of short sentences. |
| `lifecycle` | no | A list of `{id, title, summary}` stages. Present them as illustrative. |
| `lifecycle_note` | no | Replaces the default "these stages are illustrative" note. |
| `roles` | no | A list of `{name, description}`. |
| `use_cases` | no | A list of `{title, description}`. |

Each component:

```yaml
components:
  - ref: capability.document-management   # a block ID (required)
    purpose: Maintains investigative documents and attachments.   # required
    stage: investigation                  # optional; a lifecycle stage id
    notes: Optional extra mission-specific detail.
```

The page shows each block's canonical title, type, and summary from the block record, alongside this mission's `purpose`. It groups blocks by type and by lifecycle stage, and notes which other missions also use each block.

List a block once. If it really plays different parts at different stages, list it once per stage, each with a distinct `stage`. The validator rejects other duplicates.

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
     description: The policy sets rules for the capability or process.
   ```

2. Use it in a block's `relationships`.
3. Run `python scripts/validate_content.py`.

Block pages and the vocabulary page pick it up automatically. Add relationship types deliberately: each one should carry a meaning that existing types don't. Avoid generic types such as `related_to`.

`realizes` is reserved for Implementation Guides and can't be used on blocks.

## Other registries

- **Block types:** add an entry under `types` in `_data/block_types.yml`, and add the type to exactly one entry under `groups`. Add colors for `.type-<name>` in `assets/css/site.css` if you want a distinct color; otherwise it falls back to neutral.
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

Implementation Guides describe how a specific technology realizes logical blocks. They're kept separate so the logical model stays vendor-neutral.

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
ERROR    _blocks/capability.case-management.md: relationship #1: (manages -> information.cas) targets ID 'information.cas', which does not exist. Create the block (a 'planned' stub is fine) or fix the ID. Did you mean 'information.case'?

FAILED: checked 12 blocks, 2 missions, 0 implementation guides; 1 error(s), 0 warning(s).
```

CI runs the validator and its tests before building, so invalid content never deploys.

---

## How generated references work

The site derives every reverse view at build time with Liquid. It doesn't store any reciprocal data.

- **Block → block:** a block page scans other blocks' `relationships` for its own ID and groups them by the inverse label ("Managed by", "Constrains", and so on).
- **Block → missions:** a block page scans every mission's `components` for its ID and shows each mission with that mission's purpose and stage.
- **Mission → missions:** each component on a mission page lists the other missions that also use it.
- **Homepage:** blocks used by two or more missions are listed automatically.

This is fine for a library of hundreds of records. If builds become slow at a much larger scale, the next step is a build-time index generated by a script in CI, not hand-maintained links.

---

## Design and accessibility

- One stylesheet with CSS custom properties, a light theme, and a dark theme that follows the reader's system setting.
- Semantic landmarks, a skip link, visible focus states, `aria-current` navigation, and labeled filter controls.
- Every page works without JavaScript. The script only adds the type and text filter on the Building Blocks index and "Copy" buttons for IDs.
- Responsive from phone to wide desktop, with no horizontal page scrolling.
- The conceptual model diagram is HTML and CSS, so it stays crisp and readable by screen readers.

---

## Scope of version 0.1

Deliberately **not** included: an interactive graph explorer, a database or CMS, an ontology or inference engine, advanced search, AI generation, authentication, collaborative authoring, a comprehensive catalog, vendor-specific architectures, or a large design system.

The focus is clear content structure, typed references, validation, and good navigation. The library is meant to grow from any starting point: a mission, a capability, an information concept, a governance concern, or a pattern.

---

## License

Written content, including building blocks, mission blueprints, and documentation, is licensed under [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Code, including scripts, templates, styles, and workflows, is licensed under the [MIT License](LICENSE-MIT.txt). See [LICENSING.md](LICENSING.md) for how the split applies and how to give attribution.
