---
title: The Model
permalink: /model/
kicker: How Enterprise Blueprints works
summary: One evolving architectural model of the AI-native enterprise, presented through many connected views.
---

## The problem

AI is making software much cheaper to create. Teams can now produce a new app, workflow, or agent in days rather than months. That's good news, but it carries a familiar risk at a faster pace. Each new experience can quietly re-implement its own version of what a case is, who may see it, how a document is retained, or when a person must review a decision.

When that happens, the organization's responsibilities fragment. Meaning drifts between systems. Policies are enforced in some places and forgotten in others. Every new experience adds integration and governance debt.

The answer isn't to slow down how experiences are built. It's to give them a durable, shared foundation to build on: **Build Experiences. Share Capabilities.**

## The architecture

{% include model-diagram.html %}

**Experiences** are how people and agents get work done: applications, portals, workspaces, conversational interfaces, and AI agents. They should be easy to create and easy to replace.

**The Enterprise Foundation** is what experiences rely on and shouldn't reinvent:

- *Information and meaning:* shared concepts such as a case or a document, defined clearly within a stated scope.
- *Capabilities and behavior:* what the organization can reliably do, such as managing cases, and the processes that coordinate that work.
- *Governed contracts:* agreed, enforceable terms for how experiences use that information and those capabilities.

**Implementations** are the operational systems and technologies that realize these logical responsibilities. A single product may realize several of them. A system of record, for example, often provides capabilities as well as authoritative data.

**Trust and Governance** spans the whole model. Policies and the controls that enforce them apply to experiences, to the foundation, and to implementations alike.

These four areas describe *responsibilities*, not products, deployment tiers, or a required call sequence. Orchestration might live in a process, a service, or an agent. The model doesn't force it into a separate layer.

## Building blocks and mission blueprints

The library separates two kinds of content.

**Building blocks** are canonical, reusable definitions. Each one has a stable ID, a type, and explicit relationships to other blocks. A block is written once and referenced everywhere it's needed.

**Mission Blueprints** are compositions. A blueprint such as {% include ref.html id="mission.investigations" text="Investigations" %} explains a mission's outcomes and an illustrative lifecycle, then references the building blocks it relies on. For each one, it records the part that block plays *in this mission*.

That gives two kinds of relationship, and the difference matters:

- An **intrinsic relationship** belongs to the block because it's part of what the block means. Case Management *manages* Case wherever Case Management appears.
- A **contextual relationship** belongs to the mission. In Investigations, Document Management maintains the evidence file. In Grants Management, the same block holds application packages. Neither use changes the canonical definition of Document Management.

Relationships are always recorded in one direction, on the record that owns them. The site generates the reverse view. A block page lists every mission that uses it, and every block that points to it, without anyone keeping reciprocal lists in sync.

### What "define once" means

Define once means **one canonical definition per distinct concept within a clear scope**. It doesn't mean one universal definition for every similarly named thing. A case in an investigations context carries meaning that a case in another domain may not share. When that difference matters, the library models it as a separate block that explicitly *specializes* the general one, rather than stretching a single definition to fit everything.

## Building block types

{% assign block_types = site.data.block_types.types %}
| Type | What it describes | Where it sits | Example |
| --- | --- | --- | --- |
{% for t in block_types %}| [{{ t[1].label }}]({{ '/blocks/' | relative_url }}?type={{ t[0] }}) | {{ t[1].description | strip | strip_newlines }} | {{ t[1].area }} | {{ t[1].example }} |
{% endfor %}

On the site, policies and controls appear together under **Governance**, but they remain distinct types in the data. A policy states a rule or obligation. A control is a safeguard that helps satisfy it. Patterns guide how blocks are arranged; they aren't an additional software tier. And a capability isn't necessarily an API or a service.

Relationships between blocks use a small, typed vocabulary such as *manages*, *uses*, *constrained by*, and *enforces*. Each relationship type allows only certain source and target types, and the content validator checks every relationship against those rules. See the [vocabulary reference]({{ '/model/vocabulary/' | relative_url }}) for the full list.

## Vendor neutrality

Every building block and mission blueprint describes *logical* architecture. Definitions avoid product names and don't assume that any single vendor or platform is required.

Technology-specific material belongs in [Implementation Guides]({{ '/implementations/' | relative_url }}), which are kept separate. A guide points at the logical blocks it realizes. Blocks never depend on a guide, so the same definition can be realized in different ways by different organizations.

## Principles

1. **Define once. Reference everywhere. Compose as needed.** Reuse a canonical definition instead of copying it.
2. **Make relationships explicit and typed.** Say *how* two things relate, not just that they're related.
3. **Scope meaning deliberately.** Specialize a concept for a domain when its meaning genuinely differs.
4. **Keep logical and physical separate.** Describe responsibilities first, then how a technology realizes them.
5. **Grow from anywhere.** Start with a mission, a capability, an information concept, a governance concern, or a pattern. A planned stub is enough to connect it to the model.
