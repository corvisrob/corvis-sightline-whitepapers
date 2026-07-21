---
slug: metron-proving-compliance
title: "Metron: proving compliance"
authors: [rob]
tags: [metron]
draft: true
---

Status: outline. Paper 3 in the Sightline whitepaper series - the payoff
paper that ties the other two together.

{/* truncate */}

## The problem

Frame the disconnected GRC-tool problem: a compliance tracker that doesn't
reference the actual architecture or the actual risk register produces
assessments nobody trusts by the second audit cycle.

## The concept

What Metron actually is: requirement packages bound to a Tetra model,
assessed per requirement and entity, with an architectural rule engine that
runs against the live model.

## How it works

This is the section to spend the most space on: an architectural rule runs
against the bound Tetra model, a match becomes a Finding, and a person
promotes the Finding into a Bowtie Cause or links it to an existing
Control. Make the point explicitly that this is what makes the three
pillars one spine instead of three separate tools.

## Why it matters

Ground this in AESCSF/ISA-62443 assessment framing, since this is the paper
most likely to be read by someone evaluating the tooling against a
framework they already report against.

## Where it fits

Point back to [Bowtie](/blog/bowtie-from-architecture-to-risk). This is the
last of the three core papers; point forward to Prism and the standards
alignment note as secondary reading once these three have landed.
