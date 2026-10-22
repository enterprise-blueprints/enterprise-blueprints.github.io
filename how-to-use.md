---
title: How to Use Enterprise Blueprints
permalink: /architecture/how-to-use/
kicker: The Architecture
summary: Start from what a mission needs to achieve, follow the links down to reusable building blocks, and carry the result into a design you can build.
---

Enterprise Blueprints is meant to be walked through, not read cover to cover. The usual path runs from a mission's outcomes, through the processes and capabilities that achieve them, to the information and governance underneath, and finally to an implementation. Every step is a link, so you can stop at whatever depth you need.

The example below follows one thread through the {% include ref.html id="mission.investigations" text="Investigations" %} blueprint, from wrongdoing being addressed down to how each concern is triaged.

## 1. Start with the mission's outcomes

A Mission Blueprint describes outcomes at two levels:

- **Mission outcomes** are the public value the agency creates, such as [Wrongdoing is addressed]({{ '/missions/investigations/#outcome-wrongdoing-addressed' | relative_url }}). They change rarely. Each one comes with example indicators, such as funds recovered, for the agency to choose from.
- **Operational outcomes** describe how well the work performs, and each one serves a mission outcome. Under "Wrongdoing is addressed", [timely triage]({{ '/missions/investigations/#operational-timely-triage' | relative_url }}) is measured by *Time to accept*. It's supported by the Triage step of the investigation process, and by Case Management's *Accept* and *Screen out* operations.

Outcomes are where to agree on priorities with the people who run the mission, before anyone talks about systems. The outcomes a particular system or project sets out to change belong to that project. They link up to these, but they aren't part of the library.

## 2. Follow the outcome to the process

A process shows how the work actually happens: its steps, who leads each one, the decisions made along the way, and who is accountable for them. The {% include ref.html id="process.investigation-lifecycle" %} process shows the [Triage step]({{ '/blocks/process-investigation-lifecycle/#step-triage' | relative_url }}), where a supervisor decides whether to accept or screen out each concern and records why. A screened-out concern stays on record.

The mission page doesn't repeat any of this. It links to the process, which is defined once and can serve more than one mission.

## 3. Find the capabilities the work relies on

Each process step names the capabilities it uses. A capability is something the organization can reliably do, described by its operations: what each one does, what it takes and returns, the states it moves between, the events it announces, and who may perform it, including whether an AI agent may.

{% include ref.html id="capability.case-management" %} defines [Accept]({{ '/blocks/capability-case-management/#op-accept' | relative_url }}) and [Screen out]({{ '/blocks/capability-case-management/#op-screen-out' | relative_url }}). It also defines the [Time to accept]({{ '/blocks/capability-case-management/#measure-time-to-accept' | relative_url }}) measure, which the mission's outcome references rather than copying.

This is the layer most worth sharing. When every experience records and accepts cases through the same operations, the case record stays consistent however the work arrives.

## 4. Check the information and the governance

A capability manages entities, such as {% include ref.html id="entity.case" %}, which describe the data itself and nothing about how it's used. Policies and controls sit alongside everything: {% include ref.html id="policy.restricted-case-access" %} states the obligations, and {% include ref.html id="control.case-authorization-check" %} enforces them on every request. A policy page shows which obligations have a control behind them and which don't yet.

## 5. Shape experiences and apply patterns

Experiences are how people and agents reach the processes and capabilities, such as the {% include ref.html id="experience.investigator-workspace" %}. They're described by who uses them and what they need, so they can change quickly without changing the foundation underneath. Patterns such as {% include ref.html id="pattern.human-in-the-loop-review" %} give reusable guidance for arranging the pieces, here for keeping an accountable person in charge of decisions an agent suggests.

## 6. Carry it into an implementation

Everything so far is logical architecture. It says what the enterprise needs, not which product provides it. When you build, a capability's operations become the contract a service or API has to honor, its events become messages, and its policies become access rules. [Implementation Guides]({{ '/implementations/' | relative_url }}) describe how a particular technology realizes a building block, without changing the block itself.

## Starting from a building block instead

You can also work the other way. Every building block page lists the missions that use it. Some list the block **directly**, with the part it plays there. Others use it **indirectly**, through another block that depends on it. For example, {% include ref.html id="entity.document" %} is used indirectly by both missions, through Document Management. That's a quick way to see what a change to a shared block would affect.

## Adding to the library

You can start anywhere: an outcome, a process, a capability, or a placeholder. A planned block with nothing but a summary is already enough to link to, and to show where the library has gaps. The [vocabulary]({{ '/architecture/vocabulary/' | relative_url }}) lists the block types and relationships, and the repository README explains how to add content.
