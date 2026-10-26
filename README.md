# Enterprise Blueprints

An independent, open reference library of public-sector missions, the capabilities they depend on, and
vendor-neutral patterns that might realize them. The first package describes U.S. federal Offices of
Inspector General in general terms.

## Develop

Requires Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm check       # type-check
pnpm test        # validator tests
pnpm build       # validate every package and build the static site into dist/
pnpm check:dist  # check every internal link and the published data in dist/
pnpm verify      # all of the above, in order
```

To check a build under a project-site path, as CI does:

```bash
BASE_PATH=/baseurl-check OUT_DIR=dist-subpath pnpm build
node scripts/check-dist.mjs dist-subpath /baseurl-check
```

## How it's organized

- `content/<package>/<version>/blueprint.json` holds each package version: its sources, elements,
  relations, and discovery questions. The pages show the latest version of each package; every version
  stays published.
- `schemas/blueprint-package.schema.json` is the package format (schemaVersion 0.1.0). Solution Studio
  keeps an identical copy.
- `src/lib/vocabulary.ts` lists the element types and relationship predicates the site knows, with their
  labels and URL sections.
- `src/lib/package.ts` validates a package: the JSON Schema first, then unique IDs, known types and
  predicates, and references that resolve. Any problem stops the build.
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
| `schemas/blueprint-package-0.1.0.schema.json` | The package JSON Schema. |

`pnpm check:dist` confirms each published package matches its source file and its digest.
`pnpm check:published` confirms every version the live site already publishes is still in the build,
byte for byte.

## Edit content

Edit the latest version, such as `content/federal-oig/0.2.0/blueprint.json`, then run `pnpm verify`. If
the build fails, its message names each problem. A new element type or predicate needs an entry in
`src/lib/vocabulary.ts` first.

A published version never changes. Once a version is live, copy it to a new folder such as
`content/federal-oig/0.3.0/`, raise `version` to match, and make the changes there. Tools that pinned the old
digest keep working, and the deploy refuses a build that changes a live version.

**Discovery questions** live in a package's `assessments`. IDs look like `assessment:<name>` and
`question:<name>`. A choice or yes-or-no answer can point to an element through `candidateMappings`, with a
short interpretation; text and number answers are recorded as said and point nowhere.

To add a second package, create `content/<name>/<version>/blueprint.json` with its own `packageId`. Element
IDs must be unique across all packages. The site picks it up automatically.

## Deploy

`.github/workflows/pages.yml` runs on every push and pull request. It type-checks, runs the tests, builds
the site, and checks links and published data, both at the real base path and under a test project path.
Pushes to `main` then deploy to GitHub Pages. The repository's Pages source must be set to
**GitHub Actions** (Settings → Pages).

`.agent-handoff/` holds the original planning notes. They're background, not a spec.

## License

MIT. See [LICENSE](LICENSE).
