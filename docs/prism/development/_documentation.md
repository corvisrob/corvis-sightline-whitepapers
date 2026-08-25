The documentation set is written to the **ASD-STE100 writing rules**. Use the active
voice and the present tense. Write one instruction in one sentence. Keep a
procedural sentence to twenty words, and a descriptive one to twenty-five. Give one
word one meaning.

**No page in this set may claim certified conformance.** The dictionary those rules
accompany is licensed, and Corvis does not hold it. Nothing here can check a word
against the approved list. What the set claims is prose that is rules-conformant and
vocabulary-disciplined, where discipline means agreement with the project term list.

## Read these before you draft

Two internal files govern a page, and both live in the repository rather than on
this site:

| File | What it settles |
|---|---|
| `docs/internal/style-guide.md` | The project overlay, and the placeholder rule |
| `docs/internal/term-list.md` | One approved name per concept, with rejected synonyms |
| `docs/internal/documentation-map.md` | Where each page goes, and what is denied |

Read them **before drafting, not afterwards**. A page written in the wrong register
gets rewritten rather than corrected.

## The placeholder rule

**Write a placeholder in backticks.** `` `<your-hostname>` ``, never bare.

The site parses Markdown as MDX, which reads a bare `<your-hostname>` as an opening
tag. Under a strict setting the build fails. Under a lenient one it succeeds, and
the placeholder is **silently deleted from the rendered page**. The sentence then
reads as the author's mistake. The publish tool fails on this, and the
rule exists so the problem is never created.

## Two checks before a page is finished

Both are cheap and both find things reading does not.

**Rejected terms**, from the term list. Its rejected column is the useful half, and
the pattern to run is in that file.

Two exemptions and one trap. A code identifier is exempt: a collection name, a
script name or a flag is what it is. Do not rewrite one to satisfy a prose rule.

Inline formatting hides a hit. A plain-text grep misses a term split by bold or
backticks, so read the paragraphs it flagged nothing in.

**Sentence and paragraph limits**, which no grep finds. Code fences and tables are
exempt.

## Publishing

`docs/` is mirrored to this site. A change to any published page reaches a reader
only after a publish run. A repository that is correct while the site is stale is
worse than both being stale.

The publish tool writes two files per page: a partial holding the content, replaced
every publish, and a page holding the front matter, **written once**. The front
matter owns the title, so renaming a page takes an edit on the site as well as in
the configuration.

## Where to go next

| Question | Document |
|---|---|
| What is the product? | [Architecture overview](/docs/prism/architecture/overview) |
| How is a release cut? | [Cutting a release](/docs/prism/development/releasing) |
