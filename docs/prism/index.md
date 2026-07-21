---
sidebar_position: 1
title: What is Prism?
---

# What is Prism?

Prism is Sightline's asset intelligence layer. It collects asset data from
cloud APIs, on-prem agents and files, normalises it into a consistent
schema, and stores point-in-time snapshots rather than overwriting what came
before.

## Why this sits underneath the other three pillars

[Tetra](../tetra/index.md), [Bowtie](../bowtie/index.md) and [Metron](../metron/index.md) are only
as accurate as the asset data behind them. A model built from a one-off
import at project kickoff is accurate on day one and wrong by month three.
Prism keeps that data current by collecting from multiple sources on an
ongoing basis and reconciling them, rather than treating the initial import
as the last word.

## Multi-source collection and normalisation

Sources range from cloud provider APIs and endpoint security tools through
to Active Directory, IT service management data and plain spreadsheets.
Each source is normalised into a tiered schema, base fields common to every
asset, more specific fields for a given asset type, and a flexible
vendor-specific area for anything that doesn't fit the common schema, so
data from very different sources can still be compared and merged
consistently.

## Where it fits

Prism is the data foundation the other three pillars draw on. It doesn't
have a page-by-page workflow of its own the way Tetra, Bowtie and Metron
do; instead, its job is making sure those three are working from current,
reconciled asset data.
