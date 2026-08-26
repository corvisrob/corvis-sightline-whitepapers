An upgrade moves an existing [runtime instance](/docs/prism/install/runtime-instance) to a newer version of Prism. It does not move your configuration or your data — those stay where they are, and this page tells you exactly which of them survive.

Read [Version compatibility](/docs/prism/upgrade/compatibility) for what the target Prism version is coupled to.

## What the instance holds

A runtime instance holds state the upgrade must not destroy. Know what is in yours before you run anything.

| Item | What it holds |
|---|---|
| `.env` | The environment values you filled in |
| `.connectors/` | One manifest for each connector instance, with credential references |
| `rules/` | Your sync and reverse rules, as one file each |
| `.data/` | Your records, when you use the local storage backend |
| `node_modules/@sightline/` | The installed packages — this is what the upgrade replaces |

Only the last row is the upgrade's business. The rest is yours.

## Back up the instance first

Do this as a step, not as good practice. The local backend keeps your records inside the runtime instance, so a mistake there costs data.

```bash
cp -R acme-prism acme-prism-backup-$(date +%Y%m%d)
```

**Expected output.** No output. A new directory beside your instance, holding a complete copy.

If you use the MongoDB backend, your records are in MongoDB and this copies configuration only. Back up the database by your own procedure — Prism does not manage it.

## Upgrade the instance

The upgrade re-runs the installer against the same runtime instance.

1. Put the archive for the version you are moving to in your install directory, and remove the old one. Corvis supplies it. The installer installs the single archive it finds beside it, so two versions in one directory stop it rather than letting it guess.
2. Re-run the installer with the same `--dir` and the same `--role` and `--connectors` you used before.

```bash
cd prism-install
node install.mjs --dir ../acme-prism --role central --connectors crowdstrike,jira-assets
```

**Pass the same flags you installed with.** The installer resolves the package list from `--role` and `--connectors` on each run. A connector you leave off the list is not removed. It is also not upgraded, so it stays on the old version while everything around it moves.

### What re-running the installer does to an existing instance

The installer is written to be re-run. Each step that would create something tests for it first.

| Step | Against an existing instance |
|---|---|
| Create the runtime instance | Left alone. It already exists. |
| Mark it with a `package.json` | Left alone when one is present. |
| Install the packages | **Replaced.** This is the upgrade. |
| Check system prerequisites | Warns only. It never fails the install. |
| Assemble `.env.example` | **Rewritten** on every run, from the packages now installed. |
| Create `.env` | Left alone when one is present. Your values survive. |
| Scaffold a connector manifest | Left alone when one is present. |

**Your `.env` is never overwritten, and `.env.example` always is.** That pairing is the upgrade's one piece of real work for you: the refreshed example shows the variables the new version expects.

### Pick up new environment variables

After the upgrade, compare the refreshed template against your own file.

```bash
cd ../acme-prism
diff <(grep -oE '^[A-Z][A-Z0-9_]*' .env.example | sort -u) <(grep -oE '^[A-Z][A-Z0-9_]*' .env | sort -u)
```

**Expected output.** No output when the two carry the same variables. A line beginning `<` names a variable the new version expects and your `.env` does not have. Add it, then fill in its value.

A variable you never set does not announce itself at upgrade time. It fails later, when the code that reads it runs.

## Verify the upgrade

Confirm the installed version from inside the instance:

```bash
cd ../acme-prism
npm ls @sightline/prism-connector-sdk
```

**Expected output.** One line naming the package at the version you upgraded to.

Then confirm your configuration survived:

```bash
ls .env .connectors rules
```

**Expected output.** All three, each listed once. A missing `.connectors` or `rules` means you are not in the instance you think you are. Check the working directory before you conclude anything was lost.

Then run one collector and read its output. It names the storage backend it connected to and the data directory it resolved. That line is the fastest confirmation that the upgraded instance still points at your records.

## Where to go next

| Question | Document |
|---|---|
| Which combination should I move to? | [Version compatibility](/docs/prism/upgrade/compatibility) |
| What happens to my existing records? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| Can I go back? | [Rollback](/docs/prism/upgrade/rollback) |
| How do I upgrade the CLI? | [Upgrading the CLI](/docs/prism/upgrade/cli) |
