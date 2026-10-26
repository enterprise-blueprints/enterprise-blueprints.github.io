# RELEASE 1 — Federal Office of Inspector General Mission Blueprint (v0.3)

**Binding implementation scope.** Replaces the prior named-office and cross-agency-accountability Release 1 concepts. **All references to specific agency implementations, spotlights, customers, cases, or vendors are removed from the R1 package.**

## Product objective

Publish an accessible, responsive and informative **Enterprise Blueprints** static website explaining the mission and selected capabilities of the generic **U.S. federal Office of Inspector General (OIG)** organizational function.

The mission is independent oversight of government programs and operations—preventing and detecting fraud, waste and abuse; promoting economy, efficiency and effectiveness; conducting independent audits/investigations/reviews; and reporting findings and recommendations. Source: 5 U.S.C. § 404 and CIGIE/Oversight.gov general resources.

**This is an independent, unofficial conceptual reference.** It is not an official OIG taxonomy, legal advice, a depiction of any specific federal office, a representation of installed software, or a public intake service. OIG powers vary by statute, type of office and subject matter.

## Canonical content: one mission, five capabilities, one illustrative pattern

- Mission `eb:mission:independent-government-oversight`: **Independent Oversight of Government Programs and Operations**
- Capability `eb:capability:complaint-allegation-disclosure-intake`: **Complaint, Allegation & Disclosure Intake**
- Capability `eb:capability:audit-inspection-evaluation`: **Audit, Inspection & Evaluation**
- Capability `eb:capability:investigation-management`: **Investigation Management**
- Capability `eb:capability:recommendations-corrective-action-monitoring`: **Recommendations & Corrective Action Monitoring**
- Capability `eb:capability:oversight-reporting-communication`: **Oversight Reporting & Communication**
- Pattern `eb:implementationPattern:oversight-intake-case-tracking`: **Oversight Intake & Case Tracking (Illustrative)**

Relationships: five `supports_mission` edges; two `candidate_pattern` edges from intake and investigation management to the pattern. All references are vendor-neutral, not assertions of actual deployments.

**Whistleblower coordination** is a cross-cutting topic for the intake and communications capabilities, not a standalone element in R1. Do not imply OIGs adjudicate all whistleblower retaliation claims or guarantee confidentiality for every report; refer users to the actual authorized reporting routes.

## Build only

1. Static Astro website: homepage, generic mission overview, five-capability listing, five capability detail pages, one pattern page, source list, simple navigation, responsive and accessible layout. All from validated data, no hardcoded duplicated content.
2. Shared JSON Schema validation and typed content loading, source and edge integrity checks, `catalog.json` and versioned `blueprint.json`, SHA-256 digest, and schema export in static build output.
3. Basic pnpm workspace scaffold, build scripts and CI. GitHub Actions Pages deployment configuration, with site-root and repository subpath support. Do not claim success until an actual deploy occurs.
4. Visible independent/unofficial and **not-a-reporting-channel** notice. Links to official OIG reporting guidance, no intake forms, identity collection or complaint submission features.
5. Concise developer docs: install, dev, check, build, Pages setup, how to edit JSON content and add a second mission later (documentation only).

## Explicitly out of scope

- Named-agency showcases, spotlights, organizational profiles, actual agency practices or product claims.
- Solution Studio application, data persistence, auth, role permissions, AI agents, assessments, workflow/planning engine, graph canvas, vendor catalog/comparisons, SOW generation, community contributions, content management UI, sophisticated search.
- Endpoints that receive information from visitors; API backend; any case, allegation or whistleblower reporting function.

## Reference and editorial safeguards

Official general federal references in the package:
- Inspector General Act: https://uscode.house.gov/us/usc/119-121/t5/s404/
- Federal IGs mission: https://www.oversight.gov/about/inspectors-general/mission
- CIGIE FAQ: https://www.ignet.gov/node/54
- Official reporting routes: https://www.oversight.gov/where-report-fraud-waste-abuse-or-retaliation

Site must state that capabilities are *editorial architecture abstractions*, not an authoritative prescribed or complete capability map. Provide last-reviewed metadata. The domain is **U.S. federal OIGs** in this first package, not all non-federal inspector general organizations globally.

Keep `license: UNLICENSED-DEMO` for tests until a reviewed public license is chosen; surface the licensing decision as a publication blocker, not as an excuse to implement a license selection UI.

## Definition of done

- [ ] Exactly 1 conceptual OIG mission, 5 capabilities, 1 vendor-neutral pattern in a valid package, all shown on site.
- [ ] No named-agency profiles, example customers, specific vendors, or assumed deployed systems in active content.
- [ ] Internal navigation works across homepage, mission, capabilities, pattern and sources.
- [ ] Public JSON package, catalog, schema, SHA-256 digest are generated and match published content.
- [ ] Schema/reference validation passes; intentionally broken identifiers and dangling references fail tests.
- [ ] Root deployment and GitHub Pages repository-subpath static builds succeed in CI.
- [ ] Site is readable on mobile, keyboard accessible and sufficiently polished for public reference use.
- [ ] Unofficial/not-a-reporting-channel notices and official reporting links are visible; no sensitive input forms.
- [ ] Source accuracy, publication license and deployment steps documented, actual build/test results reported.
- [ ] STOP. Everything described for R2+ is deferred.
