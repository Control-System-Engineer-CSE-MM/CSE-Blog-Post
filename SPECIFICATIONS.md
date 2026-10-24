# SPECIFICATIONS.md

Version 1.0 · Source of truth for the SSG website package.

Priority legend: **P1** = satisfy first, never trade away · **P2** = strongly desired, may be adapted · **P3** = optional enhancement, only when it does not harm P1.

Statements about third-party tools in this document are general guidance. The agent must re-verify versions, option names and plugin availability against the current official documentation before relying on them (see the skill, step 2).

---

## 1. Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | **Documentation site** for technical documents: LaTeX-style equations, tables, figures, code, cross-references | P1 |
| G2 | **Blog** with tags and an RSS/Atom feed | P1 |
| G3 | **Personal portfolio** (projects, about, contact) | P1 |
| G4 | **Linktree / linkbio** style page, mobile-first | P1 |
| G5 | Burmese-first content, with some pages shown bilingual (Burmese + English) | P1 |
| G6 | Comfortable reading on **E-Ink displays** | P1 |
| G7 | **ASCII art** as the visual identity | P1 |
| G8 | AI-company typography and restraint; CLI / Oh-My-Posh flavour; optional Liquid Glass / Dynamic Island / Hyprland-style effects | P1 / P2 / P3 |

Non-goals: server-side features, comment systems, analytics, user accounts, paid tooling.

## 2. Constraints

| Area | Requirement |
|------|-------------|
| Hosting | GitHub Pages from a **public** repository, Pages source = **GitHub Actions** |
| Build | **GitHub Actions only.** No SSG, compiler or package manager is installed locally |
| Authoring | Content is created from a phone or tablet through GitHub (mobile app, mobile web, or Claude Code on the web) |
| Language | Content Burmese (Unicode); `README.md` and `docs/CONTENT-GUIDE.md` Burmese; **all code comments Burmese** |
| Network | Zero third-party requests at runtime |
| Cost | Free tier only |

Direct consequences the agent must design for:

1. No local scaffolding generators → hand-write every scaffold file.
2. No local lockfile for Node/Ruby SSGs → pin **exact** versions in `package.json` / `Gemfile`; the workflow uses `npm ci` when a lockfile exists and `npm install` otherwise (see §12.4).
3. No local preview → content syntax must preview correctly in GitHub's own Markdown renderer (GFM + math + alerts + tables + footnotes).
4. Pull requests build but never deploy, so a bad change is visible in Actions before it can reach the live site.

---

## 3. SSG selection

### 3.1 Fit matrix (qualitative; re-verify)

| Criterion | Hugo | Astro | Eleventy | Jekyll | Docusaurus |
|-----------|------|-------|----------|--------|------------|
| Runtime in CI | one Go binary | Node | Node | Ruby + Bundler | Node (React) |
| Lockfile problem without local install | none | yes | yes | yes | yes |
| Multilingual (`my` / `en`) | built in | built-in routing | built-in i18n plugin | plugin or manual | built in |
| LaTeX at build time (KaTeX) | built-in renderer in recent releases, or passthrough + render hook | remark-math + rehype-katex | markdown-it math plugin | kramdown math engine (extra gem / JS runtime) | remark-math + rehype-katex (documented) |
| Docs features (sidebar, TOC, search) | build them (small) | Starlight, or build them | build them | theme / plugins | built in |
| Freedom for ASCII / E-Ink / custom look | very high | very high | very high | high | medium (needs swizzling) |
| JavaScript shipped by default | ~none | ~none (islands) | none | none | heavy React runtime |
| CI build speed | fastest | fast | fast | slowest | slow–medium |
| Fit for this project | **1st** | **2nd** | 3rd | 5th | 4th (only if docs dominate) |

Recommendation to present to the owner: **Hugo** — no Node/Ruby dependency tree and therefore no lockfile problem, built-in multilingual support, quick CI, near-zero JS, and full control over HTML/CSS for the ASCII and E-Ink design. **Astro** is the runner-up when component-style interactivity or Starlight is wanted. The owner makes the final choice.

### 3.2 Decision protocol

Ask once (CLAUDE.md §4), record in `SITE-DECISIONS.md`, never re-ask. Do not mix SSGs silently.

### 3.3 "ALL" mode (only when the owner explicitly chooses it)

