# Enterprise Blueprints and Solution Studio

Two products, built together, kept in separate repos and deployed separately. This page is the same in both.
It says what each one is for, how they fit, the ideas they share, and where they're going. Each repo's README
covers how its code works.

## What each one is

**Enterprise Blueprints** is a public library of reference architecture for public-sector missions, readable
by people (the website) and by tools (versioned JSON packages, a catalog, a schema, and a vocabulary). An
architect opens a mission and sees what the agency is trying to achieve, what it has to be able to do, what
those abilities have to respect, and the logical parts of an architecture that could provide them, with the
sources behind each.

**Solution Studio** is a private, local workspace where an architect models one real engagement. It can start
from notes, from discovery questions, or from the library, and every view (outline, map, gaps, goals, options)
is a view of the same model.

The library describes what's generally true and the choices there are. Studio holds what's true for one
agency and what it chooses.

## How they fit

- **The library publishes releases.** All its packages share one release version, such as 0.9.0. A published
  version never changes; changes go into the next release. Every schema version stays published, so older
  packages still validate.
- **A workspace stands on blueprints.** In Studio, a library package a workspace builds on is one of its
  blueprints, at one version. Each library element in it is on (in the model), off (decided against, and
  remembered), or not decided yet. Mission packages build on a common package, so shared capabilities, such
  as identity and records management, are described once.
- **Studio keeps what it downloads.** It checks each package against the catalog's digest and the schema,
  stores it as downloaded, and keeps working when the library can't be reached. When a newer release comes
  out, a blueprint offers its update, with a review of what changes.
- **The schema is the contract.** Studio keeps an identical copy of every version of the package schema, and
  a test checks the copies match.

## The model

- A **mission** seeks **outcomes**, each with **measures** that tell how it's going.
- **Capabilities** contribute to outcomes. **Requirements** say what a capability has to do or respect.
- **Patterns** are the logical parts of an architecture that could provide a capability, fully or in part.
  Each lists its **ways** to source it (configure a product, extend a platform the agency has, combine tools,
  or build to fit), with strengths, when it fits, and what to watch for. A pattern can need another, or work
  well with one.
- A mission's patterns, by **layer**, are its architecture, and the mission lists the **principles** that
  architecture follows. The seven layers, in order: public facing, AI and insights, business applications,
  worker productivity, connections, data and records, and security and identity.
- Outcomes, capabilities, and requirements each belong to a group that holds across missions: an outcome's
  **theme** (what the public gets), a capability's **stage** of the work, and a requirement's **kind** of
  obligation. A new mission fits the groups there are; a group is added only when nothing fits.
- **Discovery questions** ask about how an office works today, and each answer can point at what it suggests.

Choosing one way for each pattern is an agency's decision, so it belongs in Studio's **scenarios**, not in
the library.

## Words

| Word | Means |
| --- | --- |
| Release | The library's one version, such as 0.9.0. |
| Package | The downloadable, validated unit: a file, its schema, its catalog entry. |
| Blueprint | A package as something a Studio workspace builds on. |
| Layer | Only the seven parts of a mission's architecture. |
| Pattern, way, approach | A logical part of the architecture; one way to source it; the kind of way it is. |
| Workspace, model, scenario | Studio's engagement; what's turned on in it; the options compared. |

## Ideas both keep

- **Start anywhere.** No wizard and no required order. Incomplete, unknown, and disconnected are normal states.
- **Keep what was said.** A note or an answer stays as written, apart from what's made of it.
- **Propose, don't decide.** Suggestions, from discovery now and from AI later, arrive as proposals to review.
  A reference requirement isn't a customer requirement until the architect accepts it, and a candidate
  pattern isn't a chosen one.
- **Show the sources.** Library content cites official references, with the date each was last reviewed.
- **Keep the model light.** Add a type, field, or relationship only when a page or a Studio feature needs it.
  Structured content is data, so the pages and the packages come from the same source.

## Where it's going

Built so far, each step pairing library content with the Studio feature that uses it: capture, starting from
a blueprint, discovery, requirements and gaps, and options. Next:

1. **Deliverables.** An architecture summary an architect can hand over, built from a fixed revision of the
   model, so it can be traced back and reproduced.
2. **Assist.** AI suggestions from notes and findings, through the same review as discovery's.
3. **Roadmaps.** Which parts of the architecture to build first, from wherever an agency starts.
4. **More missions.** Mission names leave out "Federal" so state and local versions can reuse them.
5. **Explainers.** Videos and articles that link to the library's items by ID, once both products have a
   solid foundation.
