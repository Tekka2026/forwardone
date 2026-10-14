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
  Section (H2) and Feature headings, stat values, card metrics and the
  wordmark only.
- `--font-sans`: **Inter** (Google Fonts, variable 400–600). H3 and below
  (card titles, the Playbook list) and all body and UI text: lede, body,
  small, buttons, navigation, forms, footer.
- `--font-mono`: **Geist Mono** (Vercel, SIL OFL; self-hosted from
  `src/assets/fonts/geist-mono`, weights 400 and 500). Eyebrow, label, code, and
  the nav panel column titles.

**Sizes, line heights and tracking stay** whatever the family.

| Role        | Class         | Size                                   | Line | Tracking | Weight | Notes |
|-------------|---------------|----------------------------------------|------|----------|--------|-------|
| Display/H1  | `.h-display`  | `clamp(44px, 7vw, 100px)`              | 1.04 | 0        | 450    | **One per page.** |
| Section/H2  | `.h-section`  | `clamp(30px, 4.2vw, 56px)`             | 1.06 | 0        | 450    | max-width 1056px (8 cols). |
| Feature/H3  | `.h-feature`  | `clamp(34px, 5vw, 72px)`               | 1.04 | 0        | 450    | max-width 1056px (8 cols). |
| Card title  | `.card-title` | 19px                                   | 1.3  | −0.01em  | 550    | |
| Metric      | `--fs-metric` | `clamp(24px, 2.4vw, 32px)`             | 1.15 | 0        | 450    | Headline figure on a card (Proof). Also stat values at ≤640px. |
| Lede        | `.lede`       | `clamp(18px, 1.6vw, 21px)`             | 1.5  | 0        | 400    | max-width 784px (6 cols). Homepage section body copy uses it too: hero, Track record, What we do blocks, Playbook, Fund III. |
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
  A `\n` in the content string forces an extra break mid-sentence
  (hero: "Performance, / engineered.").
- H1 words enter from the bottom one by one in discrete frames (invisible,
  then 2 steps down, 1 step, rest; the last word rises smoothly from 7
  steps down over the span of 8 frames, appearing as a left-to-right
  gradient from the heading colour to `--reveal-tint` #78F6FB; the blue
  then slides out to the right over `--reveal-tint-duration`, 32 frames,
  from the moment it appears). Tokens
  `--reveal-frame` (80ms), `--reveal-step` (0.02em), `--reveal-stagger`
  (90ms). Pass `reveal` to `Sentences`. Off under reduced motion.
- Section headings can use the same word reveal, started when they
  scroll into view (`<Sentences reveal onScroll>`): held until the heading
  is above the bottom 15% of the window (clear of the floating nav), then
  played without the page-load pause. Used on the Playbook H2.
- Homepage intro sequence: the eyebrow's lead ("Early-stage VC") is
  visible from the start; its rest ("for European industrial tech") ticks
  in word by word straight away (`<Sentences reveal tick>`, start 0ms);
  the H1 starts after `--reveal-start` (800ms); once its last word has
  landed (`--h1-end`), the body copy; eight frames later (body copy about half visible) the buttons
  one after the other (`--reveal-stagger-buttons`, 180ms); later the figures arrive one by one, `--reveal-stagger-figures`
  (180ms) apart. Three motions (global.css), all off under reduced motion:
  - `.reveal-gentle`: slow fade while rising 8px, `--reveal-gentle`
    (1600ms), slow start and soft landing. Body copy and the figure labels.
  - `.reveal-snap`: the H1 word motion (invisible, 2 steps, 1 step, rest).
    The figure numbers; each label eases in 3 frames after its number.
    The figures are held until 15% of the section after the intro is on
    screen (clear of the floating nav), then come in one by one; if they are in view at load they keep their place in the intro
    sequence.
  - `.reveal-block`: one-frame appearance, then a smooth 12px rise over
    9 frames, like the H1's last word. The buttons.
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

### Figures and tables

- Stat values never wrap. The stats grid uses `minmax(min-content, 1fr)`
  columns, so a column is never narrower than its number; labels wrap instead.
  In the DOM the number comes before its label (screen readers read it first).
