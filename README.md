# Enterprise Blueprints

An independent, open reference library of public-sector missions, the capabilities they depend on, and
example patterns that might realize them. A mission seeks outcomes, each with measures for telling
how it's going, and capabilities contribute to those outcomes. Four mission packages describe U.S. federal
Offices of Inspector General, federal agencies' Freedom of Information Act programs, federal grants
management, and federal acquisition in general terms. Each builds on Common Capabilities, a package of the
capabilities many missions rely on, such as identity and access, data protection, records, logging, and case
management. Example Solutions combines patterns across the missions.

## Develop

Requires Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm content:build  # build content/ from source/, giving changed packages their next version
pnpm content:check  # fail if content/ is behind source/
pnpm check          # type-check
pnpm test           # validator and source tests
pnpm build          # validate every package and build the static site into dist/
pnpm check:dist     # check every internal link and the published data in dist/
pnpm verify         # content:check, check, test, build, and check:dist, in order
```

To check a build under a project-site path, as CI does:

```bash
BASE_PATH=/baseurl-check OUT_DIR=dist-subpath pnpm build
node scripts/check-dist.mjs dist-subpath /baseurl-check
```

## How it's organized

- `source/<package>/` is what people edit: YAML files that describe one package. `pnpm content:build`
  turns them into the published files below.
- `content/<package>/<version>/blueprint.json` holds each package version as published: its sources,
  elements, relations, and discovery questions. The pages show the latest version of each package; every
  version stays published. These files are built, not edited by hand.
- `schemas/blueprint-package-<version>.schema.json` holds each version of the package format. 0.2.0 adds
  `dependencies`. 0.3.0 checks the attributes of patterns and solutions and adds `coverage` to candidate
  patterns. 0.4.0 adds a pattern's `ways` to source it and north stars, with `way` and `phase` on links. Every
  version stays, and Solution Studio keeps identical copies.
- `src/lib/vocabulary.ts` lists the element types and relationship predicates the site knows, with their
  labels and URL sections.
- `src/lib/compile.ts` builds a package from its source and decides its version; `scripts/content.ts` runs it.
- `src/lib/package.ts` validates a package: the JSON Schema for its `schemaVersion` first, then unique IDs,
  known types and predicates, and references that resolve, including into the packages it builds on. Any
  problem stops the build.
- `src/lib/publish.ts` defines the published data files, listed below.
- `src/pages/` has the home page, one index and one detail template for every element type, the
  discovery pages, and the sources, data, and about pages.

## Published data

Every build publishes these files next to the pages:

| Path | What it is |
| --- | --- |
| `catalog.json` | Every published package version with its license and SHA-256 digest, the latest marked `latest: true`. Its `href` values are relative to the catalog. |
| `vocabulary.json` | The element types and relationships, with labels, definitions, and each type's page address. |
| `packages/<name>/<version>/blueprint.json` | A package, byte for byte as stored in `content/`. |
| `packages/<name>/<version>/blueprint.json.sha256` | The package digest, in `sha256sum -c` format. |
| `schemas/blueprint-package-<version>.schema.json` | Each version of the package JSON Schema. The catalog's `schema` names the current one and `schemas` lists them all. |

`pnpm check:dist` confirms each published package matches its source file and its digest.
`pnpm check:published` confirms every version the live site already publishes is still in the build,
byte for byte.

## Edit content

Edit the files under `source/<package>/`, then run `pnpm content:build` and `pnpm verify`. If either fails,
its message names each problem and the file it's in. A new element type or predicate needs an entry in
`src/lib/vocabulary.ts` first.

| File | What it holds |
| --- | --- |
| `package.yaml` | The package's ID, title, description, and other details, and `dependencies`: the folder names of the packages it builds on. |
| `sources.yaml` | The references it cites, each with an `id` that elements and links use. |
| `missions.yaml`, `outcomes.yaml`, `measures.yaml`, `capabilities.yaml`, `requirements.yaml`, `patterns.yaml`, `solutions.yaml` | The elements of that type, in the order the pages show them. Each has an `id` (its key), `title`, `description`, and optionally `sources`, `applicabilityNotes`, and `attributes`. |
| `links.yaml` | Links from the elements of packages this one builds on, such as a shared capability that satisfies one of its requirements. |
| `discovery.yaml` | Discovery question sets. |

A mission's `title` is its plain name, such as Federal Acquisition, the same as its package's short title, and
`attributes.tagline` says what it is in a few words, such as "Acquiring goods and services for the government". Pages show
the tagline under the name.

**Links** sit on the element that holds them, named for the predicate, with the keys of their targets:

```yaml
- id: investigation-management
  title: Investigation Management
  description: Ability to assess allegations within jurisdiction, …
  contributes_to: [fraud-waste-abuse-prevented]
  satisfies: [link-evidence, restrict-case-access]
  candidate_pattern:
    - oversight-intake-case-tracking
    - to: shared-case-platform
      note: For an OIG, the office needs to control who administers the platform …
      sources: [cigie-silver-book]
