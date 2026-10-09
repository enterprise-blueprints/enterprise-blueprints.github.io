---
id: "architecture-decision:0005-add-a-machine-readable-capability-catalog"
title: "Add a machine-readable capability catalog"
type: "architecture-decision"
status: "draft"
summary: "Describe business and shared capabilities as structured data in one catalog that use cases, missions, and tools refer to by ID."
related:
  - "architecture-decision:0004-add-machine-readable-use-case-processes"
  - "foundation:enterprise-capability-map"
  - "capability:catalog"
---

# Add a machine-readable capability catalog

## Context

[The Enterprise Capability Map](../foundations/enterprise-capability-map.md) names example business and shared capabilities, such as Notification, Approval, and Document Management. Use case processes and missions now refer to capabilities by ID: activities name the capabilities they use, requirements name the capabilities that could fulfill them, and typical systems name the capabilities they provide.

Those IDs need somewhere to point. Architects also need a consistent description of each capability to ask whether a customer already has it, has it several times over, or needs it. That is the habit of searching before building.

## Decision

Describe capabilities as structured data, one YAML file per capability in `_data/capabilities/<slug>.yml`. Each states the capability's layer (business or shared), responsibility, boundaries, operations at a logical level, entities, policy areas, dependencies, signs that it is missing or duplicated, and questions to ask.

One article, the [Capability Catalog](../capabilities/catalog.md), renders every capability and shows where the library uses it. The site publishes the catalog as JSON at `/capabilities/index.json`.

The starter catalog holds the capability map's examples, with Case Management as a business capability, plus Reporting. Entities and policy areas remain plain IDs until their own artifacts exist.

## Alternatives

- **One prose article per capability.** Room for depth, but fourteen thin articles would add little before their contracts are developed. A capability can still get its own article when it needs one, using the [capability template](../templates/capability.md).
- **Full capability contracts now.** Inputs, outputs, failure behavior, and service levels matter, but they deserve the foundation articles on capability contracts first.
- **IDs without definitions.** Tools could match on IDs, but readers couldn't tell what a capability covers or where its boundaries lie.

## Consequences

The format is documented in the [Capabilities index](../capabilities/README.md), with a [data template](../templates/capability.yml). Authors keep capability IDs stable, because use cases, missions, and tools refer to them.

Operation names such as `Notification.send` describe responsibilities, not interfaces. The catalog doesn't imply one central platform for any capability.
