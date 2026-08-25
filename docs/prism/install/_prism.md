An install is two files in one directory, and one command.

The installer creates a [runtime instance](/docs/prism/install/runtime-instance), and installs Prism there rather than in the directory it runs from.

**A node gets only the packages it needs.** A collector node gets the connectors you name. A central node also gets the operator CLI and the sync engine.

Read [Prerequisites](/docs/prism/install/prerequisites) before you start.

## What Corvis supplies

Two files. Put them in the same directory.

| File | What it is |
|---|---|
| `install.mjs` | The installer. One script, for macOS, Linux and Windows. |
| `sightline-prism-latest.tar.gz` | Every package a node can need, in one archive. |

The installer reads the archive from its own directory. Without it, the installer stops and names the file it expected.

**There is one installer, and it runs the same way everywhere.** You run it with Node, which the install needs in any case:

```bash
node install.mjs --help
```

## Install a collector node

A collector node collects from one or more sources. It does not run syncs.

```bash
node install.mjs --dir ../acme-prism --connectors crowdstrike,jira-assets
```

## Install a central node

A central node runs the sync engine and the review TUI.

```bash
node install.mjs --dir ../acme-central --role central --connectors spreadsheet
```

**The operator CLI is already in the archive.** `--role central` selects it. There is nothing further to obtain and nothing further to install.

## The flags

The installer takes three options.

| Flag | What it does | Default |
|---|---|---|
| `--dir` | Where the runtime instance goes. | `./prism-run` |
| `--role` | What the node is for: `collector`, `central` or `both`. | `collector` |
| `--connectors` | The connectors to install, as a comma-separated list. | none |

`-h` or `--help` prints the usage and stops.

**Name a role the installer knows.** A value outside `collector`, `central` and `both` stops the install. A typed mistake therefore fails, rather than quietly giving you a collector when you asked for a central node.

**Name at least one thing to install.** The installer stops when `--connectors` is empty and `--role` is `collector`, because that combination installs nothing.

**Name a connector the archive holds.** The installer stops when it cannot find one you named, and it lists what the archive does hold. A misspelt connector name fails the install rather than producing a node without its collector.

## What the installer does

1. It checks for Node.js and npm, and stops when either is missing.
2. It resolves the package list from `--role` and `--connectors`, and stops when the archive is not beside it.
3. It creates the runtime instance and marks it with a `package.json`.
4. It extracts the archive, and selects the packages it resolved **by name**.
5. It installs those packages into the runtime instance.
6. It checks the system prerequisites of the connectors it installed.
7. It assembles the environment file.
8. It scaffolds a connector manifest for the first connector you named.

Steps 6 and 8 warn or skip rather than fail. The install reports success even when a system prerequisite is missing.

**Step 4 is what keeps a node small.** The archive carries every connector. The installer takes only the ones you asked for. A collector node never receives the operator CLI, and never a connector it does not run.

### The environment file

The installer builds the environment file from the template that each installed package ships. It drops the keys it has already seen, and writes one combined file.

It writes two files into the runtime instance:

| File | When it is written |
|---|---|
| `.env.example` | On every run. It is the current template. |
| `.env` | Only when no `.env` is present. |

**Your values survive a re-run.** The installer never overwrites an existing `.env`. After you add a connector, compare the refreshed `.env.example` against your `.env` and copy across any new key.

The installer supplies the variable names. **You supply the values.** Which variables appear depends on the connectors you installed. The storage variables always appear, because every install includes the SDK. [Storage backends](/docs/prism/install/storage-backends) describes those.

Never commit the runtime instance's `.env`.

### Where the prerequisite list comes from

The installer does not hold a list of which connector needs Python or PowerShell. Each connector declares its own requirement in its `package.json`, under a `prism.systemRequirements` field, and the installer reads the connectors that it installed.

A connector that needs no extra runtime declares an empty list. [Writing a connector](/docs/prism/architecture/writing-a-connector) covers the field for connector authors. [Prerequisites](/docs/prism/install/prerequisites) lists what the shipped connectors declare today.

## Verify the install

Change into the runtime instance. Then list the entry points that the install produced.

```bash
cd ../acme-prism
ls node_modules/.bin/
```

**Expected output.** One entry point for each connector you installed, named `prism-collect-<connector>`. A collector node installed with `--connectors crowdstrike` lists `prism-collect-crowdstrike`.

A central node also lists the five CLI entry points:

```
prism-drain
prism-migrate-rules
prism-review
prism-seed-tables
prism-sync
```

Then confirm the instance has its own configuration:

```bash
ls .env .connectors
```

**Expected output.** The path `.env`, and a `.connectors` directory holding one manifest directory for the first connector you named.

An empty `node_modules/.bin/` means the install did not complete. Re-run the installer and read its output from the top.

## Add a connector later

Run the installer again against the same directory, and name the new connector.

```bash
node install.mjs --dir ../acme-prism --connectors cylance
```

The installer adds the connector and leaves your `.env` alone. Compare the refreshed `.env.example` against your `.env` afterwards, and copy across any new key.

## Where to go next

| Question | Document |
|---|---|
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
| What is the operator CLI? | [Installing the CLI](/docs/prism/install/cli) |
| How do I install the Windmill hosting instead? | [Installing Windmill-hosted Prism](/docs/prism/install/windmill) |
