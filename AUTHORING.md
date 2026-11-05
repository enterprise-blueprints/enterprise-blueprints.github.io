# Authoring a mission

How to add a mission to the library, for a coding agent starting cold. `AGENTS.md` covers the ecosystem
and the working agreements; read it first. This guide covers the content: what to write, how to write it,
and how to check it. The seven federal missions in `source/` are the models. When this guide and a model
disagree, the model shows what the tests and pages expect, so follow it and fix this guide.

A person can do all of this in the browser too, with `pnpm editor`, as [EDITING.md](EDITING.md) describes. It
writes the same files, so everything here applies.

## Before writing anything

1. **Agree on the mission and its scope with the user.** A mission is an enduring public purpose run by
   one kind of office, such as an agency's FOIA program or its contracting office. Name its jurisdiction
   (federal, a state, local) and the laws that govern it. One package holds one mission.
2. **Read a model end to end.** `source/federal-acquisition/` is the newest; `source/federal-foia/` is
   the smallest. Run `pnpm content:show <a mission's id>` to see how its pieces connect.
3. **See what Common already offers.** `pnpm content:show "<words>"` and `source/common/` list the shared
   capabilities (case management, records, identity and access, data protection, and others) and their
   patterns. A new mission links to these rather than restating them.
4. **Gather the official sources first.** Statutes, regulations, and the guidance of the agency that
   oversees the program (for example DOJ's Office of Information Policy for FOIA, OMB for grants). Every
   requirement and measure should trace to one. Fetch each source and read what it says before citing it.

## The package, file by file

Make `source/<package>/`. A package's folder name is `<jurisdiction>-<mission>`, such as `federal-foia`.
Each element file is a YAML list in the order the pages show it, with a one-line comment at the top like
the models'. Write IDs as short kebab-case keys (`records-search-collection`); the compiler adds
`eb:<type>:`. Within a link, a bare key means the one type that link can reach, and `type:key` is needed
when it could reach more than one (`helps_with`, discovery `to:`).

### `package.yaml`

`schemaVersion` (the newest in `schemas/`), `packageId` (`org.enterprise-blueprints.<package>`),
`idPrefix: eb`, `title` ("FOIA Program — Public Access to Agency Records"), a `description` that counts
what's inside, `publisher`, `license: MIT`, `domain: public-sector`, `jurisdictions`, `tags`, and
`dependencies: [ common ]`. Never write `version` or `publishedAt`; the build sets them.

### `missions.yaml`

One mission. `title` is short ("FOIA Program"); `description` says the purpose in a sentence or two.
`attributes` holds `tagline`, `sector`, `scope` (such as `US-federal-FOIA`), and at least five
`principles`: plain statements of how the architecture works, such as "Each request is one record from
receipt to final response". `seeks:` lists every outcome in the package, in order.

### `outcomes.yaml`

Six to nine outcomes, each a result the public would recognize, written as a sentence: "Requests are
answered within the time the law allows". Each has a `theme` (below) and one or more `measures`, each with
an `id`, `title`, `description`, and `sources`. Prefer measures the office already reports, and say where
they're reported ("Annual FOIA reports include these figures"). Measure IDs must be unique within the
package.

### `capabilities.yaml`

Eight to ten capabilities, covering the work from planning to reporting. `title` is a noun phrase in title
case ("Request Intake"). `description` starts "Ability to …". Each has a `stage`, `sources`, often
`applicabilityNotes` (what varies by agency), and its links:

- `contributes_to:` the outcomes it advances. Every capability needs at least one.
- `satisfies:` its requirements. Every capability has some.
- `candidate_pattern:` patterns that could realize it, as a bare key or as
  `{ to, coverage: partial, note }` when the pattern covers only part. At least 80% of capabilities need
  a pattern; aim for all. Common's patterns are fair game (`sam-gov-entity-checks`, `shared-case-platform`).

### `requirements.yaml`

What a capability must do or respect, as an imperative: "Place each request on a processing track".
Each has a `kind` and `sources`, and belongs to exactly one capability in this package. Put the specific
figure from the law in the description (10 calendar days, 20 working days). Usually 15 to 25 in all.

### `patterns.yaml`

At least five example architectures. `description` starts "An example architecture:". `attributes` has
exactly `layer`, `parts`, `strengths`, `fitsWhen`, and `watchFor`; each list item is a short sentence. Link
patterns with `depends_on:` (can't work without, however it's sourced) and `works_with:`. Keep patterns
generic: describe kinds of product, never name a vendor. Each pattern gets at least one solution.

### `solutions.yaml`

The ways to source each pattern, in the order of their patterns. Each has an `id` (the pattern's key and a
short word for the way, as in `grants-management-product`), a `title` that says what it is ("A grants
management product", "The agency's shared case platform"), an `approach` (`product`, `platform`, `shared`
for a service another agency runs, `combine`, or `build`), a `description`, `implements:` with the patterns
it sources, and in `attributes` its own `strengths`, `fitsWhen`, and `watchFor`, which add to the pattern's.
A need of this solution only, such as case management on the agency's platform needing the platform, goes
on it as `depends_on:`. The library's solutions are examples too: kinds of product, never a vendor's.

### `resources.yaml`

Free resources from government, standards bodies, nonprofits, and universities: training, videos, guides,
communities, datasets. Each has `title`, `kind` (never `service` here), `by`, `url`,
`lastReviewedAt`, `description`, and `helps_with:` with typed targets
(`capability:foia-reporting`, or `solution:grants-management-product` for one way of sourcing a pattern). Open each link before adding
it, and leave out anything archived or behind a login. Say a video's year if it's old.

### `sources.yaml`

Each source has `id`, `title`, `url`, `kind` (usually `official-reference`), `lastReviewedAt` (the day you
checked it), optional `publicationDate`, and a `note` on what it's cited for. Prefer stable links, such as
`govinfo.gov/link/...` for the U.S. Code and eCFR for regulations.

### `links.yaml`

Links from Common's elements into this package, `from: capability:<key>` with `contributes_to`,
`satisfies`, or `candidate_pattern`. This is how a shared capability such as case management shows up in
the mission's blueprint. Most missions link four or five Common capabilities.

### `discovery.yaml`

Two sets, in this order:

1. **Results** (`<mission>-results`). Its first question is multiple-choice, "Which of these results
   matter most for this effort?", with one option per outcome pointing to it. Its second is
   "Which of these does the office track during the year?", with options pointing to measures
   (`to: measure:<id>` or a list) and a `none` option. Then a `text` question on where the figures come
   from.
2. **Operations** (`<mission>-operations`). Questions on how the office works today, so that every
   capability in the package gets at least one question pointing at it. Kinds are `single-choice`,
   `multiple-choice`, `boolean` (`when: "true"`), `number`, and `text`. Each `points` entry has `when`
   (an option value), `to` (a typed ID or a list), and `why`.

Questions ask how the office operates, never about a particular request, case, or person. Each set's
`description` says so, like the models'.

## Groups

Outcomes, capabilities, requirements, and resources each name one group from `src/lib/vocabulary.ts`. Fit
the ones there; add a group only when nothing fits, and propose it to the user first, since it changes the
vocabulary every repo reads.

| Field | On | Groups |
| --- | --- | --- |
| `theme` | outcome | `timely`, `fair-accessible`, `easy-to-use`, `integrity`, `results`, `accountable`, `transparent` |
| `stage` | capability | `plan-prepare`, `reach-take-in`, `assess-decide`, `deliver-operate`, `monitor-correct`, `report-close`, `across-the-work` (Common only) |
| `kind` | requirement | `timeliness`, `checks-controls`, `decisions-on-record`, `privacy-security`, `transparency-reporting`, `service-access`, `fairness-due-process` |
| `kind` | resource | `video`, `course`, `guide`, `site`, `community`, `dataset`, `tool`, `template`, `demo`, `case-study` |
| `layer` | pattern | `public-facing`, `ai-insights`, `business-applications`, `worker-productivity`, `connections`, `data-records`, `security-identity` |

## Writing

- Plain language, short sentences, active voice. Write for a program manager, not an engineer.
- Use curly quotes and apostrophes (’ “ ”) and en dashes as the models do.
- Patterns are "example" or "sample", never "vendor-neutral". No disclaimers or safety notices.
- AI shows up as help staff decide on, never as the decider: "AI suggests redactions, and staff decide."
- Each claim of a deadline, threshold, or duty matches its cited source. If no source supports a
  requirement, say so to the user rather than inventing one.

## Sharing with Common

When a second mission needs what one mission has, move it to Common (as the SAM.gov checks moved when
acquisition arrived) instead of copying it. Moving or changing Common means a new Common version too, and
tests that pin Common's contents may need updating. Propose the move first.

## Checking and finishing

```sh
pnpm content:build                        # builds the release, after validating every link
pnpm content:report                       # gaps: unsourced requirements, capabilities without questions
pnpm content:show <mission id>            # check the mission reads as intended
pnpm verify                               # everything, including the site build
```

Then:

1. **Tests.** Add the package to `tests/package.test.ts`: a `latest('<package>')` constant, the `missions`
   lists, and a count test like acquisition's (missions, outcomes, measures, capabilities, requirements,
   patterns, that every capability has a pattern). The per-mission checks then run on it.
2. **README.** Its opening paragraph counts and names the mission packages; add the new one.
3. **Look at it.** Run `OUT_DIR=<scratch> pnpm build` and a preview, then take screenshots of the mission
   page and its explorer at about 1400px and 390px, in light and dark.
4. **Commit** with a message like the models': what the package holds in counts, what it shares with
   Common, and any choices worth knowing. Push only when the user asks.

Studio and the kit need nothing for a new mission: Studio reads it from the next published release.
