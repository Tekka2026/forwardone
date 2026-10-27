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
| `--canvas` | `1984px`                  | Reference design width. Not a cap: section backgrounds and hairlines run to the window edges at any width (no max-width on `body`, owner 2026-10-15); content stays within `--max`. |
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
  gradient from the heading colour to `--reveal-tint` (#DB8E00 amber where
  headings are black, #FFEA6D yellow in `.theme-dark` where they are white,
  e.g. the homepage hero; owner 2026-10-17); the tint
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

### Founders strip (between the intro and the track record)

`src/components/home/Founders.astro`; copy in `founders` (home.ts). Owner,
2026-10-19.

- White section. Head as in the Proof slider: eyebrow "On the road" and the
  H2 ("We go where Europe’s builders are.") left, a line of body copy right
  (all of Europe, 2,500 screened a year; owner 2026-10-19, 'screen' not 'meet' 2026-10-21). Then a row of 5:7 cards, each three
  of the twelve columns wide, 32px apart, starting at the content's left
  edge and running on past the window's right edge.
- Never takes over the page's scrolling (owner, 2026-10-19): a plain
  horizontal scroller (swipe, trackpad, shift + wheel) with snap points,
  window edge to window edge like the Proof slider, the first card at the
  content's left edge. The track never scrolls vertically, so the wheel
  always moves the page. No arrows or progress line (owner, 2026-10-19).
- Phones (880px and below): cards min(72vw, 340px) wide.
- Docking (owner, 2026-10-19): card 1 is in place from the start. When the
  track is 35% in view, the other cards in view slide in from 0.9 of a card
  width to the right, one after another (320ms apart), and settle into
  their slots over 2800ms (cubic-bezier(0.16, 1, 0.3, 1); fade 1200ms;
  doubled from 1400 / 160 / 600 on 2026-10-19).
  Sideways scrolling is locked until the last of them has mostly arrived
  (90% of its slide, a third of the way into it; about 1.6s for three
  cards); the settle finishes while you scroll. Later cards dock the
  same way the first time they scroll into view. Reduced motion: no motion.
- Never a Proof company or an exit (owner, 2026-10-19): no company in the
  strip may also be in the Proof slider or the track record's exits; the
  build fails if one is.
- Sequence: the 20 founders in order, the card type alternating founder /
  company, and a clip after every fourth founder (25 cards).
- Founder card: the CEO's photo, full bleed (#ECECEA until supplied); name
  (card title) and "CEO, company" (small, muted) at the bottom, white over a
  soft dark gradient when there is a photo.
- Company card: the brand colour (else the site's tones in turn: yellow,
  ink, purple, sand, amber, deep red, grey-blue); the name in the display
  face (28–44px), one line of small body copy under it; text dark or white
  by the colour's luminance.
- The clip's profile circle links to the presenter's team profile.
- Company card link (owner, 2026-10-19): "Discover more about <company> →"
  at the bottom, the phrasing rotating card by card between "Discover more
  about", "Get to know" and "Learn more about" (owner, 2026-10-21); the whole card its click area (the company's page on
  forward.one, else the portfolio overview). On hover or keyboard focus it
  animates in like the H1: word by word in 80ms frames (two steps low, one,
  rest), the last word rising smoothly (no tint
  gradient, owner 2026-10-19); steps sized to ~2px like the H1's. Touch screens
  show it plainly; reduced motion shows it without motion.
