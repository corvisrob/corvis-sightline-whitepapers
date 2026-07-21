---
sidebar_position: 1
title: What is Bowtie?
---

# What is Bowtie?

Bowtie is Sightline's risk modelling pillar. It uses the bow-tie method: a
central risk event sits between its causes on one side and its consequences
on the other, with controls placed along each path to prevent a cause from
occurring or to limit a consequence once it has.

## Grounded in the architecture, not a spreadsheet

The usual failure mode for a risk register is that it's written once, as
free text, and nothing forces it to stay aligned with the architecture it's
describing. A Bowtie cause, exposure or control can instead reference a real
zone, device or flow from a bound [Tetra](../tetra/index.md) model, so the register
describes what's actually built rather than a description of it from
whenever it was last updated.

## Causes, controls and consequences

- **Causes** are the conditions or events that could trigger the risk.
- **Controls** sit on the cause side (preventive) or the consequence side
  (mitigating), and describe what stands between a cause and an outcome.
- **Consequences** describe what happens if a cause isn't stopped.
- The **risk matrix** rolls these up into a consistent view of exposure
  across an environment.

## Where findings become causes

Bowtie's other source of causes is [Metron](../metron/index.md): when an
architectural rule fires against the live Tetra model, it produces a
Finding, and promoting that Finding creates a Bowtie Cause (or links it to
an existing Control) without anyone re-typing what the finding already
said. That link is what turns a one-off compliance check into a standing
risk register entry.

## Where it fits

Read [Tetra](../tetra/index.md) first if you haven't, since Bowtie entries are most
useful when they reference a real architecture model. Then see
[Metron](../metron/index.md) for how compliance findings feed back into this
register.
