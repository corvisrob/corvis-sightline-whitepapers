# Review and apply changesets

A sync rule in `review` mode leaves its proposed changes **pending**. Reviewing them is how those changes become real.

**Start in your [runtime instance](/docs/prism/install/runtime-instance).**

```bash
cd acme-central
npx prism-review
```

Choose **Review pending changes** from the menu.

The same operations are available in a browser through the Windmill layer — see [The review app](/docs/prism/usage/review-app).

## What you are looking at

Changes are grouped into an asset tree. Each row is one proposed field change. It shows the old value against the new one, with the source that proposed it and that source's priority.

You are not deciding whether the new value is *newer*. The engine already settled that. You are deciding whether it is **right**.

## The keys

| Key | What it does |
|---|---|
| `↑` `↓` | Move between rows |
| `a` | Approve this change |
| `r` | Reject this change |
| `d` | Decline this value |
| `D` | Decline this field from this source |
| `l` | Link — only on a new-asset proposal |
| `s` | Clear the decision on this row |
| `space` | Fold or unfold an asset group |
| `A` | Approve every reviewable change |
| `R` | Reject every reviewable change |
| `enter` | Go to the confirmation step |
| `←` | Go back |
| `q` | Quit |

**`space` folds; it does not decide.** On a field row it clears the decision, which is the same as `s`. On an asset row it collapses the group. Use `s` when you mean to clear, and the meaning never changes under you.

## Reject and decline are not the same

This is the part the key names do not tell you. **All three of `r`, `d` and `D` reject the change.** They differ in what they leave behind.

| Key | The change | What is suppressed afterwards |
|---|---|---|
| `r` reject | Recorded `rejected` | **Nothing.** The same value can be proposed again on the next sync. |
| `d` decline | Recorded `declined` | **This exact value**, from this source. A corrected value still comes through. |
| `D` decline field | Recorded `declined-field` | **The whole field**, from this source. No value for that field is proposed from it again. |

Use `r` for a change that is wrong once. Use `d` for a value that is wrong at the source and keeps arriving. Use `D` when that source should never speak for that field at all.

`d` and `D` create a permanent suppression, and a suppression is invisible until you look for it. [Manage deferrals](/docs/prism/usage/deferrals) covers finding and removing them.

**Decline is unavailable on a mirror row.** A mirror proposal creates an asset rather than changing a field value, so there is no source value to suppress. Those rows take `a` and `r` only.

## Linking a new asset

A source can propose an asset that Prism does not yet hold. `l` opens a picker so you can attach the proposal to an existing master record instead of creating a second one.

⚠️ **Pressing `l` and choosing nothing rejects the change.** A link needs a target. Without one the proposal falls through to rejected, exactly as if you had pressed `r`.

## Applying

`enter` does **not** apply. It opens a confirmation step, which reports what you decided. `y` commits and `n` returns you to the list.

Only then are approved changes written into the synthetic dataset and the changeset persisted.

**Applying is the point of no return for that pass.** Anything you approved is written. To undo it afterwards you roll the changeset back. That is a data operation, and a different thing from a version rollback — see [Browse datasets and changesets](/docs/prism/usage/browse).

A change you left undecided stays pending. It appears again next time you review.

## Where to go next

| Question | Document |
|---|---|
| How do I undo one I applied? | [Browse datasets and changesets](/docs/prism/usage/browse) |
| What did I suppress, and how do I undo it? | [Manage deferrals](/docs/prism/usage/deferrals) |
| How do I do this in a browser? | [The review app](/docs/prism/usage/review-app) |
| Why did the engine propose this? | [Sync engine](/docs/prism/architecture/sync-engine) |