- Clip card (TikTok-style): a muted, looping vertical video that plays while
  in view (until the team videos arrive, all five play the owner's
  Slush Finland clip `public/founders/clip-placeholder.mp4`, 14s, each from a
  different moment); a thin progress bar at the top that follows the video; right
  rail (small: avatar 28px, icons 15px, labels 9px) with the FORWARD.one
  avatar (the presenter's photo, cropped round; "F." without one) and red
  follow "+", Like (heart, fills
  red #FF3B5C and pops; "Like" → "Liked") and Share (opens LinkedIn's share
  dialog in a new tab, to post the site on the visitor's own feed); bottom left a caption
  (no handle or name/role line, owner 2026-10-19) and "♪ original sound · FORWARD.one" (11px, smaller than the caption). No
  like or share counts are shown (no invented numbers).

### Track record head

Centred: eyebrow, then the headline figure (`€388M`, the three funds' total commitments) with the number at
twice the H1 size (`calc(var(--fs-display) * 2)`) and the € and M at H1
size (`--fs-display`) on one baseline, weight `--fw-figure` (= `--fw-heading`, 450, like the H1) and
tracking `--ls-figure` (0), then the H2 centred below it. Same rhythm as
the hero: eyebrow → figure 12px, figure → title 16px; the number's line
height is `(--lh-display + 0.7) / 2` so the room around the digits equals
the H1's (an H1 line height at twice the size would double it) on one line (an exception to the
break-after-each-sentence rule; it wraps only where it does not fit),
with centred body copy 16px below it, at the hero's lede size
(`.lede`, `--fs-lede`, like the copy under the H1).
The figure is painted by a `--figure-base` → `--figure-glow` gradient (#820400
deep red → #DB8E00 amber; owner 2026-10-17) whose amber slides
out to the right while both colours darken to black (`color-mix` with `--fg`
by the same amount). Desktop (mouse): the cursor drives it; far away the full
gradient shows, within 480px it fades as the cursor approaches, on the
number it is solid black (eased). Touch (no cursor): scroll-linked, full
gradient as the figure enters at the bottom, the amber slides out as it
rises, solid black once its top reaches the top of the window. Solid
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
(both screens) and `portal/icons.ts`; copy and the illustrative figures in
`fundIII` and `portal` (home.ts).

- Fund III section background: a diagonal gradient, full width, evenly from
  `#FFEA6D` in the bottom-left corner to `rgba(0, 0, 0, 0.04)` over the page
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
- Rise on scroll (owner, 2026-10-19): the frame is 50px taller than the
  visible cut and reaches 50px below the section, which clips it
  (`overflow: hidden` on `.fund`). As the section scrolls in, the preview
  rises by those 50px (`--pp-rise` 0 → 1 over 1.5 window heights of
  scrolling from when its container enters at the bottom of the window,
  smoothstep eased; doubled from 0.75 on 2026-10-19 so it comes in slower), so
  more of the dashboard slides out from under the edge where the Insights
  block starts. It starts 98px under the CTA and ends at the usual 48px.
  Without JS or under reduced motion it rests risen.
- Designed at that fixed size and scaled to the column width like an image
  (a ResizeObserver sets `--pp-scale`), so the layout never reflows.
- Content (owner, 2026-10-19): the LP's investor-report overview, after the
  owner's portal screenshot. The top bar (logo, Home / Wealth / Transactions /
  Documents, then the Fundrbird mark (the owner's SVG redrawn as a 1.5-stroke
  line icon at 18px, 2026-10-19), mail with badge, settings, log out; the
  badge counts 3 → 4 once, 0.8s after the dashboard is half in view: the
  number slides up and is replaced from below, the yellow circle pops
  gently to 1.18×, 460ms; under reduced motion the number just changes) and the greeting row
  (greeting, value date, Filter) stay as before; no email address or user
  name is shown. Under them one card with a table:
  - a head row of mono column labels, right-aligned: Commitment, Paid-in
    capital, Distributed, Unfunded commitment, then on a tinted band (1.25%
    black, a 1px line on its left) Capital account at fair value, Fund
    multiple TVPI, Fund net IRR;
  - per fund a group row (name in 15px, a small grey mono currency badge,
    "View Q3 2026 report ↗" in `--brand-purple` over the band; no link when
    there is no report yet) and its holding rows (13px, tabular figures,
    distributions and negative IRRs in parentheses, "–" for none);
  - a look-through row (the LP's part held via another vehicle) indented
    under a corner mark, figures muted, the vehicle's name in purple;
  - a total row (600 weight, `#fafafa`), which falls under the cut.
- Figures are ILLUSTRATIVE: invented names for the investor entity and the
  co-investment companies, invented amounts of the same size as the real
  screenshot's, kept consistent (unfunded = commitment − paid-in, TVPI =
  (distributed + capital account) ÷ paid-in, totals add up).
- Mobile (≤880px): instead of the shrunken desktop screen, a phone version,
  a 390 × 633 stage (75% of 390 × 844), at most 390px wide and centred,
  scaled the same way. White bar with menu icon, logo centred and log-out
  icon; greeting and value date; then one card per fund: name and currency
  badge, six figures in two columns (mono label over the value: commitment,
  paid-in, unfunded, capital account, TVPI, net IRR) and the report link.
  The cards run into the cut.
- Live bits: the greeting follows the viewer's local time (morning 05–12,
  afternoon 12–18, evening otherwise) and the value date shows their current
  date and time.
- Geist-style parts in the site's type and colours: white top bar (1px line
  under it, muted tabs, black underlined active tab), square cards with
  Geist's shadow border on a `#fafafa` canvas, the site's small ghost pill
  button (Filter), a yellow pill badge on the mail icon, 1.5px stroke icons,
  links in `--brand-purple`. Amounts use comma thousands separators.
