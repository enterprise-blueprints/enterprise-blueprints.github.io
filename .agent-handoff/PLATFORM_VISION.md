# Solution Studio + Enterprise Blueprints — Shared Platform Vision

**Status:** Strategic product context only · **Version:** 1.0 · **Audience:** Product owners, architects, coding agents, editors

> **IMPORTANT — NOT A BUILD INSTRUCTION.** This document explains the long-term product vision so early architectural choices do not foreclose it. It **does not authorize implementation** of anything outside the currently approved release. Within each handoff, `AGENTS.md` and `docs/01-release-1-scope.md` override this vision when there is a conflict. Do not scaffold speculative infrastructure, integrations, or features just because they are described below.

## 1. North star

Build an open reference knowledge ecosystem and a complementary private solution-design workbench. People should be able to **learn about an organizational mission, explore reusable capabilities and implementation approaches, then progressively model a real-world solution**—without re-entering information, inventing certainty, or following a mandatory sequence.

**Enterprise Blueprints**: a public, independent, human- and machine-readable library of enterprise and public-sector architecture knowledge. Starting domain: the **generic U.S. federal Office of Inspector General (OIG)** mission, not a named OIG or agency-specific implementation.

**Solution Studio**: a private, goal-aware architecture workspace for people designing solutions. The architect may begin with rough notes, detailed requirements, a proposed vendor implementation, a reference Blueprint, an assessment, or an existing architecture, then continuously refine the same connected model.

**Educational content / channel**: videos, tutorials, diagrams, transcripts and other explainers that link back to Blueprint items. The educational content is useful independently; publishing it is not a prerequisite for R1 of either application.

**Unifying principle:** One reusable architectural vocabulary, many ways to explore and apply it. Public reference knowledge is *not* a statement of truth about any private engagement.

## 2. Product responsibilities and boundaries

| Surface | Core responsibility | Does not own |
| --- | --- | --- |
| Enterprise Blueprints website | Publish sourced, vendor-neutral reference missions, outcomes, capabilities, processes, implementation patterns, and related content; provide navigable pages and validated downloadable structured packages. | Confidential models, actual customer facts, allegations, reporting intake, or assessments of real agencies without authoritative evidence. |
| Solution Studio app | Capture sources and knowledge, create/refine typed elements, link them, review proposals, manage goals, assess needs, evaluate alternatives, and generate reviewed deliverables. | Publishing customer information to the public Knowledge Hub by default. |
| Educational media | Explain reference missions, capability concepts, patterns, and carefully scoped vendor implementation demonstrations. Link content to reference item IDs, sources, and review dates. | Automatically changing architecture facts or claiming a product meets requirements without evidence. |
| Shared contracts | Stable IDs, types, typed relationships, provenance metadata, packages, validation and compatibility. | A requirement that both products share a database or deploy together. |

## 3. Progressive modeling philosophy — the product-defining feature

- **Start anywhere**: create notes, requirements, capabilities, implementations, goals, sources or links in any order. No mandatory onboarding wizard, prescribed maturity level, or completeness gate to capture an item.
- **Allow incomplete information**: unknowns, ambiguities, partially specified elements and disconnected items are legitimate states, not errors.
- **Preserve what was said**: raw source text or uploaded documents remain distinguishable from interpreted or normalized architecture claims.
- **Reconcile, do not blindly import**: new information may create, link, refine, restructure, or dispute existing model items; proposed merges should be reviewable.
- **Do not manufacture certainty**: system/AI suggestions are proposals; reference requirements are not automatically customer requirements; candidate patterns are not selected or verified solutions.
- **One connected model, many views**: lists, graphs, notes, capability maps, requirements trees, assessments, guided workflows, alternatives, and deliverables are perspectives on compatible underlying records.
- **Usefulness at every stage**: an early model can drive discovery questions; a mature, reviewed model can support architecture decisions and deliverables.

Example evolution: a vague note suggests candidate requirements; a later assessment identifies a process gap; a reference Blueprint supplies candidate capabilities; an implementation comparison creates Scenario A/B; a changed goal shifts guidance from assessment toward proposal preparation; the architect remains free to work in another order.

## 4. Shared architectural taxonomy — extensible, not an exhaustive enum

Core **architectural element** kinds include: **Mission**, **Outcome**, **Requirement**, **Capability**, **Process**, **Process Step**, **Implementation Pattern**, **Vendor Offering**, **Implementation**, **System**, **Actor**, **Metric**, **Policy** and **Data Entity**. Other kinds can be added via an extensible type registry.

- **Mission:** enduring public purpose or organizational responsibility. Public reference concept; **not** the same as an engagement goal.
- **Outcome:** desired result or public value; can have target metrics.
- **Requirement:** a desired condition, behavior, constraint or acceptance criterion — what must be true.
- **Capability:** an ability an organization, system or solution needs or possesses — what must be possible.
- **Implementation:** a concrete or proposed mechanism for realizing one or more capabilities (e.g., process, configured system, service, team and their connections).
- **Implementation Pattern:** a reusable, often vendor-neutral approach that *might* realize a capability. It is not an actual deployment.
- **Vendor Offering:** a specific product/service that *may* be a candidate within an implementation. Suitability must be assessed per requirements, version and environment.
- **Process / Process Step:** behavioral detail; use types and relationships that can eventually represent sequencing, triggers, roles, inputs and outcomes.
- **Metric / Policy / Actor / Data Entity:** supporting semantic types; avoid turning every fact into a Requirement or Capability.

