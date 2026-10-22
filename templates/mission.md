---
# Copy to _missions/<slug>.md. The id must be "mission." + the filename.
id: mission.example
title: Example Mission
summary: An outcome-oriented sentence about what the mission achieves.
status: draft               # planned | draft | published
domains: [cross-cutting]    # keys from _data/domains.yml

# Mission outcomes: the public value the agency creates. Not what one system
# or project will change; those belong to the project.
outcomes:
  - id: public-value
    title: A short name for the outcome
    statement: One sentence on the public value the work creates.
    indicators:                # optional examples; each agency chooses its own
      - name: An indicator
        description: What it shows.

# Operational outcomes: how well the work performs. Each serves a mission
# outcome. References are "block.id" or "block.id#item": a measure on the
# block, a process's step, or a capability's operation.
operational_outcomes:
  - id: timely-response
    statement: A short sentence about how well the work performs.
    contributes_to: [public-value]                              # mission outcome ids
    measures: [capability.case-management#time-to-accept]       # optional
    supported_by: [capability.case-management#accept]           # optional

lifecycle_note: Optional. Explains that the stages are illustrative.
lifecycle:
  - id: first-stage         # lowercase words joined by hyphens
    title: First stage
    summary: What happens in this stage.

roles:
  - id: example-role        # optional; lets a mission effectiveness model refer to the role
    name: Example role
    description: What this role does in the mission.
    concerns: What they care about most.   # optional
    influence: medium       # optional: high | medium | low

# Systems organizations doing this work usually have today. Optional.
typical_systems:
  - id: case-system
    name: Case management system
    kind: service
    description: What it does today.
    provides: [capability.case-management]

# A mission effectiveness model, with the conditions and behaviors behind the outcomes,
# goes in _data/mission_models/<this file's name>.yml. See the README.

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