- An illustration: `role="img"` with a label; nothing inside is focusable.

### Insights and closing

- Insights section: black band (`.section--dark.theme-dark`, owner
  2026-10-15); the 5:7 visual boxes are light grey tiles (#F5F5F5) on it.
- Insights cards: visual, title (card title), then two lines of body copy
  (`.body`, muted) introducing the article (owner, 2026-10-19). No
  category or date line.
- Insights article visuals: light grey tiles (#F5F5F5) until supplied, 5:7 portrait;
  on phones (≤640px, one column) 7:5 landscape. An article can instead set
  `visual` to a coded visual from `src/components/visuals/`: the first one
  (Sensorfact) uses `RobotArm.astro`, the owner's interactive canvas robot
  arm (second version, WebGL2 with a depth buffer; inverted version). Since
  2026-10-19 the arm is drawn realistically: smooth-shaded solids without
  outlines, matte black links with a fine powder-coat grain (object-space
  noise mottling colour and sheen, so it sticks to the parts), all of it
  matte black down to the base plate, motor covers, tool changer and gripper
  (slightly different sheens keep the parts apart), and the yellow (#FFEA6D)
  sensor, lit per pixel by a camera-fixed studio rig (key upper left, fill right, rim behind, sky/ground
  ambient, highlights per material) with a soft contact shadow under the
  base. The plus-grid floor, dashed reach ring and label are unchanged. It
  fits itself to the box. Idle, its cap faces the viewer (turning with the
  slowly orbiting view) and keeps moving slightly: every 1.4–3.2 s it picks
  another spot near the camera to look at, eased so it moves like a machine.
  It follows the mouse while the pointer is over the box and eases back to
  the viewer when it leaves; drag turns the view, and while dragging the arm
  holds still; a click or tap (under 6px of movement) opens the article;
  the SENSORFACT label sits behind the arm. Coded visuals sit above the card's full-size link, so
  dragging works; the title still links. The second (Munich) uses
  `MunichMap.astro` (owner, 2026-10-19): a static, top-down street map of
  central Munich in the manner of a Mapbox "Light" style: pale land,
  built-up blocks, a dense web of white minor streets, white main roads
  with grey casings (the Mittlerer Ring among them, no longer yellow),
  muted green parks, grey-blue water (Isar, Eisbach, Auer Mühlbach, two
  lakes) and rail corridors. No names, pins or other copy on the map; only
  the legend (a 1 km scale bar and N ↑). Main roads, water and parks follow
  real coordinates, simplified; the minor streets are a seeded, slightly
  irregular grid per district (that district's street angle and block
  size), not real streets. Built at build time; it does not move.
- Insights: on desktop the H2 runs at most 6 of the 12 grid
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
- Card: date in `--brand-yellow` (group label and month + year, e.g. "EXIT: APRIL
  2022"), visual centred in the right half, or a background video filling
  the card (WebM first, MP4 fallback, poster frame; under one flat overlay (`--video-overlay`, 45% black); plays only while on screen, never under reduced motion), then along the bottom, across the whole card, the company name at Feature size (no
  hover underline; focus shows an outline), the outcome line and optional
  mono facts. A filled `metric` shows top right. At ≤760px the card stacks.
- Controls under the slider: a 1px progress line across the content width
  filling by slide in `--fg` (black), and round back/next buttons at the content's right edge
  (disabled at the ends). Swipe, trackpad and keyboard scroll the track too.

### Founders page (`/founders`)

`src/pages/founders.astro`; copy in `src/content/founders.ts` (owner,
2026-10-26). The homepage is for investors; this page is for founders. It
reuses the homepage's patterns, composed in the page from the shared tokens
and classes, because the homepage components read their copy from `home.ts`:

- Header: logo and LP login only. No Pitch us (it would link to the page
  itself) and no "For investors" (removed by the owner, 2026-10-27;
  `<Base forFounders>`).
- Black intro (as `.intro` on the homepage, at least 130% of the viewport
  high, owner 2026-10-26, so the figures start below the fold):
  eyebrow (ticks in), H1 (word reveal), lede, "Pitch us" (to the closing, `#pitch`) and "Meet the
  partners" (`#partners`); the key figures at its bottom in the homepage
  stats pattern (three figures since 2026-10-26, €250M removed; one
  column each, 2 at ≤980px, wrapping to one per row on the
  narrowest phones), held until they scroll into view, as on the homepage. Same intro sequence and timings as the homepage.
- Why founders pick us (owner, 2026-10-26, after lassie.ai): H2, then a
  scroll-driven deck. One visual per card, 6 columns wide and centred
  (columns 4–9; was 8)
  (16:10, at most 62% of the screen high, light grey #F5F5F5 with a
  hairline, square corners), only a centred placeholder marker in it until
  the visuals are supplied (no title in it, owner 2026-10-26); beside it, in the outer three columns (1–3 or
  10–12), the title
  (display face, metric size; set line breaks from the content, e.g.
  "We’ve sat / in your seat.", owner 2026-10-26) and the muted small body, on the left for
  the first card, the right for the second, and so on. On wider screens
  the visuals lie in a sticky, full-height stage and the page's own
  scrolling moves through them (about 70% of a screen per card, never
  taken over): the front card glides up and out, opaque until the end;
  the next ones wait behind it, each 6% smaller and 22px lower so their
  bottom edges peek out, a shade darker per step, and come forward in
  turn; the text beside the front card appears and disappears at once,
  no fade or movement (owner, 2026-10-26), switching halfway between
  cards. The progress follows
  the scroll position lazily (eased 12% per frame). At ≤880px, with
  reduced motion or without script: a plain list, visual then text.
- How we work with you: the homepage Playbook pattern (feature H2 with the
  word reveal on scroll, lede, numbered list in columns 9–12), no button.
  H2 "We don’t just advise on growth, we help you drive it." (owner,
  2026-10-26).
- What we back: H2, lede, sector tags as chips on the 4% tint (as on the
  team profile).
- Founders we back: the homepage founders strip itself (same sliding,
  docking cards from `founders` in home.ts; owner, 2026-10-26), with this
  page's eyebrow and title and no intro, passed in as props. Under it,
  without a hairline, "In the portfolio" (card title) and twelve square
  logo tiles (owner, 2026-10-26): hairline frame, the company's SVG logo in
  the middle (70% wide, at most 45% high, inlined in the text colour, name
  as its accessible label); six per row (two grid columns each), three at
  ≤880px, two at ≤640px. Until a logo file is supplied the tile shows the
  name and a placeholder marker. Then the exits line.
- The partners (`#partners`): the homepage team pattern; the people come
  from `partners` in `home.ts`, so both pages stay in step.
- After you pitch: four numbered steps (mono 01–04, card title, muted small
  body) on hairlines, 4 columns.
- Closing (`#pitch`): black band (`.section--dark.theme-dark`), centred
  feature title, the Pitch us button, and the pitch email line.
- Grids follow `.cards`: 2 columns at ≤980px, 1 at ≤640px.

### Team profile (`/about/team/:slug`)

`src/pages/about/team/[slug].astro`; copy in `src/content/team.ts`. Owner,
2026-10-19, after the team pages of Index Ventures.

- Reached from the profile circle on a founders-strip clip (`profile` slug).
- Hero: a back link "← Team"; the portrait (4:5, columns 1–5) and beside it
  (columns 7–12, bottoms aligned) the role as eyebrow, the name as H1, a
  one-line lede, three key facts over a hairline (based in, focus, joined;
  mono labels) and small ghost pill links (LinkedIn, email).
- Then one section per topic, mono label in columns 1–3 and content from
  column 5: About (bio paragraphs), Background (period | role and one line,
  hairline rows), Works with (company chips on the 4% tint), On the road
  (their clips, 5:7, muted loop, max 320px wide), Insights (article links).
- Stacks at 880px and below.

### The ____ Pitch (`/the-pitch`)

The team's review dashboard for this page (`booking/`, `/review`) follows its own
rules in `booking/DESIGN.md` (owner, 2026-10-26), not this file.

`src/pages/the-pitch.astro`; copy in `src/content/pitch.ts`. Owner,
2026-10-21: landing page for FORWARD.one's live pitch event at Slush
(founders pitch to FORWARD.one, Balnord (balnord.vc, owner 2026-10-22) and HCVC (owner 2026-10-26); the winner gets a term
sheet, wording confirmed by the owner 2026-10-21).

- Landing page chrome (owner, 2026-10-22; `<Base minimal>`): the header
  keeps the logo only: no LP login, and no Pitch us either (owner,
  2026-10-26; `noHeaderActions`); the wordmark there is
  19.2px high (owner, 2026-10-26: 20% smaller than
  the 24 / 19px before; elsewhere 20 / 15px). Next to it, a joint effort
  (owner, 2026-10-26), the Balnord (linked to balnord.vc) and HCVC (linked to hcvc.co, owner 2026-10-27) logos
  (`src/assets/brand/`, currentColor), each exactly as high as the
  wordmark, 48px apart (owner, 2026-10-26; before: 24px) (`Header` `partners`, from `pitch.hosts`). The row always
  fits its width, also when pasted into another site (Webflow): the header
  row is a size container; the gap is min(48px, 6% of the row) and the
  height min(19.2px, (row − 2 gaps) / 19), e.g. about 16px on a 390px
  phone, 12.6px at 320px (owner, 2026-10-26: the logos ran off on phones). Then
  the eyebrow starts 24px under the header's own 24px bottom padding; the footer is the
  copyright line ("© FORWARD.one <year>.") with a Privacy link on the right
  (forward.one/privacy-policy, owner 2026-10-27; `footerLinks` in
  `pitch.ts`), black, down
  to the page end. No floating navigation bar (owner, 2026-10-22), and no
  room kept for it at the bottom.
- One white block (light theme, header included; owner, 2026-10-26; before:
  black, like the homepage intro) from the logo down to where the facts'
  hairline was; the event facts sit on black below it (`.theme-dark`,
  owner 2026-10-26), the black footer running on under them.
  No card (owner, 2026-10-26; before: a grey grainy sheet of paper, first
  with a torn bottom edge): the eyebrow ("Slush, Helsinki"; "Slush" in
  the handwriting's gradient so it points to Slush's colours, ", Helsinki"
  in ink, owner 2026-10-26), H1 and form
  sit straight on the white, their left edge (and the facts') aligned with
  the logo (the content column), in the site's own light colour tokens.
- H1 "The ____ Pitch" on one line (no wrap), in Inter at weight 500, a
  step heavier than body copy (owner, 2026-10-22; the only heading on the
  site not in the display face), Display size and tracking. The blank is a line on the
  baseline (3.5em long while empty, `max(2px, 0.035em)` thick, heading
  colour; light grey #c4c3be once the first handwritten letter appears,
  240ms, owner 2026-10-26). From 5 typed characters, or once the visitor leaves the field
  with a shorter name, the line shrinks to the name (360ms; owner,
  2026-10-22), and grows back to 3.5em when the field is cleared. As the
  visitor types the company name (the form's first field) it is written onto
  the line letter by letter in handwriting (**Covered By Your Grace**,
  Google Fonts, OFL, owner 2026-10-22; before: Permanent Marker, Nothing
  You Could Do; loaded on this page only via Base's `head` slot) at 1.3em,
  as one gradient from #04EDCD to #05F46B, bottom left to top right, across
  the whole name (owner, 2026-10-26; tried before: #FF0000 to #8A0A00 left
  to right, #E0251B to #E39200, #E39200 to #8A0A00, solid red, and yellow
  on black; each letter paints
  its slice of a name-wide gradient, re-measured as the name grows): each new letter wipes open left to right in 300ms and
  settles from a slight lift, with a small random tilt (±2°) and baseline
  shift (±0.02em). Pasted text writes in at 45ms per letter.
- The H1's line is a second way in (owner, 2026-10-26): clicking it
  (text cursor) focuses the company name field, caret at the end, without
  scrolling; what is typed shows on both. While that field has focus the
  line shows a blinking caret after the name (#04EDCD, 1s; steady with
  reduced motion).
- Fit: the whole H1, handwriting included, never runs wider than 60% of the
  content width (owner, 2026-10-26; before: 90%), 90% on phones ≤640px
  (`--pitch-max`). Up to that it keeps the Display size; beyond it the size
  scales down continuously (`--pitch-scale`, font-size transition 240ms).
  On phones the empty heading is already scaled to fit.
- Under the H1 the lede on what the event is (owner's wording, 2026-10-27:
  "20 minutes, three deeptech investors, no slides. …"); more paragraphs
  sit 16px apart, and Balnord links to balnord.vc where named. 6 columns
  max. Fades in with the letter.
- Form as a fill-in-the-blanks letter at `--fs-metric` (24–32px, Inter,
  line height 1.35, normal text leading, 8 columns max), in the owner's
  wording of 2026-10-27:

      Hi investors,

      We're [company name] and we're building [what you're building, in
      one line]. I'm [full name], [role].

      My LinkedIn: [link]
      What my LinkedIn doesn't tell you: [something we wouldn't guess]
      Why we belong in that room: [one or two sentences]

      I'd like to grab the [pitch time] slot, Helsinki time. Reach me at
      [email] or [phone].

      See you at Slush,
      [first name]

  Every blank is required except phone. Tidied 2026-10-27 (owner): the
  three questions in the middle share one shape, the question on its own
  line and the answer full width below it (8px), 16px to the next question;
  the two long answers grow in height (textarea, `.pitch__input--long`).
  Paragraphs ("We're…", "My LinkedIn", "I'd like…", the sign-off) are
  blocks with an even gap of 0.75em above them (`--letter-para`); sentences
  in a paragraph flow on. Underlines are a light line (`--blank-line`,
  #c4c3be) that turns black on the field being typed in, exactly as wide
  as the answer, so the punctuation sits right after it. A LinkedIn profile address (pasted, typed or
  autofilled) shows as just the handle, e.g. "jeroendelange1976" (owner,
  2026-10-27); the booking service stores the full address. Another link
  gets "https://" when typed without it. The sign-off name is filled in from the first word of the full name
  when its line opens, and can be changed. No deck link any more (no
  slides, owner 2026-10-27). Blanks
  are inline inputs; what the visitor types is in Inter 500 (a step heavier
  than the letter, `--fw-answer`) in the handwriting's gradient (#04EDCD to
  #05F46B, bottom left to top right per blank, `--hand-gradient`; owner
  2026-10-26, before: red), not handwriting (owner,
  2026-10-22: only the name on the H1's line is handwritten), on a light
  hairline (black while typing; dashed red #E0251B when invalid after
  interaction); the
  hint shows in muted Inter while empty; each blank grows with its text. Each input has a visually hidden label.
  Labels and blanks reset the host page's form styles (font, margin,
  height, shadow), so the letter looks the same on Webflow (owner,
  2026-10-26, see webflow/README.md).
  Autofilled answers (the browser's saved email, name) show in solid
  #04EDCD on the page background, since the browser's own fill colour would
  show through gradient text and turn it pale (owner, 2026-10-27, iPhone).
  Script marks such a blank `.is-autofilled` (the browser's autofill state
  where it reports it, else an input event that is not typing); typing in
  it brings the gradient back. An autofill also resizes the blank and opens
  the letter on.
- The letter unfolds step by step (owner, 2026-10-21): first the greeting
  and "We're … and we're building …"; then "I'm …, …"; then each of the
  three lines; then the pitch time and contact sentence; then the sign-off
  with the privacy note. A step opens once every required blank of the
  step before is validly filled. The button
  shows from the start, disabled (40% opacity, the global `.btn:disabled`),
  and enables once the whole letter is open and every required blank is
  validly filled (owner, 2026-10-21). A
  step counts as filled after a 900ms pause in typing, on leaving the field
  or on Enter (Enter also jumps to the next blank; it only sends from the
  last one). Each new sentence fades in like the body copy
  (`reveal-gentle`); shown sentences stay. A blank keeps its following full
  stop or comma on the same line. Without script the whole letter shows.
- Cloudflare Turnstile, the bot check, sits just above the button. It is
  invisible unless Cloudflare has a question for the visitor, and only
  there when the booking service sends its key (booking/README.md).
- Then the solid button, a status line, the privacy note (muted, small:
  what the details are used for and when they are deleted, then a
  "Privacy policy" link; owner 2026-10-27, CTO check; editable on Page
  text) and
  four event facts on the black, no hairline (When, Where, Apply by, The
  panel; mono labels 12px, values in the small size, 15px, like the privacy
  note: owner 2026-10-27, before 17px), 4 columns, 2 at ≤880px, 1 at ≤640px.
  The Where value links to the map (owner, 2026-10-27,
  https://maps.app.goo.gl/SiHnx1zd7Eh2fTnD7; opens in a new tab, underlined
  1px; the link is editable on Page text as "Where, map link").
- Spacing (owner, 2026-10-22, tightened): 24px from the header to the
  eyebrow (on top of the header's own padding); eyebrow to
  H1 12px; H1 to lede 24px; lede to letter 24px; letter to button 24px
  (16/16 on phones, where the letter's line height adds the rest); letter
  line height 1.35 (normal leading; the blanks sit inside it at 1.15); privacy note 16px under the button; white ends 48px
  under the form (32px on phones), facts 24px into the black, and the
  footer 48px under the facts (24px).
  The white block (header included) is at least 80% of the viewport high
  (`80svh`, owner 2026-10-26; before: no minimum height); the content sits
  at the top and the facts' black starts below.
- Editable texts (owner, 2026-10-27): the eyebrow, the text under the
  heading, the button, the privacy note, the thank-you message and the
  event facts carry `data-copy` and are swapped for the versions saved on
  the booking dashboard (Page text, `GET /copy`) on every visit; the built
  texts stay when the service does not answer. Paragraphs and links added
  that way are styled through `:global` rules.
- Intro motion: eyebrow, then "The", the blank and "Pitch" snap in like H1
  words; the first sentence of the letter eases in gently.
- The pitch time (owner, 2026-10-26: one day, time slots; FORWARD.one
  approves or denies, a denied request frees its slot): a `<select>` styled
  as one more blank (no arrow box, the hint "time" in muted while empty,
  the chosen time in the gradient). It offers only the free slots, loaded
  from the booking service (`booking/`, `pitch.bookingApi`) on arrival and
  again when opened (at most every 20s). Sending posts the letter as JSON
  to the service, which holds the slot as a pending request; the status
  line then says the time is on hold and the letter locks. If the time was
  just taken, the status line says so, the list reloads and the choice
  gets focus. A hidden honeypot field catches bots. The team decides on
  the service's `/review` page (see booking/README.md).
- Until the booking service is set (`pitch.bookingApi`), the time blank
  stays empty and optional, the button does not post, and the status line
  says requests are not sent yet.

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
8. **The founders strip never shows a Proof company or an exit** (owner,
   2026-10-19). `Founders.astro` fails the build if a founders-strip company
   also appears in `caseStudies` or `trackRecord.exits`.


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
  the keyboard control. Insets are symmetric: the AI mark sits 16px from the
  bar's left edge, the hamburger glyph 16px from its right edge. Closed bar
  and open panel share one width (the page column, 24px from each side).
- The AI mark (#FFEA6D) sits left of the line from the start. Pressing the
  bar (open or close) plays a swap: the mark shrinks and is pushed up and to
  the right while a second mark grows in from the bottom left into its place
  (840ms; off under reduced motion). On opening the line is retyped as
  "How can we help you?", which stays. (A grey "Type your question" step
  after 2 s exists but is switched off: `navGreeting.ask.placeholderEnabled`.)
  Clicking the line, or typing anywhere once it has been typed, opens a text
  field (no backend yet). Closing types the welcome line back.
- The greeting is plain text, no gradient. The AI mark is #FFEA6D on the dark
  bar and the bar's dark text colour on the white (inverse) bar. The `_` cursor shows only while text is being
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
  `--nav-fg-inverse` (#1A1A1A) text, and the greeting drops its yellow
  gradient. The check uses the bar's resting centre line and runs on scroll
  and resize. The panel takes the same colour while closed, so opening and
  folding away animate bar and panel together (white to #000 and back).

- Entrance glow: as the bar slides in, a transparent → `--nav-glow-color`
  (#DB8E00 on the black bar, #FFEA6D on the white bar; owner 2026-10-17)
  gradient across the whole bar slides out to the right over
  `--reveal-tint-duration` with `--reveal-gentle-ease`, the same as the H1's
  last word. Off under reduced motion.

## 9. Colour (placeholders)

- Accent: `--brand-yellow` #FFEA6D (owner, 2026-10-17; replaced the cyan
  #78F6FB and the blue #2D75D9). Used for the H1 last-word tint, the nav
  AI mark and entrance glow, Proof card dates, the Fund III gradient corner, the portal's mail badge, and the robot's
  cap. Where it must read on light grey (the robot's ring and label) it is
  darkened to ochre rgb(196,160,20).
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
| 2 | Reset: box-sizing, `border-radius: 0`, body full width (no cap), element defaults for headings and code. |
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