- Layout: `sites/<ssg>/` per generator; one shared `content/` (portable GFM) copied into each site by the workflow; one shared `design/`.
- Each site builds to its own sub-path (`/hugo/`, `/astro/`, …); a small static landing page at `/` links to all of them.
- One workflow with a build matrix; deployment publishes a merged artifact.
- Warn the owner that maintenance cost is roughly multiplied by the number of SSGs and propose: *pick one, keep the others on branches*. Proceed only after confirmation.

### 3.4 Switching later

Content stays portable (GFM + front matter), so switching means re-doing templates only. Do it on a branch, keep URLs identical (`slug` is mandatory for this reason), and ask first (R9).

---

## 4. Information architecture

```text
/                  home (Burmese)            /en/              home (English)
/docs/…            documentation             /en/docs/…
/blog/…            posts, /blog/tags/<tag>/  /en/blog/…
/portfolio/…       projects                  /en/portfolio/…
/links/            linktree / linkbio  (may also be set as home — ask)
/about/            optional
/404.html          ASCII 404 page
feed               RSS or Atom for the blog (SSG default location)
```

Burmese is the default language and lives at the root. English mirrors the tree under `/en/`. Pages exist in one language, or in both and are linked by `translationKey`.

### 4.1 Wireframes (ASCII, desktop)

Home:

```text
┌──────────────────────────────────────────────────────────────┐
│ user@site ~ ❯ home                              [MY|EN] [Aa] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   <ASCII wordmark / hero>                                    │
│   one-line description (Burmese)                             │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │ docs     │  │ blog     │  │ projects │  │ links    │     │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                              │
│   latest ─────────────────────────────────────────────────   │
│   2026-10-01  post title (Burmese)                           │
│   2026-09-12  post title (Burmese)                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ © name · rss · source · edit this page                       │
└──────────────────────────────────────────────────────────────┘
```

Documentation page:

```text
┌────────────────────────────────────────────────────────────┐
│ user@site ~/docs ❯ chapter-1 ❯ page-a         [MY|EN] [Aa] │
├──────────────┬─────────────────────────────────┬───────────┤
│ ▸ Intro      │ # Page title                    │ On this   │
│ ▾ Chapter 1  │ lead paragraph …                │ page      │
│     page-a   │                                 │ · h2 a    │
│     page-b   │ $$ equation $$                  │ · h2 b    │
│ ▸ Chapter 2  │ ┌─────┬─────┐                   │ · h2 c    │
│ ▸ Reference  │ │ tbl │ tbl │                   │           │
│              │ └─────┴─────┘                   │           │
│              │ [ figure ]                      │           │
│              │ > [!NOTE] …                     │           │
│              │ [ ascii art ]                   │           │
├──────────────┴─────────────────────────────────┴───────────┤
│ ◂ previous page                                next page ▸ │
└────────────────────────────────────────────────────────────┘
```

Linktree / linkbio (mobile-first, single column, also used on desktop at ≤ 32rem):

```text
┌──────────────────────────────────┐
│                                  │
│            ( avatar )            │
│               Name               │
│    one-line tagline (Burmese)    │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ ▸ GitHub                     │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▸ Docs                       │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▸ Blog                       │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ ▸ Portfolio                  │ │
│ └──────────────────────────────┘ │
│                                  │
│           [MY|EN] [Aa]           │
└──────────────────────────────────┘
```

Each section needs: list page, single page, breadcrumbs in prompt style, language switcher, theme switcher, "Edit this page" link (§7.8).

---

## 5. Content model

Front matter is YAML between `---` lines. Keys are English; values may be Burmese.

```yaml
---
title: "ခေါင်းစဉ်"            # required
description: "အကျဉ်းချုပ် ၁–၂ ကြောင်း"   # required for SEO / social preview
slug: intro-to-pid            # REQUIRED · ASCII kebab-case · never changes after publishing
lang: my                      # required · my | en
date: 2026-10-20              # ISO 8601 (blog required, docs optional)
updated: 2026-10-21           # optional · otherwise last git commit date
translationKey: intro-to-pid  # same value on the my and en versions of one page
tags: [control, pid]          # blog + portfolio
draft: false                  # true = not published
math: true                   # load KaTeX CSS/fonts only where needed
toc: true
---
```

Section-specific keys:

