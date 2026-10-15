# Enterprise Blueprints v0.2 — Coding Agent Handoff

## Objective

Evolve the existing site into a more complete, traceable architecture knowledge system. Preserve the core principle:

**Define once. Reference everywhere. Compose as needed.**

Work within the existing Jekyll, Markdown, YAML, and Liquid architecture. Inspect existing schemas, templates, and validators before making changes.

## 1. Strengthen the Building Block Model

Retain the existing seven types: Entity, Capability, Process, Experience, Policy, Control, and Pattern.

- **Logical contracts:** Extend Capability operations with optional structured inputs, outputs, preconditions, authorization requirements, and emitted events. Keep technology-neutral.
- **Relationships:** Ensure appropriate dependencies between processes, capabilities, entities, policies, and controls can be expressed and validated.
- **Reuse:** Distinguish *direct mission usage* from *indirect/inherited usage* through relationships. Derive indirect usage rather than duplicating mission references. Use explicit dependency semantics, not arbitrary graph reachability.
- Preserve existing IDs, URLs, and content compatibility.

Do not introduce an eighth building-block type yet.

## 2. Improve Mission Blueprint Modeling

Clarify the responsibilities of each content type:

- **Mission:** Outcomes, mission context, participants, lifecycle, and composition of reusable blocks.
- **Process:** Activities, decisions, handoffs, exceptions, and capability usage.
- **Capability:** Reusable business behaviors, operations, events, and authoritative responsibilities.
- **Experience:** How people and agents interact with processes and capabilities.

Avoid duplicating detailed process definitions within mission blueprints. Reference canonical definitions wherever practical.

Introduce optional, structured mission outcomes with stable identifiers and links to supporting processes, capabilities, and measures.

Where possible, reference measures defined on canonical building blocks instead of maintaining duplicate definitions.

## 3. Refine Existing Content

Use the two existing missions to validate the model.

**Investigations**
- Clarify that every received concern is recorded, even when subsequently screened out.
- Add a concrete outcome-to-measure-to-process-to-capability example around timely triage.
- Preserve human accountability and authorization requirements.

**Grants Management**
- Add a Planned **Application Management** capability responsible for grant application lifecycle and status.
- Connect the appropriate process and Grant Application entity.
- Add initial policy/control placeholders for eligibility, conflicts of interest, reviewer independence, and auditability.
- Keep Document Management focused on documents rather than application lifecycle ownership.

## 4. Improve Navigation and Discovery

Preserve the existing high-level site navigation and visual design.

- Show direct and indirectly related mission usage on building-block pages, clearly labeled.
- Make relationships easier to follow between missions, processes, capabilities, entities, and governance.
- Add a concise **How to Use Enterprise Blueprints** guide showing the journey from mission outcomes to reusable building blocks and eventual implementation.
- Improve existing page layouts where needed rather than introducing a new UI framework.

## 5. Validation and Quality

Extend existing Python validation and tests to cover new optional fields and relationships.

- Validate IDs, relationship targets, measure references, and schema compatibility.
- Ensure existing content remains valid without requiring all new optional fields.
- Avoid manually maintained reverse references or duplicated canonical content.
- Verify Jekyll builds, internal links, and mobile layouts.

## Scope Boundaries

**Implement now:** Model refinements, updated Investigations and Grants content, derived reuse relationships, minimal traceability, and navigation improvements.

**Defer:** Additional building-block types, a full interactive graph explorer, detailed technology implementations, Solution Studio integration, and additional mission blueprints.

Keep implementation lightweight and extensible. Prefer the smallest changes that establish useful conventions.

## Acceptance Criteria

1. All existing pages and references continue working.
2. Capability contracts can be described in vendor-neutral terms.
3. Mission outcomes can be traced to supporting architecture elements.
4. Direct and indirect reuse are distinguished without redundant authoring.
5. Both existing missions demonstrate the improved model.
6. Validators and tests pass.
7. The site remains simple, coherent, and easy to extend through Markdown/YAML.

**Guiding instruction:** Prioritize sound modeling and composability over feature count. Make reasonable design decisions consistent with the existing architecture, and document any significant modeling decisions in the repository.