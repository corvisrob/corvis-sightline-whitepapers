**No other part of the product needs this.** The CLI needs two checkouts, side by
side, built in a set order.

Read this page before you build it. Nearly every failure in that build traces back
to the layout or the order, and the errors name neither.

**Installing a release needs none of it.** The published CLI carries its own copy of
the engine. Its build compiles the sync engine, the connector SDK and the shared
review logic into each of the five entry points. An installed copy reaches no
registry and needs no source on the machine.

The two-checkout requirement is a property of the build, not of the install.

## The layout

The CLI consumes the sync engine, the connector SDK and the shared review logic from
a `sightline-prism` checkout **beside it**. They are file dependencies, not
published packages.

The two must be siblings under a shared parent:

```
your-parent-directory/
├── sightline-prism/          the engine, the SDK, the connectors
└── sightline-prism-cli/      the CLI
```

## The order is not optional

Install and build the sibling first. Then install the CLI.

```bash
cd sightline-prism
npm install
npm run build

cd ../sightline-prism-cli
npm install
```

The file dependencies resolve through each package's exports map to its compiled
output. A sibling that is not built has nothing to resolve to. The second command
set reads the first one's output, so it cannot run first.

## What the wrong order looks like

An unbuilt sibling does not tell you to build the sibling. It produces
**module-not-found errors** naming packages you can see on disk:

- `@sightline/prism-engine`
- `@sightline/prism-connector-sdk`
- `@sightline/prism-review-core`

The error sends you to look for a missing dependency, and the dependency is not
missing. When the CLI cannot find any of those three, the sibling is unbuilt far
more often than anything is genuinely absent. Go back to the sibling, run
`npm run build`, then install the CLI again.

## The quieter version: a stale sibling

A **stale** build is the same problem without the error. The build inlines the
sibling's compiled output, so an out-of-date build is compiled into the tarball with
nothing to show for it.

The build guards against this. It stops when a sibling has no build at all, and it
warns when a sibling's source is newer than its build. **Read those warnings.** They
are the only signal that the engine you compiled in is not the engine you checked
out.

## Where to go next

| Question | Document |
|---|---|
| What is the CLI? | [The operator CLI](/docs/prism/architecture/cli) |
| How does an operator install it? | [Installing the operator CLI](/docs/prism/install/cli) |
| Which versions pair? | [Version compatibility](/docs/prism/upgrade/compatibility) |
