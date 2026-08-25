What must be present before you install Sightline Prism.

**What you need depends on what you install.** A collector node needs less than a central node. Each connector you choose can add a runtime of its own.

## Every install

| Requirement | Notes |
|---|---|
| Node.js 24 | The operator CLI pins this version. Earlier versions from Node 20 run the installer. |
| npm | It ships with Node.js. |

Download Node.js from [the Node.js download page](https://nodejs.org/en/download/). The page has builds for Windows and Linux.

The installer warns about an old Node.js version and then continues. It does not stop.

## Standalone Prism

| Requirement | Notes |
|---|---|
| `sightline-prism-latest.tar.gz` beside the installer | The installer reads the archive from its own directory. |
| A storage backend | MongoDB, PostgreSQL, or a local directory. See [Storage backends](/docs/prism/install/storage-backends). |

Prism installs into a [runtime instance](/docs/prism/install/runtime-instance). The procedure is in [Installing Standalone Prism](/docs/prism/install/prism).

## Windmill-hosted Prism

| Requirement | Notes |
|---|---|
| The `wmill` CLI on the path | The installer prints the install command if it is absent. |
| A Windmill workspace | The installer runs `wmill init` against it. |
| MongoDB Atlas, or a PostgreSQL server | The resource setup asks which one, then asks only for that backend's values. |
| The install archive beside the installer | The installer reads it from its own directory. |

Install the `wmill` CLI after you install Node.js. See [the Windmill CLI installation page](https://www.windmill.dev/docs/advanced/cli/installation) for the npm command.

The procedure is in [Installing Windmill-hosted Prism](/docs/prism/install/windmill).

## Connector runtimes

Install a runtime only for the connectors you choose.

| Runtime | Version | Needed by |
|---|---|---|
| Python | 3.9 or later | `local-host-python` |
| PowerShell | Any | `local-host-powershell`, `ad-computers` |

⛔ **A missing runtime does not fail the install.** Every Prism install ends with a system check. It reads each installed connector's declared requirements and runs each check command. A requirement it cannot satisfy produces a warning, and the install still reports success. The connector then fails the first time you run it.

The check sees only the connectors already in the [runtime instance](/docs/prism/install/runtime-instance). A connector you add later is not checked until the next install.

## Where to go next

| Question | Document |
|---|---|
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| How do I install Prism? | [Installing Standalone Prism](/docs/prism/install/prism) |
| How do I install the operator CLI? | [Installing the CLI](/docs/prism/install/cli) |
| How do I install the Windmill hosting? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
