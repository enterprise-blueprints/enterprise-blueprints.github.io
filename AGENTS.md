# Working on Enterprise Blueprints

Notes for coding agents. `VISION.md` says what the products are for; this says how to work on them. Each
repo's README covers its own code in more depth.

## The ecosystem

Three repos, usually side by side in `C:\Users\jerem\repos\`, each deployed on its own:

| Repo | What it is | Remote |
| --- | --- | --- |
| `enterprise-blueprints.github.io` (this one) | The library: public reference architecture for public-sector missions, as a site (Astro) and as versioned JSON packages with a catalog, schemas, and a vocabulary. | `enterprise-blueprints/enterprise-blueprints.github.io`, on GitHub Pages |
| `solution-studio` | Studio: a private, local workspace (Next.js, SQLite) where an architect models one engagement, building on the library's packages as blueprints. | `hofmanniac/solution-studio` |
| `blueprint-kit` | A template a firm copies to publish its own packages (resources such as services, demos, and products, or missions of its own) on a pinned library release. | Local only so far; meant for `enterprise-blueprints/blueprint-kit` as a template repo |

How they connect:

- **The package format is the contract.** `schemas/blueprint-package-<version>.schema.json` here is the
  source. Studio's `contracts/` and the kit's `schemas/` hold byte-identical copies, and a Studio test
  checks they match.
- **The library publishes releases.** Every package in a release has the release's version and builds on
  the others at that version. A published version never changes; it is on `origin/main` once pushed.
- **Studio reads catalogs.** The library's first, then other publishers' (made with the kit), by web
  address or folder. It checks each package against its catalog's digest and the schema, and keeps it.
- **The kit reuses the library's code.** Its `src/lib/{compile,package,vocabulary,format,paths}.ts` are
  verbatim copies of this repo's, refreshed by `pnpm sync --tools`. Change them here, never in the kit.
- **IDs are `<prefix>:<type>:<key>`,** such as `eb:capability:records-management`. `eb` is the library's
  prefix; each publisher names its own `idPrefix`. Measures are `<prefix>:measure:<id>`.

## Working agreements

- Commit after each finished change, with a message in the repos' style. Push or publish only when asked.
- Propose changes to the model (types, fields, relationships, schema) first; build them once agreed.
- Never touch the user's Studio data (`solution-studio/data/studio.db`) or their own `next dev` on port
  3000. For a demo, run `next start` on another port with `STUDIO_DB` pointing at a scratch database.
- Build this site into a scratch folder with `OUT_DIR=<scratch> pnpm build`, not into `dist/`.
- Check UI changes with screenshots at two widths (about 1400px and 390px) and in both themes.
- Package files keep LF line endings (`.gitattributes`), since digests hash their bytes.
- Words: plain language throughout. Patterns are "example" or "sample", never "vendor-neutral". No
  disclaimers or safety notices. Discovery questions ask how an office works, never about a particular
  case or person. The library's own resources are free ones from government, standards bodies,
  nonprofits, and universities; the `service` and `product` kinds belong in firms' packages.
- Naming in code: a workspace's packages are its **blueprints**; **layer** means only the seven parts of
  a mission's architecture; a pattern has **ways** to source it.

## The library

```sh
pnpm install
pnpm content:build   # source/ → content/, at the next release when anything changed; validates first
pnpm verify          # content check, type check, tests, site build, and published-data check
pnpm dev             # the site at http://localhost:4321
```

- `source/<package>/*.yaml` is what people edit; `content/<package>/<version>/blueprint.json` is built.
  Each element file is named for its type's section (`capabilities.yaml`, `resources.yaml`, …), plus
  `package.yaml`, `sources.yaml`, `links.yaml` (links from other packages' elements), and `discovery.yaml`.
- `src/lib/vocabulary.ts` holds every type, predicate, and group with its labels. `compile.ts` builds and
  versions packages; `package.ts` validates them; `library.ts` indexes the release for the pages;
  `publish.ts` defines the published files.
- Tests in `tests/` pin real content, such as counts and rules, so a content change often means a test
  change too.

### Adding a mission

1. Make `source/<name>/` with `package.yaml` (its `packageId`, `idPrefix: eb`, `dependencies: [ common ]`),
   then missions, outcomes (with `theme` and `measures`), capabilities (with `stage`), requirements (with
   `kind`), patterns (with `layer` and `ways`), resources, sources, `links.yaml` for the Common
   capabilities it uses, and discovery questions. The four federal missions are the models to follow.
2. Fit the groups that exist (themes, stages, kinds); add a group to the vocabulary only when nothing fits.
3. Cite official sources with `lastReviewedAt`, checked against the source itself. Each requirement
   belongs to exactly one capability in its own package, and every capability gets a discovery question.
4. `pnpm content:build`, `pnpm content:report` for gaps, `pnpm verify`, then screenshots of the mission
   page and its explorer.

### Changing the package format

A new schema version touches all three repos:

1. Here: write `schemas/blueprint-package-<next>.schema.json` (generate it from the last one with a
   script), register it in `package.ts` and `publish.ts`, update `vocabulary.ts`, the compiler, the pages,
   the tests, `src/pages/data.astro`, and the README, and move `source/*/package.yaml` to it.
2. Studio: copy the schema into `contracts/`, register it in `src/server/packages.ts`, and handle anything
   new in `packageView` and the views. Push Studio before the library, so it can read the release.
3. Kit: `pnpm sync --tools <library folder or ref>`, then `pnpm content:build` and `pnpm verify`.

## Looking things up

For questions about the content, use the built release rather than reading YAML by hand:

```sh
pnpm content:show records-management          # an element, its links both ways, resources, questions
pnpm content:show "records" --json            # what matches, as data
pnpm content:report                           # counts per package, and gaps worth a look
```

`content/<package>/<version>/blueprint.json` is the whole graph as JSON: `elements`, `relations`
(`from`, `predicate`, `to`), `sources`, and `assessments`. The newest version of each package is the
current release.

## Will it hold up with dozens more missions?

Mostly, with one thing to change first. Today a release is about 490 KB for five packages, and
`content/` is 3.7 MB with 51 package files.

- **Every release copies every package.** One release version for all packages means a fix to one
  mission writes a new version of all of them. At 50 missions (about 5 MB a release) and a few releases a
  month, `content/` and the published site grow by tens of MB a month, and GitHub Pages sites are capped
  at 1 GB. The fix to propose: a release becomes a set of package versions, so only changed packages get
  new versions and the catalog's `release` names which version of each it includes.
- **Builds stay fast.** Parsing every version takes well under a second; the site build is a few seconds
  for 259 pages and grows with element count, not versions.
- **Authoring stays manageable** for people and agents: one folder per mission, stable IDs, validation
  when the release is built, and `content:show` and `content:report` for questions across packages.
- **Finding things gets harder.** The site has no search, and the missions, capabilities, and
  requirements indexes become long lists. Studio's library drawer lists every package in one column.

## Backlog

Decisions to propose first:

- Release only the packages that change (above), across the library, Studio, and the kit.
- Group missions by domain or jurisdiction as state and local missions arrive.

Library:

- Site search, such as Pagefind, and filters on the long index pages.
- A scheduled check that sources' and resources' links still work, alongside their review dates.
- Eight requirements are unsourced on purpose (six in Common's case management, two in FOIA); cite them
  if an authoritative source turns up.
- The fifth mission: benefits and eligibility, or inspection and enforcement.

Studio:

- Search and grouping in the library drawer, and a short-lived cache of catalogs instead of reading
  them on every package opened.
- Read the order of resource kinds and the fallback groups from the vocabulary, instead of Studio's own
  copies in `src/lib/packages.ts` and `src/lib/groups.ts`.
- The Options card leaves a wider right gutter on phones.
- Next features, per `VISION.md`: Assist, then Roadmaps.

Kit:

- Publish it as the `enterprise-blueprints/blueprint-kit` template repo. Creating a public repo needs the
  user's go-ahead in their own session; the commands are in the kit's `AGENTS.md`.
