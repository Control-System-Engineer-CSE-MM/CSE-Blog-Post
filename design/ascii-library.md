# ascii-library.md

ASCII-art building blocks for the site (P1 identity element). Copy, adapt, reuse. Rules are in `SPECIFICATIONS.md §8.4`.

## Ground rules

1. Inside art use **Latin letters, digits, box-drawing (`─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ═ ║ ╔ ╗ ╚ ╝`) and block (`░ ▒ ▓ █`) glyphs only**. Burmese text must never be aligned inside a frame — put it next to or under the art.
2. Every line of one block has exactly the same character count. Verify before committing (the generator that produced this file did).
3. Wrap meaningful art as `<pre class="ascii ascii--wide" role="img" aria-label="…">…</pre>`; decorative art gets `aria-hidden="true"`.
4. Provide a narrow variant (≤ 44 columns) with class `ascii--narrow` for phones. Wide variants are ≤ 80 columns.
5. Font: a monospace face with box-drawing glyphs (`--font-mono`). `line-height` 1.0–1.2, `letter-spacing: 0`, ligatures off — already set on `.ascii`.
6. ASCII-only fallback: replace `─ │ ┌ ┐ └ ┘` by `- | + + + +` when the font lacks box glyphs.
7. E-Ink friendly by construction: art uses the text colour only.

## Wordmark (small, "Calvin S"-style)

Hand-draw the owner's site name in this style (≤ 8 letters). For longer names use the framed single-line form below.

```text
╔═╗╦╔╦╗╔═╗
╚═╗║ ║ ║╣ 
╚═╝╩ ╩ ╚═╝
```

Framed single-line wordmark (any length that fits the width):

```text
╔══════════════════════╗
║  [ YOUR-SITE-NAME ]  ║
╚══════════════════════╝
```

## Header bar

```text
┌──────────────────────────────────────────────┐
│ ~/site                            v1.0  [Aa] │
└──────────────────────────────────────────────┘
```

## Prompt line / breadcrumb (text version; the CSS version uses `.prompt__seg`)

```text
user@site ~/docs/equations ❯
```

## Dividers

```text
────────────────────────────────────────
════════════════════════════════════════
· · · · · · · · · · · · · · · · · · · ·
─────────── ◆ ───────────
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█
```

## Callout frame (use for NOTE / WARNING; keep the label in Latin, the message below in normal text)

```text
┌────────────────────────────────────────────────┐
│ NOTE                                           │
│ ────                                           │
│ (message goes in normal text below the frame)  │
└────────────────────────────────────────────────┘
```

## Directory-tree navigation

```text
docs/
├── intro/
│   ├── overview
│   └── install
├── reference/
│   └── api
└── glossary
```

## Progress / status

```text
[██████░░░░] 60%
[██████████] done
[░░░░░░░░░░] pending
```

## 404 page

```text
┌────────────────────────────────┐
│                                │
│   4 0 4   not found   (._.)    │
│                                │
└────────────────────────────────┘
```

Text under it (Burmese, normal paragraph): "ရှာသော စာမျက်နှာ မတွေ့ပါ။ ပင်မစာမျက်နှာသို့ ပြန်သွားပါ။"

## Empty state

```text
┌──────────────────────────────┐
│                              │
│   no entries yet             │
│   ▸ create the first one     │
│                              │
└──────────────────────────────┘
```

## Usage example (HTML)

```html
<pre class="ascii ascii--wide" role="img" aria-label="Site wordmark">…wide art…</pre>
<pre class="ascii ascii--narrow" role="img" aria-label="Site wordmark">…narrow art…</pre>
```
