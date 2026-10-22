# Handoff: library and Solution Studio, in tandem

Where things stood on October 22, 2026, for picking up in a new session. Open `C:\Users\jerem\repos\blueprints-stack.code-workspace`, which has three folders:

| Folder | What it is | Status |
| --- | --- | --- |
| `enterprise-blueprints.github.io` | **The library.** A Jekyll site of building blocks and Mission Blueprints, published to https://enterprise-blueprints.github.io | Active |
| `solution-studio` | **The app.** A local Next.js workspace that takes an architect from discovery to a logical architecture and a brief, using the library as its templates | Active |
| `enterprise-blueprints.github.io-old` | The library before the v0.2 rebuild. Its `_data/` holds the YAML that Studio still expects | Reference only. Don't edit it |

Read these first:

1. [solution-studio-alignment.md](solution-studio-alignment.md): the concept-by-concept comparison of what Studio expects and what the library has now, and what each side needs to change.
2. [enterprise-blueprints-v0.2.md](enterprise-blueprints-v0.2.md): the v0.2 brief that the recent library work followed.
3. The library README's "Modeling decisions" section: the choices behind v0.2.
4. `solution-studio/README.md` and `solution-studio/.design/processes-requirements-capabilities.md`: how Studio is meant to use missions, processes, requirements, and capabilities.

## The goal now

Work on both sides in tandem. The library defines the model, and Studio proves it in use: an architect should be able to use Studio for real engagements, with the library's blocks and missions as the starting templates. "The library content comes first, then Studio" (Studio's own design note), but changes on one side should be checked against the other.

## State of the library

**Pushed and live:** everything through `6df3c93` ("Add experience and pattern templates"): templates for all seven block types, structured front matter, capability tabs, and the redesigned Mission Blueprint pages.

**Committed, not pushed** (five commits on `main`):

- `5f80866` Light capability contracts: `takes`, `returns`, and `authority` on operations.
- `078972c` Traceable outcomes, and measure ids on capabilities.
- `4a8c201` Direct and indirect mission usage on block pages, through `implies_use` on relationship types.
- `9ec0771` Planned Application Management capability, Grants policy and control placeholders, the How to Use guide, and the README's modeling decisions.
- `f586552` The Solution Studio alignment note.

**Uncommitted in the working tree**, all tested (85 tests pass, 0 validator warnings, links check):

- **Two levels of outcomes on missions.** `outcomes` holds agency-level mission outcomes `{id, title, statement, indicators}`. The new `operational_outcomes` list `{id, statement, contributes_to, measures, supported_by}` holds how well the work performs. Project or solution outcomes belong in Studio, not the library. The mission page shows a Mission outcomes table, then "How the work contributes", grouped by mission outcome, with gaps shown.
- **Outcome tables.** Outcomes are compact tables after the Overview (`_includes/trace-list.html` and `_includes/operational-outcome-row.html`). The old `trace-ref.html` is deleted.
- **Contracts are easier to see.** Operations show full-size Takes and Returns lines with a divider, and a note under the heading says the operations form the capability's contract.
- **Widths.** The page container is 80rem. Running text is capped at 54rem, while tables and flows use the full column. `wide: true` in front matter widens a `page` layout page (The Architecture uses it).

Ask before committing or pushing. Both have been on request only.

## State of Solution Studio

