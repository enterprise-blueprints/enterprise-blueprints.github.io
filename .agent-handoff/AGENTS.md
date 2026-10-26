# AGENTS.md — binding Release 1 instructions (v0.3)

You are scaffolding **Enterprise Blueprints**, a static GitHub Pages website for a generic **U.S. federal Office of Inspector General (OIG)** mission blueprint. This is the ONLY active release task.

1. Read `docs/01-release-1-scope.md` in full before coding. It overrides all future-platform design notes.
2. Use **only** `examples/federal-oig/blueprint.json` as the active package content. Generate human-readable pages and machine-readable exports from this same validated file.
3. Build Astro + TypeScript via a minimal pnpm workspace (`apps/blueprints`, `packages/contracts`, `packages/blueprint-content` as needed). No database, Studio application, AI workflows, authentication, forms, search engine, graph editor, or commercial functionality.
4. Keep all content reusable, conceptual and vendor-neutral. Do not create a profile, fictional scenario, customer use case, or current-state implementation for a particular agency. Refer to the OIG *organizational category*, not a named OIG.
5. Publish 1 mission page, an index, 5 capability detail pages, and 1 vendor-neutral pattern page; all linked with references and sources.
6. Serve or output the package JSON, catalog.json, canonical JSON Schema, and SHA-256 digest. Validate uniqueness, element/relationship/source references, schema conformance, and generated links.
7. Support site-root and GitHub Pages project-subpath deployment, verify `pnpm build` and R1 tests, and document how to deploy; do not assert production deployment without actual verification.
8. Show visible disclaimers: independent/unofficial, conceptual, not legal guidance, and not a reporting channel. Direct anyone wishing to report an allegation to official channels; NEVER accept or request reports or identities.
9. Choose the simplest reliable approach, document relevant decisions, and stop when the Release 1 Definition of Done is met. The roadmap is not implementation scope.


## Long-term context (nonbinding)

Read `PLATFORM_VISION.md` for the complete ecosystem vision and terms. It is NOT implementation scope. Binding Release 1 scope and stop criteria above always take precedence.
