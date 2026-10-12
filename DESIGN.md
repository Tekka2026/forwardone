# DESIGN.md — layout foundation (source of truth)

This file and `css/global.css` define the layout system for the site. Later
sessions treat them as law: **components snap to these tokens; ad-hoc values are
bugs.** Fonts and colours are placeholders to be branded later. The **grid, type
scale and spacing are fixed** exactly as written here.

Load the stylesheet first on every page:

```html
<link rel="stylesheet" href="/css/global.css">
```

---

## 1. Canvas & container

| Token      | Value                     | Meaning |
|------------|---------------------------|---------|
| `--canvas` | `1984px`                  | The entire site caps here, centred on wider viewports (applied on `body`). |
| `--max`    | `1600px`                  | The content container width (`.wrap`). |
| `--pad`    | `var(--page-margin)` = 24px | The **only** horizontal page padding (Geist page margin). |

```html
<div class="wrap"> … </div>
```

`.wrap` is `max-width: var(--max); margin: 0 auto; padding-inline: var(--pad)` with
`box-sizing: content-box`, so its content box is exactly 1600px and the grid fits
edge to edge. Do not add other horizontal padding anywhere on the page.

## 2. Grid

12 columns × 104px with a 32px gutter: `12 × 104 + 11 × 32 = 1600`.

| Token      | Value   |
|------------|---------|
| `--cols`   | `12`    |
| `--col`    | `104px` |
| `--gutter` | `32px`  |

**Everything snaps to column widths.** n columns = `n × 104 + (n − 1) × 32`:

| Cols | Width   | Token      | Cols | Width    | Token       |
|------|---------|------------|------|----------|-------------|
| 1    | 104px   | `--col-1`  | 7    | 920px    | `--col-7`   |
| 2    | 240px   | `--col-2`  | 8    | 1056px   | `--col-8`   |
| 3    | 376px   | `--col-3`  | 9    | 1192px   | `--col-9`   |
| 4    | 512px   | `--col-4`  | 10   | 1328px   | `--col-10`  |
| 5    | 648px   | `--col-5`  | 11   | 1464px   | `--col-11`  |
| 6    | 784px   | `--col-6`  | 12   | 1600px   | `--col-12`  |

Never give a text block or component an arbitrary width. Pick one from this table.

Helpers:

- `.grid` — 12-column CSS grid, 32px gap. Children use `.col-1` … `.col-12`
  (`grid-column: auto / span n`) and optionally `.start-1` … `.start-12` to
  offset. Combine them as `class="col-4 start-9"`.
- `.w-1` … `.w-12` — `max-width: var(--col-n)` for blocks outside a `.grid`
  (text measures, standalone components).
- `.bleed` — full-bleed (100vw). This is an **explicit exception per element,
  never a default**. Content inside it still aligns to column 1: nest a `.wrap`.

```html
<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-6">…</div>
      <div class="col-6">…</div>
    </div>
  </div>
</section>

<div class="bleed">
  <div class="wrap">…still on the grid…</div>
</div>
```

## 3. Breakpoints

Media queries cannot read custom properties, so these numbers are hard-coded in
`global.css` (section 8). Use the same numbers everywhere, no others.

| Width   | Behaviour |
|---------|-----------|
| 980px   | Cards drop to 2 columns (`.cards`). |
| 880px   | Navigation collapses (`.nav-desktop` hides, `.nav-mobile` shows); multi-column `.grid`s stack to one column. |
| 760px   | Wide list rows stack (`.row`). |
| 640px   | Cards drop to 1 column (`.cards`). |

All queries are `max-width`, desktop-first.

## 4. Vertical rhythm

- `.section` — `padding-block: var(--section-pad)`: 128px (`--space-32x`) on
  desktop, 96px (`--space-24x`) at ≤980px, 64px (`--space-16x`) at ≤640px.
- Sections are separated by a **1px hairline top border**, not extra whitespace.
  `.section` carries `border-top: 1px solid var(--hairline)`; add `.section--flush`
  on the one section that must not (e.g. the first under the header).
- `.section--feature` steps body copy up to the feature body size (see type scale).

## 5. Type scale (marketing pages)

Three families, all loaded in `src/layouts/Base.astro`:

- `--font-display`: **Clash Display** (Fontshare; variable font, weight axis
  200–700, plus static 400/500/600 as fallback). Used for Display (H1),
  Section (H2) and Feature headings, stat values and the wordmark only.
- `--font-sans`: **Inter** (Google Fonts, variable 400–600). H3 and below
  (card titles, the Playbook list) and all body and UI text: lede, body,
  small, buttons, navigation, forms, footer.
- `--font-mono`: still a placeholder. Eyebrow, label, code.

**Sizes, line heights and tracking stay** whatever the family.

