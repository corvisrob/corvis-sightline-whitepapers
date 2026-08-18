An upgrade raises two questions about the data you already hold: do my records survive, and do my rules survive? They have different answers.

Read [Version compatibility](/docs/prism/upgrade/compatibility) for the product-version side of the same question.

## Records carry their own version

Every record carries a `schemaVersion`, a whole number. It records the schema the record was written against, and it travels with the record.

The schema registry holds schemas by name **and** by version. It can hold more than one version of the same schema at once. A record written against an older version therefore still has its schema available.

| Concept | Where it lives |
|---|---|
| The version a record was written against | The `schemaVersion` field on the record |
| The schemas themselves, by name and version | The schema registry |
| The current version for each schema | A constant in the registry |

## Nothing migrates your records

**When a schema version advances, your existing records are not rewritten.** No migration runs, at upgrade time or at read time. There is no migration command, and there is nothing for you to run.

Old records keep their `schemaVersion`. They stay valid against the version they were written with, because the registry keeps that version.

One thing does change. A data-quality check evaluates an assembled master record against the **latest** version of its schema, not the version the record was written with. After a schema advances, that check can report a record as incomplete when nothing about the record changed.

**That check is advisory.** Records are built up across sources over time, so incompleteness is an ordinary intermediate state rather than an error. It reports; it does not block a merge and it does not stop a collection.

### This has not happened yet

**Every schema is currently at version 1.** No schema in the product has advanced past its first version, so no installation has yet been through a schema-version change.

The model above is what the code does. It is not a description of an upgrade anyone has performed. Treat your first schema-version change as unverified, and read [Rollback](/docs/prism/upgrade/rollback) before you take it.

## Rules migrate on a command you run

Rules are the other half, and they behave differently. Rules move into storage only when you run the migration command.

`prism-migrate-rules` reads rule files and writes them into the `rules` collection of the configured storage backend. The CLI and the Windmill layer then read the same rules.

```bash
cd acme-central
npx prism-migrate-rules
```

It reads `rules/` by default. Pass a different directory as the first argument to read from somewhere else.

**Expected output.** A line reporting how many rules of how many files were migrated, the backend they went into, and the split between sync and reverse rules.

### Running it twice overwrites your edits

**The command is an upsert keyed on the rule's `id`.** A rule already in storage is **replaced** by the file's version. A rule not yet in storage is inserted.

That has a consequence worth stating plainly:

> If you edited a rule in the review interface, and an older copy of that rule is still sitting in your `rules/` directory, re-running this command **overwrites your edit** with the file.

Nothing warns you. The rule ids match, so the command does exactly what it was asked to do.

**Before you re-run it**, decide which copy is authoritative. If your edits live in storage, either remove the stale file or export the current rule over it first.

### What it skips

The command does not stop on a bad file. It skips it, warns, and carries on:

| Skipped | Why |
|---|---|
| A file that is not valid JSON | It cannot be parsed |
| A rule with no `id` field | There is no key to upsert on |
| A rule matching neither the sync nor the reverse shape | Its kind cannot be determined |

**Read the warnings.** The command exits with a non-zero status when it did not migrate every file it found. A skipped rule is therefore visible in the exit status, not only in the output.

## Verify after an upgrade

Confirm your rules are in storage and count as you expect:

```bash
cd acme-central
npx prism-migrate-rules
```

**Expected output.** A count matching the number of `.json` files in your `rules/` directory, and no skip warnings. A count lower than the file count means a file was skipped — read the warning above it.

Run this only when you intend the files to be authoritative. It is a write, not a status check.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| How do I upgrade Prism? | [Upgrading Prism](/docs/prism/upgrade/prism) |
| How do I review and edit rules? | [Reviewing changesets](/docs/prism/usage/review-changesets) |
