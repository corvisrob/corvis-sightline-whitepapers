A start-to-finish setup for one real pipeline: CrowdStrike endpoints collected into a consolidated dataset, pushed out to Jira as CMDB issues, and read back from Jira so the two stay linked.

This page assembles the other install pages into one ordered path and adds the parts that are specific to this pipeline — chiefly the three rule mappings. Where another page owns a step, this one links to it rather than repeating it.

**This page sets up a real environment.** For a credential-free rehearsal on a workstation — synthetic data, no CrowdStrike tenant and no Jira site — use the synthetic fixture demo that ships in the repository under `demo/`.

## What you end up with

```
CrowdStrike  ──(1) collect──>  inbox  ──(2) sync rule──>  consolidated-assets
                                                                │      ▲
                                                    (4) reverse │      │ (3) sync rule
                                                        + mirror│      │
                                                                ▼      │
                                                              Jira issues
```

Three rules, because the round trip is three legs:

| Rule | Direction | What it decides |
|---|---|---|
| `crowdstrike-sync` | CrowdStrike → consolidated | Which agent-reported fields land, and at what priority |
| `jira-assets-sync` | Jira → consolidated | Which CMDB fields land, deliberately *below* CrowdStrike on anything both report |
| `technical-to-jira` | consolidated → Jira | Which merged values get written back, and whether unlinked hosts get an issue created |

The second and third are what make it a loop rather than two one-way feeds: Jira's own static entries come in low, CrowdStrike's live-observed values win, and the winner is pushed back out over Jira's stale copy.

## Before you start

Read [Prerequisites](/docs/prism/install/prerequisites), then [Installing Prism](/docs/prism/install/prism) and [The runtime instance](/docs/prism/install/runtime-instance). **Commands below run from a runtime instance, not from the checkout** — that page explains why, and it is the most common early mistake.

You also need, and this page assumes you have arranged:

- A PostgreSQL server reachable from wherever the collectors run.
- CrowdStrike API credentials with the read scopes the connector needs.
- **A Jira project you administer.** Creating the project, its issue type and its custom fields is your job — Part 3 says exactly which fields, and the rest of this page assumes they exist.

---

## Part 1 — PostgreSQL

Read [Storage backends](/docs/prism/install/storage-backends) first; it is the authority on the variables and on what each backend costs you.

For this pipeline:

```bash
export STORAGE_BACKEND=postgres
export POSTGRES_URI='postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require'
```

Two things that bite:

- **`pg` is an optional dependency.** `npm install pg` on any node that selects `postgres`. Selecting it without the driver stops at startup and says so.
- **A managed server refuses a non-TLS connection, and the refusal does not mention TLS.** It reports `no pg_hba.conf entry for host ...`, which reads like a firewall problem. `sslmode=require` above is what avoids it.

There is no schema to create. Tables are made on first write to each collection.

**Confirm before going on.** The backend is named in the startup log of any command that touches storage; [Storage backends](/docs/prism/install/storage-backends) has a section on verifying which one is actually in use. Do that now rather than discovering it three parts later.

---

## Part 2 — CrowdStrike

The connector's own README is the authority on its configuration, regional base URLs and required API scopes: [CrowdStrike Falcon Connector](/docs/prism/architecture/connectors/crowdstrike).

**Its `.env` lives in the connector's own folder**, not the repo root, and not the runtime instance:

```
packages/connectors/crowdstrike/.env
```

```ini
CROWDSTRIKE_CLIENT_ID=...
CROWDSTRIKE_CLIENT_SECRET=...
# Must match your tenant's cloud. US-1 is the default; US-2, EU-1 and
# US-GOV-1 have their own hosts - the README lists them.
CROWDSTRIKE_BASE_URL=https://api.crowdstrike.com
```

### Name the instance

An instance name separates one deployment of a connector from another, and it becomes part of the source id every rule references. Pick it now and do not change it later — the rules, the inbox and the outbox all key on it.

This page uses `prod`, giving the source id **`crowdstrike.prod`**.

