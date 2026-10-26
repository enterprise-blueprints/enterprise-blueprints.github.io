# Enterprise Blueprints

An independent, open reference library of public-sector missions, the capabilities they depend on, and
vendor-neutral patterns that might realize them. The first package describes U.S. federal Offices of
Inspector General in general terms.

## Develop

Requires Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm check    # type-check
pnpm build    # validate every package and build the static site into dist/
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
- `src/pages/` has the home page, one index and one detail template for every element type, and the
  sources and about pages.

## Edit content

Edit `content/federal-oig/blueprint.json`, then run `pnpm build`. If the build fails, its message names
each problem. A new element type or predicate needs an entry in `src/lib/vocabulary.ts` first.

`.agent-handoff/` holds the original planning notes. They're background, not a spec.

## License

MIT. See [LICENSE](LICENSE).
