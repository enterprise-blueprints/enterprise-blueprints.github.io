Implement **Release 1 of Enterprise Blueprints** using this attached v0.3 coding-agent handoff. This replaces any previous OAWP/VA, other named-agency, or broader platform Release 1 instructions.

First read `AGENTS.md`, `README.md`, and `docs/01-release-1-scope.md`, then inspect `examples/federal-oig/blueprint.json`, `schemas/blueprint-package.schema.json`, and the validation scripts.

**Build only the Enterprise Blueprints static site** using Astro, TypeScript, pnpm workspaces and GitHub Pages deployment configuration. The active knowledge package describes a **generic U.S. federal Office of Inspector General (OIG)** mission, five reusable capability definitions, and one illustrative vendor-neutral implementation pattern.

Generate the site's mission page, capability directory and detail pages, pattern page, source links and machine-readable package/catalog/schema/digest from the validated JSON. Make the site responsive, keyboard-accessible and visually professional. Validate schemas, unique IDs, internal relationships and generated links; run production builds for root and GitHub Pages repository-base paths; report actual test/build results and configuration still needed.

**Do not** add agency-specific examples, case studies, customer details, named product/vendor implementations, any submissions or contact forms, a database, authentication, AI, assessments, workflow features, Solution Studio, or other future features. The original domain is generic OIG oversight; whistleblower coordination remains a supporting consideration, not the whole mission.

Site must conspicuously say 'Independent, unofficial reference' and 'Not a reporting channel', link to the official reporting locator, and avoid promising statutory powers, confidentiality or legal protection that may not apply universally. Source legal/factual statements; mark the capabilities as authorial architecture abstractions, not an official taxonomy. Flag the final public-content license decision.

Use reasonable documented decisions to resolve small ambiguities; do not expand scope for speculative future flexibility. Implement the complete R1 vertical slice, then stop. Provide instructions to run locally and deploy, a summary of generated files, test results, any source/licensing review needs, and brief R2 ideas **without implementing R2**.
