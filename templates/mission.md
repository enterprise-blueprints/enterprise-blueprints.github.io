---
# Copy to _missions/<slug>.md. The id must be "mission." + the filename.
id: mission.example
title: Example Mission
summary: An outcome-oriented sentence about what the mission achieves.
status: draft               # planned | draft | published
domains: [cross-cutting]    # keys from _data/domains.yml

outcomes:
  - A short sentence describing one outcome.

lifecycle_note: Optional. Explains that the stages are illustrative.
lifecycle:
  - id: first-stage         # lowercase words joined by hyphens
    title: First stage
    summary: What happens in this stage.

roles:
  - name: Example role
    description: What this role does in the mission.

# Experiences someone could build for this mission. Suggestions, not building blocks.
experience_ideas:
  - title: Example experience
    description: What it would let people or agents do.

# Each component references a building block by ID.
# `purpose` says what the block does in THIS mission. `stage` is optional.
# List a block twice only when it plays a different part at different stages.
components:
  - ref: capability.document-management
    purpose: What this block does for this mission.
    stage: first-stage
---

## Overview

Context for the mission, and why its architecture matters.

## Design notes

- Mission-specific architectural guidance.
