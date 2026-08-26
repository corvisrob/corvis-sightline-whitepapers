The installer reads one archive from its own directory and nothing else. There is
no build-from-source mode, so to exercise an installer change you build an archive
first.

The archive is built by `sightline-prism-cli`, not by this repository. This one is
the library it packs.

## Build one, then install from it

```bash
(cd ../sightline-prism-cli && npm run build:release --allow-dirty)
```

That lands `prism-standalone-<version>.tgz` and `install.mjs` together in
`../sightline-prism-cli/dist/releases/<version>/`. Install from there:

```bash
cd ../sightline-prism-cli/dist/releases/<version>
node install.mjs --dir ./test-instance --role central --connectors crowdstrike
```

`--allow-dirty` is what lets a test build run against a working tree. It stamps
`dirty: true` into the archive's `BUILD-INFO.json`, so a test build cannot later be
mistaken for a release.

## Choosing between archives

The installer installs the single archive it finds beside it. Keep two versions in
one directory and it stops and lists them, rather than guessing which you meant.

**`--archive <name>` names one explicitly**, so you can keep several and switch
between them without renaming anything.

`scripts/bundle.yaml` in `sightline-prism-cli` decides what the archive root
carries. `scripts/assemble-bundle.mjs` lays it out as a closed allowlist, so
`packages/` gets exactly the tarballs the build packed.
`scripts/__tests__/assemble-bundle.test.ts` holds that contract.

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
