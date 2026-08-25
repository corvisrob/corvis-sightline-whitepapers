The review app is the browser interface to the same operations the operator CLI provides. It runs in your Windmill workspace, and it is one of the two interfaces to a single product rather than a product of its own.

**It mirrors the review TUI closely, but no longer entry for entry.** It records the same decisions, with the same effects on your data. It adds two operations the terminal has no equivalent for, which cover a source whose connector cannot run.

**This page tells you where each operation is. It does not repeat the procedures** — those are written once, for both interfaces, and linked below. Following a stale second copy is exactly the failure this structure avoids.

Choose by where the operator is, not by capability. Someone on a jump host uses the CLI. Someone who needs to hand a review to a colleague without shell access uses the app.

## Getting there

Open your Windmill workspace and start the review app. [Installing Windmill-hosted Prism](/docs/prism/install/windmill) covers deploying it; [Upgrading Windmill-hosted Prism](/docs/prism/upgrade/windmill) covers moving it forward.

The app reads the same store as the CLI. A changeset you leave pending in one appears in the other.

## The menu, and where each entry is documented

| Menu entry | What it does | Procedure |
|---|---|---|
| **Review pending changes** | Walk each proposed field change and decide it | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| **Browse all changesets** | Every changeset, its detail, and rollback | [Browse datasets and changesets](/docs/prism/usage/browse) |
| **Browse a dataset's records** | Filter, sort, page and open a master record | [Browse datasets and changesets](/docs/prism/usage/browse) |
| **Re-run a sync rule** | Run one rule now, including a rule with a remote target | [Run a sync rule](/docs/prism/usage/sync) · [Run a write-back](/docs/prism/usage/write-back) |
| **Manage deferrals** | Browse and remove permanent suppressions | [Manage deferrals](/docs/prism/usage/deferrals) |
| **Manage rules** | Enable, disable, edit and create rules | [Create and edit rules](/docs/prism/usage/manage-rules) |
| **Run a script** | Run a deployed collector or write-back script and see its result | [Run a collector](/docs/prism/usage/collect) · [Run a write-back](/docs/prism/usage/write-back) |
| **Upload a document into a source's inbox** | Put a JSON document into a remote source's inbox by hand, for a source whose collector cannot run | No terminal equivalent — see below |
| **Complete a source's pending write-backs** | Read a source's queued writes, download them, and mark the ones you performed as done | [Run a write-back](/docs/prism/usage/write-back) |

## What differs from the CLI

The decisions and their effects are identical. A few practical differences are worth knowing.

**There are no key bindings.** The procedures name keys such as `a`, `r`, `d` and `D` because the terminal needs them. In the browser you click the equivalent control. The decision each one records is the same, and the distinction between reject, decline and decline-field matters just as much.

**There is no starting directory.** The CLI procedures open by telling you to change into a runtime instance. The app is already bound to a workspace and its store, so that step does not apply.

**Creating a rule does not ask which kind.** [Create and edit rules](/docs/prism/usage/manage-rules) says `n` asks for sync or reverse before the form. The app has no such step. Pick the target dataset and the direction follows it, exactly as it does at run time: a local target merges, a remote one pushes. The app only asks when it cannot tell, which means the target is not in the table registry. The rule you end up with is the same either way.

**Two entries have no terminal counterpart.** **Upload a document into a source's inbox** and **Complete a source's pending write-backs** both cover a source that no connector can reach. One puts data in. The other takes the queued writes out. The CLI has no command for either. The screens carry their own guidance, and [Run a write-back](/docs/prism/usage/write-back) explains what completing a write-back means.

Everything else in the linked procedures reads the same in either interface.

## Where to go next

| Question | Document |
|---|---|
| How do I install this layer? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
| What is the terminal equivalent? | [The operator CLI](/docs/prism/architecture/cli) |
| How do I start from nothing? | [First run](/docs/prism/usage/quickstart) |
