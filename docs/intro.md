---
sidebar_position: 1
slug: /
---

# Welcome to the Sightline Knowledge Base

Sightline is a connected modelling platform for OT and industrial cyber
security work. Instead of keeping architecture diagrams, risk registers and
compliance trackers as three disconnected artefacts, Sightline binds them
into one workspace of linked models, so a change in one place is visible
everywhere it matters.

## The three pillars

Sightline is organised around a natural pipeline: model the architecture,
ground risk in that architecture, then prove compliance against it.

- **[Tetra](./tetra/index.md)** models the architecture: zones, devices, networks,
  channels, flows and information, stored as plain YAML rather than a
  drawing that goes stale the day after it's exported.
- **[Bowtie](./bowtie/index.md)** models the risk: causes, exposures, controls and
  consequences, using the bow-tie methodology, with entries that can
  reference real elements of a bound Tetra model instead of living as free
  text in a spreadsheet.
- **[Metron](./metron/index.md)** proves compliance: requirement packages bound to a
  Tetra model, assessed per requirement and entity, with an architectural
  rule engine that can surface a Finding and let a person promote it
  straight into a Bowtie Cause or link it to an existing Control.

Underneath all three, **[Prism](./prism/index.md)** collects and normalises asset
data from cloud APIs, on-prem agents and files, so the models above are
working from current data rather than a one-off import done at project
kickoff.

## Where to go next

- New to Sightline? Start with [Tetra](./tetra/index.md), since Bowtie and Metron
  both build on a Tetra model.
- Evaluating Sightline against a specific framework? See
  [Standards & framework alignment](./standards-alignment.md).
- Looking for the longer-form arguments behind the product? See the
  [whitepaper series](/blog) for the "why", alongside this section's "how".