```

A bare key names an element of the type the link reaches. Write `type:key`, such as `capability:case-management`,
anywhere else an element is named. A link's `note` becomes the relation's `description`. Relation IDs are
generated; an `id` on a link keeps an older one.

**Versions are automatic.** A version is published once it's on `origin/main`, and it never changes after
that. When a package's source no longer matches its latest published version, `pnpm content:build` writes the
next minor version, and the next version of every package that builds on it, pinned to the new one. Until that
version is pushed, building again rewrites it in place, and undoing the change removes it. Tools that pinned an
old digest keep working, and the deploy refuses a build that changes a live version.

**Discovery questions** live in `discovery.yaml`, as sets of questions. Options are written `value: label`. A
choice or yes-or-no answer can point to elements through `points`, each group naming the answers (`when`), the
elements (`to`), and why (`why`). Text and number answers are recorded as said and point nowhere. In the
published package these become `assessments` and `candidateMappings`.

**Implementation patterns** are examples, and each one describes itself in its `attributes` so patterns can be
compared side by side and grouped: `approach` (`product`, `platform`, `combine`, or `build`), `role` (the part
it plays: `public-facing`, `business-applications`, `worker-productivity`, `processing`, `ai-insights`, or
`infrastructure`), and `parts`,
`strengths`, `fitsWhen`, and `watchFor`, each a list of short statements. `src/lib/vocabulary.ts` defines them,
and `vocabulary.json` publishes their labels; since schema 0.3.0 the schema checks them too. A
`candidate_pattern` link's `note` says what the pattern means for that capability, such as a mission's caveat
on a shared pattern. A pattern that covers only part of a capability says `coverage: partial`, with a note on
which part:

```yaml
  candidate_pattern:
    - foia-request-processing
    - to: national-portal-api
      coverage: partial
      note: Requests from FOIA.gov only. The agency’s own form, email, and mail come in another way.
```

Patterns connect to each other too. `depends_on` (shown as **Needs**) is for a pattern that can't work
without another, such as one built on the shared case platform. `works_with` (**Works well with**) is for a
natural pairing, written once on either pattern.

**Solutions** combine patterns across an agency. The `solutions` package builds on the mission packages and
Common Capabilities. Each solution `includes` patterns, with a `note` saying why each one is there, and
`supports` the missions it serves, with `fitsWhen` and `watchFor` in its attributes. The site works out what
each solution covers for each mission from the patterns' capabilities, fully or only partly, and warns when
a solution leaves out a pattern that one of its patterns needs.

**Logical patterns and their ways.** Since schema 0.4.0, a pattern can describe a logical part of a solution,
which a vendor or the agency could supply, and list its `ways` to source it instead of one `approach`. Each way
has an `id`, an `approach`, a `title`, a `description`, and optionally `strengths`, `fitsWhen`, and `watchFor`.
A `depends_on` link with a `way` is a need of that way only, such as case management on the agency's platform
needing the platform. A pattern that became a way of another keeps its ID, with `status: deprecated` and
`replacedBy`.

```yaml
  depends_on:
    - to: shared-case-platform
      way: agency-platform
      note: The office's case types and steps are the shared platform, set up for oversight.
```

**North stars.** A mission package can hold its north star: one long-term, opinionated solution for the
mission, in its own `solutions.yaml`, with `kind: north-star` and `principles` in its attributes. It
`supports` its one mission, and each pattern it `includes` names the `phase` that adds it (`foundation`,
`core`, `connect`, or `insight`) and, for a logical pattern, the `way` it prefers. A need comes in the same
phase as the pattern or an earlier one, so an office can start from any pattern and add its needs first.

To add a package, create `source/<name>/package.yaml` with its own `packageId`, add its files, and run
`pnpm content:build`; it starts at 0.1.0. Element IDs are unique across all packages: each element is defined
once.

**Shared elements.** A package with `schemaVersion` 0.2.0 can list `dependencies`. Its links and discovery
answers can then point at those packages' elements, so a mission package uses the common capabilities instead
of repeating them. Every link still has at least one end in the package itself. The latest version of a package
builds on the latest version of each dependency, since the pages show only the latest versions;
`pnpm content:build` keeps the pins up to date. An element's page lists the other packages that use it.

## Deploy

`.github/workflows/pages.yml` runs on every push and pull request. It type-checks, runs the tests, builds
the site, and checks links and published data, both at the real base path and under a test project path.
Pushes to `main` then deploy to GitHub Pages. The repository's Pages source must be set to
**GitHub Actions** (Settings → Pages).

`.agent-handoff/` holds the original planning notes. They're background, not a spec.

## License

MIT. See [LICENSE](LICENSE).
