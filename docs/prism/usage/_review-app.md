The review app is the browser interface to the same operations the operator CLI provides. It runs in your Windmill workspace, and it is one of the two interfaces to a single product rather than a product of its own.

**It mirrors the review TUI closely, but no longer entry for entry.** It records the same decisions, with the same effects on your data. It adds the operations the terminal has no equivalent for: configuring a connector instance, and reaching a source whose connector cannot run.

**This page tells you where each operation is. It does not repeat the procedures**: those are written once, for both interfaces, and linked below.

Choose by where the operator is, not by capability. Someone on a jump host uses the CLI. Someone who needs to hand a review to a colleague without shell access uses the app.

## Getting there

Open your Windmill workspace. Start the review app. [Installing Windmill-hosted Prism](/docs/prism/install/windmill) covers deploying it; [Upgrading Windmill-hosted Prism](/docs/prism/upgrade/windmill) covers moving it forward.

The app reads the same store as the CLI. A changeset you leave pending in one appears in the other.

## The menu, and where each entry is documented

| Menu entry | What it does | Procedure |
|---|---|---|
| **Review** | Walk each proposed field change and decide it | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| **Browse** | Every changeset, its detail, and rollback | [Browse datasets and changesets](/docs/prism/usage/browse) |
| **Browse data** | Inboxes, local tables and outboxes: what a collector landed, what the rules merged, and what is queued to go back | [Browse datasets and changesets](/docs/prism/usage/browse) · [Run a write-back](/docs/prism/usage/write-back) |
| **Re-run** | Run one rule now, including a rule with a remote target | [Run a sync rule](/docs/prism/usage/sync) · [Run a write-back](/docs/prism/usage/write-back) |
| **Deferrals** | Browse and remove permanent suppressions | [Manage deferrals](/docs/prism/usage/deferrals) |
| **Rules** | Enable, disable, edit and create rules | [Create and edit rules](/docs/prism/usage/manage-rules) |
| **Connectors** | Configure a connector instance: read its fields, map them, collect from it, and write back to it | [Recipe](/docs/prism/install/bootstrap) § Part 4 |
| **Upload** | Put a JSON document into a remote source's inbox by hand, for a source whose collector cannot run | No terminal equivalent, see below |

### Browse data holds three views

Data moves inbox to local table to outbox, and each step answers a different question about the same records.

| View | What it answers |
|---|---|
| **Inboxes** | What a collector landed, before any rule has read it |
| **Local tables** | A consolidated dataset's records, after the rules merged them |
| **Outboxes** | A source's pending write-backs, and the screen that records the ones you performed by hand |

**Inboxes is where you confirm a collection.** A collector reports success even where the transmit is skipped, and a local table stays empty until a sync rule runs against the inbox.

### Local datasets are declared, not collected

A connector's dataset appears the first time that connector collects. A consolidated dataset belongs to no connector, so this hosting declares one as a `prism_local_table` resource in the workspace, alongside the storage and manifest resources. Duplicate one and change its `id` to add another.

The engine reads its table registry from the store rather than from Windmill, so a declaration is reconciled into it before it counts. **Rules** does that when it reads its dataset list, and **Re-run** does it before a rule starts. Both are idempotent, so neither costs anything on a workspace that is already in step.

### Connectors is where an instance is configured

A connector instance is one manifest resource, holding its identity, its credentials and its settings. The screen lists them, and drilling into one gives the run controls and what that instance collects.

**Refresh fields** asks the connector what it offers, and every connector answers. One that reads its source's catalogue, such as `jira-assets`, returns that source's fields and the keys you map them to. One with a fixed record shape, such as `crowdstrike`, returns the paths it collects and nothing to map, without contacting the source. An instance cannot collect until it has been refreshed once, because until then nothing says which fields that connector needs.

A connector with no write-back script shows no **Write back now**.

To add an instance, duplicate a manifest resource in Windmill and change `instance`. It appears in the list with nothing to register.

## What differs from the CLI

The decisions and their effects are identical. A few practical differences are worth knowing.

**There are no key bindings.** The procedures name keys such as `a`, `r`, `d` and `D` because the terminal needs them. In the browser you click the equivalent control. The decision each one records is the same, and the distinction between reject, decline and decline-field matters just as much.

**There is no starting directory.** The CLI procedures open by telling you to change into a runtime instance. The app is already bound to a workspace and its store, so that step does not apply.

**Identity and missing records are controls, not JSON.** [Create and edit rules](/docs/prism/usage/manage-rules) lists seven fields the terminal editor reaches only through `r`. The browser editor gives two of them their own panels, because both decide whether records link rather than what a mapping carries.

**Identity**, on a merge rule, holds the source's own id, the identity keys as a two-column grid, and the tie-break. A merge rule with no identity key writes a new master record for every record it reads. The panel says so where the keys are empty.

**Missing records**, on a push rule, decides what happens to a master the target system does not hold. A push addresses a record by the id the merge rule recorded, so a master with no id is skipped on every run. Turning this on has the connector create the record, and the id it returns becomes the address for every later run. The [recipe](/docs/prism/install/bootstrap) § 6c works an example through.

The other five fields are JSON in both interfaces.

**Creating a rule does not ask which kind.** [Create and edit rules](/docs/prism/usage/manage-rules) says `n` asks for sync or reverse before the form. The app has no such step. Pick the target dataset and the direction follows it, exactly as it does at run time: a local target merges, a remote one pushes. The app only asks when it cannot tell, which means the target is not in the table registry.

**Two operations have no terminal counterpart.** **Upload** and the **Outboxes** view under **Browse data** both cover a source that no connector can reach. One puts data in. The other takes the queued writes out. The CLI has no command for either. The screens carry their own guidance, and [Run a write-back](/docs/prism/usage/write-back) explains what completing a write-back means.

Everything else in the linked procedures reads the same in either interface.

## Where to go next

| Question | Document |
|---|---|
| How do I install this layer? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
| What is the terminal equivalent? | [The operator CLI](/docs/prism/architecture/cli) |
| How do I start from nothing? | [First run](/docs/prism/usage/quickstart) |
