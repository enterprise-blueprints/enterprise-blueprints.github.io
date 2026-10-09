---
id: "capability:catalog"
title: "Capability Catalog"
type: "capability"
status: "draft"
summary: "A starter catalog of business and shared enterprise capabilities: what each is responsible for, its operations, and where the library uses it."
related:
  - "foundation:enterprise-capability-map"
  - "use-case:public-sector-case-management"
  - "mission:inspector-general-investigations"
---

# Capability Catalog

## Overview

[The Enterprise Capability Map](../foundations/enterprise-capability-map.md) describes business capabilities that consume and compose shared enterprise capabilities. This catalog gives those capabilities a first, concrete form.

Each entry states the capability's responsibility and boundaries, its operations at a logical level, the entities it acts on, and the policy areas that govern it. It also lists the signs that a capability is missing or duplicated, and questions to ask before building a new one. Those support the habit of searching before building.

Use cases and missions refer to these capabilities by ID. Activities name the capabilities they use, requirements name the capabilities that could fulfill them, and typical systems name the capabilities they provide today. Each entry shows where the library uses it.

## How to read this catalog

Operations use names such as `Notification.send` to describe a responsibility, not an interface. An implementation may provide one through an API, an event, a workflow, or an agent tool. Inputs, outputs, failure behavior, and service levels belong in fuller capability contracts, which later artifacts will develop.

The catalog is a starting point, not a complete inventory, and it doesn't imply one central platform. An organization may share a capability across its programs, run separate implementations that agree on a contract, or keep a specialized capability where its work requires one.

Case Management appears as a business capability, as it does in the capability map. Reporting is an addition to the map's examples, because oversight and statistics need it in almost every program.

The data lives in [`_data/capabilities/`](https://github.com/enterprise-blueprints/enterprise-blueprints.github.io/tree/main/_data/capabilities), one file per capability. Tools can read the whole catalog as JSON at [`/capabilities/index.json`](index.json). The rest of this page is generated from that data.

{% include capability-catalog.html %}

## Related architecture

- [The Enterprise Capability Map](../foundations/enterprise-capability-map.md) explains the layers these capabilities belong to.
- [Public Sector Case Management](../use-cases/public-sector-case-management.md) shows which capabilities each case management activity uses.
- [Inspector General Investigations](../missions/inspector-general-investigations.md) shows which capabilities typical systems provide today.
