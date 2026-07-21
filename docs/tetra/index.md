---
sidebar_position: 1
title: What is Tetra?
---

# What is Tetra?

Tetra is Sightline's architecture modelling pillar. It represents an OT or
industrial environment as zones, devices, networks, channels, flows and
information, and renders that model as an interactive block diagram.

## The model is the diagram

A Tetra model is stored as plain YAML on disk, not as a proprietary drawing
file. The diagram is a rendering of that model, so it stays accurate as the
model changes instead of drifting the way a hand-drawn Visio export does the
moment someone changes a firewall rule or adds a device. Because the model
is plain text, it lives in version control alongside everything else in a
project, and changes to it show up as a reviewable diff.

## Zones and conduits

Tetra's core vocabulary lines up with the zone-conduit language used in
ISA/IEC 62443 and in defensible-architecture practice more broadly: assets
are grouped into zones, and the conduits between them carry the channels and
flows that a security boundary needs to control. That shared vocabulary is
deliberate, since it means a Tetra model can be read directly against the
same standards an OT security programme is already reporting to.

## What binds to a Tetra model

A Tetra model isn't just a diagram; it's the foundation the other two
pillars bind to:

- A **[Bowtie](../bowtie/index.md)** cause or control can reference a specific zone,
  device or flow, so a risk entry is grounded in something that actually
  exists in the architecture.
- A **[Metron](../metron/index.md)** requirement package binds to a Tetra model to
  assess compliance per requirement and entity, and its rule engine runs
  directly against the live model to surface findings.

## Where it fits

Tetra is the starting point for the other two pillars: read this page first,
then [Bowtie](../bowtie/index.md) for how risk grounds itself in the architecture,
and [Metron](../metron/index.md) for how compliance is assessed against it.
