---
title: About
permalink: /about/
summary: An evolving, open-source, vendor-neutral reference library for enterprise and solution architects.
---

Enterprise Blueprints is a reference library about designing the AI-native enterprise. It's written for enterprise architects, solution architects, technical leaders, and modernization teams, with an initial focus on public-sector missions. The underlying ideas apply well beyond government.

## What makes it different

Most architecture material is a set of separate documents. Each one redefines the concepts it needs, and they drift apart over time. Enterprise Blueprints is built as **one connected model**. Every building block is defined once with a stable ID. Missions compose those blocks instead of copying them. The site generates the links between them, so you can always move from a mission to the blocks it uses, and from a block to every mission that relies on it.

## Vendor-neutral by design

Building blocks and mission blueprints describe logical architecture: responsibilities, information, behavior, and governance. They don't name or assume any product. Technology-specific realizations belong in separate [Implementation Guides]({{ '/implementations/' | relative_url }}), so the logical model stays useful whatever platforms an organization chooses.

## An evolving library

This is version 0.1, and the content is deliberately small. Each record carries a status:

{% for s in site.data.statuses %}- **{{ s[1].label }}:** {{ s[1].description | strip }}
{% endfor %}

The lifecycles, roles, and use cases in mission blueprints are illustrative. They show one sensible way to organize a mission, not a universal or mandated process, and they don't describe the obligations of any particular agency or jurisdiction.

## Contributing

The library is open source and grows one record at a time. You can start anywhere: a mission, a capability, an information concept, a governance concern, or a pattern. Adding a block or a mission means writing a Markdown file with structured front matter. A validator checks IDs and relationships before the site is built. The repository README explains how to run the site locally and add content.
