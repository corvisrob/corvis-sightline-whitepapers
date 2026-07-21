---
slug: prism-the-data-underneath
title: "Prism: the data underneath"
authors: [rob]
tags: [prism]
draft: true
---

Status: outline. Secondary paper - publish after the three core papers
have landed. May be folded into the overview instead if it doesn't carry
enough independent story on its own.

{/* truncate */}

## The problem

Frame the stale-import problem: an asset inventory built once at project
kickoff is accurate on day one and wrong within months.

## The concept

What Prism actually is: multi-source collection (cloud APIs, agents,
files), normalised schemas, point-in-time snapshots rather than
overwrites.

## How it works

Cover the tiered schema (base, specific, extended) and how sources with
very different shapes end up comparable.

## Why it matters

Make the argument plainly: Tetra, Bowtie and Metron are only as good as the
asset data feeding them, and this is what keeps that data current.

## Where it fits

Point back to [Metron](/blog/metron-proving-compliance) as the paper this
one supports from underneath.
