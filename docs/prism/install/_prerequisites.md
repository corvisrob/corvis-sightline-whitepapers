# Prerequisites

This page lists what must be present before you install Sightline Prism, the operator CLI or the Windmill layer.

Every requirement on this page names the file it was read from. The source column is the last column of each table. If a requirement is not in a file, it is not on this page.

**The requirement set depends on what you install.** A collector node needs less than a central node. A connector adds its own requirements. Read the section for the product you install, then read [Connector requirements](#connector-requirements) for the connectors you choose.

## Node.js and npm

The installers refuse to run without Node.js and npm.

| Requirement | What the installer does | Source |
|---|---|---|
| Node.js on the path | The installer stops and tells you to install it. | `install/install.sh`, `install/install.ps1` |
| npm on the path | The installer stops. npm ships with Node.js. | `install/install.sh`, `install/install.ps1` |

### The Node version

**The three repositories do not state one Node version between them.** This page reports what each file says. It does not resolve them into a single number.

| Product | What the file states | Source |
|---|---|---|
| Prism | No minimum. The file declares no `engines` field. | `sightline-prism/package.json` |
| Operator CLI | Node 24. | `sightline-prism-cli/.nvmrc` |
| Windmill layer | No minimum. The file declares no `engines` field. | `sightline-prism-windmill/package.json` |

The Prism installers add two more figures, and the two disagree:

| When | What the installer prints | Source |
|---|---|---|
| Node.js is absent | Install Node 20 or later. | `install/install.sh`, `install/install.ps1` |
| Node.js is older than major version 18 | A warning that Node 18 or later is recommended. | `install/install.sh`, `install/install.ps1` |

**Neither installer fails on the Node version.** The version check prints a warning and continues.

The operator CLI is the only component with a pinned version, and it is the highest figure here. Install Node 24 if you install the CLI.

## Prism

| Requirement | Why | Source |
|---|---|---|
| Node.js and npm | The installer stops without them. | `install/install.sh` |
| A storage backend | Prism writes snapshots to MongoDB or to a local directory. | `packages/connector-sdk/src/lib/mongo.ts` |

Prism installs into a [runtime instance](/docs/prism/install/runtime-instance), not into its code checkout. The procedure is in [Installing Prism](/docs/prism/install/prism).

## Operator CLI

Installing a released CLI tarball needs nothing beyond Node and npm — the engine and its supporting packages are compiled into it. **Building the CLI from source** has one requirement that no other product has: **a second code checkout**.

| Requirement | Why | Source |
|---|---|---|
| Node 24 | The repository pins the version. | `sightline-prism-cli/.nvmrc` |
| A `sightline-prism` checkout beside the CLI checkout | Building the CLI consumes the engine, the SDK and the shared review logic as file dependencies of a sibling directory. Not needed to install a release. | `sightline-prism-cli/package.json` |
| The sibling checkout installed and built | An unbuilt sibling produces module-not-found errors; a stale one would be compiled into the tarball, so the build warns. | `sightline-prism-cli/package.json` |
| git | The Prism installer prints a `git clone` command when the sibling checkout is missing. | `install/install.sh` |

The order is not optional, and the failure it produces does not name its own cause. Read [Installing the CLI](/docs/prism/install/cli) before you start.

## Windmill layer

| Requirement | Why | Source |
|---|---|---|
| The `wmill` CLI on the path | The installer stops without it, and prints the install command. | `sightline-prism-windmill/install/install.sh` |
| A Windmill workspace | The installer runs `wmill init` against a target workspace. | `sightline-prism-windmill/install/install.sh` |
| A MongoDB Atlas cluster | The resource setup accepts an Atlas hostname only. The local backend does not apply. | `sightline-prism-windmill/install/setup-resource.mjs` |
| curl or wget | Needed only when you install without a gold-master checkout. | `sightline-prism-windmill/install/install.sh` |

The procedure is in [Installing the Windmill layer](/docs/prism/install/windmill).

## Connector requirements

Some connectors need a runtime that Node.js does not provide. Each connector declares its own requirements, and the installer reads them from the packages it installed.

| Runtime | Version | Needed by | Source |
|---|---|---|---|
| Python | 3.9 or later | The `local-host-python` connector | `packages/connectors/local-host-python/package.json` |
| PowerShell | No minimum stated | The `local-host-powershell` and `ad-computers` connectors | `packages/connectors/local-host-powershell/package.json`, `packages/connectors/ad-computers/package.json` |

Install a runtime only for the connectors you choose. A connector you do not install adds no requirement.

### What the installer checks, and what it does about it

`install/check-system-deps.mjs` runs at the end of every Prism install. Both installers call it, so the behaviour is the same on every platform.

The checker does three things:

1. It reads the requirements each installed connector declares.
2. It runs each requirement's check command, such as `python3 --version` or `pwsh -v`.
3. It prints a line for each requirement it finds, and a warning for each one it does not.

**The checker never fails the install.** A missing Python or PowerShell runtime produces a warning, and the install reports success. The connector that needs the runtime then fails when you run it.

The checker only sees the connectors that are already installed in the runtime instance. It reports nothing about a connector you add later.

| Behaviour | Source |
|---|---|
| Reads each installed package's declared requirements | `install/check-system-deps.mjs` |
| Warns, and never fails the install | `install/check-system-deps.mjs` |
| Runs on macOS, Linux and Windows | `install/check-system-deps.mjs` |

## What is not on this page

No page in this set states a hardware size, a network topology or a hosting recommendation. Those depend on your environment, and no file in these repositories states them.

## Where to go next

| Question | Document |
|---|---|
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| How do I install Prism? | [Installing Prism](/docs/prism/install/prism) |
| How do I install the operator CLI? | [Installing the CLI](/docs/prism/install/cli) |
| How do I install the Windmill layer? | [Installing the Windmill layer](/docs/prism/install/windmill) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
