---
slug: tetra-modelling-the-architecture
title: "Tetra: modelling the architecture"
authors: [rob]
tags: [tetra]
draft: true
---

Status: outline. Paper 1 in the Sightline whitepaper series.

{/* truncate */}

## The problem

Frame the problem generically before Sightline enters the page: a Visio
export or a static diagram is accurate on the day it's drawn and wrong
soon after, because nothing forces it to track the architecture it claims
to describe.

## The concept

What Tetra actually is: zones, devices, networks, channels, flows and
information, modelled as plain YAML rather than a drawing. The diagram
renders from the model instead of being the model.

## How it works

Cover the zone-conduit vocabulary and its correspondence to ISA/IEC 62443,
without turning this into a user manual.

## Why it matters

Tie back to the Defensible Architecture and reference-architecture work
this vocabulary is already grounded in, and to why a version-controlled
model is a meaningfully different artefact from a drawing.

## Where it fits

Point back to the [overview](/blog/connected-model-overview) and forward to
[Bowtie](/blog/bowtie-from-architecture-to-risk).
