Read this page before you run any install command. It explains the one idea that the rest of the installation documentation depends on.

## Two directories, and only one of them runs commands

Sightline Prism separates what you install from what you operate.

The **install directory** holds the installer and the archive it reads. Nothing you operate lives here, and operational commands do not run from here.

A **runtime instance** is a directory created by `node install.mjs --dir <path>`. It holds the environment file, the data directory, the connector manifests and the rule instances. Operational commands run from here.

The installer reads its own directory and writes a runtime instance somewhere else.

```
your-parent-directory/
├── prism-install/            install.mjs + the archive - the installer reads this
└── acme-prism/               the runtime instance - you run commands here
```

**One install directory can create many runtime instances.** A collector node and a central node are two instances built from the same archive.

## What the installer puts in a runtime instance

| Item | What it holds |
|---|---|
| `package.json` | Marks the directory as a runtime instance. The installer creates it when it is absent. |
| `node_modules/@sightline/` | The connectors and the CLI you chose. A node gets only the packages it needs. |
| `.env` | The environment values for this node. |
| `.env.example` | The template the installer assembles from the installed packages. |
| `.connectors/` | One directory for each connector manifest. |
| `rules/` | The rule instances, as one file for each rule. |
| `.data/` | The record store, when you choose the local storage backend. |

The installer writes `.env.example` on every run. It writes `.env` only when no `.env` is there.

A connector manifest sits at `.connectors/<type>.<instance>/manifest.json`. It names the connector type, the instance label and the asset schema. It holds credential references, never credential values.

## The two flags that shape the instance

| Flag | What it does | Default |
|---|---|---|
| `--dir` | Sets where the runtime instance goes. | `./prism-run` |
| `--role` | Sets what the node is for. | `collector` |

`--role` takes three values:

| Value | What the node gets |
|---|---|
| `collector` | The connectors you name, and nothing else. |
| `central` | The operator CLI, plus any connectors you name. |
| `both` | The same packages as `central`. |

A collector node runs near a data source. A central node runs the sync engine and the review TUI. Give each one its own directory.

The remaining flag, `--connectors`, chooses which connectors to install. See the [Installing Standalone Prism](/docs/prism/install/prism) guide for how to choose them.

## Why the commands must run from the instance

Prism resolves its own files against the **current working directory**. It does not search upward, and it does not read a configuration file that points elsewhere.

Four things resolve this way:

| What | How it resolves |
|---|---|
| The environment file | The runtime loads `.env` from the current directory. |
| The connector manifests | The loader reads `.connectors/` as a relative path. |
| The record store | The local backend resolves `.data` under the current directory. |
| The rule instances | The sync command reads `rules/<rule-id>.json` as a relative path. |

So the working directory decides which instance you operate. Change directory into the instance first. Then run the command.

```bash
cd acme-prism
npx prism-sync <rule-id>
```

## What goes wrong when you run from the install directory

**The commands do not tell you that you are in the wrong directory.** Read this section before you meet the problem.

The install directory holds `install.mjs` and the archive. It has no `.env`, `.connectors/` or `rules/`, because the installer wrote all three somewhere else. Each of the four lookups above therefore fails on its own terms:

| What you did | What you see |
|---|---|
| Ran a collector from the install directory | Missing-credential errors, because no `.env` was loaded. |
| Listed connector instances from it | An empty list. The loader treats a missing `.connectors/` as no instances, and reports no error. |
| Ran a sync from it | The rule is not found, although the rule exists in your instance. |
| Ran a collector with the local backend | A new, empty `.data` directory appears beside the installer. |

The last one is the most confusing, because nothing failed. The collector wrote a real snapshot to a real store: the wrong one. Your instance's data is untouched, and it looks like the collection did nothing.

If a command behaves as though your configuration does not exist, check the working directory before you check anything else.

## Where to go next

| Question | Document |
|---|---|
| What must be present first? | [Prerequisites](/docs/prism/install/prerequisites) |
| How do I create an instance? | [Installing Standalone Prism](/docs/prism/install/prism) |
| How do I install the operator CLI? | [Installing the CLI](/docs/prism/install/cli) |
| Where does the data go? | [Storage backends](/docs/prism/install/storage-backends) |