- A card's `metric` is its most prominent line when filled and is not rendered
  while it is empty or a placeholder.
- Data tables are real `<table>` elements with `scope`d headers. At ≤760px
  each row restacks into a block between hairlines (no box) with mono
  labels taken from `data-label`; tables never scroll horizontally.

### Track record head

Centred: eyebrow, then the headline figure (`€383M`) with the number at
twice the H1 size (`calc(var(--fs-display) * 2)`) and the € and M at H1
size (`--fs-display`) on one baseline, weight `--fw-figure` (= `--fw-heading`, 450, like the H1) and
tracking `--ls-figure` (0), then the H2 centred below it. Same rhythm as
the hero: eyebrow → figure 12px, figure → title 16px; the number's line
height is `(--lh-display + 0.7) / 2` so the room around the digits equals
the H1's (an H1 line height at twice the size would double it) on one line (an exception to the
break-after-each-sentence rule; it wraps only where it does not fit),
with centred body copy 16px below it, at the hero's lede size
(`.lede`, `--fs-lede`, like the copy under the H1).
The figure is painted by a black → `--brand-cyan` gradient whose cyan slides
out to the right. Desktop (mouse): the cursor drives it; far away the full
gradient shows, within 480px it fades as the cursor approaches, on the
number it is solid black (eased). Touch (no cursor): the full gradient
stays. Solid
without JS or under reduced motion. The
table follows 16px lower.

The whole section sits on a tinted band, `.section--tint`
(`--bg-tint`: `rgba(0, 0, 0, 0.04)`, white 4% inside `.theme-dark`),
full window width, with no hairline at its top (the colour change marks
the edge).

Under the table one row: the exits line on the left, the "Funds & track
record" link on the right (right-aligned with the table); stacked, exits
first, at ≤760px.

### Playbook list

Numbered list in the right column (`src/components/home/Playbook.astro`):
mono number (`01`–`04`), then a title (card-title size) with one line under
it in small, muted text (`--muted`), aligned with the title; hairline
dividers between items (8px above and below each item). The list
stretches to the text column's height and shares spare room between its
items, so both columns end on the same line where the list fits; on narrow
screens the list stacks under the CTA.

### Investor portal preview (under Fund III)

`src/components/home/FundIII.astro`, `src/components/home/PortalPreview.astro`
(both screens), `src/components/home/portal/AssetsChart.astro` (legend,
gauge and tooltips, shared) and `portal/icons.ts`; copy in `fundIII` and
`portal` (home.ts).

- Fund III section background: a diagonal gradient, full width, evenly from
  `#B6E3E5` in the bottom-left corner to `rgba(0, 0, 0, 0.04)` over the page
  white in the top-right corner. `background-clip: padding-box`, so the
  top hairline keeps the standard grey instead of tinting over the gradient.
- Fund III head is centred: eyebrow, H2, body (balanced), CTA.
- Under it, 48px below the CTA, a desktop dashboard drawn in HTML: the middle
  10 of 12 columns (full width at ≤880px). No device bezel: edged by a 1px line on
  three sides, top corners rounded `--radius` (4px, as the nav bar), on the
  unscaled frame so they stay 1px / 4px at any width. The section has no bottom padding, so the
  dashboard runs into the section's bottom edge and is cut off there: only
  the top 75% of the 1328 × 840 screen is drawn (1328 × 630), and content
  below the cut is left out of the markup, not hidden.
- Designed at that fixed size and scaled to the column width like an image
  (a ResizeObserver sets `--pp-scale`), so the layout never reflows.
- Mobile (≤880px): instead of the shrunken desktop screen, a phone version
  of the same dashboard, a 390 × 633 stage (75% of 390 × 844), at most 390px
  wide and centred, scaled the same way. White bar with menu icon, logo
  centred and log-out icon; greeting and value date; the Total Assets card
  with title, a 264px gauge centred and the legend in two columns under it;
  the "Your team" card, which runs into the cut. The article card falls
  below the cut on mobile, so it is left out. Chart interaction: hover with
  a mouse, tap on touch (tap again or elsewhere in the chart to clear); on
  mobile the tooltip sits in the middle of the gauge.
