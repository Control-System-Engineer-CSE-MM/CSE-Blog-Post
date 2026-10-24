# CLAUDE.md

Operating rules for Claude Code (and any other coding agent) working in this repository.

- Human-facing documents are in Burmese: `README.md`, `docs/CONTENT-GUIDE.md`.
- This file, `SPECIFICATIONS.md` and the skills are written in English so that requirements stay unambiguous for the agent. The language rules for *code comments*, *site content* and *replies to the owner* are in §3 (R3).

## 1. Mission

Build and maintain a static website — documentation, blog, personal portfolio and a linktree/linkbio page — served by **GitHub Pages** from a **public** repository and built **only by GitHub Actions**. The owner writes in **Burmese** (some pages bilingual Burmese/English) and publishes content from a **phone or tablet** that has no site toolchain installed.

## 2. Read order

1. `SITE-DECISIONS.md` — decisions already made (SSG, sections, repository identity). Never re-ask what is recorded there.
2. `SPECIFICATIONS.md` — source of truth: requirements, design system, CI, acceptance checklist.
3. `design/` — `tokens.css`, `ascii-library.md`, `theme-init.js`, `controls.js`. Reuse these; do not reinvent them.
4. `.claude/skills/ssg-site-builder/SKILL.md` — scaffold / CI / design-integration procedure.
5. `.claude/skills/content-author/SKILL.md` — adding and editing content.

Precedence when instructions conflict: the owner's latest message > this file > `SPECIFICATIONS.md` > skills.

## 3. Hard rules

**R1 — No local toolchain.** Never install or run an SSG, its package manager or a compiler in this environment in order to build the site (no hugo, go, npm/node builds, bundler/jekyll, docusaurus, sass, …). All builds and verification happen in GitHub Actions.
Allowed locally: reading and editing files, `git`, `gh` (if already present and authenticated), and read-only checks with tools that are already installed (grep, the python3 standard library — e.g. `scripts/check_content.py`).
Consequence: generators such as `hugo new site` or `npm create astro` cannot be used. Write every scaffold file by hand.

**R2 — GitHub Pages only.** Public repository, Pages source = "GitHub Actions". Never commit build output (`public/`, `dist/`, `_site/`, `build/`, `.astro/`, `.docusaurus/`, `resources/_gen/`). The site may be served from a sub-path (`/<repo>/`), so every URL and asset reference must go through the SSG's base-path mechanism — never hard-code a leading `/` in templates or content.

**R3 — Language rules.**
- Site content: Burmese, **Unicode only (never Zawgyi)**. Do not correct, reword or restyle the owner's Burmese text unless asked.
- Code comments (CSS, JS, HTML, YAML, TOML, templates, shell, workflow files — wherever comment syntax exists): **Burmese**. Keep them short and explain *why*. Do not translate identifiers, keywords or commands.
- Identifiers, file names, URL slugs and front-matter keys: English ASCII (slugs are kebab-case).
- `README.md` and `docs/CONTENT-GUIDE.md`: Burmese.
- Replies to the owner: Burmese in a formal written register, unless the owner writes in English.
- Commit messages: English, imperative mood, unless the owner asks otherwise.

**R4 — Phone-first authoring.** Content changes must need no tooling. Content uses portable GitHub-Flavored Markdown (tables, `$…$` / `$$…$$` math, `> [!NOTE]` alerts, footnotes) so the owner can preview it in GitHub's own mobile preview. No SSG-specific shortcodes inside content, except optional ones that degrade gracefully. Never ask the owner to run a command.

**R5 — Minimal, private, self-contained.** No third-party requests at runtime (no CDNs, Google Fonts, analytics, trackers, embeds). Self-host fonts (open licences only) and KaTeX assets. The site must be fully readable without JavaScript; JS is a small, deferred progressive enhancement. No CSS framework unless the owner asks for one.

**R6 — No proprietary assets.** Evoke Apple / Claude / OpenAI / Nothing styles with original CSS and open-licensed fonts. Do not copy their fonts (SF Pro, Tiempos, Söhne, Styrene, Ndot, …), logos, icons or source code.

**R7 — No invention.** Do not fabricate the owner's biography, credentials, employers, links or contact data. Use clearly marked placeholders (`TODO(owner)`, `example.com`) and list every one of them in the final handoff.

**R8 — Git hygiene.** No secrets in the repository. No force-push to `main`. Prefer small commits. Deployment is triggered by pushes to `main`; pull requests build but never deploy.

**R9 — Ask before destructive or irreversible steps:** deleting owner content, rewriting history, switching SSG after one was chosen, changing the default language or the URL scheme.

## 4. Step 0 — mandatory questions

If `SITE-DECISIONS.md` still contains `undecided`, ask the owner **before writing any scaffold**. Use Burmese, one message, and the interactive question tool if one is available:

1. **SSG** — Hugo, Astro, Eleventy, Jekyll, Docusaurus, or ALL. Give a one-line fit note for each from `SPECIFICATIONS.md §3`, state the recommendation (Hugo first, Astro as runner-up) and also offer "recommend for me". The owner decides.
2. **Sections to enable now** — docs, blog, portfolio, links (multi-select).
3. **Repository identity** — GitHub user/org, repository name (it decides the base path), custom domain (yes/no), site title, and the English letters to use for the ASCII wordmark.

Write the answers into `SITE-DECISIONS.md` immediately. If the answer to question 1 is ALL, follow `SPECIFICATIONS.md §3.3` and confirm the plan with the owner before building.

## 5. Work loop

Follow `.claude/skills/ssg-site-builder/SKILL.md`. In short: look up current versions from official sources → hand-write the scaffold → install the workflow template → integrate the design system → add clearly marked sample content → run the static checks → push → read the Actions result → fix → hand off in Burmese.

Do not claim the site "works" until the GitHub Actions run is green and, when reachable, the deployed URL has been checked. If Actions logs cannot be read, ask the owner to paste the failing log.

## 6. Design priorities (details: `SPECIFICATIONS.md §8`)

- **P1:** ASCII-art identity · E-Ink readability · AI-company typography (open-licensed analogues) · Clean Paper Minimalism background.
- **P2:** Apple / Claude / Nothing-phone restraint · CLI look · Oh-My-Posh-style prompt segments.
- **P3 (opt-in only):** Liquid Glass, Dynamic Island pill, Hyprland-style transparency — never behind reading text, never in the E-Ink theme.

When a P2/P3 idea harms a P1 requirement, drop the P2/P3 idea.

## 7. Code standards

- Semantic HTML: one `<h1>` per page, landmarks, a skip link, `lang` on `<html>` and on every foreign-language block.
- CSS is hand-written and driven by the variables in `design/tokens.css`; components reuse the class names defined there. No inline colours, no magic numbers outside the tokens.
- JS is vanilla, small and deferred; every `localStorage` access is wrapped in `try/catch`.
- Every template or config file that can hold comments starts with a short Burmese comment saying what the file is for.

## 8. Definition of done

Every box in `SPECIFICATIONS.md §15` is ticked, or explicitly waived by the owner in writing.
