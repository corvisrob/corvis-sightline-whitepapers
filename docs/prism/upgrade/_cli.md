The operator CLI upgrades with the rest of the node. It travels inside the install archive, so a newer archive carries a newer CLI.

Read [Version compatibility](/docs/prism/upgrade/compatibility) for what the target version is coupled to.

## The pairing check comes first

**A CLI carries its engine inside it.** The release workflow compiles the sync engine, the connector SDK and the shared review logic into the CLI's own entry points. The version you install therefore decides the engine you run.

Before you upgrade, answer one question: **does the target CLI version pair with the Prism version you run?**

The honest answer is often "nobody can tell you from the artifact". No release records which Prism commit it was built from, so you cannot read the pairing off the release. Ask Corvis when the pairing matters, and read [Version compatibility](/docs/prism/upgrade/compatibility) for what is actually evidenced.

**Do not infer the pairing from version numbers.** The three products number independently. A matching major and minor tells you nothing about what was compiled in.

## Upgrade the CLI

The CLI is installed into a runtime instance, so the upgrade runs the installer again against that same instance.

1. Confirm the pairing, as above.
2. Put the archive for the target version in your install directory. Corvis supplies it.
3. Re-run the installer against your existing runtime instance.

```bash
cd prism-install
node install.mjs --dir ../acme-central --role central --connectors crowdstrike
```

**Pass the same `--connectors` you installed with.** The installer resolves the package list on each run, and a connector you leave off is not upgraded.

The installer does not overwrite your `.env`, your connector manifests or your rules. It replaces the installed packages. [Upgrading Prism](/docs/prism/upgrade/prism) lists exactly what survives.

Then [verify the version](#verify-the-version).

## Building from source

A contributor who upgrades a CLI they built from source has a different procedure. It needs two checkouts in a set order, and [Building the operator CLI](/docs/prism/development/building-the-cli) covers it.

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

The workflow runs the type checker and the full test suite against the exact engine build it packs. A build that fails either check is never published.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| How do I upgrade Prism itself? | [Upgrading Prism](/docs/prism/upgrade/prism) |
