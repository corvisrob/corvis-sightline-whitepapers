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

## Run the dry run first

**A dry run is available and worth the minute it costs.** It shows what the release changes in your install before anything moves.

```bash
node update.mjs --dir ../acme-prism-windmill --dry-run
```

**Expected output.** An itemised list of the files the updater would add or change, then a per-directory count, then a line stating that nothing changed.

Each directory's line also counts the files your install holds that this release does not carry. They are listed as `kept`, and the updater leaves them alone. A file appearing there after an upgrade is usually a script the release renamed, so read the list.

The dry run stops after the file listing. It does not go on to preview the deployment.

## What is replaced and what is kept

The refresh copies one way and deletes nothing. An install directory is not a checkout of the archive. Operators create resources in it, connectors are set up into it, and instances live there as files. A file the archive does not carry was put there by someone, so the updater leaves it and reports it as `kept`.

**Replaced**, refreshed from the archive:

| Path | What it holds |
|---|---|
| `f/` | The review-app scripts, and the archive's own connector scripts |
| `windmill/` | The collector and discover templates |
| `vendor/` | The compiled engine, connector SDK, review logic and connectors |
| `*.resource-type.yaml` | The resource types at the install root |

`vendor/` is refreshed on purpose. Leaving it behind would run the previous release's engine against this release's scripts. That mismatch surfaces as a missing export at deploy time, not as a version error.

**Kept**, never overwritten:

| Path | What it holds |
|---|---|
| `wmill.yaml` | The workspace binding |
| `wmill-lock.yaml` | The deployment lock |
| `f/prism/storage.resource.yaml` | Your storage connection resource (MongoDB or PostgreSQL) |
| `f/prism/*_manifest.resource.yaml` | Your connector instances: identity, credentials and settings |
| `f/prism/<connector>_collect.ts` | The deployed collector script of every connector set up in this install |
| `u/<user>/` | Per-user content |

Your credentials survive an upgrade. You do not re-enter them.

**A manifest is an instance**, so losing one loses the instance. The updater never writes over a `*_manifest.resource.yaml`, whatever the archive holds.

A collector script the archive does not ship is always yours, so the updater always keeps it. That includes one left behind by a connector setup you interrupted before entering its credentials. Where the archive does ship a collector, an instance manifest decides. With one present, the install has its own copy to keep. Without one, the archive's copy refreshes normally.

## The updater corrects three wmill.yaml flags

`skipVariables`, `skipSecrets` and `skipResources` must all be `true`. The updater sets any that is not, and reports which it changed.

Variables, secrets and resources are all managed outside the sync. The installer pushes them directly, and an instance created by duplicating a manifest in the Windmill user interface has no local file at all. In sync scope each of those reads as deleted, so a `wmill sync push` with any of the three flags left `false` removes them from the workspace. A secret variable is the only copy of a credential.

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

Then confirm each connector you run still has both halves, its instance manifest and its collector script:

```bash
ls f/prism/*_manifest.resource.yaml f/prism/*_collect.ts
```

**Expected output.** A matching pair for each connector you run. A manifest with no matching collect script means the script was lost before this updater, and the connector cannot run until it is back. Delete that manifest and re-run the installer for the connector, which asks for the credentials again.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| How do I install this hosting for the first time? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
