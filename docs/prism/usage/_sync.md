# Run a sync rule

A sync rule merges records from a connected dataset into a synthetic dataset. Running one is a single command. Understanding what it produced is the part worth reading.

**Start in your [runtime instance](/docs/prism/install/runtime-instance).** The sync command resolves its rule against the current directory.

```bash
cd acme-central
```

## Run the rule

Name the rule by its id.

```bash
npx prism-sync aws-mock-to-consolidated
```

**Expected output.** A start line naming the rule, then a line naming where the rule was loaded from. Per-change lines follow, each showing the mode, the priority and the status. A summary of what was applied closes the run.

### Where the rule comes from

The command looks in two places, in order:

1. `rules/<rule-id>.json`, relative to your current directory.
2. The rule storage collection, if no such file exists.

It prints which one it used. **Keep your rule files.** The file path is the one that works reliably — see [If the rule is not found](#if-the-rule-is-not-found).

A rule that exists but is disabled stops the run with a message saying so. That is not a failure; it is the rule's `enabled` flag doing its job.

## Auto-apply against pending review

This is the distinction that decides whether you have more work to do.

Every field rule carries a mode:

| Mode | What happens when the sync runs |
|---|---|
| `auto` | The change is applied immediately, where priority permits. |
| `review` | The change is recorded and left **pending**. Nothing is written yet. |

**A sync that reports pending changes has not failed.** It has queued them. An operator who expects `auto` everywhere reads a pending count as a broken sync. They then look for an error that does not exist.

Priority still governs an `auto` change. A lower-priority source does not overwrite a higher-priority value simply because its rule says `auto`.

## Direction follows the target, not the rule

There is one rule shape for both directions. A reverse rule is run by the same command as a sync rule.

**The direction comes from where the target table lives.** A local target merges into a synthetic dataset. A remote target enqueues writes to that target's outbox instead, for an edge to drain later.

So you do not choose a direction when you run a rule, and there is no separate reverse-sync command. You choose a target when you write the rule. [Run a write-back](/docs/prism/usage/write-back) covers what happens after a remote target is enqueued.

## If the rule is not found

The command reports where it looked. Two causes are common, and the second one is not obvious.

**The file is not there.** You are in the wrong directory, or the rule id does not match the filename. The command prints the exact path it tried.

⚠️ **The rule was migrated into storage.** `prism-migrate-rules` writes rules into a `rules` collection, but this command's storage fallback reads a `sync_rules` collection. **They are different collections.** A rule that exists only in storage after a migration is therefore not found here.

**Keep the `rules/*.json` files in your instance.** They are the path this command resolves first, and the one that does not depend on that mismatch. Do not delete them after running a migration.

## See what the sync produced

The run summary tells you the counts. It does not tell you whether the pending changes are right.

Every change left pending is waiting in a changeset. Review it, decide each change, and apply what you accept: [Review and apply changesets](/docs/prism/usage/review-changesets).

## Where to go next

| Question | Document |
|---|---|
| How do I review what this produced? | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| How do I write or edit a rule? | [Create and edit rules](/docs/prism/usage/manage-rules) |
| How do fields actually merge? | [Sync engine](/docs/prism/architecture/sync-engine) |
| What happens with a remote target? | [Run a write-back](/docs/prism/usage/write-back) |
