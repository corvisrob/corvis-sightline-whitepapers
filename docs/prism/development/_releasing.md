Three artefacts come out of this project, and they are built three different ways.
One of the three pushes.

| Artefact | Built by | Pushes? |
|---|---|---|
| `prism-standalone-<version>.tgz` | `npm run build:release` in `sightline-prism-cli` | No |
| `prism-windmill-<version>.tgz` | `npm run build:release` in `sightline-prism-windmill` | No |
| The public source mirror and its GitHub Release | `scripts/release.sh` in this repo | Yes |

## The two install archives

Each archive is built by its own repository, from a manifest in that repository.

```bash
(cd ../sightline-prism-cli      && npm run build:release)
(cd ../sightline-prism-windmill && npm run build:release)
```

Each lands a versioned directory under `dist/releases/<version>/`, holding the
archive and the installer that reads it. `dist/` is gitignored, so the directory is
a build output. Nothing is committed, tagged or pushed, and you take the directory
to wherever you distribute from.

Both builds need a sibling `sightline-prism` checkout. This repository is the
library: the CLI packs its workspaces, and the Windmill build compiles its engine
into `vendor/`.

### What ships is a manifest, not a script

`scripts/bundle.yaml` in each repository names what the archive carries, as globs.
To change what ships, change that file. `keep` wins over `exclude`, which wins over
`include`, which is how `.env.example` survives a blanket exclusion of `.env.*`.

The bundler and the manifest both sit in `scripts/`, which the manifest excludes.
Build tooling has no place in a customer's archive.

### A release must come from a commit

Both builds stop when any input repository has uncommitted changes. `--allow-dirty`
builds anyway and records the fact, so a development build is never mistaken later
for a clean one.

Every archive carries `BUILD-INFO.json` at its root. It holds the version, the
build time, and for each input repository the remote, the `HEAD` and whether that
tree was dirty. Read it without unpacking:

```bash
tar -xzOf prism-standalone-<version>.tgz sightline-prism/BUILD-INFO.json
```

That is the path from an archive in the field back to the source behind it.

## The public source mirror

`scripts/release.sh` mirrors the public packages to `sightline-public/prism` and
creates the GitHub Release.

⛔ **This script pushes.** Past the `--dry-run` gate it pushes the public mirror,
pushes private `main`, force-pushes tags on both repositories, and creates a public
GitHub Release. There is no second confirmation. Run `--dry-run` first and read what
it reports.

`--dry-run` stops before anything lands. `--no-bump` skips the closing patch bump.

### The mirror is staged, never edited in place

The mirror is built in a staging directory and swapped in only past the dry-run
gate. The mirror is a working tree, so anything in it with no source behind it
exists in exactly one place on disk. An earlier version deleted the target before
that gate, so even a dry run destroyed such files.

Before replacing the mirror, the script reports anything the live copy holds that
the new build does not. Read that list: it is the only warning that a release is
about to drop a file.

### The environment-file check is not optional

The script strips every `.env` from the staged mirror, then verifies none survived
and aborts if any did. Both archive builds run the same verification over their own
staged trees, after the manifest has selected what ships.

Do not weaken any of the three. They are the reason a credential cannot reach a
public artefact by accident, and they exist because one did.

## Where to go next

| Question | Document |
|---|---|
| How do I test an installer change? | [Testing an install](/docs/prism/development/testing-an-install) |
| Why does the CLI need two checkouts? | [Building the operator CLI](/docs/prism/development/building-the-cli) |
| Which versions pair? | [Version compatibility](/docs/prism/upgrade/compatibility) |
