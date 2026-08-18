A collector reads one source and transmits a snapshot into Prism. This page covers running one.

**Start in your [runtime instance](/docs/prism/install/runtime-instance), not in the code checkout.** A collector resolves its manifest, its environment and its data directory against the current directory. Run it anywhere else and it finds none of them.

```bash
cd acme-prism
```

## One collector, many instances

A connector is code. An instance of it is a [connector manifest](/docs/prism/architecture/connector-model), at `.connectors/<type>.<instance>/manifest.json`.

You name the instance when you run the collector. The collector reads that manifest for its schema and its credential references, then transmits to that instance's inbox.

So a single `crowdstrike` connector can serve two tenants as `crowdstrike.prod` and `crowdstrike.test`, with separate manifests and separate inboxes.

## Start with a mock

Two connectors need no credentials at all: `aws-ec2-mock` and `jira-assets-mock`. They generate synthetic records.

Run one first. It confirms the mechanics — manifest, transmit, storage — before any real credential is involved.

1. Change into your runtime instance.
2. Run the mock collector, naming an instance.

```bash
cd acme-prism
npx prism-collect-aws-ec2-mock demo
```

**Expected output.** A short run log. The collection starts, then records are transformed to the `AssetComputer` schema. A snapshot is created with a total count and a valid count. A final line confirms the transmit to `inbox_aws-ec2-mock.demo`.

The last line is the one that matters. **No transmit line means no data reached the store**, whatever else the log says.

## Run a credentialed collector

A real connector needs its credentials in the instance's environment. The manifest holds references; the values live in `.env`.

1. Confirm the manifest exists for the instance you intend to run.
2. Confirm the credential variables it references are set in your `.env`.
3. Run the collector, naming the instance.

```bash
cd acme-prism
npx prism-collect-crowdstrike prod
```

**Expected output.** The same shape as the mock: fetch, transform, snapshot counts, then a transmit line naming `inbox_crowdstrike.prod`.

A missing credential fails the run and names the variable. That is the intended behaviour — a collector stops rather than running half-authenticated.

### From a code checkout instead

If you work in the code checkout rather than an installed instance, the commands differ. Use the npm scripts, and pass the instance after `--`:

```bash
npm run collect:crowdstrike -- prod
```

**These two forms are not interchangeable.** The instance form is what an operator runs. The checkout form is for development, and it resolves its data directory against the checkout.

## The PowerShell agents are different

Two connectors run as PowerShell agents on the Windows machine being inventoried. They do not use the commands above, **and they do not work the same way as each other.**

| Connector | Shape |
|---|---|
| `local-host-powershell` | One script. Collects and writes in a single run. |
| `ad-computers` | **Two scripts.** Collect to a file, then push that file. |

### `local-host-powershell` — one script

It collects local system information and writes the snapshot in one run. There is no intermediate file and no second step.

```powershell
.\Collect-LocalHost.ps1
```

It needs the `Mdbc` PowerShell module to reach MongoDB.

**Expected output.** A run log ending with the snapshot written.

### `ad-computers` — two scripts

⚠️ **This one is a two-step operation, and stopping after the first step is the common mistake.**

The first script queries Active Directory and writes a **YAML file on disk**. It does not reach MongoDB. The second script reads that file and writes it in.

1. On a domain-joined host, collect to a file.

   ```powershell
   .\Collect-ADComputers.ps1
   ```

   **Expected output.** A YAML file written beside the script, with a timestamped name.

2. Push that file into the store.

   ```powershell
   .\Push-ADSnapshot.ps1
   ```

   **Expected output.** Confirmation that the snapshot was written. The script finds the most recent YAML file in its own directory when you give it no path.

**If you run only the first script, you have a file and no data in Prism.** Nothing reports an error, because nothing failed — the second half simply never ran.

The two scripts can run on the same machine. When the domain-joined host cannot reach MongoDB, copy the YAML file to a machine that can and run the push there. `Push-ADSnapshot.ps1` accepts a path, a connection and a database.

## Confirm the collection landed

The transmit line in the run log is the first signal. To confirm independently, browse the dataset the collector wrote to — see [Browse datasets and changesets](/docs/prism/usage/browse).

## Validate schemas

Schema validation is a separate check. It confirms that the schema definitions themselves are sound, not that your collected data is correct.

**Run it from the code checkout**, not from a runtime instance — it runs against the schema sources.

```bash
cd sightline-prism
npm run schemas:validate
```

**Expected output.** A pass result with no reported failures.

### What a failure means

A validation failure here points at the **schema definitions**, not at your collected records. It means a schema in the registry does not hold together — a version is missing, or a definition is malformed.

That is a code-level problem, not an operational one. It is not the check that tells you a collector produced bad data. A collector validates its own records as it runs, and reports the valid count in its snapshot summary. A total higher than the valid count is the signal that records were rejected.

If schema validation fails after an upgrade, the installed packages are inconsistent. Read [Upgrading Prism](/docs/prism/upgrade/prism).

## Where to go next

| Question | Document |
|---|---|
| How do I merge what I collected? | [Run a sync rule](/docs/prism/usage/sync) |
| How do I see what arrived? | [Browse datasets and changesets](/docs/prism/usage/browse) |
| What is a connector manifest? | [Connector model](/docs/prism/architecture/connector-model) |
| How do I add a connector? | [Writing a connector](/docs/prism/architecture/writing-a-connector) |
