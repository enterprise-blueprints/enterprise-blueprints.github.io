# Enterprise Blueprints — Greenfield Website Scaffolding Brief

**Version:** 0.1  
**Purpose:** Standalone implementation brief for a coding agent  
**Starting point:** An empty repository. Do not assume any existing code, content, styling, navigation, or site structure.

## 1. Assignment

Build the first working version of **Enterprise Blueprints**, an open-source, vendor-neutral, GitHub Pages knowledge site about designing the AI-native enterprise.

Enterprise Blueprints is **one evolving architectural knowledge model, presented through many connected views**. It is not just a blog or a collection of independent architecture articles.

The site must make it easy to:

1. Explain the overall AI-native enterprise architecture.
2. Define reusable architectural building blocks **once**, each with a stable identity and explicit relationships.
3. Compose these blocks into mission-oriented blueprints, such as Investigations and Grants Management, without copying their definitions.
4. Navigate in both directions: from a mission to its blocks, and from a block to all missions that use it.
5. Add content incrementally from any starting point, including placeholders, without restructuring the codebase.
6. Keep logical architecture separate from vendor-specific implementations.

**Guiding principle:** *Define once. Reference everywhere. Compose as needed.*

The initial result should be a clean, credible, usable site with a very small seed dataset—not a sprawling architecture portal or a feature-heavy graph application.

## 2. Audience, voice, and scope

Primary readers are enterprise architects, solution architects, technical leaders, and public-sector modernization teams. Examples should emphasize public-sector missions, but the underlying concepts should apply more broadly.

Use plain, precise architectural language; explain why a concept matters before elaborating on it. Make definitions vendor-neutral and avoid implying that a single vendor or platform is required.

### Core architectural thesis

As AI makes software creation easier, the enterprise must provide durable shared information, capabilities, governance, and contracts so that new apps, workflows, and agents do not continually reinvent organizational responsibilities.

Tagline: **Build Experiences. Share Capabilities.**

### Enterprise model (initial explanatory view)

The high-level architecture has:

- **Experiences:** Apps, interfaces, AI agents, and user-facing interactions.
- **Enterprise Foundation:** Reusable information and meaning, capabilities and behavior, and governed contracts.
- **Implementations:** The operational systems and technologies that realize logical responsibilities.
- **Trust & Governance:** Cross-cutting requirements that apply throughout.

These are **conceptual responsibilities**, not necessarily distinct products, runtime tiers, or a prescribed call sequence. A system of record can provide capabilities as well as authoritative data. Orchestration may occur within processes, services, or agents. Do not force a separate orchestration or semantic-vs-system-of-record technical layer into this diagram.

## 3. Content architecture

There are four user-facing content families:

| Family | Purpose |
| --- | --- |
| **The Model** | The thesis, overarching architecture, foundational principles, and how the model works. |
| **Building Blocks** | Canonical reusable definitions and relationships. |
| **Mission Blueprints** | Mission-specific compositions of blocks, with outcomes, process context, and application. |
| **Implementation Guides** | Optional technology-specific realizations, kept strictly separate from logical definitions. |

The first three must be visible in v0.1. Prepare a minimal, extensible structure for Implementation Guides but don't invent elaborate vendor-specific material.

A **domain** establishes scope and the meaning of concepts (for example, Investigations). It does not necessarily correspond to one Mission Blueprint; a mission can use building blocks defined across many domains. Initially, domain can be a simple metadata field rather than a separate page type.

An **outcome**, **metric**, **role**, **requirement**, or **use case** may initially be a structured section inside a Mission Blueprint. Do not create first-class content types for all of them yet.

### Building block types

Use one building-block collection with the following typed records:

