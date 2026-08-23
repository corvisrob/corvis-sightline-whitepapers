The Windmill layer runs the collectors and the review app inside a Windmill workspace. It installs into a Windmill repository directory, not into a Prism [runtime instance](/docs/prism/install/runtime-instance).

Read [Prerequisites](/docs/prism/install/prerequisites) before you start. For what this layer is, read [Windmill layer](/docs/prism/architecture/windmill).

## The Windmill layer runs on MongoDB or PostgreSQL

**This layer does not support the local storage backend.** The local store is single-process, and Windmill runs concurrent workers. The installer sets up one storage resource and asks which of the two shared backends it names.

If you tried Prism on a workstation with the local backend, that choice does not carry over. Read [Storage backends](/docs/prism/install/storage-backends) for what the backends are and why they hold separate data.

**A PostgreSQL server must be reachable from the Windmill workers.** That is a smaller condition than it sounds for a self-hosted Windmill sitting in the same network, and a real one for Windmill Cloud: the workers reach your server from the public internet, so a firewalled server must allow their egress. Windmill publishes no static egress IP list for its cloud, so ask their support for the worker group's external range, run a self-hosted worker inside your network, or use a private endpoint. A worker that cannot get through reports `connect ETIMEDOUT`, not a credentials error.

## Before you run the installer

You need three things beyond the [prerequisites](/docs/prism/install/prerequisites):

1. A Windmill workspace, created in the Windmill user interface.
2. That workspace registered with your `wmill` CLI.
3. A MongoDB Atlas cluster, with a username and a password for it.

The installer runs `wmill init`, which offers only the workspaces already registered with the CLI. When a workspace you just created is not listed, register it first:

```bash
wmill workspace add <profile-name> <workspace-id> <remote-url>
```

Then run the installer.

### Obtaining the gold master

The installer runs from a checkout of the Windmill layer, which Corvis distributes privately. Ask Corvis for access. You need an access token, supplied to the installer as `SIGHTLINE_TOKEN`, to download the layer without a checkout.

## The install command

```bash
./install/install.sh --dir ../acme-prism-windmill --connectors crowdstrike,jira-assets
```

| Flag | What it does | Required |
|---|---|---|
| `--dir` | Where the Windmill repository goes. | Yes. The installer stops without it. |
| `--connectors` | The connectors to set up, as a comma-separated list. | No |
| `--help` | Prints the usage. `-h` also works. | No |

That is the whole list. The installer takes no other flag.

## What the installer does

1. It checks for the `wmill` CLI, and stops when it is absent.
2. It copies the layer's content into the target directory, unless content is already there.
3. It runs `wmill init` to bind the directory to a workspace, unless it is already bound.
4. It sets up the storage resource, unless that resource is already set up.
5. It sets up each connector you named, and skips any that is already set up.
6. It regenerates the script and app metadata.
7. It previews the deployment, and stops.

