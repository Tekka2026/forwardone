# Brand guidelines (`/brand`)

A brand guidelines site in ten pages: Welcome, Foundations, Logo, Color,
Typography, Photography, Graphics, Layout, Applications and Marketing
Collateral. The structure and layout follow brand.curri.com. All content is
lorem ipsum or clearly marked placeholder, and every visual (logos, photos,
mockups) is drawn in CSS. No text, logos or assets were copied from Curri.

Live: https://tekka2026.github.io/forwardone/brand/ (not linked from the main
site; pages carry `noindex`).

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
`specimen`, `weights`, `typeRows`, `tester` (editable type tester),
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

Dark `#0a0a0a`, light `#f1f1f1`, text black on light and white on dark. One
accent (`--accent: #5b5bd6`) is used only for interactive elements (links on
hover, focus rings, the back-to-top button, the tester's focus state). The
layout is a 12-column grid with a 40px page margin (16px on phones) and a
20px gutter. Media corners are 10–16px. Type is Inter with JetBrains Mono for
code-style labels.