| `type` | Meaning | Example |
| --- | --- | --- |
| `information` | A meaningful enterprise information concept. | Case, Document |
| `capability` | What an organization can reliably do. | Case Management |
| `process` | How work is coordinated to achieve an outcome. | Investigation Lifecycle |
| `experience` | How people or agents engage with capabilities and processes. | Investigator Workspace |
| `policy` | A rule, obligation, or constraint. | Restricted Case Access |
| `control` | A safeguard or enforcement mechanism satisfying a policy. | Case-Level Authorization Check |
| `pattern` | A reusable design/composition approach. | Human-in-the-Loop Review |

Group `policy` and `control` together under **Governance** in the UI, while preserving their distinct types in data. Patterns guide arrangements; they are not an additional software tier. A capability is not necessarily an API or service.

### What “define once” means

Maintain **one canonical definition per distinct concept within a clear scope**, not one universal definition for every similarly named object. A Case in Investigations may have specialized meaning; do not automatically merge it with every other domain's use of the word “case.” Support explicit specialization when needed.

## 4. Relationships and composition rules

Represent relationships explicitly, as **typed, directional references to stable IDs**. Avoid untyped generic `related_to` links as a substitute for meaningful relationships.

Start with this small registry:

| Relation | Allowed source → target | Meaning |
| --- | --- | --- |
| `manages` | capability → information | Capability manages a logical information concept. |
| `uses` | process → capability | Process employs a capability. |
| `supports` | experience → process | Experience helps participants perform a process. |
| `provides_access_to` | experience → capability | Experience provides interaction with a capability. |
| `constrained_by` | information/capability/process/experience → policy | Applicable requirement or restriction. |
| `enforces` | control → policy | Control helps implement/enforce a policy. |
| `depends_on` | capability → capability | A true logical dependency, not a merely common integration. |
| `references` | information → information | A modeled information association. |
| `part_of` | same type → same type | Hierarchical decomposition where meaningful. |
| `specializes` | same type → same type | Explicit refinement or specialization. |
| `applies_to` | pattern → information/capability/process/experience/control | Applicable reusable guidance. |

Implementations may later use `realizes` to reference logical elements; leave room for it in the registry but do not require implementation examples in v0.1.

**Crucial distinction:**

- **Intrinsic relationships** belong to canonical block records, because they are part of the block's meaning (e.g. Case Management `manages` Case).
- **Contextual relationships** belong to a Mission Blueprint's composition. They state how a block participates in that particular mission (e.g. Document Management used to preserve investigative documentation).

Do **not** add a contextual relationship to a block just because one mission uses it that way. Generate reverse references instead of duplicating relationships in both directions.

Treat the registry as a version-0.1 working vocabulary: easy to extend deliberately, but validated against allowed endpoint types.

## 5. Recommended repository structure

Use **Jekyll, Markdown, YAML front matter, and GitHub Pages**. Keep dependencies minimal. Avoid custom Jekyll plugins, databases, CMSs, web services, or a client-side framework. Use Liquid templates and small amounts of vanilla JavaScript where helpful.

A reasonable starting structure is:

```text
.
├── _config.yml
├── Gemfile
├── index.md
├── model.md
├── about.md
├── _blocks/
├── _missions/
├── _implementations/          # optional / ready for future use
├── _data/
│   ├── block_types.yml
│   └── relationship_types.yml
├── _layouts/
├── _includes/
├── assets/
│   ├── css/
│   └── js/
├── scripts/
│   └── validate_content.py
├── .github/workflows/
│   └── pages.yml
├── requirements-dev.txt       # if YAML parsing requires PyYAML
└── README.md
```

Use one `_blocks` collection rather than a separate collection per block type. New blocks should be content files, not application-code changes. Treat the structure above as a recommendation, not an excuse to invent a large component framework.

### Canonical block metadata example

`_blocks/capability.case-management.md`:

```yaml
---
id: capability.case-management
type: capability
title: Case Management
summary: Manage matters from initiation through resolution and closure.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: information.case
  - type: constrained_by
    target: policy.restricted-case-access
---

# Case Management

A concise definition, responsibilities, boundaries, examples, and considerations.
```

