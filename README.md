# Sightline knowledge base & whitepapers

Source for [docs.corvis.au](https://docs.corvis.au): the Sightline knowledge
base (`docs/`) and whitepaper series (`blog/`), built with
[Docusaurus](https://docusaurus.io/).

- `docs/` - the wiki-style knowledge base: one section per pillar (Tetra,
  Bowtie, Metron, Prism), plus standards alignment.
- `blog/` - the whitepaper series. Each post starts as a `draft: true` stub
  with the section skeleton described in `whitepaper-outline.md`; remove
  `draft: true` when a paper is ready to publish.
- `whitepaper-outline.md` - the series-level plan (not published; a
  repo-root planning doc).

## Local development

```bash
pnpm install
pnpm start
```

Starts a local dev server with live reload at `http://localhost:3000`.

## Build

```bash
pnpm build
```

Generates static content into `build/`. `pnpm serve` serves that build
locally to sanity-check it before deploying.

## Deployment

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to
`main`: it builds the site and publishes `build/` to the `gh-pages` branch.
GitHub Pages is configured to serve that branch under the custom domain
`docs.corvis.au` (see `static/CNAME`) - the DNS record for that subdomain
needs a `CNAME` pointing at `corvisrob.github.io`, set up once outside this
repo.

## Writing

New knowledge base pages go under `docs/<pillar>/`; new whitepapers go
under `blog/YYYY-MM-DD-slug/index.md` with `draft: true` until ready. House
style (Australian English, no em dashes in prose, avoid LLM "briefing
voice" tics) follows the same conventions as the rest of the Corvis reports
workspace - see the parent `CLAUDE.md`.