- Live bits: the greeting follows the viewer's local time (morning 05–12,
  afternoon 12–18, evening otherwise) and the value date shows their current
  date and time.
- Assets by class (layout per the owner's reference, 2026-10-14): 24px under
  the total, a row of two 300px columns: "Assets by class" with the legend
  under it (12px), vertically centred on the gauge's visible height, then a
  270° gauge open at the bottom (after a fintech gauge reference); the rest
  of the card's width stays empty on the right. The SVG viewBox is cropped
  to the drawn arc, top of the arc to the bottom of its end caps. The three largest classes plus Other,
  largest first, clockwise from the bottom-left end; together they fill the whole
  arc (shares of these four add up to 100%), 14-unit stroke, rounded ends,
  6px gaps. Share labels (mono) sit inside the arc; the centre shows the
  viewer's current year in the display face, grey. The legend lists the same
  four. Segments rest at 85% opacity; hovering a segment or legend row
  brightens that one to full colour and fades the others (no change in
  size), and shows its tooltip (label, value, share) at the arc's midpoint,
  opening toward the inside of the ring. No divider between the total and
  the chart. The Portfolios card is left out (it fell below the cut); the
  Total Assets card stretches to the column height, so it runs into the
  cut like the right-hand cards instead of ending above it.
- Geist-style parts in the site's type and colours: white top bar (1px line
  under it, muted tabs, black underlined active tab), square cards with Geist's shadow border on a
  `#fafafa` canvas, the site's small ghost pill button (Filter), a cyan pill
  badge, a dark tooltip, 1.5px stroke icons, links in `--brand-purple`.
- Chart tones: cyan, ink, lilac (purple 45% toward white), grey. Amounts use comma thousands separators (EUR 1,500,300).
- An illustration: `role="img"` with a label; nothing inside is focusable.

### Insights and closing

- Insights (black band): on desktop the H2 runs at most 6 of the 12 grid
  columns (fluid, from the wrap width); full width at ≤880px.
- Closing ("Serious about performance? So are we."): title and buttons
  centred.

### Proof slider ("From lab to exit.")

Built like the "Follow the battery." section on vikka.io
(`src/components/home/CaseStudies.astro`):

- Heading row: eyebrow and H2 in 6 columns, intro (body copy) in 4 columns
  from column 9 (owner, 2026-10-14).
- One dark card (`#111111`, dark theme) per company in a horizontal
  scroll-snap track. Cards are 10 of 12 columns wide (`--card-cols`; 1328px at full width);
  in the single-column grid (≤880px) the content width minus a 48px peek.
- The track runs from window edge to window edge (also beyond the 1984px
  canvas); the current card aligns with the content's left edge (the last card,
  at the end, with its right edge), earlier and later
  cards are cut off by the browser on either side. The root clips
  horizontal overflow, so there is no page scroll.