A block's `id` must be globally unique and persistent. IDs need not dictate URLs, but links must resolve through IDs rather than fragile manually copied URLs. Make new blocks easy to create with this same schema. Use an explicit `status` such as `planned`, `draft`, or `published`.

### Mission composition example

`_missions/investigations.md`:

```yaml
---
id: mission.investigations
title: Investigations
summary: Receive, assess, investigate, and resolve allegations.
status: draft
components:
  - ref: capability.case-management
    purpose: Track investigations and their lifecycle.
    stage: case-management
  - ref: capability.document-management
    purpose: Maintain investigative documents and attachments.
    stage: evidence-collection
  - ref: policy.restricted-case-access
    purpose: Restrict sensitive investigative information.
---

# Investigations

Mission outcomes, stakeholders, lifecycle, key use cases, and design notes.
```

`purpose`, `stage`, and any mission-specific notes describe **membership in this composition**. The mission references canonical definitions, not copies of them. A mission can reference blocks from multiple domains.

### Reverse links and validation

On a block page, show both intrinsic links and an automatically generated “Used in Mission Blueprints” section. On a mission page, show each referenced block's canonical title, type, link, and contextual purpose.

These must be derived from the one-way metadata references. For the initial small dataset, use Liquid over collections where practical; a simple build-time derived index is also acceptable if reliably generated in CI. Do not manually maintain reciprocal arrays.

Provide a content validator that fails with clear messages for:

- Missing or duplicate IDs.
- Unknown building block types or relationship types.
- References to nonexistent IDs.
- Relationships with invalid source/target type combinations.
- Missing required fields.
- Duplicate mission component references within the same mission when unintended.

Allow **planned** block stub records with brief metadata; a referenced block must still resolve to a real stub page. Missing references should not silently disappear.

## 6. Site pages and user experience

### Global navigation

- **The Model**
- **Mission Blueprints**
- **Building Blocks**
- **About**

Implementation Guides may be discoverable from relevant pages later without being a main nav item yet.

### Homepage

Communicate the thesis quickly, explain the “Build Experiences. Share Capabilities.” idea, and show a simple conceptual model: Experiences ↔ Enterprise Foundation ↔ Implementations, with Trust & Governance spanning the whole model.

Give readers three clear paths: understand the Model, explore a Mission Blueprint, or browse Building Blocks.

### The Model

Explain the problem, the high-level architecture, the difference between canonical building blocks and mission compositions, and the principle of vendor neutrality. Keep the initial prose concise and clear.

### Building Blocks index and detail pages

- Show a list or grid with name, type, summary, and status.
- Offer simple filter-by-type functionality; search is optional.
- Detail pages show definition, responsibilities, boundaries, outgoing relationships, incoming relationships where useful, and missions using the block.
- Show readable names, not just raw IDs; preserve accessible deep links.

### Mission Blueprints index and detail pages

- Show title, outcome-oriented summary, and status.
- Mission detail includes purpose/outcomes, illustrative lifecycle, key roles/use cases, and a structured list of supporting blocks grouped by type or mission stage.
- Include the mission-specific role/purpose alongside each referenced block.

### About

Explain that this is an evolving, open-source, vendor-neutral reference library, initially oriented toward public-sector enterprise and solution architecture.

### Design requirements

Create a restrained, modern knowledge-site visual language: readable typography, clear hierarchy, ample whitespace, responsive layouts, sensible light/dark behavior or a consistent accessible theme. Prefer crisp text and CSS-based diagrams over decorative imagery. Support keyboard navigation, visible focus states, semantic landmarks, and sufficient color contrast. The site should feel complete even with little content. Don't build an elaborate brand system.

All internal URLs and assets must work both on a GitHub Pages project site (`/repo-name/`) and a root user/organization site. Use Jekyll's URL helpers consistently.

## 7. Seed a deliberately small, connected dataset