| Section | Extra keys |
|---------|------------|
| docs | `order` (number), `section` (sidebar group title) |
| blog | `cover` (image path), `series` |
| portfolio | `role`, `year`, `stack` (list), `links` (list of `{label, url}`), `cover` |

Linktree data lives in `data/links.yml` (location may vary per SSG), not in Markdown:

```yaml
profile:
  name: "TODO(owner)"
  tagline: "TODO(owner)"
  avatar: images/avatar.svg
links:
  - label: "GitHub"
    url: "https://example.com"      # TODO(owner)
    note: ""
    group: "social"
```

Rules: `slug` is ASCII kebab-case; file names are ASCII lowercase; image alt text is Burmese (or English on English pages). `scripts/check_content.py` enforces the required keys and slug format in CI.

---

## 6. Language and i18n

### 6.1 Encoding and attributes (P1)

- UTF-8 everywhere. Burmese is **Unicode** (U+1000–U+109F, U+A9E0–U+A9FF, U+AA60–U+AA7F). **Zawgyi is never acceptable**; the CI check warns on the typical Zawgyi signature.
- `<html lang="my">` on Burmese pages and `lang="en"` on English ones; every inline or block foreign-language passage carries its own `lang`.
- `hreflang` links between translations, `og:locale` `my_MM` / `en_US`, `<link rel="alternate">` for the feed.

### 6.2 Typography for Burmese (P1)

- Body line-height ≥ 1.8 (tokens use 1.95); headings ≥ 1.5. Tight line-heights clip stacked vowel and medial marks.
- No `letter-spacing`, no `text-transform`, no justified text, no synthetic italic or bold (`font-synthesis: none`). Use weight for emphasis.
- `overflow-wrap: break-word`, `word-break: normal`, `hyphens: manual`. Burmese has no spaces between words; rely on the browser's dictionary line-breaking and do not insert zero-width spaces.
- Base size 17–18 px (E-Ink: ≥ 18 px).
- Never put Burmese inside ASCII-art alignment (§8.4); combining marks break monospace grids.

### 6.3 Fonts (P1)

All fonts are open-licensed (SIL OFL or equivalent), **self-hosted as WOFF2**, subset with `unicode-range` so Latin and Myanmar download separately, `font-display: swap`, and only the body face preloaded.

| Role | Latin | Burmese | Notes |
|------|-------|---------|-------|
| UI / navigation | Inter | Noto Sans Myanmar | |
| Reading (long text) | Source Serif 4 or Newsreader | Noto Serif Myanmar, or Noto Sans Myanmar when the serif is too heavy on E-Ink | owner may switch via `--font-read` |
| Monospace / ASCII | JetBrains Mono or IBM Plex Mono | — (fallback chain only) | must contain box-drawing glyphs |
| Dot-matrix display (Nothing-style) | Doto, fallback DotGothic16 | — | headings/labels only, optional |
| Fallback chain | `"Myanmar Text"`, `Padauk`, system fonts | | already in `tokens.css` |

Acquisition ladder (the agent cannot run `npm install`): (1) download WOFF2 files from the fonts' official/open distribution if the network allows and commit them to the assets folder; (2) otherwise ship the system fallback stack, leave `TODO(owner): upload fonts to <path>` and document it in the handoff. Verify each licence before committing.

### 6.4 Bilingual display (P1)

1. **Paired pages (default for articles).** One file per language, linked by `translationKey`; a language switcher on every page jumps to the counterpart, or to the language home when none exists.
2. **Inline bilingual blocks (short parallel text: glossaries, abstracts, captions).** Portable markup that also renders in GitHub's preview:

```html
<div class="bi">
<div lang="my">

မြန်မာစာ စာပိုဒ်

</div>
<div lang="en">

English paragraph

</div>
</div>
```

   Blank lines inside the `div`s are required so Markdown is parsed inside them. Per-SSG switches the agent must enable: Hugo `markup.goldmark.renderer.unsafe = true`; markdown-it `html: true`; Jekyll kramdown needs `markdown="1"` on the inner divs; Docusaurus (MDX) accepts the pattern as is — verify. An optional SSG-native shortcode/component may wrap the same markup but must never be the only way.
3. **Reading-language toggle.** `data-bi="my|en|both"` on `<html>` (set by `controls.js`) hides one side of every `.bi`; `both` shows two columns on wide screens and a stack on narrow ones.

---

## 7. Documentation features (G1)