| Role        | Class         | Size                                   | Line | Tracking | Weight | Notes |
|-------------|---------------|----------------------------------------|------|----------|--------|-------|
| Display/H1  | `.h-display`  | `clamp(44px, 7vw, 100px)`              | 1.04 | 0        | 450    | **One per page.** |
| Section/H2  | `.h-section`  | `clamp(30px, 4.2vw, 56px)`             | 1.06 | 0        | 450    | max-width 1056px (8 cols). |
| Feature/H3  | `.h-feature`  | `clamp(34px, 5vw, 72px)`               | 1.04 | 0        | 450    | max-width 1056px (8 cols). |
| Card title  | `.card-title` | 19px                                   | 1.3  | −0.01em  | 550    | |
| Lede        | `.lede`       | `clamp(18px, 1.6vw, 21px)`             | 1.5  | 0        | 400    | max-width 784px (6 cols). |
| Body        | `.body`       | 17px; `clamp(17px, 1.4vw, 19px)` inside `.section--feature` | 1.55 | 0 | 400 | max-width 648px (5 cols); `.body--wide` allows 784px, never more. |
| Small       | `.small`      | 15px (`.small--tight` = 14.5px)        | 1.55 | 0        | 400    | Card body, list items. |
| Eyebrow     | `.eyebrow`    | 12px mono                              | 1.4  | +0.14em  | 500    | UPPERCASE. **Opens every section.** |
| Label       | `.label`      | 12px mono                              | 1.4  | +0.16em  | 500    | UPPERCASE. Metadata, markers. |
| Code        | `.code`       | 13.5px mono                            | 1.7  | 0        | 400    | As-is. Also the default for `code`, `pre`, `kbd`, `samp`. |

Bare `h1`, `h2`, `h3` elements map to Display, Section and Card title respectively
so unclassed semantic markup still lands on the scale. Heading level and visual
role are independent: use the semantic element the outline needs and the class
the design needs.

Rules:

- Headings are **sentence case, never all-caps**. UPPERCASE is reserved for the
  mono `.eyebrow` and `.label` styles.
- Display and Section headings break onto a new line after every sentence:
  render them through `src/components/ui/Sentences.astro`.
- H1 words enter from the bottom one by one in discrete frames (invisible,
  then 2 steps down, 1 step, rest; the last word over 8 frames). Tokens
  `--reveal-frame` (80ms), `--reveal-step` (0.08em), `--reveal-stagger`
  (90ms). Pass `reveal` to `Sentences`. Off under reduced motion.
- No em dashes anywhere in copy. Use a comma, colon or full stop. Page titles
  join with a vertical bar.
- Heading tracking is 0 (previously −0.04em / −0.03em; tokens `--ls-display`,
  `--ls-section`, `--ls-feature`). At 11–18px tracking stays at or near 0.
- Body text never exceeds 6 columns (784px).
- Every size, line height, tracking and heading weight value exists as a token
  (`--fs-*`, `--lh-*`, `--ls-*`, `--fw-heading`, `--fw-card-title`). New
  components reference tokens, never literal values. Heading weights are
  450 / 550 (set 2026-10-12), which requires the Clash Display variable font
  loaded in `src/layouts/Base.astro`; without it they snap to 500 / 600.

## 6. Spacing — Vercel Geist system

The padding system is Geist's: a 4px base unit named by multiple, a "gap"
family for the default distance between things, a fixed page margin and fixed
form-control heights. Applied everywhere; no off-scale values.

| Token               | px  | Geist name |
|---------------------|-----|------------|
| `--space`           | 4   | space |
| `--space-2x`        | 8   | space-2x |
| `--space-4x`        | 16  | space-4x |
| `--space-8x`        | 32  | space-8x |
| `--space-16x`       | 64  | space-16x |
| `--space-24x`       | 96  | space-24x |
| `--space-32x`       | 128 | space-32x |
| `--space-48x`       | 192 | space-48x |
| `--space-64x`       | 256 | space-64x |
| `--gap-quarter`     | 6   | gap-quarter |
| `--gap-half`        | 12  | gap-half |
| `--gap`             | 24  | gap |
| `--gap-double`      | 48  | gap-double |
| `--page-margin`     | 24  | page-margin |
| `--form-height-small` | 32 | form-small-height |
| `--form-height`     | 40  | form-height |
| `--form-height-large` | 48 | form-large-height |
| `--nav-height`      | 48  | form-large-height (the floating nav bar) |

Fixed uses:

