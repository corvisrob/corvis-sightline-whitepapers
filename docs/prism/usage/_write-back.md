A write-back sends a value from a consolidated dataset back out to the source system it came from.

A write-back is a two-location operation, and that is the whole difficulty. One half runs centrally. The other half runs wherever the source is actually reachable. Running only the first half looks like nothing happened.

[Sync engine](/docs/prism/architecture/sync-engine) explains the outbox design. This page is the procedure.

## The two halves

| Half | Where it runs | What it does |
|---|---|---|
| Enqueue | Centrally, with the engine | Runs a rule whose target is remote, and queues each write into that source's outbox |
| Drain | At the edge, where the source is reachable | Reads the queue, writes each item to the source, and marks it done or failed |

Nothing reaches the source in the first half. The queue is the handover.

## Half one: enqueue, centrally

**Start in your central [runtime instance](/docs/prism/install/runtime-instance).**

```bash
cd acme-central
npx prism-sync <rule-id>
```

A write-back runs through the same command as any other rule. The direction follows the rule's target: a remote target enqueues instead of merging. [Run a sync rule](/docs/prism/usage/sync) covers that.

**Expected output.** The usual sync summary. The queued writes are in the source's outbox, not at the source.

## Half two: drain, at the edge

**Start where the source system is actually reachable.** That is often not the machine that ran the sync; it is the point of splitting the operation.

```bash
cd acme-edge
npx prism-drain <source>
```

**Expected output.** A line naming the outbox being drained, one line per item, and a summary counting written and failed.

## ⚠️ The shipped drain command writes nothing

**Read this before you run `prism-drain` against a real queue.**

The command that ships is a **reference implementation**. It uses a dry-run writer that only prints what it would do. It does not contact your source system, and it does not write any value anywhere.

It still marks every item it processed as `done`.

So running it against a real outbox has one observable effect: your queued write-backs are consumed and marked complete, and nothing reaches the source. The summary reports items written, but nothing was written.

Each line it prints is tagged as a dry run, and the opening line says so too. That tag is the only thing distinguishing a real drain from this one.

A production write-back needs a connector that supplies its own writer, backed by its authenticated API client. A connector does that by using the drain routine from the SDK and passing that writer in. Until a connector does that for your source, treat the queue as unattended and do not drain it.

## Half two, by hand: the review app's Outbox

When no connector can reach the source, the queue is still actionable by a person. The review app's **Outbox** entry lists every source that has an outbox, with the number of writes queued for it. It shows each queued write in full, and downloads the lot as JSON.

Nothing on that screen reaches your source system. The app holds no source credentials and no connectivity; it reads the queue and it records outcomes. The sequence is:

1. Open Outbox, pick the source, and read or download its pending items. Each one names the record to change, the field, and the value.
2. Perform those writes yourself, in the source system.
3. Come back, tick the items you actually performed, and press **Mark done**.

Marking an item done records that the write has already happened at the source. That is what the completion guarantee below rests on, and what the dry-run drain gets wrong. Tick nothing you did not do.

An item you could not perform is best left alone. `pending` is already the correct state for a write that has not happened: nothing has been consumed, and the item is still there next time. The app deliberately offers no way to mark an item `failed`. That status exists so a connector can record an error its API returned. A person clicking a button does not have that error.

A `create` item needs one extra thing: the native id the source gave the record you provisioned. Enter it beside that row before marking it done, or the engine has no way to link the new record back to the master.

[The review app](/docs/prism/usage/review-app) covers where the entry is.

## The completion guarantee

When a real writer is in place, this guarantee applies.

An item stays `pending` until the edge acts on it. Only then is it marked `done` or `failed`. Nothing is marked written on the central side, at enqueue time, or at any point before the edge reports back.

That is what makes the operation safe to repeat. A drain that never ran leaves every item pending, and running it later processes exactly those items. A write that failed is marked `failed` with its error, and is not silently counted as delivered.

This is also why the dry-run default is dangerous rather than merely useless. The edge did act, so the guarantee's mechanism is satisfied. The work the guarantee is about never happened.

## Where to go next

| Question | Document |
|---|---|
| How do I write a rule with a remote target? | [Create and edit rules](/docs/prism/usage/manage-rules) |
| How does the outbox work? | [Sync engine](/docs/prism/architecture/sync-engine) |
| How do I run the rule? | [Run a sync rule](/docs/prism/usage/sync) |
| How do I build a connector that writes? | [Writing a connector](/docs/prism/architecture/writing-a-connector) |