Three common user-facing lenses remain **Requirements (what must be true)**, **Capabilities (what must be possible)**, and **Implementations (how an ability is realized)**. They are *not* a hard ceiling on the number of element types.

**Classification** (e.g., domain, function, jurisdiction) is distinct from **element type**, and both are distinct from **context/status** (e.g., proposed in Scenario B, existing in baseline). A capability can support multiple missions. No universal fixed-depth hierarchy or mandatory parent is required.

Relationship vocabulary may include `supports_mission`, `contributes_to`, `decomposes_into`, `satisfies`, `realized_by`, `implemented_using`, `candidate_pattern`, `depends_on`, `constrains`, `measured_by`, `performs`, `precedes`, and `related_to`. Typed predicate rules help validation but can expand over time. `satisfies` alone does not prove compliance or fit.

## 5. Knowledge, evidence, and context (target model)

Over time, the logical metamodel should support several separable layers:

1. **Source / Evidence** — the original note, document, interview passage, assessment answer, official reference, or published package. Preserve provenance and review dates.
2. **Statement / Assertion** — a claim about an element, relationship or value. Claims may be `proposed`, `accepted`, `disputed`, `rejected` or `superseded`, and may be valid only in a specific context/time period. An assertion is not equivalent to a proven fact.
3. **Element / ElementType** — stable identity, semantics, display metadata and contextual properties. Relationships can be represented through assertions rather than a second competing truth store.
4. **Open Question / Model Proposal** — missing facts or candidate changes with review/reconciliation status.
5. **Context / Scenario** — baseline, target, competing solution options and approved versions, referring to shared requirements/capabilities while selectively varying implementations, evaluations or assumptions.
6. **Assessment / Decision / Snapshot** — contextual findings, consciously selected options, approvals, and immutable historical baselines.
7. **Engagement Goal / Workflow / Deliverable** — work objectives, optional activities and generated artifacts. None should own or erase the architecture model.

**R1 deliberately implements only a very small subset** of these concepts in each product. The terms above are logical expansion points, not instructions to add database tables now.

## 6. Enterprise Blueprints knowledge and publication protocol

Structured reference content is the source of truth; human-readable pages and machine-readable packages are generated from it. Packages should support stable IDs, version/schemaVersion, relationships, source citations, applicability/jurisdiction metadata, and a manifest/catalog. Integrity checks reject duplicate IDs, unknown relationship targets, invalid references and invalid schema shape. Pin immutable package versions/digests where needed for reproducibility.

Information should be organized primarily around public-sector missions and capabilities, but permit navigation via domain/jurisdiction facets, outcomes, reference requirements, processes, patterns, source materials and eventually vendor offerings and educational assets.

The first package is **generic U.S. federal Office of Inspector General — Independent Oversight of Government Programs and Operations**, with five reference capabilities and a vendor-neutral intake/case-tracking pattern. It is an **independent, unofficial educational model**: not a government-sponsored taxonomy, legal advice, agency profile, vendor recommendation, or reporting channel. OIG authorities vary. Do not collect allegations, whistleblower identities or sensitive case details; link to authorized official reporting routes.

Later versions can add additional missions, cross-mission reusable capabilities, more detailed pattern and vendor content, assessments and playbooks. Adding such material should not require rewriting the entire website.

## 7. Studio knowledge capture and Blueprint integration

Studio should eventually support at least six entry points: **notes-first, requirements-first, Blueprint-first, assessment-first, implementation-first, and blank/direct modeling**. The architect may switch approaches during an engagement.

Future Blueprint import flow: discover package → preview individual elements and relationships → compare against the private model → propose creates/links/refinements → architect accepts selected changes → retain immutable package/version/source reference → flag future source changes without silently overwriting local edits. A reference claim never becomes an accepted private fact merely because it was imported.

The Studio model should remain usable if Enterprise Blueprints is offline or if the catalog evolves. Do not bind local element identity to a mutable public URL or title.

## 8. Goals and optional intelligent guidance

An **Engagement Goal** is a changeable high-level objective, such as “understand a mission,” “assess current capabilities,” “evaluate implementation patterns,” or “prepare a proposal.” An engagement may have multiple historical or concurrent goals; changing the active goal must not delete or silently reclassify existing information.

Long-term **Guidance Engine**:
- prebuilt playbooks and reusable activities;
- model-aware “what should I do next?” recommendations;
- AI-proposed workflows assembled from available activities, knowledge and constraints;
- objective-specific readiness checks (e.g., ready for a discovery discussion but not yet a fixed-price SOW);
- optional skipping, reordering, revisiting and abandoning of steps;
- clear human review before consequential model changes.

