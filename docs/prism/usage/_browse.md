Two browsing workflows answer the same question from different ends: **what happened to this data?**

Browse changesets to see what a sync proposed and what became of it. Browse a dataset to see what a record looks like now, and which source each of its values came from.

**Start in your [runtime instance](/docs/prism/install/runtime-instance).**

```bash
cd acme-central
npx prism-review
```

## Browse changesets

Choose **Browse all changesets**. Every changeset appears, not only the ones awaiting review.

| Key | What it does |
|---|---|
| `↑` `↓` | Move between changesets |
| `enter` | Open the changeset |
| `/` | Search the list |
| `←` | Back to the menu |
| `q` | Quit |

Inside a changeset, each row shows the record and field, the old value against the new one, and the status that change ended with. Long changesets page twenty rows at a time, with `[` and `]` moving between pages.

### Rolling a changeset back

**`r` rolls back the changeset**, and it is offered only when the changeset was actually applied — its status is `applied` or `partial`. There is nothing to undo on a changeset that was never applied, so the key does not appear.

`r` opens a confirmation. `y` commits the rollback and `n` returns.

⚠️ **This is a data rollback, not a version rollback.** It reverses the field changes this changeset wrote. It does not change which version of Prism you run, and rolling back a version does not undo an applied changeset. [Rollback](/docs/prism/upgrade/rollback) covers the version side and keeps the two apart.

## Browse a dataset's records

Choose **Browse a dataset's records**, then pick a dataset. From there you can filter, sort, page through the records, and open one.

The available keys are shown along the bottom of each view. Read that line rather than memorising a set — it changes with the view you are in.

### Field-level provenance is the point

Opening a record is worth doing because of what the record carries beside each value.

A merged record does not just hold a value. For each field it also holds **the source that supplied it and that source's priority**. Both appear next to the field, as a source name and a priority number. A field no source has claimed yet is marked as new.

That is what makes a synthetic dataset auditable. When a value looks wrong, the record names the connector that proposed it and how strongly. That is usually enough to choose between fixing the source, changing a priority, and declining the value at review.

[Data model](/docs/prism/architecture/data-model) explains how provenance is stored. This page is about reading it.

## Where to go next

| Question | Document |
|---|---|
| How do I decide pending changes? | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| Can I roll back a version too? | [Rollback](/docs/prism/upgrade/rollback) |
| Why did a value win? | [Sync engine](/docs/prism/architecture/sync-engine) |
| How do I stop a source proposing a field? | [Manage deferrals](/docs/prism/usage/deferrals) |