```bash
mkdir -p .connectors/crowdstrike.prod
cat > .connectors/crowdstrike.prod/manifest.json <<'EOF'
{"connectorType": "crowdstrike", "instance": "prod", "schema": "AssetComputer", "credentials": {}, "config": {}}
EOF
```

### First collection

[Run a collector](/docs/prism/usage/collect) covers the command and how to confirm the snapshot landed. Do that before writing any rule: a rule written against a guess at the field names is a rule you will debug twice.

Once a snapshot is in, look at an actual record. The connector normalises CrowdStrike hosts to `AssetComputer`, putting vendor-specific values under `extendedData.crowdstrike*` — which is where most of the interesting fields are, and what Part 4 maps.

---

## Part 3 — Jira

**You set this up, in Jira.** Prism does not create projects, issue types, fields or schemes.

### 1. Project and issue type

Create the project (or use an existing one) and decide the issue type that represents a machine. This page uses project key `ASSET` and issue type `Computer`.

### 2. Custom fields

The connector's README carries the full table with each field's `fieldIds` key: [Jira Assets Connector](/docs/prism/architecture/connectors/jira-assets) § Jira Setup. At minimum, for this pipeline, create text fields for:

| Purpose | `fieldIds` key |
|---|---|
| Host name — the identity key both directions match on | `hostName` |
| IP address | `ip` |
| MAC address | `mac` |
| Model | `model` |
| Asset ID — Prism's master id, so an issue can be traced back | `assetId` |

Add them to the project's screens, or Jira will accept the field and never show or return it.

### 3. Read the field ids back — do not guess them

Jira assigns `customfield_NNNNN` itself. The numbers are per-site and there is no way to choose them.

```bash
curl -u you@example.com:$JIRA_API_TOKEN \
  https://your-domain.atlassian.net/rest/api/3/field \
  | jq '.[] | select(.custom) | {name, id}'
```

### 4. Put them in the manifest, not in code

**Field ids are per-instance configuration.** Set them in the connector manifest; anything you do not override falls back to the connector's defaults.

```bash
mkdir -p .connectors/jira-assets.prod
cat > .connectors/jira-assets.prod/manifest.json <<'EOF'
{
  "connectorType": "jira-assets",
  "instance": "prod",
  "schema": "BaseAsset",
  "credentials": {},
  "config": {
    "baseUrl": "https://your-domain.atlassian.net",
    "projectKey": "ASSET",
    "fieldIds": {
      "hostName": "customfield_10001",
      "ip":       "customfield_10002",
      "mac":      "customfield_10003",
      "model":    "customfield_10004",
      "assetId":  "customfield_10005"
    }
  }
}
EOF
```

Substitute your own ids. The ones above are illustrative and will not match your site.

Credentials go in `packages/connectors/jira-assets/.env` — `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`.

This gives the source id **`jira-assets.prod`**.

---

## Part 4 — The three rules

This is the part that is specific to your data, and the part worth slowing down on.

[Create and edit rules](/docs/prism/usage/manage-rules) covers the editor itself. What follows is what to put in it.

### How the editor presents a rule

Two levels, toggled by **Visual** / **Raw**:

- **Visual** is a grid, one row per field mapping, plus **Add mapping**. Everything outside the grid — the rule's id, name, source, target, target schema and enabled flag — sits above it.
- **Raw** is the rule's JSON in a Monaco editor, parsed live. Switching back to Visual is blocked while the JSON does not parse, and **Save is disabled** while any expression is invalid or any mapping has a blank source or target.

The grid's columns depend on the rule's direction:

| Direction | Columns |
|---|---|
| Sync (into consolidated) | Source field · Target field · Mode · Priority · Expression · Condition |
| Reverse (out of consolidated) | Master field · Source field · Expression · Condition |

A reverse rule has no Mode or Priority because there is nothing to merge — it writes one value to one place.

**You do not pick the direction; the target does.** Choose a local target dataset and the rule merges into it; choose a remote source and it pushes out. The app only asks when it cannot tell, which means the target is not in the table registry. [The review app](/docs/prism/usage/review-app) and [Run a sync rule](/docs/prism/usage/sync) both cover this — it is the single most confusing thing about creating a first reverse rule.

### The two ideas the mappings encode