- Card: date in `--brand-cyan` (group label and month + year, e.g. "EXIT: APRIL
  2022"), visual centred in the right half, or a background video filling
  the card (WebM first, MP4 fallback, poster frame; under one flat overlay (`--video-overlay`, 45% black); plays only while on screen, never under reduced motion), then along the bottom, across the whole card, the company name at Feature size (no
  hover underline; focus shows an outline), the outcome line and optional
  mono facts. A filled `metric` shows top right. At ≤760px the card stacks.
- Controls under the slider: a 1px progress line across the content width
  filling by slide in `--fg` (black), and round back/next buttons at the content's right edge
  (disabled at the ends). Swipe, trackpad and keyboard scroll the track too.

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
- Buttons: Geist sizes, `--form-height-small` / `--form-height` /
  `--form-height-large` with `--btn-pad-small` / `--btn-pad` / `--btn-pad-large`.
- Inputs: height `--form-height`, horizontal padding `--gap-half`.
- Panel and card inner padding: `--gap`. Cell padding: `--gap-half`.
- Between titled groups: `--gap-double`.
- Eyebrow to the heading under it: `--gap-half` (12px).
- Heading to the body copy or lede that follows it: `--space-4x` (16px).
- Heading block (eyebrow, heading, intro/body) to the section's content
  (cards, slider, table, list): `--space-4x` (16px).
- Section content to its closing link or button: `--gap-double` (48px).
  Exception: the Track record exits/link row is an annotation of the table
  above it and sits `--gap` (24px) below it.
- Inside a component, step with `--space-2x` / `--space-4x` / `--space-8x`;
  between blocks within a section, `--gap`, `--space-8x`, `--gap-double`,
  `--space-16x` in ascending order of separation.
- The 12-column grid keeps its own `--gutter` (32px): that is grid geometry,
  not padding.

The token values were transcribed from Geist's CSS variables; the Geist site
could not be reached from the build environment to re-verify them (see
CLAUDE.md action A0005).

## 7. Hard rules

1. **Square corners everywhere, except buttons, the navigation bar and the
   portal preview.** Buttons are pills (`--btn-radius`, as on vercel.com); the
   navigation bar and the portal preview's top corners use `--radius` (4px).
   The reset applies `border-radius: 0` to every other
   element and pseudo-element.
2. **Links and buttons share ONE `.btn` component** and must render identically.
   `<a class="btn">` and `<button class="btn">` get the same reset, box, type and
   states. **Shape** follows the Vercel Geist / vercel.com button; **colours**
   are the site's own (Geist colours deliberately not used, 2026-10-13):
   - Pill shape on every size (`--btn-radius`).
   - Sizes `.btn--small` (32px, 14px/20px text, header "Pitch us"), default
     (40px, 16px/24px) and `.btn--large` (48px, 16px/24px); weight 500;
     padding `--btn-pad-small` / `--btn-pad` / `--btn-pad-large`.
   - `.btn`: `--accent` fill, 1px `--fg` border. `.btn--ghost`: transparent
     with a 1px `--fg` border. Focus: 2px `--fg` outline, 2px offset.
     Disabled: 40% opacity.
   - Hover (and focus): filled (primary) buttons mix 20% of the opposite
     colour into their fill (`--btn-hover-mix`, `--btn-hover-amount`; owner
     2026-10-14): the black button gets 20% white (#111 → #414141), the
     white button on dark backgrounds 20% black (#fff → #ccc). Text colour
     does not change. Outlined buttons keep the vercel.com 6% overlay
     (`--btn-hover-shade`, 8% white in the dark theme).
   Set them with `<Button variant size>`. Never style a link to look like a
   button any other way.
3. **No arbitrary widths.** Widths come from the column table (section 2).
4. **No arbitrary spacing.** Internal spacing comes from the spacing scale
   (section 6); page spacing from `--page-margin`, `--gutter`, `--section-pad`.
5. **No arbitrary type.** Sizes, line heights and tracking come from the type
   scale (section 5).
6. **One `.h-display` per page.** Every section opens with an `.eyebrow`.
7. **Full-bleed is opt-in** per element via `.bleed`, never a default.

Link underlines (hover, current page) are 1px (`a` in global.css); the
font's default underline is too heavy.

## 8. Navigation

The primary navigation is a bar that floats at the bottom of the viewport
(`src/components/Nav.astro`), not a top header. The logo and two small
buttons sit in a plain strip at the top of the page
(`src/components/Header.astro`): Pitch us (solid: white with black text on
the dark intro, black with white text on light pages) and, to its right,
LP login (outlined, opens the LP portal in a new tab, ↗). On phones
(≤640px) Pitch us is hidden; founders reach it from the closing section.

- Hidden on load. It slides in from the bottom on the visitor's first scroll
  (or at once when the page cannot scroll, or on the first Tab press).
  Once in place, a gradient fades in behind it: black 30% at the viewport
  bottom to black 0% at 20px above the bar.
- Closed: `--nav-bg` (#1A1A1A), height `--nav-height`, 12 columns wide
  (`--col-12`), centred, `--gap` above the viewport bottom. Left:
  "Welcome to FORWARD.one", typed once and kept until the bar is pressed.
  Right: a hamburger button. The whole bar opens the panel; the hamburger is
  the keyboard control.
- Pressing the bar: the text slides right, the AI mark (#78F6FB) rises into
  place 750ms later the way the last H1 word does, and the line is retyped as
  "How can we help you?", which stays. (A grey "Type your question" step
  after 2 s exists but is switched off: `navGreeting.ask.placeholderEnabled`.)
  Clicking the line, or typing anywhere once it has been typed, opens a text
  field (no backend yet). Closing types the welcome line back.
- The first six typed characters carry a circular #78F6FB-to-white gradient
  centred on the first letter; on the white (inverse) bar the same gradient
  runs from #78F6FB into the bar's dark text colour. The `_` cursor shows only while text is being
  typed or erased. Copy lives in `src/content/nav.ts` (`navGreeting`).
- Open: the panel expands upward from the bar in `--nav-bg-open` (#000000)
  with the section columns (accordions on mobile). LP login is also reached via
  the Investors column; Pitch us and LP login are buttons in the top strip. The
  page behind is pushed back 3% (scale 0.97) from the centre of the visible
  viewport, covered by an 80% white layer and made inert. Opening and closing
  use the same fluid, snappy motion (420ms, ease-out). The panel never fades:
  it unfolds up out of the bar and folds back down into it, and the panel
  and bar always share one colour, changing together. Escape,
  the scrim or the Close button closes it and returns focus.
- The page wrapper reserves `--nav-height` + 2 × `--gap` at the bottom so the
  footer is never hidden behind the bar.

- Inverse: while closed and over an element marked `data-nav-dark` (the
  homepage intro), the bar turns `--nav-bg-inverse` (#FFFFFF) with
  `--nav-fg-inverse` (#1A1A1A) text, and the greeting drops its cyan
  gradient. The check uses the bar's resting centre line and runs on scroll
  and resize. The panel takes the same colour while closed, so opening and
  folding away animate bar and panel together (white to #000 and back).

- Entrance glow: as the bar slides in, a transparent → `--brand-cyan`
  gradient across the whole bar slides out to the right over
  `--reveal-tint-duration` with `--reveal-gentle-ease`, the same as the H1's
  last word. Off under reduced motion.

## 9. Colour (placeholders)

- Dark sections: `.section--dark.theme-dark` (black band, tokens inverted;
  `data-nav-dark` so the floating nav inverts over it). Used by Insights.
- `.theme-dark` re-points the colour tokens (`--bg` #000, `--fg` #FFF,
  `--accent` #FFF, `--muted` #A1A1A1, white hairlines, button hover mix) so
  any component inside it inverts without its own dark styles.
- Homepage intro (`.intro` in `src/pages/index.astro`): header, hero and
  figures on one black block, edge to edge (beyond the canvas too, and
  upwards, so no white strip shows when the open menu pushes the page back), at
  least 130% of the viewport high
  (`130svh`), figures at its bottom, hero content centred vertically in the space
  between header and figures. The header sits transparently on top
  (`Base` prop `darkTop`; `--header-h` = 80px). Where the content needs more
  room (phones) the block grows.

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
| Logo | `src/assets/brand/forwardone.svg` (supplied 2026-10-14), inlined by `src/components/ui/Logo.astro` in `currentColor`: 20px high (15px at ≤420px so logo and LP login fit down to 320px); also in the portal preview's top bar (16px desktop, 14px mobile) |
| Top strip (logo), floating nav, footer | `src/components/Header.astro`, `src/components/Nav.astro`, `src/components/Footer.astro` |
| Footer partner logos (Invest Europe, EIF, EU) | `src/assets/partners/*.svg`: single-colour SVGs inlined in `currentColor` (black on the light footer), all 44px high. No hairline above. Desktop: one left-aligned row, "Member of:" (Inter, `.small`) 12px before the Invest Europe logo, 64px between logos. Phones (≤640px): "Member of:" centred with the three logos centred in one row 16px under it, 32px high; label and names in `footer.partnersLabel` / `footer.partners` (nav.ts) |
| Shared UI | `src/components/ui/` (Button, Logo, Footnote, Placeholder) |
| Homepage sections | `src/components/home/`, composed in `src/pages/index.astro` |
| Copy and numbers | `src/content/home.ts`, `src/content/nav.ts`, `src/content/pages.ts` |
| Legacy redirects | `src/content/redirects.mjs` |
| Internal links | always through `href()` from `src/lib/href.ts` so the base path is applied |

Component styles are Astro scoped `<style>` blocks that use the tokens above.