- Page margin: `--page-margin` (`.wrap` padding, via `--pad`).
- Section rhythm: `--space-32x` / `--space-24x` / `--space-16x` by breakpoint.
- Buttons and inputs: height `--form-height`, horizontal padding `--gap-half`.
- Panel and card inner padding: `--gap`. Cell padding: `--gap-half`.
- Between titled groups: `--gap-double`.
- Eyebrow to the heading under it: `--gap-half` (12px).
- Heading to the body copy or lede that follows it: `--space-4x` (16px).
- Inside a component, step with `--space-2x` / `--space-4x` / `--space-8x`;
  between blocks within a section, `--gap`, `--space-8x`, `--gap-double`,
  `--space-16x` in ascending order of separation.
- The 12-column grid keeps its own `--gutter` (32px): that is grid geometry,
  not padding.

The token values were transcribed from Geist's CSS variables; the Geist site
could not be reached from the build environment to re-verify them (see
CLAUDE.md action A0005).

## 7. Hard rules

1. **`border-radius: 0` everywhere.** The reset applies it to every element and
   pseudo-element. Sharp corners are the point; nothing is rounded.
2. **Links and buttons share ONE `.btn` component** and must render identically.
   `<a class="btn">` and `<button class="btn">` get the same reset, box, type and
   states. `.btn--ghost` is the only variant. Never style a link to look like a
   button any other way.
3. **No arbitrary widths.** Widths come from the column table (section 2).
4. **No arbitrary spacing.** Internal spacing comes from the spacing scale
   (section 6); page spacing from `--page-margin`, `--gutter`, `--section-pad`.
5. **No arbitrary type.** Sizes, line heights and tracking come from the type
   scale (section 5).
6. **One `.h-display` per page.** Every section opens with an `.eyebrow`.
7. **Full-bleed is opt-in** per element via `.bleed`, never a default.

## 8. Navigation

The primary navigation is a bar that floats at the bottom of the viewport
(`src/components/Nav.astro`), not a top header. The logo sits alone in a plain
strip at the top of the page (`src/components/Header.astro`).

- Hidden on load. It slides in from the bottom on the visitor's first scroll
  (or at once when the page cannot scroll, or on the first Tab press).
- Closed: `--nav-bg` (#26175A), height `--nav-height`, 12 columns wide
  (`--col-12`), centred, `--gap` above the viewport bottom. Left: a greeting
  typed with a typewriter effect and a blinking `_` cursor (copy in
  `src/content/nav.ts`, `navGreeting`: first line, 4 s hold, erase, second
  line stays). Right: a hamburger button. Nothing else in the bar.
- Open: the panel expands upward from the bar in `--nav-bg-open` (#110338)
  with the section columns (accordions on mobile) and the utility links
  (LP Login and Pitch us live here on every width). The
  page behind is pushed back 3% (scale 0.97) from the centre of the visible
  viewport, covered by an 80% white layer and made inert. Escape,
  the scrim or the Close button closes it and returns focus.
- The page wrapper reserves `--nav-height` + 2 × `--gap` at the bottom so the
  footer is never hidden behind the bar.

## 9. Colour (placeholders)

`--bg`, `--fg`, `--muted`, `--hairline`, `--accent`, `--accent-fg`. These exist so
the layout can be seen; they are not a palette. Brand them later without
touching anything above.

## 10. What is in `css/global.css`

| Section | Contents |
|---------|----------|
| 1 | All tokens on `:root`. |
| 2 | Reset: box-sizing, `border-radius: 0`, body capped at `--canvas`, element defaults for headings and code. |
| 3 | `.wrap`, `.grid`, `.col-*`, `.start-*`, `.w-*`, `.bleed`. |
| 4 | `.section`, `.section--flush`, `.section--feature`. |
| 5 | Type classes. |
| 6 | `.btn`, `.btn--ghost`. |
| 7 | `.panel`, `.cell`, `.group`, `.cards`, `.row`. |
| 8 | Breakpoints. |
| 9 | `.visually-hidden`, reduced-motion. |

Add new components in their own files that **consume** these tokens. Do not
redefine any token or class from this file elsewhere.

## 11. Where things live (Astro)

| What | Path |
|---|---|
| Global stylesheet | `css/global.css`, imported once in `src/layouts/Base.astro` |
| Page shell, skip link, font loading | `src/layouts/Base.astro` |
| Top strip (logo), floating nav, footer | `src/components/Header.astro`, `src/components/Nav.astro`, `src/components/Footer.astro` |
| Shared UI | `src/components/ui/` (Button, Logo, Footnote, Placeholder) |
| Homepage sections | `src/components/home/`, composed in `src/pages/index.astro` |
| Copy and numbers | `src/content/home.ts`, `src/content/nav.ts`, `src/content/pages.ts` |
| Legacy redirects | `src/content/redirects.mjs` |
| Internal links | always through `href()` from `src/lib/href.ts` so the base path is applied |

Component styles are Astro scoped `<style>` blocks that use the tokens above.
