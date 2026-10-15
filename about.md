---
title: About
permalink: /about/
summary: An evolving, open-source reference library for enterprise and solution architects.
---

Enterprise Blueprints is a reference library about designing the AI-native enterprise. It's written for enterprise architects, solution architects, technical leaders, and modernization teams, with an initial focus on public-sector missions. The underlying ideas apply well beyond government.

## What makes it different

Most architecture material is a set of separate documents. Each one redefines the concepts it needs, and they drift apart over time. Enterprise Blueprints is built as **one connected body of knowledge**. Every building block is defined once, and missions link to the blocks they rely on. You can always move from a mission to the blocks it uses, and from a block to every mission that relies on it.

New to the library? [How to Use Enterprise Blueprints]({{ '/architecture/how-to-use/' | relative_url }}) walks through it, from a mission's outcomes to the building blocks behind them.

## Logical architecture first

Building blocks and mission blueprints describe logical architecture: responsibilities, information, behavior, and governance, rather than particular products. Technology-specific realizations belong in separate [Implementation Guides]({{ '/implementations/' | relative_url }}), so the logical architecture stays useful whatever platforms an organization chooses.

## An evolving library

This is version 0.1, and the content is deliberately small. Each page carries a status:

{% for s in site.data.statuses %}- **{{ s[1].label }}:** {{ s[1].description | strip }}
{% endfor %}

The lifecycles, roles, and experience ideas in mission blueprints are illustrative. They show one sensible way to organize a mission, not a universal or mandated process, and they don't describe the obligations of any particular agency or jurisdiction.

## Contributing

The library is open source and grows one page at a time. You can start anywhere: a mission, a capability, an entity, a governance concern, or a pattern. The repository README explains how to add content.
