# Brand guidelines (`/brand`)

FORWARD.one's brand guidelines in ten pages: Welcome, Foundations, Logo,
Color, Typography, Photography, Graphics, Layout, Applications and Marketing
Collateral. The structure and layout follow brand.curri.com; no text, logos
or assets were copied from Curri.

**Where the content comes from (2026-11-05):**

| Page | Source |
|---|---|
| Welcome, Foundations | FORWARD.one Brand Foundation doc, sections 1–7, copy as written there |
| Color | Brand Foundation doc, section 8 (palette, uses, rules); contrast ratios computed at build time |
| Typography | The fonts and type scale of the main site (`css/global.css`) |
| Logo | The supplied wordmark (`src/assets/brand/forwardone.svg`); its rules are still placeholders |
| Photography, Graphics, Layout, Applications, Marketing Collateral | Placeholders (lorem ipsum, CSS mock-ups) |

Pages whose rules are still placeholders carry `draft` in their content file:
a notice under the lead and a "Draft" label on the home tile. Remove the
field once the real content is in. Any `[bracketed]` text in the copy shows as
a dashed placeholder marker (listed in `PLACEHOLDERS.md`). `**bold**` works in
copy strings.

The logo download (`public/brand/forwardone-logo.zip`) holds the wordmark as
Ink and White SVGs, generated from `src/assets/brand/forwardone.svg`.

Live: https://tekka2026.github.io/forwardone/brand/ (not linked from the main
site; pages carry `noindex`).

## Background maker (`/brand/backgrounds`)

A tool for new brand backgrounds: the plectrum (`src/assets/brand/plectrum.svg`,
supplied 2026-11-06) extruded to 3D with Three.js, on a gradient of palette
colours. Controls: format (1:1, 3:4, 4:5, 1:2, 16:9 default, 5:7, each turned
90° on request), gradient (presets or colours in order, linear or radial,
angle), plectrum colour, size, position, rotation (sliders or drag), thickness,
rounded edge, gloss, metal, motion blur (spin, tumble, roll or slide), blur and
grain. Export is a PNG with a long side of 1920 or 3840 px. All settings live in
the page address, so a background can be shared or reopened by its link.

| What | Where |
|---|---|
| Copy, formats, gradient presets, colour list | `src/content/brand/backgrounds.ts` |
| Page and controls | `src/pages/brand/backgrounds.astro` |
| Renderer | `src/lib/plectrum-studio.ts` |

How a frame is made (`plectrum-studio.ts`): the plectrum is rendered 8–128 times
into a float target, each sample with a sub-pixel jitter (smooth edges) and, with
motion blur, a slightly different rotation or position; the samples are averaged.
An optional two-pass gaussian blur follows, then one shader draws the gradient,
puts the plectrum on top and adds grain. A different SVG works as long as it
consists of filled shapes.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321/forwardone/brand/. Production build: `npm run build`
writes static HTML to `dist/brand/`. It is plain HTML and CSS with one small
inline script, so any static host can serve it.

## How it is built

It is part of the Astro site, with its own layout and stylesheet, so the
main site's design system and this template can't affect each other.

| What | Where |
|---|---|
| Page content (one file per page) | `src/content/brand/<page>.ts` |
| Page order (home tiles, Index menu, previous/next) | `src/content/brand/index.ts` |
| Wordmark, welcome text, contact people | `src/content/brand/site.ts` |
| Placeholder palette | `src/content/brand/palette.ts` |
| Content model (block types) | `src/content/brand/types.ts` |
| Layout: header, Index menu, contact footer, back-to-top, copy-HEX | `src/layouts/Brand.astro` |
| Section: rule, label, notes, button, blocks | `src/components/brand/Section.astro` |
| One renderer per block type | `src/components/brand/Block.astro` |
| Placeholder visuals (logo, photo, UI, merch, slides…) | `src/components/brand/Visual.astro` |
| Home tile and previous/next card | `src/components/brand/PageCard.astro` |
| Routes | `src/pages/brand/index.astro`, `src/pages/brand/[slug].astro` |
| Stylesheet and tokens | `css/brand.css` |
| Colour maths (RGB, CMYK, WCAG contrast) | `src/lib/brand.ts` |

### Page anatomy

Each page has a dark sticky header, a dark hero with the page title, a large
lead paragraph, then **sections**. A section is a hairline with a small label
(columns 1–3), one or two short notes (from column 4) and an optional black
pill button (right). Its **blocks** follow below, either full width or offset
to column 4. Every page ends with previous/next cards and the dark contact
footer.

### Block types

`prose`, `statement`, `feature`, `items`, `media` (with do/don't verdicts and
tinted panels), `swatches` (name, CMYK, RGB, HEX, PMS, copy button),
`proportion`, `contrast` (WCAG ratio computed at build time), `rules`,
`stats` (key figures), `specimen`, `weights`, `typeRows`, `tester` (editable type tester),
`wordlist`, `spacing`, `radius`, `columns` and `downloads`.

### Common changes

- **Edit copy:** change the strings in the page's content file.
- **Add a section:** add an object to that page's `sections` array.
- **Add a page:** create `src/content/brand/<slug>.ts` that exports a
  `BrandPage`, then add it to the list in `index.ts`. Its route, home tile,
  Index menu entry and previous/next links are generated from that list.
- **Add a block type:** add it to `Block` in `types.ts` and give it one
  renderer in `Block.astro`. `npm run check` flags any content that does not
  fit the types.
- **Real assets:** add art types to `Visual.astro`, or extend `Media` with an
  image path, when the real logo files and photos arrive. Download buttons
  point to `brandSite.downloadHref` (`#`) until the files exist.

### Tokens

The FORWARD.one palette: Black for the header, hero and footer, White for the
page, Ink for text, Cream for bands. Oxblood marks interactive elements on
light backgrounds (hover, focus, buttons, back-to-top), Gold on Black. A
stepped band of the seven tones runs under the home cover. Type uses the main
site's font files: KMR Apparat Light for headlines, leads and statements,
Inter for body, Geist Mono for labels. The layout is a 12-column grid with a
40px page margin (16px on phones) and a 20px gutter.
