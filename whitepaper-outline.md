# Sightline Whitepaper Series — Structure Sketch

## Purpose

A short series introducing Sightline ahead of a fuller knowledge base. The
audience is OT cyber teams and asset owners evaluating how to run
architecture, risk and compliance work without three disconnected artefacts
(a Visio diagram, a risk spreadsheet, and a GRC tracker that all drift
independently), plus consultancies and prospective commercial licensees
assessing the tooling itself.

The series follows the product's own pipeline: model the architecture, ground
risk in that architecture, then prove compliance against it. That ordering
mirrors Sightline's internal module list (tetra → bowtie → metron) and gives
each paper a natural forward pointer to the next.

## Series arc

### 0. Overview — the connected model

- The problem: architecture, risk and compliance usually live in three tools
  that don't reference each other, so an update to one never reaches the
  others.
- The approach: one workspace, one set of linked models. Tetra owns the
  architecture, Bowtie owns the risk, Metron owns the compliance packages,
  and the three hold live references to each other rather than copies.
- Frames the reading order for the rest of the series and names the
  standards the later papers lean on (AESCSF, ISA/IEC 62443).

### 1. Tetra — modelling the architecture

- The zone/conduit architecture model: zones, devices, networks, channels,
  flows, data.
- Models are plain YAML, so the diagram is a rendering of the model rather
  than a one-off drawing that goes stale.
- Ties directly to the zone-conduit language already used in the Defensible
  Architecture and AusNet reference architecture work, which gives this
  paper an existing credibility anchor.
- Positions Tetra as the foundation the other two pillars bind to.

### 2. Bowtie — from architecture to risk

- Bow-tie methodology: causes, exposures, controls, consequences, the risk
  matrix.
- The distinction from a standalone risk spreadsheet: a cause or control can
  reference a real zone, device or flow from the bound Tetra model, so the
  register stays grounded in what's actually built rather than a
  point-in-time snapshot someone typed up once.

### 3. Metron — proving compliance

- Requirement packages bound to a Tetra model, assessed per
  requirement × entity, with evidence and a findings ledger.
- The payoff mechanism: an architectural rule runs against the live model,
  a match becomes a Finding, and a human promotes it into a Bowtie Cause or
  links it to a Control. This is the moment the series demonstrates the
  three pillars are one spine, not three tools bolted together.
- Natural home for AESCSF/ISA-62443 assessment framing.

### 4. Prism — the data underneath (secondary)

- Asset Intelligence: multi-source collection (cloud APIs, agents, files),
  normalised schemas, point-in-time snapshots.
- The argument: Tetra, Bowtie and Metron are only as good as the asset data
  feeding them, and Prism is what keeps that data current instead of a
  stale import done once at project kickoff.
- Optional as a standalone paper; could instead be folded into the overview
  as a shorter section if it doesn't carry enough independent story.

### 5. Standards alignment note (secondary, reference-style)

- A shorter, more reference-style piece mapping Sightline's model onto
  AESCSF and ISA/IEC 62443 directly, reusing the Standards & Framework
  Alignment structure from the existing reference architecture documents.
- Functions as a credibility/sales artefact for utilities and OT operators
  evaluating the tooling against a framework they already report against.

## Per-paper section shape

A consistent light structure keeps the series recognisable without turning
each paper into a full reference architecture document:

1. The problem, framed generically before Sightline enters the page
2. The concept: what Tetra/Bowtie/Metron/Prism actually is
3. How it works, mechanically, without becoming a user manual
4. Why it matters, including standards alignment where relevant
5. Where it fits in the series, pointing forward and back

## Sequencing recommendation

Publish the overview first, then Tetra, Bowtie, Metron in that order, since
it mirrors both the natural pipeline and the product's own module ordering.
Prism and the standards-alignment note land after, as deepening content once
the core three are live.
