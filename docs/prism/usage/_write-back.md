A write-back sends a value from a consolidated dataset back out to the source system it came from.

**It is a two-location operation, and that is the whole difficulty.** One half runs centrally. The other half runs wherever the source is actually reachable. Running only the first half looks like nothing happened.

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

There is no separate write-back command here. You run the rule, and the direction follows its target — a remote target enqueues instead of merging. [Run a sync rule](/docs/prism/usage/sync) covers that.

**Expected output.** The usual sync summary. The queued writes are in the source's outbox, not at the source.

## Half two: drain, at the edge

**Start where the source system is actually reachable.** That is often not the machine that ran the sync — it is the point of splitting the operation.

```bash
cd acme-edge
npx prism-drain <source>
```

**Expected output.** A line naming the outbox being drained, one line per item, and a summary counting written and failed.

## ⚠️ The shipped drain command writes nothing

**Read this before you run `prism-drain` against a real queue.**

The command that ships is a **reference implementation**. It uses a dry-run writer that only prints what it would do. It does not contact your source system, and it does not write any value anywhere.

It still marks every item it processed as **done**.

So running it against a real outbox has one observable effect: **your queued write-backs are consumed and marked complete, and nothing reaches the source.** The summary reports items written. Nothing was written.

Each line it prints is tagged as a dry run, and the opening line says so too. That tag is the only thing distinguishing a real drain from this one.

**A production write-back needs a connector that supplies its own writer**, backed by its authenticated API client. A connector does that by using the drain routine from the SDK and passing that writer in. Until a connector does that for your source, treat the queue as unattended and do not drain it.

## The completion guarantee

When a real writer is in place, the guarantee is worth knowing.

An item stays **pending** until the edge acts on it. Only then is it marked `done` or `failed`. Nothing is marked written on the central side, at enqueue time, or at any point before the edge reports back.

That is what makes the operation safe to repeat. A drain that never ran leaves every item pending, and running it later processes exactly those items. A write that failed is marked `failed` with its error, and is not silently counted as delivered.

This is also why the dry-run default is dangerous rather than merely useless: it satisfies the guarantee's mechanism — the edge did act — without doing the work the guarantee is about.

## Where to go next

| Question | Document |
|---|---|
| How do I write a rule with a remote target? | [Create and edit rules](/docs/prism/usage/manage-rules) |
| How does the outbox work? | [Sync engine](/docs/prism/architecture/sync-engine) |
| How do I run the rule? | [Run a sync rule](/docs/prism/usage/sync) |
| How do I build a connector that writes? | [Writing a connector](/docs/prism/architecture/writing-a-connector) |
