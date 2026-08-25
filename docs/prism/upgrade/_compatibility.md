Sightline Prism, the operator CLI and the Windmill layer each release on their own cadence. They are not independent of each other.

**Read this page before you upgrade any of them.** An upgrade that moves one component without the others can produce a combination nobody has run.

## The three states

Every combination on this page carries one of three states. The third one matters most.

| State | What it means |
|---|---|
| **Supported** | The combination was built and tested together. The evidence is named in the row. |
| **Unsupported** | The combination is known not to work. |
| **Unverified** | Nobody has tested this combination. |

**Unverified is not a soft "supported".** It is also not a warning that something is broken. It means the question has not been answered, and you are the first person to ask it. Treat an unverified combination as a change to test in a non-production instance first.

A row is marked supported only when it names its evidence. A row with no evidence is unverified, however likely it looks.

## Where the coupling comes from

The operator CLI consumes the sync engine, the connector SDK and the shared review logic from a `sightline-prism` checkout. That coupling reaches a release in a specific way.

The CLI's release workflow checks out `sightline-prism` at a `prism_ref` input, which **defaults to `main`**. It builds the engine, the SDK and the review logic from that checkout, then compiles them into the CLI's own entry points.

Two consequences follow, and both surprise people:

1. **A CLI release contains a specific Prism build, not a Prism version.** The workflow pins a commit, and a commit is not a version number.
2. **A released CLI needs no `sightline-prism` checkout to run.** The engine travels inside it. The two-checkout requirement applies to building the CLI from source, not to installing a release.

### The record you cannot look up

**No CLI release records which Prism commit it was built from.** The release notes are a fixed line of text, and the packed artifact carries no build stamp.

So you cannot answer "which engine is inside CLI v2.0.1?" from the release. If you need that answer, ask Corvis. Do not infer it from the version numbers — they move independently, and a matching major and minor number means nothing about what was compiled in.

## Released versions

| Product | Latest release | How it is distributed |
|---|---|---|
| Sightline Prism | `v2.0.0`, released 2026-07-11 | Inside the Standalone Prism install archive |
| Operator CLI | `v2.0.1` | Inside the same archive, selected by `--role central` |
| Windmill layer | No tagged release | An archive the Windmill installer downloads |

The Windmill layer does not tag versions. It distributes one current archive. Your version is therefore the date you last ran its update, not a number.

## The matrix

| Combination | State | Evidence |
|---|---|---|
| A CLI release, with the engine compiled into it | **Supported** | The release workflow asserts the sibling packages resolve, then runs the type checker and the full test suite against that exact engine build before it packs the tarball. A release that failed either check was never published. |
| A CLI release, against a **separately installed** Prism version | **Unverified** | No release records its `prism_ref`, so the pair cannot be identified, let alone confirmed. |
| A CLI built from source, against the sibling checkout it was built from | **Supported** | The build stops when a sibling has no build, and warns when a sibling's source is newer than its build. |
| A CLI built from source, against a **different** Prism checkout than the one it was built against | **Unsupported** | The engine is compiled in at build time. A later change to the sibling checkout does not reach an already-built CLI, so the two silently disagree. |
| The Windmill layer, against any Prism version | **Unverified** | The layer carries its own vendored build of the engine, SDK and connectors, and has no tagged release to pair against. |
| The Windmill layer and a CLI, against one MongoDB store | **Unverified** | Both read the same store, and no test covers them running against it together. |

## Breaking changes in 3.0.0

Version 3.0.0 adds the PostgreSQL backend and moves storage behind a proper adapter layer. Two things that worked in 2.x stop working, and neither fails gradually.

| What changed | What breaks | What to do |
|---|---|---|
| The storage module moved. `lib/mongo.js` no longer exists. | Any import of `@sightline/prism-connector-sdk/lib/mongo.js` fails to resolve. | Import the storage instance from `@sightline/prism-connector-sdk/lib/storage/index.js`, and `MongoStorage` from `.../lib/storage/mongo.js`. |
| The debug admin helpers take a store, not a connection string. `mongo-admin.js` is now `storage-admin.js`. | `snapshotDatabase`, `restoreDatabase`, `listRules`, `deleteRules`, `inspectCollection`, `clearCollections`, `upsertRules` and `listSnapshots` no longer accept `(uri, dbName, …)`. | Pass a connected storage instance as the first argument in place of the two connection parameters. The names and return shapes are unchanged. |

Both breaks surface at build time rather than at run time, which is deliberate: the Windmill layer's vendored bundle names every export it uses, so a rename fails the bundle build instead of producing an `undefined is not a function` on a worker.

**An unrecognised `STORAGE_BACKEND` now stops the runtime at startup.** In 2.x, any value that was not `local` selected MongoDB, so a typo wrote to the wrong store and nothing reported it. If you have a node whose `STORAGE_BACKEND` has been quietly misspelled, it worked before and will refuse to start now — read [Storage backends](/docs/prism/install/storage-backends) and set the value you actually meant. Its records are in whichever store it has been writing to.

## Schema versions are a second axis

Product versions are not the only compatibility question. The records already in your store carry their own version.

Every record carries a `schemaVersion`, and the schema registry holds more than one version of each schema. So a newer engine reading records written by an older one is the ordinary case, not an error case.

That axis has its own page, because it decides whether your existing snapshots survive an upgrade: [Schema versions and rule migration](/docs/prism/upgrade/schema-migration).

## Before you upgrade

1. Find your current version of each component you run.
2. Find the combination you intend to move to in the matrix above.
3. If it is unverified, upgrade a non-production instance first.
4. Read [Rollback](/docs/prism/upgrade/rollback) before you start, not after.

## Where to go next

| Question | Document |
|---|---|
| How do I upgrade Prism? | [Upgrading Prism](/docs/prism/upgrade/prism) |
| How do I upgrade the CLI? | [Upgrading the CLI](/docs/prism/upgrade/cli) |
| How do I upgrade the Windmill hosting? | [Upgrading Windmill-hosted Prism](/docs/prism/upgrade/windmill) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
