Each repository releases on its own cadence, and the three do not release the same
way. One blanket statement about them would be false.

| Repository | How it releases |
|---|---|
| `sightline-prism` | A hand-invoked `scripts/release.sh`. No continuous integration in that path. |
| `sightline-prism-windmill` | Its own hand-invoked `scripts/release.sh`. |
| `sightline-prism-cli` | A continuous-integration workflow. |

## Neither release script pushes

Both hand-invoked scripts commit locally and stop. They print the `git push` command
for a person to run after reviewing the commits.

**That is deliberate, and it is the control worth keeping.** A push is the step that
makes an artifact public. A person reads the diff first, and automating the push
removes the only point at which someone looks.

The CLI's workflow is the counter-case, and it earns the automation. A release cut
from a workstation can bundle a file that was never committed. A clean automated
checkout cannot.

## What `scripts/release.sh` does

In `sightline-prism`:

1. Builds and packs every workspace.
2. Assembles the public source mirror, in a staging directory.
3. Assembles the install archive, and lands it with a copy of `install.mjs`.
4. Pushes the source, tags the release, and creates the GitHub Release.
5. Patch-bumps every package for next time.

`--dry-run` stops after step 3 and lands nothing. `--no-bump` skips step 5.

### The mirror is staged, never edited in place

Step 2 builds the mirror in a staging directory. It swaps that in only past the
dry-run gate.

This matters more than it sounds. The mirror is a working tree, so anything in it
without a source behind it exists in exactly one place on disk. An earlier version
deleted the target before that gate, so even a dry run destroyed such files.

Before replacing the mirror, the script reports anything the live copy holds that
the new build does not. Read that list. It is the only warning you get that a
release is about to drop a file.

### The environment-file check is not optional

The script strips every `.env` from the staged mirror, then **verifies none
survived** and aborts if any did. The install archive gets the same verification.

Do not weaken either check. They are the reason a credential cannot reach a public
artifact by accident.

An allowlist is why one cannot reach the archive at all. `assemble-bundle.mjs`
copies named files, never directories.

## Building the CLI is a prerequisite

The install archive carries the operator CLI, which lives in its own repository. The
release builds it from the sibling checkout before packing, rather than packing
whatever `dist/` happens to hold. That is how a stale engine would otherwise reach a
customer with nothing to show for it.

The script stops with the path it expected when the sibling is absent.

## Where to go next

| Question | Document |
|---|---|
| Why does the CLI need two checkouts? | [Building the operator CLI](/docs/prism/development/building-the-cli) |
| How do I test an installer change? | [Testing an install](/docs/prism/development/testing-an-install) |
| Which versions pair? | [Version compatibility](/docs/prism/upgrade/compatibility) |