**Step 7 is where the installer ends.** Read [The install does not deploy](#the-install-does-not-deploy) before you expect a working workspace.

**Nothing in this list overwrites existing work.** Each step tests for what it would create and skips when it finds it. Re-running the installer on an installed directory is safe, and it is how you add a connector later.

### The compiled code travels with the install

The layer carries the compiled engine, connector SDK, shared review logic and connectors inside the directory it installs. It does not read a sibling `sightline-prism` checkout, and it does not need one. The operator CLI ships the same way — it compiles those packages into its own entry points — so neither component's *install* has a two-checkout requirement. Building either from source still does.

## The storage resource

`install/setup-resource.mjs` sets up the connection to your store. The installer calls it, and it asks which backend first — `mongo` or `postgres` — then only for that backend's values.

For **MongoDB**:

| Value | Type |
|---|---|
| The Atlas hostname | Plain text. It must be the full hostname, not the cluster code. |
| The MongoDB username | Plain text |
| The MongoDB password | Masked. It never appears on screen. |
| The database name | Plain text. Defaults to `prism`. |

The script rejects a hostname that is not an Atlas hostname, and asks again.

For **PostgreSQL**:

| Value | Type |
|---|---|
| The host | Plain text. There is no shape check: a Postgres server sits on no particular domain, so anything rejected here would be a guess. |
| The port | Plain text. Defaults to `5432`. |
| The database name | Plain text. Defaults to `prism`. |
| The username | Plain text |
| The password | Masked. It never appears on screen. |
| `sslmode` | Plain text. Defaults to `require`. |
| The schema | Plain text. Defaults to `public`. |

**Leave `sslmode` at `require` unless your server genuinely does not use TLS.** A managed server refuses a plain connection and reports it as `no pg_hba.conf entry for host ...`, which reads like a firewall or permissions problem and is neither.

Either way the script stores the password as a Windmill secret variable and writes the resource to `f/prism/storage`. The password is not written to a file in the repository. It also pushes the `prism_storage` resource type, so a first-ever install works against a workspace that has never seen it.

## Connectors

`install/connectors.json` is the catalog of connectors this layer can deploy. Each entry names a collector template, a resource type, and the credential fields to ask for.

```jsonc
"<connector-name>": {
  "template": "<collector-template-file>",
  "resourceType": "<windmill-resource-type>",
  "fields": [
    { "name": "<field-name>", "secret": false },
    { "name": "<field-name>", "secret": true },
    { "name": "<field-name>", "secret": false, "default": "<default-value>" }
  ]
}
```

| Key | What it does |
|---|---|
| `template` | The collector template copied into the workspace for this connector. |
| `resourceType` | The Windmill resource type the credentials are pushed as. |
| `fields` | The values the installer asks for, in order. |
| `secret` | When true, the prompt is masked and the value is stored as a Windmill secret variable. |
| `default` | Offered at the prompt. Press enter to accept it. |

**To change which connectors are available, edit this file.** Add an entry, name a template that exists, and list the fields that connector needs. A connector name the installer cannot find in this file is rejected, and the installer tells you to add it.

Four connectors ship in the catalog: `crowdstrike`, `cylance`, `azure-vms` and `jira-assets`.

**A secret field never reaches a file in the repository.** The installer pushes it as a Windmill secret variable and stores a reference to it in the resource.

## The install does not deploy

The installer finishes with a **preview**, not a deployment. It runs the deploy command in preview mode and prints what would change.

Read that output. Then deploy:

```bash
cd ../acme-prism-windmill
wmill sync push
```

This is deliberate. You see the whole change set before anything reaches your workspace.

**Confirm the deployment landed.** Run the preview again:

```bash
wmill sync push --dry-run
```

**Expected output.** No remaining changes. A second preview that still lists the same scripts and resources means the push did not complete. Read the output of the push itself for the reason.

## Verify the install

Confirm the resource setup completed, from inside the install directory:

```bash
cd ../acme-prism-windmill
ls wmill.yaml f/prism/storage.resource.yaml
```

**Expected output.** Both paths, each listed once. A missing `wmill.yaml` means `wmill init` did not complete, and the directory is not bound to a workspace.

Then confirm each connector you named has its credentials resource:

```bash
ls f/prism/*_credentials.resource.yaml
```

**Expected output.** One file for each connector you named, such as `f/prism/crowdstrike_credentials.resource.yaml`.

Then preview the deployment again. It changes nothing, so it is safe to repeat:

```bash
wmill sync push --dry-run
```

**Expected output.** A list of the scripts, apps and resources that would deploy. An authentication error here means the workspace binding did not complete.

## Add a connector later

Run the installer again against the same directory:

```bash
./install/install.sh --dir ../acme-prism-windmill --connectors cylance
```

The installer detects the existing install and adds to it. It skips the workspace binding and the storage resource, and sets up only the new connector.

To redo a connector's credentials, delete its resource file first. The installer skips a connector whose resource file is already present.

## Where to go next

| Question | Document |
|---|---|
| What is the Windmill layer? | [Windmill layer](/docs/prism/architecture/windmill) |
| Which storage backend do I choose? | [Storage backends](/docs/prism/install/storage-backends) |
| How do I install Prism itself? | [Installing Prism](/docs/prism/install/prism) |
| What is the terminal equivalent of the review app? | [Operator CLI](/docs/prism/architecture/cli) |