**Priority decides who wins a field.** When two sources report the same target field, the higher priority is applied and the lower is *shadowed* — kept, visible, not applied. This is the whole reason the Jira rule comes in below CrowdStrike.

**Mode decides whether a human sees it.** `auto` applies on sync; `review` queues the change for approval. Reserve `review` for fields where a wrong value is expensive — security posture, business criticality — because everything marked `review` is something a person must clear.

> Approving a review item overrides priority entirely. A person approving a lower-priority proposal *will* replace a higher-priority applied value, because they said so.

### 4a. CrowdStrike → consolidated

| Header field | Value |
|---|---|
| id | `crowdstrike-sync` |
| Source (dataset) | `crowdstrike.prod` |
| Target (dataset) | `consolidated-assets` |
| Target schema | `AssetComputer` |

Identity keys and `sourceIdField` are not in the grid — set them in **Raw**. They decide when two records are the same machine:

```json
"sourceIdField": "id",
"identityKeys": { "hostname": "hostname", "mac": "network.0.macAddress" },
"reconcilePresence": false
```

Then the mappings. A representative subset — the shipped `crowdstrike-sync.json` has the full set to copy from:

| Source field | Target field | Mode | Priority |
|---|---|---|---|
| `hostname` | `hostname` | auto | 85 |
| `os` | `platform` | auto | 85 |
| `osVersion` | `osVersion` | auto | 90 |
| `network.0.ipAddress` | `localIpAddress` | auto | 80 |
| `network.0.macAddress` | `macAddress` | auto | 85 |
| `extendedData.crowdstrikeDeviceId` | `crowdstrikeDeviceId` | auto | 95 |
| `extendedData.crowdstrikeLastSeen` | `lastSeenDate` | auto | 95 |
| `extendedData.crowdstrikeSystemProductName` | `model` | auto | 85 |
| `extendedData.crowdstrikePreventionPolicy` | `preventionPolicy` | **review** | 95 |
| `extendedData.crowdstrikeDetectionState` | `detectionState` | **review** | 95 |

Note the shape of the source paths: dotted, and indexed for arrays (`network.0.ipAddress`). Vendor-specific values live under `extendedData`.

**`reconcilePresence: false` is deliberate here.** Turn it on and a host absent from a run is proposed for decommission — which is what you want eventually, and not what you want while you are still confirming the collector sees your whole fleet.

### 4b. Jira → consolidated

| Header field | Value |
|---|---|
| id | `jira-assets-sync` |
| Source (dataset) | `jira-assets.prod` |
| Target (dataset) | `consolidated-assets` |
| Target schema | `BaseAsset` |

```json
"sourceIdField": "id",
"identityKeys": { "hostname": "extendedData.hostname" },
"reconcilePresence": false
```

`extendedData.hostname` is the Host Name custom field from Part 3, and matching on it is what makes a Jira issue join the machine CrowdStrike already reported rather than creating a second master.

| Source field | Target field | Mode | Priority | Why |
|---|---|---|---|---|
| `extendedData.hostname` | `hostname` | auto | 60 | The identity link |
| `extendedData.jiraIssueKey` | `jiraIssueKey` | auto | 90 | Needed to address the write-back |
| `extendedData.jiraIpAddress` | `localIpAddress` | auto | **55** | Below CrowdStrike's 80 — shadowed on purpose |
| `extendedData.jiraModel` | `model` | auto | 60 | Below CrowdStrike's 85 |
| `ownership.owner` | `owner` | auto | 75 | Jira *is* authoritative for ownership |

The asymmetry is the design. Jira wins on business facts it alone knows; CrowdStrike wins on anything an agent observes live.

### 4c. consolidated → Jira

| Header field | Value |
|---|---|
| id | `technical-to-jira` |
| Master dataset | `consolidated-assets` |
| Target source | `jira-assets.prod` |

⛔ **`Target source` must match the drain exactly.** The queue is `outbox_<target source>`, and the drain reads the queue named by the source string you give it. A mismatch drains an empty queue and reports success.

The grid here is Master field → Source field, and **the right-hand column is Jira field ids**, from Part 3:

