---
id: "architecture-decision:0002-build-experiences-share-capabilities"
title: "Adopt Build Experiences. Share Capabilities."
type: "architecture-decision"
status: "published"
summary: "Use an active design principle to connect tailored experiences with shared enterprise capabilities."
related:
  - "foundation:ai-native-enterprise"
---

# Adopt Build Experiences. Share Capabilities.

## Context

Earlier charter versions used “Thin Apps. Thick Platforms.” as the signature phrase. The project owner prefers wording that tells builders what to do and makes reuse central.

## Decision

Use **Build Experiences. Share Capabilities.** as the signature architectural principle in the current charter, documentation, articles, and site.

Explain it in plain language:

> Create apps, workflows, and agents that fit the work. Build on shared enterprise capabilities.

Shared capabilities operate on enterprise entities and authoritative state. Identity, policy, and governance define who may act and under what conditions. Sharing a capability means providing a governed way to use it; it does not grant unrestricted access to data or actions.

Experiences can change as needs change. The enterprise foundations remain durable.

[Charter v0.5](../charter/project-charter-v0.5.md) incorporates this principle. Earlier charter versions retain their historical wording.

## Alternatives

- **Dynamic Experiences. Durable Foundations.** Emphasizes the distinction between changing experiences and lasting foundations.
- **Flexible Apps. Shared Foundations.** Emphasizes reuse, but limits the phrase to apps.
- Keep the earlier phrase. It expresses the architectural separation, but no longer fits the project owner's preferred language.

## Consequences

The home page, project introduction, and [AI-Native Enterprise article](../foundations/ai-native-enterprise.md) use the new phrase. The architectural commitments remain the same.

Supporting explanations must cover shared meaning, authoritative state, identity, policy, and governance as well as capabilities.
