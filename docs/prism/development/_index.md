This section is for a contributor who builds Prism from source. It is not for an
operator who installs it.

**An operator needs none of it.** An install is two files in one directory and one
command, described in [Installing Standalone Prism](/docs/prism/install/prism). Nothing in
that procedure involves a repository, a build, or a registry.

## The repositories

Three repositories make up the product.

| Repository | What it holds |
|---|---|
| `sightline-prism` | The sync engine, the connector SDK, the connectors, the installer |
| `sightline-prism-cli` | The operator CLI: the review TUI and the four scripts beside it |
| `sightline-prism-windmill` | Windmill-hosted Prism: the collector scripts, the review app, its installer and updater |

Only one of them needs a second checkout to build, and [Building the operator CLI](/docs/prism/development/building-the-cli) covers why.

## Development commands

Run these from `sightline-prism`.

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Build | `npm run build` |
| Test | `npm test` |
| Test with coverage | `npm run test:coverage` |
| Build the distributable bundles | `npm run bundle` |
| Validate the schemas | `npm run schemas:validate` |

Cross-package imports resolve through the root `tsconfig.json` `paths` map, and
`vitest.config.ts` mirrors that map as a Vite alias. Development needs no build
first. A release does.

## Where commands run

A checkout holds code. **Operational commands never run from it.** They run from a
[runtime instance](/docs/prism/install/runtime-instance), which holds `.env`,
`.connectors/`, `rules/` and `.data/`.

Prism resolves all four against the **current working directory**. It does not
search upward, and it reads no configuration file pointing elsewhere. A command run
from a checkout therefore fails in four different ways, none of which names the
cause:

| What you did | What you see |
|---|---|
| Ran a collector | Missing-credential errors, because no `.env` was loaded |
| Listed connector instances | An empty list, reported as success. A missing `.connectors/` reads as no instances |
| Ran a sync | The rule is not found, although it exists in your instance |
| Ran a collector on the local backend | A new, empty `.data/` appears in the checkout |

The last is the worst. Nothing failed, a real snapshot reached a real store, and it
was the wrong one. If a command behaves as though your configuration does not exist,
check the working directory before anything else.

## Node version

The three repositories do not state one Node version between them.

| Component | What its own file states | Source |
|---|---|---|
| Prism | No minimum. No `engines` field. | `package.json` |
| Operator CLI | Node 24. | `sightline-prism-cli/.nvmrc` |
| Windmill-hosted Prism | No minimum. No `engines` field. | `sightline-prism-windmill/package.json` |

The installer adds two more figures, and they disagree: it names Node 20 when npm is
absent, and it warns below major version 18. It fails on neither.

The operator CLI is the only component with a pinned version, and it is the highest
figure here. Install Node 24 if you build the CLI.

## Where to go next

| Question | Document |
|---|---|
| Why does the CLI need two checkouts? | [Building the operator CLI](/docs/prism/development/building-the-cli) |
| How do I run an installer I just changed? | [Testing an install](/docs/prism/development/testing-an-install) |
| How is a release cut? | [Cutting a release](/docs/prism/development/releasing) |
| What are the rules for editing a page? | [Writing documentation](/docs/prism/development/documentation) |
