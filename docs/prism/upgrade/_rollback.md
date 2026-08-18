# Rollback

An upgrade sometimes has to be undone. The three products do not answer that the same way, and one of them does not answer it at all.

**Read this page before you upgrade, not after.** One of the three has no supported rollback, and knowing that in advance changes how you sequence the upgrade.

| Product | Rollback |
|---|---|
| Prism | Supported — reinstall the previous version |
| Operator CLI | Supported — reinstall the previous version |
| Windmill layer | **Not supported** |

## Changeset rollback is a different thing

Prism has an operation called rollback that is **not** a version rollback, and the two are easy to confuse.

**Rolling back a changeset** undoes a set of field changes that was applied to your records. It is a data operation. You reach it from the review interface, where every changeset can be inspected and rolled back.

**Rolling back a version** replaces the installed software. It changes no records.

They are unrelated. Rolling back a version does not undo an applied changeset, and rolling back a changeset does not move you to an earlier version. The changeset procedure is in [Reviewing changesets](/docs/prism/usage/review-changesets).

## Prism

Rollback is a reinstall at the earlier version, into the same [runtime instance](/docs/prism/install/runtime-instance).

1. Check whether a schema migration ran during the upgrade. If it did, read [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) first — your records may no longer match the version you are returning to.
2. Return the code checkout to the earlier version.
3. Re-run the installer against the same instance, with the same flags you used before.

```bash
cd sightline-prism
git checkout <previous-version>
npm install
npm run build

./install/install.sh --dir ../acme-prism --role central --connectors crowdstrike,jira-assets
```

**Expected result.** The instance runs the earlier packages. Your `.env`, your connector manifests, your rules and your records are untouched — the installer replaces packages only.

**Your records do not roll back.** Anything collected or synced while the newer version ran stays exactly as it is. Rollback returns the software, not the data.

## Operator CLI

Rollback is a reinstall at the earlier version, and the path matches how you installed it.

**For a released CLI:**

1. Confirm which earlier version you are returning to.
2. Re-run the Prism installer against the instance with that version selected.

```bash
cd sightline-prism
./install/install.sh --dir ../acme-central --role central --source npm --registry <your-registry>
```

**For a CLI built from source:**

1. Return the `sightline-prism` sibling checkout to the earlier version and rebuild it.
2. Return the CLI checkout to the earlier version and rebuild it.

```bash
cd sightline-prism
git checkout <previous-version>
npm install
npm run build

cd ../sightline-prism-cli
git checkout <previous-version>
npm install
npm run build
```

**Expected result.** `npm ls @sightline/prism-cli` from the instance names the earlier version, and all five entry points resolve.

The engine is compiled into the CLI, so returning the CLI returns the engine with it. The sibling must be rebuilt at the earlier version too. Rebuilding them out of order leaves you with a pairing neither version was tested as.

## Windmill layer

**Rollback is not supported.** There is no procedure below, because there is no supported way to do it.

The updater fetches the **current** gold master. It has no flag to select a version, and the layer publishes no tagged releases, so there is nothing earlier to fetch. Once you have run the update, the previous content is gone from your install.

What to do instead:

1. **Copy the install directory before you update.** This is the whole mitigation, and it has to happen before you upgrade.

   ```bash
   cp -R acme-prism-windmill acme-prism-windmill-backup-$(date +%Y%m%d)
   ```

2. To return to the previous state, restore that copy and deploy it.

   ```bash
   cd acme-prism-windmill-backup-<date>
   wmill sync push
   ```

3. If you did not take a copy, ask Corvis. Recovering an earlier gold master is not something you can do from your own installation.

**Run the updater's dry run before every update.** It lists what would change and what would be deleted, which is the only preview you get of what a copy would need to protect. [Upgrading the Windmill layer](/docs/prism/upgrade/windmill) covers it.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| What happens to my records across versions? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| How do I upgrade Prism? | [Upgrading Prism](/docs/prism/upgrade/prism) |
| How do I upgrade the Windmill layer? | [Upgrading the Windmill layer](/docs/prism/upgrade/windmill) |
