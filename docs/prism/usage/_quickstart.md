This is the shortest path from an installed Prism to a merged record you decided yourself. **It needs no credentials.**

Two connectors generate synthetic records instead of contacting a real system: `aws-ec2-mock` and `jira-assets-mock`. The whole cycle below runs on those.

**Before you start**, complete [Installing Prism](/docs/prism/install/prism) with those two connectors, and choose a storage backend in [Storage backends](/docs/prism/install/storage-backends). The local backend is the least setup for a first run.

**Every command runs from your [runtime instance](/docs/prism/install/runtime-instance).**

```bash
cd acme-prism
```

## Step 1 — Collect from two sources

Run each mock collector, naming an instance.

```bash
npx prism-collect-aws-ec2-mock demo
npx prism-collect-jira-assets-mock demo
```

**Expected output.** Each run ends with a transmit line naming the inbox it wrote to. Two collectors, two inboxes, two snapshots.

You now have records from two sources that do not agree with each other. That disagreement is the point.

## Step 2 — Merge them

Run a sync rule whose target is a consolidated dataset.

```bash
npx prism-sync <rule-id>
```

Use a rule that reads one of the mock sources. [Create and edit rules](/docs/prism/usage/manage-rules) covers writing one if your instance has none.

**Expected output.** A per-change summary. Changes in `auto` mode are applied. Changes in `review` mode are left **pending** — those are the ones you decide next.

If everything applied automatically and nothing is pending, the rule's field modes are all `auto`. Set one to `review` and run it again, so there is something to review.

## Step 3 — Decide the pending changes

```bash
npx prism-review
```

Choose **Review pending changes**.

Each row is one proposed field change, with the source that proposed it and that source's priority. Approve with `a`, reject with `r`, then `enter` and `y` to commit.

The full procedure, including what decline does that reject does not, is in [Review and apply changesets](/docs/prism/usage/review-changesets).

**Expected output.** A confirmation of what was applied.

## Step 4 — Confirm the result

```bash
npx prism-review
```

Choose **Browse a dataset's records**, pick your consolidated dataset, and open a record.

**Expected output.** The merged record, with each field showing the source that supplied its value and that source's priority.

That last line is the whole product in one screen: a record assembled from two disagreeing sources, with every value traceable to where it came from and a decision you made recorded against it.

## What to do next

| Next | Document |
|---|---|
| Connect a real source | [Run a collector](/docs/prism/usage/collect) |
| Understand why a value won | [Sync engine](/docs/prism/architecture/sync-engine) |
| Do this in a browser | [The review app](/docs/prism/usage/review-app) |
| Push a value back to its source | [Run a write-back](/docs/prism/usage/write-back) |
