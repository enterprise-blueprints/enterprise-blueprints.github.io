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

- `content/<package>/blueprint.json` holds each package: its sources, elements, and relations. Every page
  is generated from these files.
- `schemas/blueprint-package.schema.json` is the package format (schemaVersion 0.1.0). Solution Studio
  keeps an identical copy.
- `src/lib/vocabulary.ts` lists the element types and relationship predicates the site knows, with their
  labels and URL sections.
- `src/lib/package.ts` validates a package: the JSON Schema first, then unique IDs, known types and
  predicates, and references that resolve. Any problem stops the build.
- `src/lib/publish.ts` defines the published data files, listed below.
- `src/pages/` has the home page, one index and one detail template for every element type, and the
  sources, data, and about pages.

## Published data

Every build publishes these files next to the pages:

| Path | What it is |
| --- | --- |
| `catalog.json` | Every package with its version, license, and SHA-256 digest. Its `href` values are relative to the catalog. |
| `packages/<name>/<version>/blueprint.json` | A package, byte for byte as stored in `content/`. |
| `packages/<name>/<version>/blueprint.json.sha256` | The package digest, in `sha256sum -c` format. |
| `schemas/blueprint-package-0.1.0.schema.json` | The package JSON Schema. |

`pnpm check:dist` confirms each published package matches its source file and its digest.

## Edit content

Edit `content/federal-oig/blueprint.json`, then run `pnpm verify`. If the build fails, its message names
each problem. A new element type or predicate needs an entry in `src/lib/vocabulary.ts` first.

A published package version shouldn't change. Once a version is live, raise `version` in the package for
any change, so tools that pinned the old digest keep working.

To add a second package, create `content/<name>/blueprint.json` with its own `packageId`. Element IDs must
be unique across all packages. The site picks it up automatically.

## Deploy

`.github/workflows/pages.yml` runs on every push and pull request. It type-checks, runs the tests, builds
the site, and checks links and published data, both at the real base path and under a test project path.
Pushes to `main` then deploy to GitHub Pages. The repository's Pages source must be set to
**GitHub Actions** (Settings → Pages).

`.agent-handoff/` holds the original planning notes. They're background, not a spec.

## License

MIT. See [LICENSE](LICENSE).
