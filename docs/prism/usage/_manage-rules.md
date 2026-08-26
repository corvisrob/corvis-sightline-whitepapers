A rule decides which fields move, from where, to where, and how strongly. This page covers creating and editing one.

**Start in your [runtime instance](/docs/prism/install/runtime-instance).** The rule editor reads `./rules` relative to your current directory.

```bash
cd acme-central
npx prism-review
```

Choose **Manage rules**.

For why priorities and conflicts resolve as they do, read [Sync engine](/docs/prism/architecture/sync-engine). This page is about the editor.

## Where rules live

Rules are JSON files in a `rules/` directory inside your instance. One file per rule, named by its id.

**Keep those files.** They are what the editor lists and what a sync resolves first. The storage fallback exists, but the files are the reliable path. [Run a sync rule](/docs/prism/usage/sync) explains why.

## The rule list

| Key | What it does |
|---|---|
| `↑` `↓` | Move between rules |
| `enter` | Open the rule in the editor |
| `space` or `e` | Enable or disable the rule |
| `n` | Create a new rule |
| `/` | Search the list |
| `←` | Back to the menu |
| `q` | Quit |

**Expected output when there are none.** A line reporting no rules found in `./rules`. That means the directory is empty or you are in the wrong directory: check the second before creating anything.

Disabling a rule leaves it in place and stops it running. A sync against a disabled rule stops and says so.

## Creating a rule

`n` asks which kind first: **sync** or **reverse**. Pick, then fill in the form.

The kind sets the shape; the direction that actually applies at run time follows the target table. [Run a sync rule](/docs/prism/usage/sync) covers that.

## The editor has two levels

This is the part that is not obvious from the screen.

### The form and its grid

`enter` opens a form over the rule. It carries the header fields and a field-mapping grid.

| Key | What it does |
|---|---|
| `enter` | Open a mapping's cells for editing |
| `a` | Add a mapping |
| `x` | Remove the mapping under the cursor |
| `s` | Save |
| `r` | Open the whole rule as JSON |

Expressions are checked as you type, against the same parser the engine uses. A mapping missing either side blocks the save.

### The JSON escape hatch

The form covers the rule's common shape: its id, its name, whether it is enabled, its source, its target, its field mappings and its version.

**Everything else is reachable only through `r`.** That includes:

- `identityKeys`
- `mirror`
- `presenceGuard`
- `reconcilePresence`
- `tieBreak`
- `newAssetMode`
- `stalenessWindowMs`

`r` opens the whole rule as JSON in your editor, and validates it when you come back. It needs `$VISUAL` or `$EDITOR` set; without one it reports that no editor is configured and changes nothing.

### Your ungridded fields survive a form save

**A field the grid does not show is preserved untouched when you save from the form.** Saving does not blank the seven fields above, and it does not rewrite anything you set through the JSON view.

The opposite assumption makes operators avoid the form entirely. They then edit every rule as raw JSON.

## Loading rules without the editor

You can write rule files directly into `rules/` and the editor will list them. That is the ordinary way to move a rule between instances.

Rules can also be loaded into the storage collection a sync falls back to. Load them into the collection the sync command actually reads. Keep the files as well: the file path resolves first, and it does not depend on that fallback.

## Where to go next

| Question | Document |
|---|---|
| How do I run one? | [Run a sync rule](/docs/prism/usage/sync) |
| Why did this field lose? | [Sync engine](/docs/prism/architecture/sync-engine) |
| How do rules move between versions? | [Schema versions and rule migration](/docs/prism/upgrade/schema-migration) |
| How do I do this in a browser? | [The review app](/docs/prism/usage/review-app) |
