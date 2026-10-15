---
title: The Architecture
permalink: /architecture/
kicker: How Enterprise Blueprints works
summary: One evolving architecture for the AI-native enterprise, presented through many connected views.
---

## The problem

AI is making software much cheaper to create. Teams can now produce a new app, workflow, or agent in days or even hours rather than months. That's good news, but it carries a familiar risk at a faster pace. Each new experience can quietly re-implement its own version of what a case is, who may see it, how a document is retained, or when a person must review a decision.

When that happens, the organization's responsibilities fragment. Meaning drifts between systems. Policies are enforced in some places and forgotten in others. Every new experience adds integration and governance debt.

The answer isn't to slow down how experiences are built. It's to give them a durable, shared foundation to build on: **Build Experiences. Share Capabilities.**

## The four areas

{% include architecture-diagram.html %}

**Experiences** are how people and agents get work done: applications, portals, workspaces, conversational interfaces, and AI agents. They should be easy to create and easy to replace.

**The Enterprise Foundation** is what experiences rely on and shouldn't reinvent:

- *Information and meaning:* shared concepts such as a case or a document, defined clearly within a stated scope.
- *Capabilities and behavior:* what the organization can reliably do, such as managing cases, and the processes that coordinate that work.
- *Governed contracts:* agreed, enforceable terms for how experiences use that information and those capabilities.

**Implementations** are the operational systems and technologies that realize these logical responsibilities. A single product may realize several of them. A system of record, for example, often provides capabilities as well as authoritative data.

**Trust and Governance** spans the whole architecture. It covers security, identity and access, privacy, and the policies and controls that keep the organization accountable. These apply to experiences, to the foundation, and to implementations alike, and to AI agents as much as to people: an agent needs a defined identity and permissions, and its consequential decisions need human oversight.

These four areas describe *responsibilities*, not products, deployment tiers, or a required call sequence. Orchestration might live in a process, a service, or an agent. The architecture doesn't force it into a separate layer.

## Building blocks and mission blueprints

This library separates two kinds of content.

**Building blocks** are reusable definitions of what the enterprise needs. Each one has a type and explicit relationships to other blocks. For example, {% include ref.html id="capability.case-management" %} is a capability that manages {% include ref.html id="entity.case" text="Cases" %} and is constrained by the {% include ref.html id="policy.restricted-case-access" %} policy. A block is defined once and reused wherever it's needed.

**Mission Blueprints** put building blocks to work for a specific mission. For example, {% include ref.html id="mission.investigations" text="Investigations" %} follows a reported concern from intake to closure. It uses Case Management to track each matter, Document Management to keep the evidence file, and Human-in-the-Loop Review before findings are approved. For each block, the blueprint explains the part it plays *in that mission*.

Both are meant to be granular and self-contained. A building block covers one concept and makes sense on its own page. A blueprint can start as a handful of references and grow over time. New blocks and blueprints can be added, or extended, from any starting point without restructuring what's already there. Everything is linked both ways: a mission links to its blocks, and every block shows the missions that use it.

## Building block types

{% assign block_types = site.data.block_types.types %}
| Type | What it describes | Where it sits | Example |
| --- | --- | --- | --- |
{% for t in block_types %}| [{{ t[1].label }}]({{ '/blocks/' | relative_url }}?type={{ t[0] }}) | {{ t[1].description | strip | strip_newlines }} | {{ t[1].area }} | {{ t[1].example }} |
{% endfor %}

On the site, policies and controls appear together under **Governance**, but they remain distinct types in the data. A policy states a rule or obligation. A control is a safeguard that helps satisfy it. Patterns guide how blocks are arranged; they aren't an additional software tier. And a capability isn't necessarily an API or a service.

Relationships between blocks use a small, typed vocabulary such as *manages*, *uses*, *constrained by*, and *enforces*. Each relationship type connects only certain kinds of blocks; for example, a control *enforces* a policy. See the [vocabulary reference]({{ '/architecture/vocabulary/' | relative_url }}) for the full list.

## Logical architecture and implementations

Building blocks and mission blueprints describe *logical* architecture: what the enterprise needs to be able to do, rather than which products provide it.

Technology-specific material belongs in [Implementation Guides]({{ '/implementations/' | relative_url }}), which are kept separate. A guide points at the logical blocks it realizes. Blocks never depend on a guide, so the same definition can be realized in different ways by different organizations.

## Principles

1. **Define once. Reference everywhere. Compose as needed.** Reuse an existing definition instead of copying it.
2. **Make relationships explicit and typed.** Say *how* two things relate, not just that they're related.
3. **Scope meaning deliberately.** Specialize a concept for a domain when its meaning genuinely differs.
4. **Keep logical and physical separate.** Describe responsibilities first, then how a technology realizes them.
5. **Grow from anywhere.** Start with a mission, a capability, an entity, a governance concern, or a pattern. Even a placeholder is enough to connect it to the rest of the library.
