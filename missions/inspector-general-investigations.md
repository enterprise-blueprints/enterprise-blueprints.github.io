---
id: "mission:inspector-general-investigations"
title: "Inspector General Investigations"
type: "mission"
status: "draft"
summary: "How conditions and behaviors in an Office of Inspector General's investigative work shape timely, thorough, and defensible investigations."
related:
  - "use-case:public-sector-case-management"
mission: "inspector-general-investigations"
---

# Inspector General Investigations

## Overview

An Office of Inspector General (OIG) investigates fraud, waste, abuse, and misconduct in the programs and operations of its agency. Investigations start from complaints, hotline submissions, referrals, and the office's own analysis. They end in findings that support criminal, civil, or administrative action.

This mission model describes what shapes how well that work goes. It connects the conditions that enable or inhibit the work, the behaviors of investigators and supervisors, the operational outcomes those behaviors produce, and the mission outcomes the public cares about.

Use it in discovery to walk a customer through how their investigations operate today. Ask about each factor, and note whether it is a strength or a problem. The relationships then point to the biggest opportunities for improvement and to the outcomes and metrics worth committing to.

## How to read this model

Every relationship is a proposition to test with a customer, not an established fact about any agency. Most are marked as hypotheses. Evidence from real engagements, research, and performance data should strengthen, refine, or contradict them over time.

The model includes interventions of every kind. A technology solution can change some factors, such as visibility into stalled requests. Others, such as closure targets or staffing, depend on policy, process, and people. Those are out of scope for a technology solution, but they belong in the conversation.

The feedback loops matter most. The closure pressure loop suggests that pushing for more closed cases may grow the backlog, which is the opposite of what a closure target intends.

The model's data lives in [`_data/missions/inspector-general-investigations.yml`](https://github.com/enterprise-blueprints/enterprise-blueprints.github.io/blob/main/_data/missions/inspector-general-investigations.yml). Tools can read every mission model as JSON at [`/missions/index.json`](index.json). The rest of this page is generated from that data.

{% include mission-model.html mission=page.mission %}

## Related architecture

- [Public Sector Case Management](../use-cases/public-sector-case-management.md) introduces the case management process that investigations specialize.
