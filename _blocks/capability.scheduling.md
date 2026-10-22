---
id: capability.scheduling
type: capability
title: Scheduling
summary: Find availability and book, change, and cancel appointments between staff, the public, and partners.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.notification
operations:
- id: find-availability
  title: Find availability
  description: Find times when the required people and resources are free.
  takes:
  - participants
  - duration
  - time window
  returns:
  - available times
- id: book
  title: Book
  description: Book an appointment and invite the participants.
  takes:
  - participants
  - time
  - purpose
  - location or channel
  returns:
  - appointment ID
- id: change
  title: Change
  description: Move or cancel an appointment and tell the participants.
  takes:
  - appointment ID
  - change
  returns:
  - updated appointment
---


