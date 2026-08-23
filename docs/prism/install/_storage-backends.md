Sightline Prism writes its records to one of three backends: **MongoDB**, **PostgreSQL**, or a **local JSON store**. You choose with one environment variable.

Choose before you collect anything. The choice is easy to change and the consequence is not, for the reason in [The backends do not share data](#the-backends-do-not-share-data).

## Choose a backend

Set `STORAGE_BACKEND` in the [runtime instance](/docs/prism/install/runtime-instance) environment file.

| Value | Backend | When to use it |
|---|---|---|
| `mongo` | MongoDB | A shared installation, a Windmill deployment, or more than one process. |
| `postgres` | PostgreSQL | A shared installation where your organisation already runs PostgreSQL and would rather not add MongoDB. Safe for more than one process. |
| `local` | Local JSON store | A workstation trial, a single-operator CLI installation, or a standalone node. |

**`mongo` is the default.** The runtime uses MongoDB when `STORAGE_BACKEND` is unset.

The value is not case-sensitive, so `Local` and `LOCAL` work too.

**A value that is not one of the three stops the runtime at startup**, naming what you set and what it accepts. This is deliberate: a misspelling used to select MongoDB silently, so `STORAGE_BACKEND=postgress` wrote to a store you never intended and nothing reported it.

## The MongoDB backend

| Variable | What it holds |
|---|---|
| `MONGODB_URI` | The connection string for your MongoDB deployment. |
| `MONGODB_DB` | The database name. |

Both variables have a built-in default that points at a MongoDB on the same machine. **Set both explicitly.** A default that silently works on a workstation is the thing that fails without explanation on a server.

The Windmill layer does not read these variables. It reads a Windmill resource instead, which its own installer creates — see [Installing the Windmill layer](/docs/prism/install/windmill).

## The PostgreSQL backend

PostgreSQL holds each collection in its own table, as `_id text primary key, doc jsonb`. Tables are created the first time something writes to that collection, so there is no migration to run and no schema to install before you start.

**The driver is not installed by default.** `pg` is an optional dependency, so a node that uses MongoDB or the local store never carries it. Install it on a node that needs it:

```bash
npm install pg
```

Selecting `postgres` without it stops at startup and tells you the same thing.

| Variable | What it holds |
|---|---|
| `POSTGRES_URI` | The full connection string. |
| `POSTGRES_SCHEMA` | The schema the collection tables live in. Defaults to `public`. |

**`POSTGRES_URI` is optional.** Leave it blank and the driver reads the standard PostgreSQL variables instead — `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`. Use whichever your environment already provides; do not set both.

### Object key order is not preserved

PostgreSQL stores documents as `jsonb`, which normalises the keys of every JSON object — ordering them by key length, then by bytes. So a record written with its keys in one order reads back with them in another.

**No value changes and nothing is lost.** Every field, every value and every provenance entry survives exactly. What differs is the order keys come back in, which you will notice anywhere a listing is printed in key order — the demo's consolidated-master output is the obvious one.

This matters in one place beyond display: deciding whether a field changed. Prism compares field values structurally rather than by their serialised text, so a value that only came back with its keys reordered is correctly seen as unchanged. Were it compared as text, a record with an object-valued field would appear to change on every single sync and never settle.

Array order is preserved. A list is a list.

### A managed server needs TLS, and will not say so clearly

A managed PostgreSQL — Azure Database for PostgreSQL among them — refuses a connection that does not negotiate TLS. The refusal does not mention TLS:

```
no pg_hba.conf entry for host "203.0.113.10", user "prism", database "prism"
```

That message reads like a firewall or permissions problem. It is neither. Set `PGSSLMODE` to `require` or `verify-full`, or put `?sslmode=require` on the end of `POSTGRES_URI`.

## The local JSON store

The local store is a zero-dependency backend that writes one JSON file for each collection. It needs no database and no server.

| Variable | What it holds | Default |
|---|---|---|
| `PRISM_DATA_DIR` | Where the JSON files go. | A `.data` directory in the current directory. |

The default resolves against the **current working directory**, not against the code checkout. This is one of the reasons operational commands run from the runtime instance. Read [The runtime instance](/docs/prism/install/runtime-instance) for the rest.

### The local store runs one process at a time

**The local store is single-process.** It is intended for CLI use, local development and standalone operation. It is not built for concurrent workers, and the Windmill layer must not use it.

Two processes writing to the same local store at the same time can lose a write. There is no lock between them. When more than one process needs the data, use MongoDB or PostgreSQL.

## The backends do not share data

**Nothing is copied between the backends, in any direction, at any time.** They are separate stores. A record written under one backend is not visible under another, and switching the value of `STORAGE_BACKEND` does not migrate anything.

This matters because of how it looks from the operator's side. You switch the backend, you run a command, and every dataset is empty. Nothing reports an error, because nothing went wrong — you are reading a different store, and it is empty because it is new. A reader who expected continuity concludes the data was lost, and from that view it was.

Your records are still in the first backend. Set `STORAGE_BACKEND` back to its previous value to see them again.

Plan the switch as a data move, not as a configuration change.

## Every backend runs the whole product

Every connector, the sync engine and the operator CLI work against any backend, with no change to any code. Prism reaches its store through one narrow interface, and all three backends implement it — the same interface test suite runs against each of them.

So the choice is about where the data lives and how many processes reach it. It is not about which features you get.

| Question | Answer |
|---|---|
| Do the connectors change? | No |
| Does the sync engine change? | No |
| Does the operator CLI change? | No |
| Does the Windmill layer have a choice? | No. It uses MongoDB. |

## Verify the backend in use

Run any command that reaches the store, from inside the runtime instance. The runtime names the backend it selected as it connects.

| Backend | What the log line reports |
|---|---|
| MongoDB | That it connected to MongoDB, and the database name it used. |
| PostgreSQL | That it connected to PostgreSQL, and the schema it resolved. |
| Local JSON store | That it uses local storage, and the data directory it resolved. |

Each collector also names the backend when it transmits. Read the data directory in that line. It tells you which store you write to, and it catches a wrong working directory faster than anything else.

For the local store, confirm the files exist:

```bash
cd acme-prism
ls .data/
```

**Expected output.** One JSON file for each collection that has been written, named after the collection. An empty or absent `.data` directory means nothing has been collected into this store yet.

## Where to go next

| Question | Document |
|---|---|
| What is a runtime instance? | [The runtime instance](/docs/prism/install/runtime-instance) |
| How do I install Prism? | [Installing Prism](/docs/prism/install/prism) |
| How do I install the Windmill layer? | [Installing the Windmill layer](/docs/prism/install/windmill) |
| How does the data model work? | [Data model](/docs/prism/architecture/data-model) |
