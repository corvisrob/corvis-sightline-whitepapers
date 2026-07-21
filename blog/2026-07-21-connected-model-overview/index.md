---
slug: connected-model-overview
title: "The connected model: why architecture, risk and compliance shouldn't live apart"
authors: [rob]
tags: [overview]
draft: true
---

Status: outline. This is paper 0 in the Sightline whitepaper series - the
overview that frames the three papers after it.

{/* truncate */}

## The problem

Write the case for why architecture diagrams, risk registers and compliance
trackers usually drift apart: each is maintained by a different process, on
a different cadence, and nothing forces an update in one to reach the
others.

## The concept

Introduce Sightline's approach: one workspace, one set of linked models.
Tetra owns the architecture, Bowtie owns the risk, Metron owns the
compliance packages, and the three hold live references to each other
rather than copies.

## How it works

A short walkthrough of the reference shape: a Bowtie cause can point at a
real Tetra zone or device; a Metron requirement package binds to a Tetra
model; a Metron Finding can be promoted into a Bowtie Cause. Save the detail
for the three papers that follow.

## Why it matters

Name the standards this series leans on (AESCSF, ISA/IEC 62443) and the
audience: OT cyber teams, asset owners, and consultancies evaluating the
tooling.

## Where it fits

Point forward to the next paper: [Tetra](/blog/tetra-modelling-the-architecture).
