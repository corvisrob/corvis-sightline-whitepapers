A **deferral** is a permanent suppression. You create one during review, and it stops a source input from ever being proposed again.

**Start in your [runtime instance](/docs/prism/install/runtime-instance).**

```bash
cd acme-central
npx prism-review
```

Choose **Manage deferrals**.

## Where deferrals come from

You do not create a deferral here. You create one at review, with `d` or `D`:

| Review key | The deferral it creates |
|---|---|
| `d` | Suppresses that exact value from that source. A corrected value still comes through. |
| `D` | Suppresses the whole field from that source. Nothing from it is proposed for that field again. |

Plain reject (`r`) creates no deferral at all. [Review and apply changesets](/docs/prism/usage/review-changesets) covers the distinction where you make it.

## Why a mistake here is quiet

**A suppressed change does not reappear.** That is the point of the feature.

A deferral made in error raises no error or warning, and leaves no pending change. The source keeps sending the value, and Prism keeps discarding it. Nothing in the review queue hints that a decision is being applied on your behalf.

So the symptom of a wrong deferral is a field that never updates, from a connector that is running perfectly. **This list is the only place that shows it.** Check here before concluding a connector is broken.

## Browse and remove

| Key | What it does |
|---|---|
| `↑` `↓` | Move between deferrals |
| `x` | Remove the deferral under the cursor |
| `←` | Back to the menu |
| `q` | Quit |

**Expected output when there are none.** A line confirming there are no permanent deferrals.

Removing a deferral does not restore the value it suppressed. It stops the suppression. The next sync from that source proposes the value again, and it returns to the review queue like any other change.

## Where to go next

| Question | Document |
|---|---|
| Where do I create one? | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| Why is a field not updating? | [Browse datasets and changesets](/docs/prism/usage/browse) |
| How do I do this in a browser? | [The review app](/docs/prism/usage/review-app) |
