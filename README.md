# TextKit — example build

**TextKit** is a working title for a Dev & Text Tools site: twelve free utilities that run
100% in the visitor's browser. This repository holds the **example build** (Astro source),
published for review on GitHub Pages at <https://d1m3k.github.io/textkit/>. The brand/repo
name is a working title — production will get its own name, domain and repository, at which
point `site` and `base` in `astro.config.mjs` are the only config lines that change.

## The tools (12)

| Category | Tools |
| --- | --- |
| JSON & Data | JSON Formatter & Validator, JSON to CSV |
| Encoding | Base64 Encode/Decode, URL Encode/Decode, Hash Generator (SHA-1/256/512) |
| Text | Word Counter, Case Converter, Diff Checker, Lorem Ipsum Generator |
| Generators | UUID Generator (v4), Password Generator |
| Converters | Timestamp Converter |

Every tool page carries a worked explanation of its method, step-by-step instructions and a
3-question FAQ, and is generated from the single catalogue in `src/config/site.ts`.

## Structure

```
astro.config.mjs          site + base (/textkit) for GitHub Pages
src/config/site.ts        site identity + TOOLS catalogue (single source of truth)
src/lib/logic.js          pure, framework-free logic for every tool (Node-testable)
src/layouts/Base.astro    header, catalogue-driven footer, canonical/OG meta
src/layouts/ToolPage.astro  shared tool shell: working window, steps, about, FAQ, JSON-LD
src/components/tools/     one UI component per tool (markup + small inline script)
src/pages/
  index.astro             homepage (catalogue by category, why-client-side, FAQ)
  tools/index.astro       hub listing all tools
  tool/[slug].astro       static route generated from the catalogue
  guides/                 index + two original articles
  about / privacy / disclaimer / contact / 404
  sitemap.xml.js          build-time sitemap endpoint, in sync with the catalogue
public/robots.txt
```

## Run locally

```bash
npm install
npm run dev      # local dev server
npm run build    # static build into dist/
npm run preview  # preview the built site
```

Requires Node 18+. There are **no dependencies besides Astro** — no PDF or WASM libraries;
all tool logic is hand-written in `src/lib/logic.js`.

## Deployment (GitHub Pages, example)

The example is deployed from the built `dist/` by GitHub Actions (source: GitHub Actions,
not branch). The workflow file `.github/workflows/deploy.yml` is **not in this repository
on purpose**: the GitHub API connector used by the maintainer's tooling cannot create files
under `.github/workflows/`, so the workflow is created once through the GitHub web UI
(Standard "Astro" / static Pages workflow: install, `npm run build`, upload `dist/` as the
Pages artifact). Pushes to `main` then deploy automatically.

`node_modules/` and `dist/` are local-only and are never committed.

## Notes

- **Privacy by architecture:** there is no backend. Tool input never leaves the browser.
- **Contact page:** this example build deliberately does not publish an email address. The
  contact page states that channels open at launch; a monitored address will be added to
  `src/pages/contact.astro` before production.
- **Design:** original "code editor / terminal" theme (deep slate `#0D1117`, JetBrains Mono
  + Inter, terminal-green `#3FB950`, window-chrome cards) — unrelated to any sibling project.
