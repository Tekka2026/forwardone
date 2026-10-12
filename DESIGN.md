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
| `--pad`    | `clamp(20px, 4vw, 56px)`  | The **only** horizontal page padding. |

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
  (`grid-column: span n`) and optionally `.start-1` … `.start-12` to offset.
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

- `.section` — `padding-block: clamp(80px, 12vh, 160px)` (`--section-pad`).
- Sections are separated by a **1px hairline top border**, not extra whitespace.
  `.section` carries `border-top: 1px solid var(--hairline)`; add `.section--flush`
  on the one section that must not (e.g. the first under the header).
- `.section--feature` steps body copy up to the feature body size (see type scale).

## 5. Type scale (marketing pages)

Two families, both placeholders (`--font-sans`, `--font-mono`). Swap families
later; **sizes, line heights and tracking stay**.

| Role        | Class         | Size                                   | Line | Tracking | Weight | Notes |
|-------------|---------------|----------------------------------------|------|----------|--------|-------|
| Display/H1  | `.h-display`  | `clamp(44px, 7vw, 100px)`              | 1.04 | −0.04em  | 500    | **One per page.** |
| Section/H2  | `.h-section`  | `clamp(30px, 4.2vw, 56px)`             | 1.06 | −0.03em  | 500    | max-width 1056px (8 cols). |
| Feature/H3  | `.h-feature`  | `clamp(34px, 5vw, 72px)`               | 1.04 | −0.03em  | 500    | max-width 1056px (8 cols). |
| Card title  | `.card-title` | 19px                                   | 1.3  | −0.01em  | 600    | |
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
- Negative tracking belongs to large display text only. At 11–18px tracking
  stays at or near 0.
- Body text never exceeds 6 columns (784px).
- Every size, line height and tracking value exists as a token (`--fs-*`,
  `--lh-*`, `--ls-*`). New components reference tokens, never literal sizes.

## 6. Spacing scale (4px base) — UI / panel internals

| Token        | px |
|--------------|----|
| `--space-1`  | 4  |
| `--space-2`  | 8  |
| `--space-3`  | 12 |
| `--space-4`  | 16 |
| `--space-5`  | 24 |
| `--space-6`  | 32 |
| `--space-8`  | 48 |
| `--space-10` | 64 |

No off-scale values. Fixed uses:

- Cell padding: `--space-3` (`.cell`).
- Panel inner padding: `--space-5` (`.panel`).
- Between titled groups: `--space-6` (`.group + .group`).

Page-level horizontal spacing is `--pad` and `--gutter`; page-level vertical
spacing is `--section-pad`. The spacing scale is for what happens inside
components.

## 7. Hard rules

1. **`border-radius: 0` everywhere.** The reset applies it to every element and
   pseudo-element. Sharp corners are the point; nothing is rounded.
2. **Links and buttons share ONE `.btn` component** and must render identically.
   `<a class="btn">` and `<button class="btn">` get the same reset, box, type and
   states. `.btn--ghost` is the only variant. Never style a link to look like a
   button any other way.
3. **No arbitrary widths.** Widths come from the column table (section 2).
4. **No arbitrary spacing.** Internal spacing comes from the spacing scale
   (section 6); page spacing from `--pad`, `--gutter`, `--section-pad`.
5. **No arbitrary type.** Sizes, line heights and tracking come from the type
   scale (section 5).
6. **One `.h-display` per page.** Every section opens with an `.eyebrow`.
7. **Full-bleed is opt-in** per element via `.bleed`, never a default.

## 8. Colour (placeholders)

`--bg`, `--fg`, `--muted`, `--hairline`, `--accent`, `--accent-fg`. These exist so
the layout can be seen; they are not a palette. Brand them later without
touching anything above.

## 9. What is in `css/global.css`

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
