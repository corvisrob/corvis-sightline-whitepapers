Building the operator CLI has one requirement that no other Sightline Prism component has: **two code checkouts, side by side, installed in a set order**.

Read this page from the top. Nearly every failure in this install traces back to the layout or the order, and the errors they produce do not name either one.

Read [Prerequisites](/docs/prism/install/prerequisites) before you start.

## Installing a release needs no second checkout

The build compiles the engine, the connector SDK and the shared review logic **into** each of the five entry points, so the published tarball is self-contained. Installing it pulls ordinary published packages and needs no `sightline-prism` checkout anywhere on the machine.

Everything below is about building the CLI from source, which is a different matter.

## The two-checkout requirement, when building from source

The CLI consumes the sync engine, the connector SDK and the shared review logic from a `sightline-prism` checkout **beside it**, as file dependencies rather than as published packages.

The layout must be two siblings under a shared parent:

```
your-parent-directory/
├── sightline-prism/          the engine and the SDK
└── sightline-prism-cli/      the CLI
```

The file dependencies resolve through each package's exports map to its compiled output. A sibling that is not built has nothing to resolve to.

## The install order

**Install and build the sibling first. Then install the CLI.**

```bash
cd sightline-prism
npm install
npm run build

cd ../sightline-prism-cli
npm install
```

That order is not a convention. The second command set reads the first one's compiled output, so it cannot run first.

### What the wrong order looks like

An unbuilt sibling does not produce a message that tells you to build the sibling. It produces **module-not-found errors** that name packages you can see on disk:

- `@sightline/prism-engine`
- `@sightline/prism-connector-sdk`
- `@sightline/prism-review-core`

The error sends you to look for a missing dependency, and the dependency is not missing. When the CLI cannot find any of those packages, the sibling is unbuilt far more often than anything is genuinely absent.

Go back to the sibling, run `npm run build`, then install the CLI again.

A **stale** sibling build is the quieter version of the same problem: because the build inlines the sibling's compiled output, out-of-date output would be baked into the tarball with nothing to show for it. The build guards against that — it stops when a sibling has no build at all, and warns loudly when a sibling's source is newer than its build.

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

Confirm that all five entry points resolve. Each one maps to a compiled file, so list those five files.

```bash
cd sightline-prism-cli
ls dist/review-changesets.js \
   dist/scripts/run-sync.js \
   dist/scripts/drain-writebacks.js \
   dist/scripts/seed-tables.js \
   dist/scripts/migrate-rules-to-storage.js
```

**Expected output.** The five paths, each listed once. A "No such file or directory" error on any of them means the build did not complete.

Then confirm the CLI runs:

```bash
npm run typecheck
```

**Expected output.** No output, and an exit status of zero. Any module-not-found error naming `@sightline/prism-engine`, `@sightline/prism-connector-sdk` or `@sightline/prism-review-core` means the sibling is not built.

## Installing the CLI into a runtime instance

The steps above build the CLI in its own checkout. To operate a node, install the CLI into a [runtime instance](/docs/prism/install/runtime-instance) instead.

The Prism installer does this for you:

```bash
cd sightline-prism
./install/install.sh --dir ../acme-central --role central --connectors spreadsheet
```

`--role central` packs the CLI from the sibling checkout and installs it into the instance. The sibling must already have run `npm install`, and the installer stops with the path it expected when it has not.

Verify the result from inside the instance:

```bash
cd ../acme-central
ls node_modules/.bin/
```

**Expected output.** The five entry points listed above, plus one `prism-collect-<connector>` entry for each connector you installed.

The full procedure is in [Installing Prism](/docs/prism/install/prism).

## Where it runs

The CLI runs from a runtime instance, not from its code checkout. It reads that instance's environment and data, exactly as a collector does.

One consequence matters for write-back: `prism-drain` must run somewhere the source system is reachable. That is often not the machine that runs the sync.

## Where to go next

| Question | Document |
|---|---|
| Why does building the CLI need two checkouts? | [Operator CLI](/docs/prism/architecture/cli) |
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| How do I install Prism itself? | [Installing Prism](/docs/prism/install/prism) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