7.1 **Math (P1).** `$…$` inline and `$$…$$` display, KaTeX subset (`aligned`, `cases`, `matrix`, `\tag{}`, `\mathbb`, …). Render **at build time** so no math JS ships; self-host KaTeX CSS and fonts; load them only on pages with `math: true` (or auto-detected). `.katex-display` scrolls horizontally on narrow screens. Equation numbering is manual via `\tag{}`.

7.2 **Tables (P1).** GFM tables wrapped in `.table-wrap` (horizontal scroll, `tabular-nums`, optional `<caption>`); header cell scope set; no zebra striping in E-Ink; `align` honoured. A render hook or post-process wraps tables automatically.

7.3 **Figures (P1).** `<figure>` + `<figcaption>`, `loading="lazy"`, explicit `width`/`height`, responsive `max-width: 100%`. Prefer SVG for diagrams. Raster images ≤ 300 KB, WebP preferred. In E-Ink `img` is grayscale with raised contrast.

7.4 **Code (P2).** Build-time syntax highlighting using a low-hue palette (weight/underline carry meaning, not colour), horizontal scroll, optional copy button (JS, progressive).

7.5 **Callouts (P1).** GitHub alert syntax `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` rendered as `.alert` with a text label (never colour-only).

7.6 **Navigation (P1).** Sidebar tree (collapsible on mobile), in-page TOC (right rail on desktop, `<details>` on mobile), breadcrumbs in prompt style, previous/next buttons at the bottom of every doc (page-turn navigation for E-Ink), heading anchors, footnotes (`[^1]`), print stylesheet.

7.7 **Last updated (P2).** From git history (`fetch-depth: 0` in CI) unless `updated` is set.

7.8 **Edit this page (P1).** Link to `https://github.com/<owner>/<repo>/edit/main/<path-to-file>`, which opens GitHub's editor on a phone.

7.9 **Search (P3).** A build-time static index (for example Pagefind) may be added after testing Burmese tokenisation; if results are poor, skip search rather than ship a broken one.

7.10 **Diagrams (P3).** Prefer ASCII (§8.4) or inline SVG. Client-side diagram libraries are off by default.

---

## 8. Design system

Implementation assets: `design/tokens.css` (variables + base + components), `design/theme-init.js` (inline in `<head>`, before CSS), `design/controls.js` (deferred), `design/ascii-library.md`.

### 8.1 Priority and conflict resolution

| Priority | Items |
|----------|-------|
| **P1** | ASCII art identity · E-Ink theme · AI-company typography/fonts · Clean Paper Minimalism background · Burmese typography |
| **P2** | Apple / Claude / Nothing-phone restraint · CLI chrome · Oh-My-Posh-style prompt segments · tiled "window" layout for portfolio/links |
| **P3** | Liquid Glass · Dynamic Island pill · Hyprland-style transparency |

Rule: P3 is **opt-in** (`data-fx="glass"`, default off), applies to **chrome only** (header, floating pill, menus), never sits behind reading text, and is switched off in the E-Ink theme, under `prefers-reduced-transparency`, and when `backdrop-filter` is unsupported.

### 8.2 Themes

| Theme | `data-theme` | Purpose |
|-------|--------------|---------|
| Paper (default) | absent or `paper` | Soft off-white + near-invisible paper grain |
| Dark | absent + OS dark, or `dark` | Same layout, inverted tokens, no grain |
| E-Ink | `eink` | Pure black on white, no effects (§8.5) |

`theme-init.js` chooses: stored choice → E-Ink auto-detection (`(update: slow)` or `(monochrome)` media features, progressive enhancement) → OS preference. A visible theme switch exists on every page and always works, because media-feature detection is not reliable on every E-Ink browser.

### 8.3 Clean Paper Minimalism (base theme, P1)

Design goal: calm, premium, lightweight. Background is *Soft Off-White + subtle paper texture + clean minimalist UI*, never harsh white and never an obvious textured paper.

| Token | Value |
|-------|-------|
| Background (main) | `#F7F7F5` (alternatives to test: `#FAFAF9` softer, `#F5F5F3` paper, `#EEEEEC` greyer) |
| Background (secondary) | `#F1F1EF` |
| Surface (cards, content) | `#FFFFFF` |
| Text (primary) | `#111111` |
| Text (secondary) | `#666666` |
| Border (subtle) | `#E5E5E3` |

