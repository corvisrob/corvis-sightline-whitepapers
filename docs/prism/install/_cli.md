**There is no separate CLI install.** The operator CLI travels inside the Standalone Prism archive. The installer selects it when you ask for a node that needs it.

This page covers what you get, and how to confirm you got it. [Installing Standalone Prism](/docs/prism/install/prism) covers the procedure.

Read [Prerequisites](/docs/prism/install/prerequisites) before you start.

## How to get it

Pass `--role central` or `--role both` to the installer.

```bash
node install.mjs --dir ../acme-central --role central --connectors spreadsheet
```

`--role collector` does not install the CLI. A collector node does not run syncs, so it does not need one.

The CLI carries its own copy of the engine. Its build compiles the sync engine, the connector SDK and the shared review logic into each command. The install therefore reaches no registry, and it puts no source on the machine.

## What the install produces

Five entry points.

| Entry point | What it does |
|---|---|
| `prism-sync` | Runs a sync rule |
| `prism-review` | Opens the review TUI |
| `prism-drain` | Drains pending write-backs |
| `prism-seed-tables` | Seeds table definitions |
| `prism-migrate-rules` | Migrates rules into storage |

## Verify the install

Change into the runtime instance, then list its entry points.

```bash
cd ../acme-central
ls node_modules/.bin/
```

**Expected output.** The five entry points above, plus one `prism-collect-<connector>` entry for each connector you installed.

If none of the five appears, the node was installed as a collector. Re-run the installer against the same directory with `--role central`.

## Where it runs

The CLI runs from a runtime instance, not from the directory the installer ran in. It reads that instance's environment and data, exactly as a collector does.

One consequence matters for write-back: `prism-drain` must run somewhere the source system is reachable. That is often not the machine that runs the sync.

## Where to go next

| Question | Document |
|---|---|
| How do I install Prism? | [Installing Standalone Prism](/docs/prism/install/prism) |
| What is the operator CLI? | [The operator CLI](/docs/prism/architecture/cli) |
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
