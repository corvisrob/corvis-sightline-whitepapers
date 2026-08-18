How you upgrade the operator CLI depends on how you installed it. The two paths are not variations of each other — one needs a second checkout and the other does not.

Read [Version compatibility](/docs/prism/upgrade/compatibility) before you start. It tells you what the target version is coupled to.

| How you installed it | Path to follow |
|---|---|
| From a release, into a [runtime instance](/docs/prism/install/runtime-instance) | [Upgrade a released CLI](#upgrade-a-released-cli) |
| From source, in its own checkout | [Upgrade a CLI built from source](#upgrade-a-cli-built-from-source) |

## The pairing check comes first

**A CLI carries its engine inside it.** The release workflow compiles the sync engine, the connector SDK and the shared review logic into the CLI's own entry points. The version you install therefore decides the engine you run.

Before you upgrade, answer one question: **does the target CLI version pair with the Prism version you run?**

The honest answer is often "nobody can tell you from the artifact". No release records which Prism commit it was built from, so you cannot read the pairing off the release. Ask Corvis when the pairing matters, and read [Version compatibility](/docs/prism/upgrade/compatibility) for what is actually evidenced.

**Do not infer the pairing from version numbers.** The three products number independently. A matching major and minor tells you nothing about what was compiled in.

## Upgrade a released CLI

A released CLI needs no `sightline-prism` checkout. The engine travels inside the tarball.

The CLI is installed into a runtime instance, so the upgrade runs the Prism installer again against that same instance.

1. Confirm the pairing, as above.
2. Change into the code checkout that holds the installer.
3. Re-run the installer against your existing runtime instance.

```bash
cd sightline-prism
./install/install.sh --dir ../acme-central --role central --source npm --registry <your-registry>
```

The installer does not overwrite your `.env`, your connector manifests or your rules. It replaces the installed packages. [Upgrading Prism](/docs/prism/upgrade/prism) lists exactly what survives.

Then [verify the version](#verify-the-version).

## Upgrade a CLI built from source

Building from source needs two checkouts side by side, and **the order is not optional**.

Follow these four steps in this order.

1. Confirm the pairing, as above.
2. Update the `sightline-prism` sibling checkout to the version you intend to pair with.
3. Rebuild the sibling.
4. Update and rebuild the CLI.

```bash
cd sightline-prism
git fetch --tags
git checkout <target-version>
npm install
npm run build

cd ../sightline-prism-cli
git fetch --tags
git checkout <target-version>
npm install
npm run build
```

Step 3 is the one people skip. The CLI reads the sibling's **compiled output**, not its source, so a sibling you updated but did not rebuild still serves the old engine.

### What the wrong order looks like

An unbuilt or unrebuilt sibling does not tell you to rebuild the sibling. It produces **module-not-found errors** naming packages you can see on disk:

- `@sightline/prism-engine`
- `@sightline/prism-connector-sdk`
- `@sightline/prism-review-core`

The error sends you to look for a missing dependency, and nothing is missing. Go back to the sibling and run `npm run build`.

A **stale** sibling build is the quieter failure. The build inlines the sibling's compiled output, so an out-of-date build would be compiled into the CLI with nothing to show for it. The build guards against this: it stops when a sibling has no build at all, and warns when a sibling's source is newer than its build. **Read those warnings.** They are the only signal that the engine you just compiled in is not the engine you checked out.

## Verify the version

Check the version that is actually installed, not the one you intended to install.

From a runtime instance:

```bash
cd acme-central
npm ls @sightline/prism-cli
```

**Expected output.** One line naming `@sightline/prism-cli` at the version you upgraded to. A version you did not expect means the install resolved something else, and the entry points below will run that instead.

Then confirm all five entry points still resolve:

```bash
ls node_modules/.bin/
```

**Expected output.** `prism-sync`, `prism-review`, `prism-drain`, `prism-seed-tables` and `prism-migrate-rules`, plus one `prism-collect-<connector>` entry for each connector installed here.

A missing entry point means the install did not complete. Re-run the installer and read its output from the top.

## About releases

Releases are produced by a continuous-integration workflow, not from a developer workstation. A workstation can bundle a file that was never committed. An automated build starts from a clean checkout, so it cannot.

Each release is a versioned tarball attached to a release. The workflow runs the type checker and the full test suite against the exact engine build it packs. A build that fails either check is never published.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| How do I upgrade Prism itself? | [Upgrading Prism](/docs/prism/upgrade/prism) |
