# Installing Prism

The Prism installer creates a [runtime instance](/docs/prism/install/runtime-instance). It does not install Prism into the code checkout, and it does not install every package.

**A node gets only the packages it needs.** A collector node gets the connectors you name. A central node also gets the operator CLI and the sync engine.

Read [Prerequisites](/docs/prism/install/prerequisites) before you start.

## The two installers

| File | Platform |
|---|---|
| `install/install.sh` | macOS and Linux |
| `install/install.ps1` | Windows |

Both installers do the same work in the same order. They differ in how you write a flag, and in one other way: the shell installer accepts `-h` or `--help` and prints its usage, and the PowerShell installer has no help parameter. Read the comment block at the top of `install.ps1` instead.

Run each installer from the code checkout. It writes the runtime instance to the path you give it.

## Install a collector node

A collector node collects from one or more sources. It does not run syncs.

```bash
# macOS and Linux
./install/install.sh --dir ../acme-prism --connectors crowdstrike,jira-assets
```

```powershell
# Windows
./install/install.ps1 -Dir ../acme-prism -Connectors crowdstrike,jira-assets
```

## Install a central node

A central node runs the sync engine and the review TUI.

```bash
# macOS and Linux
./install/install.sh --dir ../acme-central --role central --connectors spreadsheet
```

```powershell
# Windows
./install/install.ps1 -Dir ../acme-central -Role central -Connectors spreadsheet
```

**A central node needs a second code checkout.** Read [The sibling checkout](#the-sibling-checkout) below before you run this command.

## The flags

The two installers take the same five options. Only the spelling differs.

| Shell | PowerShell | What it does | Default |
|---|---|---|---|
| `--dir` | `-Dir` | Where the runtime instance goes. | `./prism-run` |
| `--role` | `-Role` | What the node is for: `collector`, `central` or `both`. | `collector` |
| `--connectors` | `-Connectors` | The connectors to install, as a comma-separated list. | none |
| `--source` | `-Source` | Where the packages come from: `local` or `npm`. | `local` |
| `--registry` | `-Registry` | The registry to install from. Applies to `--source npm`. | none |

The PowerShell installer rejects a value outside the allowed set for `-Role` and `-Source`. The shell installer accepts the same values without checking them.

**Name at least one thing to install.** The installer stops when `--connectors` is empty and `--role` is `collector`, because that combination installs nothing.

### `--source local` and `--source npm`

`local` is the default. The installer builds this checkout, packs the packages it needs as tarballs, and installs those. No registry is involved.

`npm` installs the published packages instead. Use `--registry` with it when the packages come from a private registry.

## What the installer does

1. It checks for Node.js and npm, and stops when either is missing.
2. It resolves the package list from `--role` and `--connectors`.
3. It creates the runtime instance and marks it with a `package.json`.
4. It installs the packages into that directory.
5. It checks the system prerequisites of the connectors it installed.
6. It assembles the environment file.
7. It scaffolds a connector manifest for the first connector you named.

Steps 5 and 7 warn or skip rather than fail. The install reports success even when a system prerequisite is missing.

### The sibling checkout

`--role central` and `--role both` install the operator CLI. Under the default `--source local`, the installer packs the CLI from a **sibling checkout**, because the CLI is a separate repository.

The layout must be two siblings under a shared parent:

```
your-parent-directory/
├── sightline-prism/          this checkout
└── sightline-prism-cli/      the CLI checkout
```

The sibling must have run `npm install` before you install a central node. The installer checks for both the checkout and its `node_modules`, and stops with the path it expected when either is absent. It does not produce a central node without a CLI.

The full CLI installation procedure is in [Installing the CLI](/docs/prism/install/cli).

### The environment file

`install/assemble-env.mjs` builds the environment file. It reads the template that each installed package ships, drops the keys it has already seen, and writes one combined file.

It writes two files into the runtime instance:

| File | When it is written |
|---|---|
| `.env.example` | On every run. It is the current template. |
| `.env` | Only when no `.env` is present. |

**Your values survive a re-run.** The installer never overwrites an existing `.env`. After you add a connector, compare the refreshed `.env.example` against your `.env` and copy across any new key.

The installer supplies the variable names. **You supply the values.** Which variables appear depends on the connectors you installed. The storage variables always appear, because every install includes the SDK — those are described in [Storage backends](/docs/prism/install/storage-backends).

Never commit the runtime instance's `.env`.

### Where the prerequisite list comes from

The installer does not hold a list of which connector needs Python or PowerShell. Each connector declares its own requirement in its `package.json`, under a `prism.systemRequirements` field, and `install/check-system-deps.mjs` reads the connectors that are installed.

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

## Where to go next

| Question | Document |
|---|---|
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
| How do I install the operator CLI? | [Installing the CLI](/docs/prism/install/cli) |
| How do I install the Windmill layer? | [Installing the Windmill layer](/docs/prism/install/windmill) |
