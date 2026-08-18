Prism CLI is the operator console. You run syncs from it, review changesets in it, and manage rules through it.

It is a separate repository, `sightline-prism-cli`, and it depends on Prism in a way that is unusual for a package. Read the next section before you try to build it from source.

## Installing a release needs nothing beside it

The published tarball is self-contained. The build compiles the sync engine, the connector SDK and the shared review logic **into** each command, so installing a release pulls only ordinary published packages and needs no Prism checkout anywhere on the machine.

The rest of this section is about building the CLI from source, which is a different matter.

## The two-checkout requirement, when building from source

**Prism CLI does not build on its own.** It consumes the sync engine, the connector SDK and the shared review logic from a Prism checkout **beside it**, as file dependencies rather than as published packages.

The layout must be two siblings under a shared parent:

```
your-parent-directory/
├── sightline-prism/          the engine, the SDK, the connectors
└── sightline-prism-cli/      this
```

And the order is not optional. **The sibling must install and build first.** The file dependencies resolve through each package's exports map to its compiled output, so a sibling that has not been built has nothing to resolve to.

### The failure you will hit if you get the order wrong

An unbuilt sibling does not produce a message telling you to build the sibling. It produces **module-not-found errors** naming packages you can see on disk.

That is worth knowing in advance, because the error sends you looking in the wrong place. If Prism CLI cannot find `@sightline/prism-engine`, `@sightline/prism-connector-sdk` or `@sightline/prism-review-core`, the sibling is unbuilt far more often than anything is genuinely missing.

The same rule applies to what a build *produces*, not just whether it succeeds: those packages resolve to their compiled output, so a stale sibling build yields a CLI that runs stale engine code without complaint.

The installation procedure is in [Installing the CLI](/docs/prism/install/cli). This document covers why the requirement exists, not the commands.

## What installing it gives you

Five entry points.

| Entry point | What it does |
|---|---|
| `prism-sync` | Runs a sync rule |
| `prism-review` | Opens the review TUI |
| `prism-drain` | Drains pending write-backs at the edge |
| `prism-seed-tables` | Seeds table definitions |
| `prism-migrate-rules` | Migrates rules into storage |

## The review TUI

`prism-review` is the operator console proper. It is a terminal interface, and it covers six operations: reviewing pending changes, browsing changesets, browsing a dataset's records, re-running a rule, managing deferrals, and managing rules.

**The review TUI and the Windmill review app mirror each other, entry for entry.** The same six operations, the same decisions, the same effects. One runs in a terminal, the other in a browser.

Choose by where the operator is, not by capability. An operator on a jump host uses the TUI. An operator who needs to hand a review to someone without shell access uses the review app.

The procedures for both are in the usage documentation, written once and referenced from both: [Reviewing changesets](/docs/prism/usage/review-changesets).

## Where it runs

Prism CLI runs from a **runtime instance**, not from its code checkout. It reads that instance's environment and data, exactly as a collector does.

One consequence matters for write-back: `prism-drain` must run somewhere the source system is reachable. That is often not the same machine that runs the sync. See [Sync engine](/docs/prism/architecture/sync-engine) for why the work is split that way.

## Distribution

Prism CLI is private. It is not published to a public registry, and it is distributed as a versioned archive attached to a release.

## Where to go next

| Question | Document |
|---|---|
| How do I install it? | [Installing the CLI](/docs/prism/install/cli) |
| How do I upgrade it? | [Upgrading the CLI](/docs/prism/upgrade/cli) |
| How do I review a changeset? | [Reviewing changesets](/docs/prism/usage/review-changesets) |
| What is the browser equivalent? | [Windmill layer](/docs/prism/architecture/windmill) |