Guidance is never a mandatory pipeline. A workflow tracks an approach to work; the model owns architecture truth. Early releases should begin with a simple manual checklist or deterministic rules before any agent orchestration.

## 9. Solution options, fit/gap, and deliverables

A requirement may be satisfied by capabilities which are realized through one or multiple concrete implementations. A capability may be shared across multiple solution options while their implementations differ. Assessments must be contextual and distinguish **capability gaps** from **implementation gaps**. Measured evidence, not link counts or fabricated percentages, should underpin fit scores.

Later, architects can compare baseline, Scenario A and Scenario B; swap candidate vendor implementations; inspect resulting dependencies, constraints, gaps and tradeoffs; and record explicit decisions and assumptions.

Reports, architecture diagrams, solution summaries, proposals, roadmaps and **statements of work** should be generated as traceable projections of reviewed model content and explicit delivery scope. A draft may reference a known model revision; an approved document must reference a fixed, reproducible snapshot. Work packages, estimates and commercial approvals are supporting planning records, not necessarily architectural elements.

## 10. Educational content as linked assets

Enterprise Blueprints and a companion video channel can share concepts and identifiers. A future **Content Asset** record may represent a YouTube video, transcript, article, slide deck, demo, diagram or tutorial, linked by predicates like `explains`, `demonstrates`, `compares`, `references` to missions, capabilities, patterns or offerings.

Suggested series: **Mission Blueprints**, **Capability Deep Dives**, **Implementation Patterns**, and **Vendor Implementation Deep Dives**. Vendor-specific videos should explain product version/edition, evidence, supported capabilities, configuration/integration dependencies and limitations; do not mistake vendor marketing for independent verification.

Publishing educational assets is a content/editorial activity, not a reason to build a video production system into the first release.

## 11. Platform and privacy boundaries

Preferred long-term shape: a TypeScript monorepo with an Astro/GitHub Pages static public site, a separately deployed/private Next.js Studio application, shared TypeScript/schema contracts, and a transactional database for Studio. The initial Studio R1 is *local-only* (SQLite) and must not be deployed as a public unauthenticated write API. Future authentication, tenant separation, backups, auditability, privacy/AI data-processing controls and content rights are production deployment gates.

Never send private Studio data back to public Enterprise Blueprints automatically. No government whistleblower disclosure intake, case data collection, or suggestion that the website is an official OIG reporting channel. Cite authoritative references and distinguish editorial architectural abstractions from legal mandates.

## 12. Incremental delivery north star and sequencing

**Enterprise Blueprints R1 — active:** publish one generic federal OIG mission, five conceptual capabilities, one vendor-neutral pattern, official reference links and validated JSON on an accessible static website.

**Solution Studio S1 — active when separately approved:** create a local modeling workspace; set/change goals, capture verbatim notes, create typed elements and relationships in any order, link notes, persist and export compatible JSON. No Blueprint browsing/import yet.

Potential later increments, individually approved:

| Increment | Example standalone value |
| --- | --- |
| Blueprints R2 | One capability deep dive plus a related educational video metadata link. |
| Studio S2 | Read-only browsing of published Blueprint packages. |
| Studio S3 | Selective, provenance-preserving reference import with review. |
| Studio S4 | One optional guided assessment/playbook and simple next actions. |
| Studio S5 | Basic alternative scenarios and manual implementation substitution. |
| Studio S6 | Traceable, editable architecture summary. |
| Later | Evidence-rich reconciliation, more missions, vendor catalogs/evaluation, intelligent guidance, SOW and delivery planning, secure multi-user hosting. |

The two products have **independent release numbers**; their schedules should not be assumed to coincide. A release should deliver one testable user outcome, not generalized infrastructure built in anticipation of a distant future.

## 13. Invariants to protect in every release

1. Adding a rough note is useful without requiring classification.
2. Requirements, capabilities and implementations may be created in any order, disconnected and incomplete.
3. Raw sources cannot be silently rewritten into “confirmed” facts.
4. A changed goal does not destroy or reclassify model knowledge.
5. Imported public reference content stays distinguishable from privately validated claims.
6. Solution alternatives do not demand wholesale duplication of shared model elements.
7. AI/model-derived changes should remain proposals until explicitly reviewed, within configured authorization rules.
8. Approved decisions and deliverables remain reproducible from immutable revisions/snapshots.
9. Public content stays public; private workspace data stays private unless consciously published through a separate review process.
10. **Scope control:** the active release spec always wins over this document. No speculative features, no premature abstraction, and no claim of completion without real tests.

---

### For coding agents

1. First read `AGENTS.md` and the binding Release 1 scope.
2. Read this document **to understand direction, vocabulary, and long-term compatibility**.
3. Implement **only** the current release. Favor stable IDs, testable contracts and simple seams for later extension, but **do not create unused services, schemas, packages, UI, databases or endpoints**.
4. Document ambiguities as future design decisions instead of solving distant problems prematurely.
5. Stop when the approved Release 1 acceptance criteria pass.
