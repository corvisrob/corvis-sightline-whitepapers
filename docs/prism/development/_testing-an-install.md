The installer reads `sightline-prism-latest.tar.gz` from its own directory and
nothing else. There is no build-from-source mode, so to exercise an installer change
you build an archive first.

## The short way

`scripts/release.sh --dry-run` assembles the archive and lands nothing. It prints
the staging path it used.

## Building one by hand

```bash
# 1. pack the workspaces, and the CLI from its sibling checkout
TARS=$(mktemp -d)
npm pack --workspaces --pack-destination "$TARS"
(cd ../sightline-prism-cli && npm run build && npm pack --pack-destination "$TARS")

# 2. lay out the archive tree
STAGE=$(mktemp -d)
node scripts/assemble-bundle.mjs "$STAGE" "$PWD/install" \
  "$TARS"/sightline-prism-connector-*.tgz "$TARS"/sightline-prism-cli-*.tgz

# 3. pack it, then install from it
tar -czf "$STAGE/sightline-prism-latest.tar.gz" -C "$STAGE" sightline-prism
cp install/install.mjs "$STAGE/"
(cd "$STAGE" && node install.mjs --dir ./test-instance --role central --connectors crowdstrike)
```

`scripts/assemble-bundle.mjs` is a closed allowlist. The archive root gets the three
installer and helper files and nothing else. `packages/` gets exactly the tarballs
you name, and `scripts/__tests__/assemble-bundle.test.ts` holds that contract.

**`--archive` points the installer at a different archive**, so you can keep several
and switch between them without renaming anything.

## Running a collector from a checkout

An operator runs a collector from a runtime instance. In a checkout the commands
differ: use the npm scripts, and pass the instance after `--`.

```bash
npm run collect:crowdstrike -- prod
```

**The two forms are not interchangeable.** The instance form is what an operator
runs. This form is for development, and it resolves its data directory against the
checkout rather than against an instance.

## Where to go next

| Question | Document |
|---|---|
| What does the installer do? | [Installing Standalone Prism](/docs/prism/install/prism) |
| Why must commands run from an instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| How is a release cut? | [Cutting a release](/docs/prism/development/releasing) |
