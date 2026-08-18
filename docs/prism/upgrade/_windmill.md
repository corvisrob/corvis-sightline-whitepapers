# Upgrading the Windmill layer

The Windmill layer upgrades through its own updater, `install/update.sh`, in the Windmill repository. The updater refreshes the layer's content from the current gold master and leaves your deployment state alone.

Read [Version compatibility](/docs/prism/upgrade/compatibility) before you start.

**Every path on this page is in the Windmill repository, not in the Prism one.**

## Before you start

The updater refreshes an **existing** install. It is not a first-time install.

It stops when the target directory has no `f/` directory or no `wmill.yaml`, and tells you to use the installer instead. [Installing the Windmill layer](/docs/prism/install/windmill) covers that path.

You also need the current gold master. Corvis distributes it privately — ask for access. An access token, supplied as `SIGHTLINE_TOKEN`, lets the updater fetch it without a checkout.

## The flags

```bash
./install/update.sh --dir ../acme-prism-windmill
```

| Flag | What it does | Required |
|---|---|---|
| `--dir` | The existing install to refresh. | Yes. The updater stops without it. |
| `--dry-run` | Shows the file changes and stops. Changes nothing. | No |
| `--help` | Prints the usage. `-h` also works. | No |

That is the whole list. The updater takes no other flag.

## ⚠️ Run the dry run first

**A dry run is available, and on this command it is not optional in practice.** Read [What the updater deletes](#what-the-updater-deletes) before you skip it.

```bash
./install/update.sh --dir ../acme-prism-windmill --dry-run
```

**Expected output.** An itemised list of the files the updater would add, change and **delete**, followed by a line stating that nothing changed. Read the deletions.

The dry run stops after the file listing. It does not go on to preview the deployment.

## What is preserved and what is replaced

The updater replaces gold-master content and protects deployment-specific state.

**Replaced** — refreshed from the gold master:

| Path | What it holds |
|---|---|
| `f/` | The review-app scripts and the deployed collector scripts |
| `windmill/` | The collector templates |
| `vendor/` | The compiled engine, connector SDK, review logic and connectors |

`vendor/` is refreshed on purpose. Leaving it behind would run the previous release's engine against this release's scripts. That mismatch surfaces as a missing export at deploy time, not as a version error.

**Preserved** — never touched:

| Path | What it holds |
|---|---|
| `wmill.yaml` | The workspace binding |
| `wmill-lock.yaml` | The deployment lock |
| `f/prism/mongodb.resource.yaml` | Your MongoDB connection resource |
| `f/prism/*_credentials.resource.yaml` | Your connector credential resources |
| `u/<user>/` | Per-user content |

Your credentials survive an upgrade. You do not re-enter them.

## What the updater deletes

The refresh is a mirror, not a merge. Anything under `f/`, `windmill/` or `vendor/` that the gold master does not carry — and that is not on the preserved list above — **is deleted**.

**This removes the deployed collector script for most connectors.**

The gold master ships one collector script in `f/prism/`, for `jira-assets`. Every other connector's script was written into your install by the installer, from a template. Those scripts are not in the gold master and are not on the preserved list, so the refresh deletes them.

| Connector | Its `f/prism/<name>_collect.ts` after an update |
|---|---|
| `jira-assets` | Kept — the gold master carries it |
| `crowdstrike`, `cylance`, `azure-vms` | **Deleted** |

The credential resource survives, and the script it drives does not. The two come apart.

### Restoring a deleted collector script

**Re-running the installer does not restore it.** The installer skips any connector whose credential resource file is already present. That file survived the update, so the connector is skipped and the script stays missing.

To restore it, remove the credential resource first, then re-run the installer for that connector and enter its credentials again:

```bash
cd ../acme-prism-windmill
rm f/prism/<connector>_credentials.resource.yaml
cd ../sightline-prism-windmill
./install/install.sh --dir ../acme-prism-windmill --connectors <connector>
```

**Plan for this before you upgrade.** Note which connectors you run and have their credentials to hand. The dry run lists the deletions, so run it first and you will know exactly which connectors are affected.

## The update does not deploy

The updater finishes with a **preview**, not a deployment, exactly as the installer does. It runs the deploy command in preview mode and prints what would change.

Read that output. Then deploy:

```bash
cd ../acme-prism-windmill
wmill sync push
```

**Confirm the deployment landed.** Run the preview again:

```bash
wmill sync push --dry-run
```

**Expected output.** No remaining changes. A second preview that still lists the same scripts and resources means the push did not complete. Read the output of the push itself for the reason.

## Verify the upgrade

From inside the install directory, confirm the deployment state survived:

```bash
cd ../acme-prism-windmill
ls wmill.yaml f/prism/mongodb.resource.yaml
```

**Expected output.** Both paths, each listed once. A missing `wmill.yaml` means the updater did not run against an existing install.

Then confirm each connector you run still has both halves — its credential resource **and** its collector script:

```bash
ls f/prism/*_credentials.resource.yaml f/prism/*_collect.ts
```

**Expected output.** A matching pair for each connector you run. A credential resource with no matching collect script is the deletion described above. Restore it before you deploy.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| How do I install this layer for the first time? | [Installing the Windmill layer](/docs/prism/install/windmill) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