Rules:
- Texture: fine-grain noise at ≈ 3 % alpha, generated by an inline SVG `feTurbulence` data URI (no image file), scrolling with the page (never `background-attachment: fixed` — repaint cost). Optional faint radial "diffuse light" at the top. No fibres, stains, creases, vintage effects or visible gradients.
- Whitespace is generous; borders thin and low-contrast; shadows rare and soft; corner radius small; cards are not used for everything.
- Monochrome palette. An accent colour appears only where it carries function (errors, focus). Optional single signal colour token `--signal` for errors/alerts.
- Consistent across header, navigation, content, cards and footer.
- Guardrail: *Keep the paper texture nearly imperceptible. Do not add visible dirt, vintage paper effects, strong gradients, excessive blur, heavy shadows or unnecessary glass cards. Prioritise cleanliness, legibility, whitespace and visual consistency over decorative effects.*
- Avoid generated-page tells: no tracked-out ALL-CAPS eyebrow above every heading, no numbered markers unless the content is a sequence, no identical rounded cards stacked everywhere, no fade-and-slide entrance on every section. Spend boldness in one place — the ASCII hero.

Type scale (rem, base 17 px): 0.875 · 1.0625 (body) · 1.25 · 1.5625 · 1.95 · 2.44. One serif + one sans + one mono; hierarchy through size and weight, secondary text in grey.

### 8.4 ASCII art system (P1)

Detailed snippets: `design/ascii-library.md`. Rules:

- Use ASCII art for: site wordmark in the header/hero, section dividers, the 404 page, directory-tree navigation, callout frames, progress bars, empty states.
- **Latin characters and box-drawing/block glyphs only inside art.** Burmese text goes beside or below the art in normal text — never aligned inside a box.
- Markup: `<pre class="ascii" role="img" aria-label="…">` for meaningful art, `aria-hidden="true"` for decoration. Never leave decorative art to be read character by character.
- Two sizes: `.ascii--wide` (≤ 80 columns, shown ≥ 40rem) and `.ascii--narrow` (≤ 44 columns, shown below). Art never forces horizontal page scroll; overflow scrolls inside the `<pre>`.
- `line-height` 1.0–1.2, `letter-spacing: 0`, ligatures off, a monospace face that contains box-drawing glyphs; provide an ASCII-only (`+ - |`) variant for fallback fonts.
- Contrast: art uses the text colour, so it stays crisp in E-Ink.

### 8.5 E-Ink theme (P1)

- Colours: `#000` on `#FFF` (text secondary ≥ `#333`); contrast ≥ 7:1. No meaning carried by hue alone.
- No transparency, blur, gradients, shadows, texture, or `position: fixed/sticky` chrome. Header is static.
- No animation, transition, smooth scrolling, parallax, auto-play. Instant state changes only.
- Borders 1–2 px solid black; links always underlined (2 px); focus ring 3 px solid black.
- Base font ≥ 18 px (user can step A−/A+ via `controls.js`, remembered locally); body weight not thin; Burmese line-height unchanged (≥ 1.8).
- Tap targets ≥ 44 × 44 px, adequate spacing so ghosting does not blur adjacent controls.
- Pagination and previous/next instead of infinite scroll; long docs split into screens of manageable length.
- Images grayscale with raised contrast; SVG line art preferred; no light-on-dark text.
- The dark theme is never auto-selected on E-Ink.

### 8.6 AI-company, Apple, Claude, Nothing, CLI, Oh-My-Posh (P1 typography / P2 rest)

Borrow the **feel**, never the assets (CLAUDE.md R6):

| Reference | What to borrow |
|-----------|----------------|
| AI-company sites (Claude / OpenAI style) | Editorial reading column (`--measure` ≈ 40rem), serif reading text + clean sans UI, generous margins, quiet monochrome, sparse motion |
| Apple | Large confident headings, precise spacing rhythm, restrained chrome, hairline separators |
| Claude | Calm paper tone, long-form comfort, plain-spoken UI copy |
| Nothing Phone | Dot-matrix display type (Doto) for hero/labels, monochrome with one optional signal red, technical captions |
| CLI | Prompt header `user@site ~/docs ❯`, monospace labels, `$` command snippets, block cursor on the hero (static in E-Ink) |
| Oh-My-Posh | Breadcrumb as prompt **segments** (`.prompt__seg`) built with CSS `clip-path`, not Nerd-Font glyphs; flat bordered boxes in E-Ink |