- **Its library connection is broken.** `src/server/library.ts` and `src/server/missions.ts` read `_data/missions/`, `_data/use-cases/`, and `_data/capabilities/` from `../enterprise-blueprints.github.io`. The rebuild removed those folders, so the mission picker is empty and the process and Define views have no templates. The old files are still in the `-old` folder.
- **Uncommitted work in progress.** About 25 changed files on Define and the future process (`future-process.tsx`, `lib/define.ts`, and migration `0007_future_process`). It isn't ours to change. Ask whether to commit it before touching Studio.
- **Saved data.** `data/studio.db` has four projects, three on the old `inspector-general-investigations` mission, with one process of 10 activities started from it.
- **Stack:** Next.js 16.4 (read `AGENTS.md`: its APIs differ from older versions), React 19, SQLite through Drizzle, Azure OpenAI Responses API, Vitest. Run `npm run dev`, `npm test`, and `npm run typecheck`. `STUDIO_AI=demo` uses canned AI answers.
- Studio also searches `../industry-blueprints.github.io` for patterns and reference architectures (`src/server/blueprints.ts`). That's a separate library, and out of scope for now.

## Decided so far

- Seven block types, no more for now. Outcomes, measures, roles, and events live inside missions and blocks.
- Capability contracts stay light: plain phrases, and no schemas.
- Outcomes come in two levels in the library: mission and operational. These match Studio's `mission-outcome` and `operational-outcome` factor types.
- Measures are defined once, on blocks. Mission indicators live on the mission.
- Mission usage is written once and derived both ways, following only real dependencies.

## Open questions, to settle at the start

From the alignment note:

1. **Where the rest of the effectiveness graph lives.** That's conditions, behaviors, causal links, loops, and interventions. The recommendation is on the mission, next to its outcomes, with factors pointing at process steps.
2. **Template requirements.** The recommendation is `requirements` on process blocks, plus mission-specific ones on missions. They power Studio's Define stage.
3. **Step granularity.** Studio's discovery wants about 30 activities, and Investigation Lifecycle has 5 steps. Sub-processes could give both.
4. **Inspector General.** Its own mission specializing Investigations, or its graph on Investigations directly.
5. **How Studio reads the library.** The recommendation is a JSON export built by the site, such as `/data/library.json`, checked by the validator, instead of parsing front matter.

## Suggested next steps

1. Settle the open questions above.
2. **Library:** add the agreed fields (graph, requirements, role ids, typical systems), a shared case-management process, planned stubs for the 11 missing capabilities, and the JSON export. Port the IG mission content from the `-old` folder into the new shape.
3. **Studio:** replace the two loader files with a reader for the export, mapped onto Studio's existing types. Switch to full IDs (`capability.case-management`) and the new URLs. Migrate or drop the old test projects.
4. Then put the new library parts to work in Studio: policies and obligations as constraints in Define, controls in Validate, patterns and experiences in Design, capability states and events in Explore.

## Working notes

- **Windows, PowerShell first.**
  - Write commit messages to a file in the scratchpad, saved as UTF-8 *without* a BOM (`[IO.File]::WriteAllText(..., New-Object Text.UTF8Encoding $false)`), then use `git commit -F`.
  - `_data/*.yml` files use CRLF line endings. Edit them with the Edit tool, or keep `\r\n` when replacing text.
- **Library checks:**
  - `python scripts/validate_content.py` and `python scripts/test_validate_content.py`.
  - Build into the scratchpad with `bundle exec jekyll build -q -d <dir>`, then run `python scripts/check_links.py <dir>`.
  - CI also builds with `--baseurl /baseurl-check` and checks links against that build.
- **Local preview:** a `jekyll serve` instance usually runs at http://127.0.0.1:4000 and writes `_site`.
- **Screenshots:** headless Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe --headless=new --screenshot`) of a local HTML file holding iframes, one at desktop width and one at 390px.
- **Liquid gotchas** (Jekyll 4.4, no plugins):
  - There's no `remove_last` filter. Use a leading separator and `remove_first`.
  - An include parameter can't be `array[0]`. Assign it to a variable first.
  - `map` over a mix of strings and objects does substring lookups on the strings, so loop instead.
- **How the user likes to work:**
  - Iterate visually, with screenshots, desktop and phone.
  - Prefer compact tables over tall cards.
  - Keep content machine-readable in front matter, for Studio.
  - Don't over-engineer.
  - Commit and publish only when asked.
