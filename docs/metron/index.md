---
sidebar_position: 1
title: What is Metron?
---

# What is Metron?

Metron is Sightline's compliance pillar. It binds a requirement package,
such as an AESCSF or ISA/IEC 62443 control set, to a [Tetra](../tetra/index.md)
architecture model, and assesses each requirement against each relevant
entity in that model.

## Requirement packages and bindings

A Metron package defines the requirements to assess. Binding that package to
a Tetra model produces a worklist of requirement-by-entity pairs, each
carrying its own outcome, evidence and notes. An outcome stays editable
until it's marked complete, and if the requirement or the entity it was
assessed against changes afterwards, Metron flags it as needing
revalidation rather than silently treating a stale assessment as still
current.

## Architectural rules and findings

Metron can also define architectural rules that run directly against the
bound Tetra model: a rule expressed as a query over the architecture, such
as flagging every cross-zone connection that lacks a specific control. When
a rule matches, it produces a Finding.

## Closing the loop back to risk

A Finding on its own is a compliance artefact. What makes it more than that
is the promote step: a person can promote a Finding into a
[Bowtie](../bowtie/index.md) Cause, or link it to an existing Control, and that link
is recorded permanently even if the underlying architecture later changes.
This is the mechanism that ties all three pillars into one spine: an
architectural condition in Tetra becomes a compliance Finding in Metron,
and a promoted Finding becomes a standing risk register entry in Bowtie.

## Where it fits

Metron assumes a bound [Tetra](../tetra/index.md) model and feeds
[Bowtie](../bowtie/index.md) through the Finding-to-Cause promotion path covered
above. See [Standards & framework alignment](../standards-alignment.md) for
how Metron's requirement packages map onto specific frameworks.
