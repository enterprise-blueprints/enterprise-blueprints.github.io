# Enterprise Blueprints — Federal OIG Release 1 Handoff (v0.3)

**ACTIVE, SINGLE RELEASE:** Build an independent, vendor-neutral **Federal Office of Inspector General (OIG)** mission reference site. The site is for a *type of public organization*, not a named office or a particular client.

**Start here:** `AGENTS.md` → `docs/01-release-1-scope.md` → `reference/CODING_AGENT_PROMPT.md`.

## What is inside

- `examples/federal-oig/blueprint.json`: **only active R1 content** — 1 generic federal OIG mission, 5 conceptual capabilities, 1 implementation pattern, 7 relationships.
- `schemas/blueprint-package.schema.json`: canonical v0.1 contract, unchanged so future Studio integration can consume it.
- `examples/catalog.json`: example generated catalog with SHA-256 of the active Blueprint fixture.
- `tools/`: package schema/semantic validation, negative tests, catalog generation.
- `docs/01-release-1-scope.md`: binding MVP scope and definition of done.
- `docs/02-release-roadmap.md`: preview only; no future features should be implemented.
- `docs/03-future-platform-notes.md`: architectural intent for the future products, not active scope.
- `reference/CODING_AGENT_PROMPT.md`: ready-to-copy prompt.

## Test the handoff contract (Python)

```bash
python -m pip install -r requirements-dev.txt
python tools/test_all_contracts.py
```

The **apps have not been scaffolded**. The coding agent should create the Astro site, workspace shell, CI and GitHub Pages workflow. Existing files are contracts, test seeds and instructions—not an implemented website.

## R1 scope boundary

Build a static website with mission overview, index, five capability detail pages, one illustrative vendor-neutral pattern page, human-readable source links, and publishable JSON/catalog/schema/digest. **Do not build Solution Studio**, the optional AI layer, assessments, agent workflow orchestration, vendor comparison, accounts, backend/database, forms, or a whistleblower/report intake system.

Do **not** add a spotlight, customer-specific section, case study, or product recommendation for any identified organization. Cite general federal OIG law and oversight guidance; jurisdictional differences must remain explicit.

## Publication safety

Clearly label content **Independent / unofficial reference** and **Not a reporting channel**. Include a prominent link to the official reporting route at https://www.oversight.gov/where-report-fraud-waste-abuse-or-retaliation . Never solicit or collect case details, allegations or personal information. Verify references editorially before publishing. `UNLICENSED-DEMO` is a placeholder: choose and document a reviewed public license before launch.


## Long-term platform direction

`PLATFORM_VISION.md` explains the shared vision across Enterprise Blueprints, Solution Studio, and educational content. It is informative **only** and cannot expand the current Release 1 scope.
