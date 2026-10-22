---
id: capability.notification
type: capability
title: Notification
summary: Deliver approved messages to people through their preferred channels, and report whether each one was delivered.
status: planned
scope: shared
domain: cross-cutting
relationships:
- type: depends_on
  target: capability.person-information
operations:
- id: send
  title: Send
  description: Send an approved message to a recipient.
  takes:
  - recipient
  - approved message
  - delivery preference
  returns:
  - delivery ID
- id: get-status
  title: Get status
  description: Report whether a message was delivered, opened, or failed.
  takes:
  - delivery ID
  returns:
  - delivery status
---


