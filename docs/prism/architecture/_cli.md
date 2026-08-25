The operator CLI is the terminal interface to Prism. You run syncs from it, review changesets in it, and manage rules through it.

It is one of the two interfaces to a single product. The other is the review app, in a browser. Neither is a product of its own, and the two mirror each other entry for entry. [Architecture overview](/docs/prism/architecture/overview) covers the two hostings and how to choose between them.

## It arrives with Standalone Prism

The installer puts the CLI in a runtime instance when you pass `--role central` or `--role both`. There is nothing separate to obtain.

The CLI carries its own copy of the engine. Its build compiles the sync engine, the connector SDK and the shared review logic **into** each of the five commands. An installed copy therefore reaches no registry, and it needs no source on the machine. [Installing the CLI](/docs/prism/install/cli) covers the procedure.

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

`prism-review` is the operator console proper. It is a terminal interface, and it covers the same six operations:

- Review pending changes
- Browse changesets
- Browse a dataset's records
- Re-run a rule
- Manage deferrals
- Manage rules


**The review TUI and the review app mirror each other on all six.** The same operations, the same decisions, the same effects. One runs in a terminal, the other in a browser. The review app adds two entries the terminal has no equivalent for, because they exist to cover a source whose connector cannot run.

Choose by where the operator is, not by capability. An operator on a jump host uses the TUI. An operator who needs to hand a review to someone without shell access uses the review app.

The procedures for both are in the usage documentation, written once and referenced from both: [Reviewing changesets](/docs/prism/usage/review-changesets).

## Where it runs

The operator CLI runs from a **runtime instance**, not from the directory you installed from. It reads that instance's environment and data, exactly as a collector does.

One consequence matters for write-back: `prism-drain` must run somewhere the source system is reachable. That is often not the same machine that runs the sync. See [Sync engine](/docs/prism/architecture/sync-engine) for why the work is split that way.

## Distribution

The operator CLI is private. It reaches no public registry. It travels inside the Standalone Prism install bundle, and the installer selects it when the node needs it.

## Where to go next

| Question | Document |
|---|---|
| How do I install it? | [Installing the CLI](/docs/prism/install/cli) |
| How do I upgrade it? | [Upgrading the CLI](/docs/prism/upgrade/cli) |
| How do I review a changeset? | [Reviewing changesets](/docs/prism/usage/review-changesets) |
| What is the browser equivalent? | [Windmill-hosted Prism](/docs/prism/architecture/windmill) |
