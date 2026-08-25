Windmill-hosted Prism upgrades through its own updater, `update.mjs`. The updater refreshes the deployment's content from a newer archive and leaves your deployment state alone.

Read [Version compatibility](/docs/prism/upgrade/compatibility) for what the target Windmill layer is coupled to.

**The updater and its archive sit together in one directory**, the way an install does. Every other path on this page is inside the deployment directory you name with `--dir`.


## Upgrading to 3.0.0 is a breaking change

**Every script's first parameter changed.** It was `mongodb`, a Windmill built-in `mongodb` resource; it is now `storage`, a `prism_storage` resource at `f/prism/storage`. Until an install is migrated, its scripts have no resource to bind and the review app does not run.

The updater does not do this for you, because it never touches your resources - that is what keeps your credentials through an upgrade.

1. Create the new resource. Either run `node install/setup-resource.mjs storage <install-dir> <archive-dir>`, or lift your existing `f/prism/mongodb` value into a `prism_storage` resource at `f/prism/storage`. Lifting it keeps the `$var:` password reference, so you do not re-enter the secret.
2. Push the resource type, then the resource, then the scripts, then the app - in that order. A script deployed before its resource exists has nothing to bind.
3. Rebind any schedule or trigger that passed `mongodb`. The field is now `storage`.

**The updater checks that you have done this.** An install with no `f/prism/storage.resource.yaml` is either un-migrated or has lost its storage resource. Refreshing one installs scripts whose first parameter is `storage`, over a workspace with nothing to bind them to. The updater stops on that check before touching a single file, names the migration, and changes nothing. `--dry-run` stops on it too, so a dry run cannot report clean on an install the real run would refuse.

⛔ **Push per file** (`wmill script push <file>`). A whole-tree `wmill sync push` deletes anything in the workspace that your install directory does not hold. That usually includes scripts which only ever existed in the workspace.

Read [Storage backends](/docs/prism/install/storage-backends) before choosing PostgreSQL: it is now a supported backend for this layer, and it must be reachable from the Windmill workers.

## Before you start

The updater refreshes an **existing** install. It is not a first-time install.

It stops when the target directory has no `f/` directory or no `wmill.yaml`, and tells you to use the installer instead. [Installing Windmill-hosted Prism](/docs/prism/install/windmill) covers that path.

You also need the archive for the version you are moving to. Corvis supplies it, with the updater beside it, exactly as it supplies an install. The updater reads the archive from its own directory and downloads nothing.

## The flags

```bash
node update.mjs --dir ../acme-prism-windmill
```

| Flag | What it does | Required |
|---|---|---|
| `--dir` | The existing install to refresh. | Yes. The updater stops without it. |
| `--archive` | Which archive to refresh from. Defaults to the latest. | No |
| `--dry-run` | Shows the file changes and stops. Changes nothing. | No |
| `--help` | Prints the usage. `-h` also works. | No |

That is the whole list. The updater takes no other flag.

`--archive` names a file beside the updater, or a path. It is how you refresh from a named version rather than the latest archive.

## ⚠️ Run the dry run first

**A dry run is available and worth the minute it costs.** It is the only way to see what a release retires from your install before it goes — see [What the updater deletes](#what-the-updater-deletes).

```bash
node update.mjs --dir ../acme-prism-windmill --dry-run
```

**Expected output.** An itemised list of the files the updater would add, change and **delete**, followed by a line stating that nothing changed. Read the deletions.

The dry run stops after the file listing. It does not go on to preview the deployment.

## What is preserved and what is replaced

The updater replaces archive content and protects deployment-specific state.

**Replaced** — refreshed from the archive:

| Path | What it holds |
|---|---|
| `f/` | The review-app scripts, and the archive's own collector script |
| `windmill/` | The collector templates |
| `vendor/` | The compiled engine, connector SDK, review logic and connectors |

`vendor/` is refreshed on purpose. Leaving it behind would run the previous release's engine against this release's scripts. That mismatch surfaces as a missing export at deploy time, not as a version error.

**Preserved** — never touched:

| Path | What it holds |
|---|---|
| `wmill.yaml` | The workspace binding |
| `wmill-lock.yaml` | The deployment lock |
| `f/prism/storage.resource.yaml` | Your storage connection resource (MongoDB or PostgreSQL) |
| `f/prism/*_credentials.resource.yaml` | Your connector credential resources |
| `f/prism/<connector>_collect.ts` | The deployed collector script of every connector set up in this install |
| `u/<user>/` | Per-user content |

Your credentials survive an upgrade. You do not re-enter them.

## What the updater deletes

The refresh is a mirror, not a merge. Anything under `f/`, `windmill/` or `vendor/` that the archive does not carry — and that is not on the preserved list above — **is deleted**.

That is deliberate, and it is what the dry run is for. It is how a script this release retires leaves your install, and how the previous release's engine chunks leave `vendor/`.

**Your own deployment state is not in that set.** The updater does not work from a fixed list of files to spare. It reads the install: your storage resource, every connector credential resource, and every collector script the installer put there. Set a connector up and it keeps both halves — the credentials and the script they drive — through every later refresh.

A collector script the archive does not ship is always yours, so the updater always keeps it. That includes one left behind by a connector setup you interrupted before entering its credentials. The one collector the archive does ship, for `jira-assets`, is kept where you have that connector set up here. Otherwise the updater refreshes it from the archive.

### Restoring a collector script an older updater deleted

Earlier updaters spared a fixed list of files that named neither the collector scripts nor, after the 3.0.0 rename, the storage resource. An upgrade run by one of those deleted the collector script of every connector except `jira-assets`, and left its credential resource behind. It could also delete `f/prism/storage.resource.yaml` outright.

If [Verify the upgrade](#verify-the-upgrade) finds a credential resource with no matching collector script, this is why.

**Re-running the installer does not restore it.** The installer skips any connector whose credential resource file is already present. That file survived, so the connector is skipped and the script stays missing.

Remove the credential resource first, then re-run the installer for that connector and enter its credentials again:

```bash
cd ../acme-prism-windmill
rm f/prism/<connector>_credentials.resource.yaml
cd ../sightline-prism-windmill
node install/install.mjs --dir ../acme-prism-windmill --connectors <connector>
```

A missing `f/prism/storage.resource.yaml` is recovered the same way the [3.0.0 migration](#upgrading-to-300-is-a-breaking-change) creates one. The updater now refuses to run at all until it is back.

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
ls wmill.yaml f/prism/storage.resource.yaml
```

**Expected output.** Both paths, each listed once. A missing `wmill.yaml` means the updater did not run against an existing install.

Then confirm each connector you run still has both halves — its credential resource **and** its collector script:

```bash
ls f/prism/*_credentials.resource.yaml f/prism/*_collect.ts
```

**Expected output.** A matching pair for each connector you run. A credential resource with no matching collect script means an older updater deleted it — [restore it](#restoring-a-collector-script-an-older-updater-deleted) before you deploy.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| How do I install this hosting for the first time? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