UI copy follows plain-language rules: sentence case, active voice, buttons say what happens ("Save", "Edit this page"), errors say what happened and how to fix it.

### 8.7 Liquid Glass, Dynamic Island, Hyprland transparency (P3, opt-in)

- `html[data-fx="glass"]` enables `.glass` surfaces: translucent surface mixed with `--surface`, `backdrop-filter: blur(≤ 20px) saturate(1.4)`, 1 px translucent border, soft shadow, ≥ 4.5:1 text contrast measured against the worst-case backdrop.
- **Dynamic Island pill** (`.island`): small black pill centred at the top, shows reading progress / section / theme + language toggles, expands on tap using `<details>` or `:focus-within`; spring-like motion ≤ 250 ms; hidden unless glass is on; respects `env(safe-area-inset-top)`.
- **Hyprland flavour:** tiled gaps and thin borders between "windows" (`.tiles` / `.tile`, active window = border switches to full-contrast on `:focus-within`), rounded corners ~10 px, 85–90 % opacity only on chrome. Monochrome only; no gradient borders.
- All of it is removed under E-Ink, `prefers-reduced-transparency`, `prefers-reduced-motion` (motion only), and when unsupported.

### 8.8 Components (shared classes in `tokens.css`)

`.container` · `.prose` · `.prompt` / `.prompt__seg` · `.ascii` · `.card` · `.tiles` / `.tile` · `.table-wrap` · `.alert` · `.bi` · `.lang-switch` · `.btn` · `.chip` · `.linktree` / `.linktree__item` · `.island` · `.glass` · `.skip-link`. Add new components as tokens + class, not as one-off CSS.

### 8.9 Motion

Default: none. Allowed: state feedback (hover/focus colour inversion, details open) ≤ 160 ms, off in E-Ink and under `prefers-reduced-motion`. One optional page-load moment at most (the hero cursor).

---

## 9. Accessibility

- WCAG 2.2 AA minimum; AAA contrast in the E-Ink theme.
- Skip link, landmarks (`header`, `nav`, `main`, `footer`), logical heading order, visible `:focus-visible`.
- Keyboard-operable switchers; `aria-pressed` kept in sync by `controls.js`.
- Respect `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency`.
- Alt text on every image (Burmese on Burmese pages); decorative art `aria-hidden`.
- Touch targets ≥ 44 px; no information by colour alone.

## 10. Performance and privacy

- Per page: HTML + CSS + JS (without fonts and images) ≤ 100 KB gzip; site JavaScript ≤ 15 KB; KaTeX CSS and fonts load only on pages that contain math.
- No third-party requests, no cookies, no analytics. `localStorage` keys only: `site-theme`, `site-fx`, `site-fontsize`, `site-bilingual`.
- Images responsive and lazy; fonts subset; CSS minified and fingerprinted by the SSG.
- Lighthouse (mobile): Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO ≥ 95.

## 11. SEO and sharing

`<title>` pattern `Page — Site`, meta description, canonical URL, Open Graph / Twitter tags using the absolute base URL from `actions/configure-pages`, sitemap, `robots.txt`, RSS/Atom for the blog, SVG favicon, `color-scheme` meta, an ASCII-styled 404 page with Burmese text.

---

## 12. GitHub Pages and CI

### 12.1 One-time owner settings
Repository **public** → Settings → Pages → *Build and deployment* → Source **GitHub Actions**. Actions enabled. For a custom domain add it under Pages and configure DNS.

### 12.2 Workflow requirements
- One workflow, `.github/workflows/deploy.yml`, copied from `templates/workflows/` and completed by the agent.
- Triggers: `push` to `main`, `pull_request` (build only), `workflow_dispatch`.
- Permissions: build job `contents: read`; deploy job `pages: write`, `id-token: write`.
- `concurrency: { group: pages, cancel-in-progress: false }`.
- Pin the SSG/runtime version **exactly** (never `latest`) and the Actions to a major tag (or commit SHA). Look the current stable versions up at scaffold time and record them in `SITE-DECISIONS.md`.
- `fetch-depth: 0` (git-based "last updated"); `TZ=Asia/Yangon` for stable date rendering.
- Base URL / path comes from `actions/configure-pages` outputs; templates never hard-code it.
- A failed build never deploys. The deploy job is skipped on pull requests.
- Content lint step: `python3 scripts/check_content.py <content-dir>` (stdlib only); starts as non-blocking, the agent may make it blocking after the owner agrees.