| Master field | Source field |
|---|---|
| `hostname` | `summary` |
| `hostname` | `customfield_10001` |
| `localIpAddress` | `customfield_10002` |
| `macAddress` | `customfield_10003` |
| `model` | `customfield_10004` |
| `masterId` | `customfield_10005` |

`hostname` appears twice deliberately: once into the issue summary so the issue is readable, once into the Host Name field so 4b can match on it next time round.

**Mirror — creating issues for machines Jira has never heard of.** Without it, this rule only updates issues that already exist. With it, a master carrying no Jira link proposes creating one:

```json
"mirror": {
  "mode": "review",
  "createFields": {
    "project":   { "key": "ASSET" },
    "issuetype": { "name": "Computer" }
  }
}
```

`mode: "review"` gates every creation behind a human. Creation is all-or-nothing per host, and once created the returned issue key is written into that master's identity so it is never proposed again.

### Loading the rules

The editor is one way. To load rule files in bulk instead, [Create and edit rules](/docs/prism/usage/manage-rules) covers the loader — rules are read from storage, not from the JSON files, so a file edited on disk has no effect until it is loaded.

---

## Part 5 — Run it

### Inbound

1. **Collect** — [Run a collector](/docs/prism/usage/collect).
2. **Sync** — [Run a sync rule](/docs/prism/usage/sync), for `crowdstrike-sync`.
3. **Review** — [Review and apply changesets](/docs/prism/usage/review-changesets). On a first run every host is a new-asset proposal: nothing is written to `consolidated-assets` until a person approves it.
4. Repeat 1–3 for `jira-assets-sync` once Jira has issues to read.

### Outbound

5. **Run `technical-to-jira`.** This enqueues; it does not write. Mirror-create proposals are review-gated.
6. **Approve** what should go out.
7. **Drain the queue** — this is what actually calls the Jira API.

⛔ **Do not use the shipped `prism-drain` for this.** That command is a reference implementation with a dry-run writer: it contacts nothing, writes nothing, and **still marks every item done**. Run it against a real outbox and your queued write-backs are consumed with nothing reaching Jira, while the summary reports items written.

The Jira connector supplies its own authenticated writer. Use it:

```bash
npx tsx packages/connectors/jira-assets/writeback.ts
```

**Check the source id before the first drain.** That entry point drains the source `jira-assets`. If your reverse rule's target source is `jira-assets.prod`, as this page has it, the queue is `outbox_jira-assets.prod` and the two do not match — align them, by naming the instance-less source in the rule or by draining the instance-qualified one from your own entry point. Getting this wrong is silent.

## Verify the loop closed

1. A Jira issue exists for a CrowdStrike host, carrying its hostname, IP and MAC.
2. Its master in `consolidated-assets` has both sources on it — [Browse datasets and changesets](/docs/prism/usage/browse) shows source and priority per field.
3. Change that host's IP by hand in Jira, re-run `jira-assets-sync`: the change is *shadowed*, not applied, because CrowdStrike outranks Jira on IP.
4. Re-run `technical-to-jira` and drain: Jira is put back to the authoritative value.

Step 3 failing to shadow means the priorities in 4a and 4b are not what this page describes — check them before anything else.

## What this page does not cover

- **Running any of it from Windmill.** [Installing the Windmill layer](/docs/prism/install/windmill) is that path; the rules and mappings here are identical, driven from the review app instead of the CLI.
- **Scheduling.** Nothing above runs on a timer.
- **Decommissioning.** `reconcilePresence` is off in both sync rules. Turn it on once you trust the collector's coverage, and read what the outage guard does before you do.
- **A second endpoint source.** Adding one is another 4a-shaped rule with its own priorities; nothing here changes.

## Where to go next

| Question | Document |
|---|---|
| How do I run this from Windmill instead? | [Installing the Windmill layer](/docs/prism/install/windmill) |
| What do the review decisions actually mean? | [Review and apply changesets](/docs/prism/usage/review-changesets) |
| How does the merge decide? | [Architecture overview](/docs/prism/architecture/overview) |
| How do I add another connector? | [Writing a connector](/docs/prism/architecture/writing-a-connector) |
