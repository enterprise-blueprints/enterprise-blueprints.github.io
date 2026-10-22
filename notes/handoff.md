# Handoff: library and Solution Studio, in tandem

Where things stood at the end of October 22, 2026, for picking up in a new session. Open `C:\Users\jerem\repos\blueprints-stack.code-workspace`, which has three folders:

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

**Pushed and live:** everything through `916d4f9`, including the two outcome levels and these notes.

**Uncommitted, from the session of October 22:** the validator shows 0 warnings, all 101 tests pass, and links check out in both builds.

- **New formats:**
  - Process steps take `waits` and `subprocess`.
  - Process blocks take `requirements`, shown as a Requirements table.
  - Mission roles take `id`, `concerns`, and `influence`.
  - Missions take `typical_systems`.
  - Operational outcomes take `indicators`.
  - Mission effectiveness models live in `_data/mission_models/<mission>.yml`, and show as a collapsed "Mission effectiveness model" section.
  - `requirement_categories` is in `_data/block_types.yml`.
- **Inspector General Investigations:** ported from the old library by `port_ig.py` in the session scratchpad, keeping the old ids.
  - **The mission and its model:** 19 conditions and behaviors, 37 links, 2 loops, and 14 interventions.
  - **Processes:** `process.oig-investigation` (it specializes Investigation Lifecycle) with five sub-processes, plus `process.oig-caseload-oversight`, with 37 requirements in all.
  - **Capabilities:** 12 planned stubs from the old catalog.
  - **Restated outcomes:** `backlog` and `rework` are restated as goals, with their links flipped to match.
- **`_config.yml`** now sets `url` to the published address, so Studio can link back.

Ask before committing or pushing. Both have been on request only.

## State of Solution Studio

- **Committed:** your Define and future process work, as `0b8c9a2`.
- **Uncommitted: Studio reads the v0.2 library.**
  - **Loaders:** `src/server/library.ts` and `missions.ts` are rewritten. They read `_blocks/`, `_missions/`, and `_data/mission_models/` with gray-matter, and build Studio's existing `Mission` type, so the UI is unchanged.
  - **IDs and links:** capability IDs are now full (`capability.case-management`), and URLs point to the new site.
  - **Tests:** a new `test-library.ts` writes test fixtures, and a new `library.test.ts` checks the real library next to Studio (it skips when the library isn't there). All 55 tests pass, and typecheck and lint are clean.
- **Saved projects:**
  - "Sample OIG" loads the new IG mission, with its outcome links and `caseload` rating intact.
  - The project whose process started from `complaint-intake` keeps its activities, because their ids are unchanged. But its process-level `missionRef` no longer matches anything. The new process is `process.oig-investigation`.
- **Your running dev server:** PID 5336 rebuilds continuously ("Fast Refresh rebuilding" every few hundred milliseconds), so headless screenshots get stuck at "Opening project…". This was already happening before these changes, and it's worth a look.
- **Stack:** Next.js 16.4 (read `AGENTS.md`: its APIs differ from older versions), React 19, SQLite through Drizzle, the Azure OpenAI Responses API, and Vitest. Run `npm run dev`, `npm test`, and `npm run typecheck`. `STUDIO_AI=demo` uses canned AI answers.
- **Other library:** Studio also searches `../industry-blueprints.github.io` for patterns and reference architectures (`src/server/blueprints.ts`). That's a separate library, and out of scope for now.

## Decided so far

- **Block types:** seven, and no more for now. Outcomes, measures, roles, and events live inside missions and blocks.
- **Capability contracts:** they stay light, as plain phrases with no schemas.
- **Outcomes:** two levels in the library, mission and operational. They're Studio's `mission-outcome` and `operational-outcome` factors.
- **Effectiveness graph:** the rest of it lives in a separate mission-model file for each mission.
- **Finer detail:** it comes from sub-processes. A step's `subprocess` is a full process block.
- **Template requirements:** they live on process blocks. Mission-specific ones go on that mission's own processes.
- **Inspector General:** it's its own mission, composing the same shared blocks as Investigations.
- **How Studio reads the library:** directly from its source files, not a JSON export. That means no build step, and the validator guards the shape. An export can come later if Studio needs to read the live site.
- **Measures:** defined once, on blocks. Mission indicators live on the mission.
- **Mission usage:** written once and derived both ways, following only real dependencies.

## Suggested next steps

1. Review and commit both repositories' changes.
2. Fix the old project's process `missionRef` (`complaint-intake` → `process.oig-investigation`), or drop the old test projects.
3. Write fuller pages for the most-used planned capabilities, such as Workflow, Notification, Identity, and Search.
4. Put the newer library parts to work in Studio:
   - policies and obligations as constraints in Define
   - controls in Validate
   - patterns and experiences in Design
   - capability states and events in Explore
5. Consider a shared, generic case lifecycle process once a second mission needs the same steps.
6. Continue the discovery toolkit plan in `notes/discovery-toolkit.md`: Studio's tools and outcome-first readiness are done; next are question answers as evidence, then the question bank.

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
