# Authoring guide

Enterprise Blueprints is currently in solo incubation. This guide describes the maintainer's authoring workflow; it does not establish a public contribution process.

[Charter v0.5](charter/project-charter-v0.5.md) governs the work. [Decision 0001](decisions/0001-add-use-cases-and-rename-objects-to-entities.md) records the content-model changes, and [Decision 0002](decisions/0002-build-experiences-share-capabilities.md) records the signature principle. Develop architecture through real domains and implementation feedback rather than filling every category in advance.

## Start an artifact

Copy the appropriate [template](templates/README.md) into its content directory. Use a lowercase kebab-case filename, such as `case.md` or `delegated-agent-authorization.md`. Replace the template metadata and prompts, and remove instructional comments before publication.

Each authored architecture artifact starts with YAML front matter:

```yaml
---
id: "entity:case"
title: "Case"
type: "entity"
status: "draft"
summary: "A durable record of work toward a defined outcome."
related: []
---
```

This is a metadata illustration, not an established definition of Case.

| Field | Convention |
| --- | --- |
| `id` | Unique, stable `type:slug` identifier; slug uses lowercase kebab-case |
| `title` | Human-readable title, matching the page heading |
| `type` | One of the artifact types in the template catalog |
| `status` | `draft`, `review`, `published`, or `superseded` |
| `summary` | One short sentence explaining the artifact |
| `related` | Optional YAML list of related artifact IDs; omit it or use `[]` when none exist |

Quote string values. Keep IDs stable when titles or paths change. Related IDs identify existing artifacts; use relative Markdown links in the body so readers can navigate to them. Metadata alone does not create a link.

Front matter applies to authored architecture artifacts. README/index pages, repository guides, license texts, and the preserved founding charter do not require it. Templates contain placeholder metadata and are not catalog artifacts. Machine-readable schemas and automated metadata tooling are deferred.

## Draft, review, publish

1. **Draft:** Start at `draft`. Explain purpose, boundaries, assumptions, and unresolved questions. Keep unresolved work visibly draft.
2. **Check relationships and boundaries:** Resolve links and related IDs, reuse existing concepts, and distinguish vendor-neutral requirements from product-specific mappings. Check policy, authority, durable state, and human decision boundaries where relevant.
3. **Review:** Set `review` when ready for a deliberate self-review. Check terminology, readability, evidence, consistency with the charter, and architectural tradeoffs. Return to `draft` if substantial work remains.
4. **Publish:** Set `published` only after review and add the artifact to its category index. This marks content maturity; it does not deploy a website.
5. **Revise or supersede:** Substantial revisions return to `draft` and pass through review again. For a replacement, retain the old artifact with `superseded` status and link to the replacement; keep its ID and inbound links usable.

Architecture decisions use sequential, four-digit filenames, starting with `0001-short-decision-title.md`, and IDs such as `architecture-decision:0001-short-decision-title`. Do not reuse numbers. Preserve the rationale of published decisions; document a changed direction in a new decision and link both records.

## Content boundaries

- Use cases introduce business context through overview, personas, and process. Link to supporting blueprints when available; keep the introduction understandable without architecture or product knowledge.
- Foundations, reference architecture, entities, capabilities, patterns, policies, and blueprints describe logical architecture independently of vendors.
- Implementations identify and link the logical architecture they realize, then describe technology mappings, gaps, and tradeoffs. Product terminology belongs here.
- Labs identify the architecture and implementation they exercise. A lab template is available, but the labs directory and runnable exercises are deferred.
- Policy artifacts explain architectural implications and assumptions; they do not claim to provide legal advice.
- Templates are prompts, not a requirement to invent detail. Use a brief “Not applicable” with a reason where needed; record unknowns as open questions.
- Store diagrams in `assets/diagrams/` and link them from the relevant artifact. Provide a textual explanation and identify trust and policy concerns across the architecture.
- Update category indexes when adding readable drafts or published artifacts, labeling their status. Update the repository map when adding directories or files.
- Follow the [licensing statement](LICENSING.md) when adding documentation, code, diagrams, or machine-readable artifacts.

## Before publication

Use simple sentences and active voice. Describe the work directly and avoid unnecessary jargon. For core case management, include internal and external sources; put specialized process rules in the relevant case type.

Check required metadata, unique IDs, valid statuses, resolvable related IDs, relative links, and image paths. Remove template prompts. Confirm that the title matches the heading and that implementation guidance identifies its logical source. Review diagrams alongside their text and record important tradeoffs as architecture decisions.

External contribution governance, website publishing procedures, and automation will be defined as the initiative matures.