Write enough substantive sample content that navigation demonstrates the actual architecture, but do not generate a massive catalog.

**Minimum blocks:**

1. `information.case` — Case
2. `information.document` — Document
3. `capability.case-management` — Case Management
4. `capability.document-management` — Document Management
5. `process.investigation-lifecycle` — Investigation Lifecycle
6. `experience.investigator-workspace` — Investigator Workspace
7. `policy.restricted-case-access` — Restricted Case Access
8. `control.case-authorization-check` — Case Authorization Check
9. `pattern.human-in-the-loop-review` — Human-in-the-Loop Review

**Mission Blueprints:**

- **Investigations:** A meaningful initial example with mission outcome, a small lifecycle (Intake, Triage, Investigation, Findings, Closure), and contextual references to the blocks above.
- **Grants Management:** A lightweight second example, included to demonstrate that at least one canonical block (e.g. Document Management) can be reused without being redefined. Keep this intentionally skeletal, not an invented comprehensive grants architecture.

Seed data should exercise multiple relationship types, both canonical and contextual relationships, and reverse “used by” navigation. Do not invent complex regulatory mandates or falsely present illustrative process stages as universal.

## 8. GitHub Pages and developer workflow

Assume a **brand-new, empty GitHub repository**. Include everything needed to build the site and deploy through GitHub Actions to GitHub Pages, along with clear local-development instructions.

- Use standard Jekyll and GitHub Pages-compatible conventions.
- Avoid reliance on unsupported custom Jekyll plugins.
- Include a CI sequence that validates content **before** building and deploying.
- Ensure page routes and static assets work when `baseurl` is set.
- Document how to configure Pages in the repository, run locally, add a new block, add a new mission, and define a new relationship type.
- Add a simple script or command contributors can run to validate content locally.

Do not claim deployment occurred unless you actually have permission and successfully deployed it. Provide the site as a working repository and explain the steps to publish.

## 9. Acceptance criteria

The scaffold is complete when:

1. An empty repository can build a useful, responsive site locally and in GitHub Actions.
2. The Model, Mission Blueprints, Building Blocks, and About pages are navigable.
3. Each building block has one canonical page with a stable ID and typed outgoing relationships.
4. Investigations and Grants Management both reference the **same** Document Management record.
5. Clicking a mission component opens that canonical record.
6. That record automatically displays both missions as users, without hand-maintained reciprocal data.
7. Malformed relationships and missing IDs fail validation with clear errors.
8. Adding a block or mission requires authoring content, not editing routing or template source.
9. The site separates logical architecture from any eventual platform-specific implementation.
10. The README allows a new contributor to build, validate, and extend the library without prior context.

## 10. Deliberately out of scope

Do **not** build: an interactive graph explorer; a database; a CMS; an ontology engine; semantic inference; advanced search; AI generation; authentication; collaborative authoring; a comprehensive enterprise catalog; vendor-specific solution architectures; an integration with Solution Studio; or a large design system.

Favor clear content structure, typed references, validation, and excellent navigation over feature volume.

## 11. Working approach for the coding agent

Implement, rather than merely describing an implementation plan. Make sensible decisions independently when minor details are unspecified.

Recommended order:

1. Repository/Jekyll skeleton and GitHub Actions workflow.
2. Collections, metadata conventions, registries, and validator.
3. Layouts and generated forward/reverse relationship links.
4. Seed content and mission compositions.
5. Refined homepage, indexes, navigation, responsive styling, and README.
6. Test local build, validation, ID lookup, reverse links, and project-site URL behavior; fix issues found.

Before finishing, report what was built, which acceptance criteria were verified, known limitations, and the next *small* content expansion worth undertaking.

**The main architectural goal:** Future contributors should be able to build the enterprise model progressively from almost anywhere—starting with a mission, capability, information concept, governance concern, or pattern—while adding to a single coherent, reusable knowledge model.