### 12.3 Pull requests and previews
GitHub Pages has no per-PR hosted preview. The PR build proves the site compiles; reading previews use GitHub's Markdown preview (hence the GFM-only content rule).

### 12.4 Lockfiles without a local install
Node/Ruby SSGs: pin exact versions in `package.json` / `Gemfile`. The workflow runs `npm ci` if `package-lock.json` exists, else `npm install --no-audit --no-fund`. Optional improvement (P3, ask first): a manual `workflow_dispatch` job that generates the lockfile in CI and commits it, after which caching (`cache: npm`) is enabled.

### 12.5 Optional quality gates (P3)
HTML validation and link checking on pull requests; Lighthouse CI on `main`.

---

## 13. Authoring from a phone or tablet

1. Edit or create files with the GitHub mobile app or the mobile website (*Add file → Create new file*; typing `folder/file.md` creates folders). Commit to `main`; the site rebuilds in a few minutes; check the Actions tab.
2. Upload images with *Add file → Upload files* into the images folder; names are ASCII lowercase (`2026-10-motor-bode.webp`); compress before upload.
3. Preview with GitHub's Markdown preview (math, tables, alerts, footnotes render there).
4. Ask Claude Code (web or mobile) for larger edits: "add a doc page about …", "translate this post to English". The `content-author` skill applies.
5. Every page's "Edit this page" link opens the correct file in GitHub's editor.

## 14. Target repository layout after scaffolding

```text
.
├── README.md                      Burmese
├── CLAUDE.md  SPECIFICATIONS.md  SITE-DECISIONS.md
├── .claude/skills/…               ssg-site-builder · content-author
├── .github/workflows/deploy.yml   from templates/workflows/
├── design/                        tokens.css · theme-init.js · controls.js · ascii-library.md
├── docs/CONTENT-GUIDE.md          Burmese (exact paths filled in by the agent)
├── scripts/check_content.py
├── templates/                     workflow templates (kept for reference)
└── <SSG-specific source tree>     content, layouts/components, config, assets, data
```

Content is organised per language and section (`content/my/docs/…`, `content/en/blog/…`) wherever the SSG allows it, because that is the simplest layout to edit on a phone. Where the SSG imposes its own layout (for example Docusaurus `i18n/`), follow the SSG and document the exact paths in `docs/CONTENT-GUIDE.md`.

---

## 15. Acceptance checklist

Build and hosting
- [ ] GitHub Actions run is green on `main`; the live URL loads; pull requests build without deploying
- [ ] No build output or secrets in git; SSG/runtime versions pinned exactly
- [ ] Works under the repository sub-path (no broken CSS/JS/image/link URLs)

Content and language
- [ ] Sample Burmese docs page with equation, table, figure, alert, footnote and ASCII art renders correctly
- [ ] Sample bilingual post (paired pages) with working language switcher; inline `.bi` block renders
- [ ] Portfolio item and linktree page render from sample data
- [ ] `check_content.py` passes; no Zawgyi warnings
- [ ] Every code comment is Burmese; README and CONTENT-GUIDE are Burmese

Design
- [ ] Paper theme matches §8.3 values; grain is nearly imperceptible
- [ ] E-Ink theme obeys §8.5 (no effects, static header, 7:1 contrast, grayscale images)
- [ ] Theme, font-size and language-view switches work and persist
- [ ] ASCII wordmark, dividers and 404 page present; art never causes page-level horizontal scroll
- [ ] Glass / Dynamic Island / transparency are opt-in and absent in E-Ink
- [ ] Burmese text is not clipped in headings and is readable at base size

Quality
- [ ] Keyboard navigation and visible focus verified; skip link works
- [ ] No third-party network requests
- [ ] Lighthouse targets in §10 met, or deviations reported
- [ ] All `TODO(owner)` placeholders listed in the handoff

## 16. Decisions

Recorded in `SITE-DECISIONS.md`. Defaults the agent proposes unless the owner says otherwise: default language `my`; English under `/en/`; linktree at `/links/`; no search; no analytics; no accent colour; content licence undecided (ask later).
