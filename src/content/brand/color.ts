import type { BrandPage } from './types';
import { P } from './palette';
import { brandSite } from './site';

export const color: BrandPage = {
  slug: 'color',
  title: 'Color',
  lead: 'Colour plays an important role in how the identity comes to life. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  tile: { color: P.white, icon: 'palette', cover: { art: 'none', tone: 'color', color: P.periwinkle } },
  sections: [
    {
      label: 'Color inspiration',
      notes: ['Our colours come straight from the world we work in. Lorem ipsum: a harmonious set built to work together.'],
      button: { label: 'Download Color Cheat Sheet', href: brandSite.downloadHref },
      blocks: [
        {
          type: 'media',
          cols: 4,
          items: [
            { media: { tone: 'photo', ratio: 'square', seed: 1 } },
            { media: { tone: 'color', color: P.signal, ratio: 'square', tag: 'Signal' } },
            { media: { tone: 'color', color: P.periwinkle, ratio: 'square', tag: 'Periwinkle' } },
            { media: { tone: 'photo', ratio: 'square', seed: 2 } },
            { media: { tone: 'color', color: P.paper, ratio: 'square', tag: 'Paper' } },
            { media: { tone: 'photo', ratio: 'square', seed: 4 } },
            { media: { tone: 'photo', ratio: 'square', seed: 6 } },
            { media: { tone: 'color', color: P.clay, ratio: 'square', tag: 'Clay' } },
          ],
        },
      ],
    },
    {
      label: 'Primary palette',
      notes: ['Lorem Ink, Paper and Signal: simple and clean, with Signal as a clear accent where we need attention.'],
      blocks: [
        {
          type: 'swatches',
          size: 'lg',
          cols: 3,
          items: [
            { name: 'Paper', hex: P.paper },
            { name: 'Ink', hex: P.ink },
            { name: 'Signal', hex: P.signal },
          ],
        },
      ],
    },
    {
      label: 'Extended palette',
      notes: ['Supports the primary palette when elements need more emphasis, such as title slides or video titles. Use sparingly.'],
      blocks: [
        {
          type: 'swatches',
          size: 'lg',
          cols: 2,
          offset: true,
          items: [
            { name: 'Periwinkle', hex: P.periwinkle },
            { name: 'Sage', hex: P.sage },
            { name: 'Lilac', hex: P.lilac },
            { name: 'Clay', hex: P.clay },
          ],
        },
      ],
    },
    {
      label: 'Neutral scale',
      notes: ['Greys for text, borders and backgrounds. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'swatches',
          cols: 5,
          size: 'md',
          items: [
            { name: 'Neutral 50', hex: '#fafafa' },
            { name: 'Neutral 200', hex: '#e5e5e5' },
            { name: 'Neutral 400', hex: '#a3a3a3' },
            { name: 'Neutral 600', hex: '#525252' },
            { name: 'Neutral 900', hex: '#171717' },
          ],
        },
      ],
    },
    {
      label: 'Proportion',
      notes: ['The balance of colour keeps the brand recognisable. Lead with Ink and Paper; accents stay small.'],
      blocks: [
        {
          type: 'proportion',
          items: [
            { hex: P.ink, share: 30 },
            { hex: P.paper, share: 30 },
            { hex: P.signal, share: 20 },
            { hex: P.periwinkle, share: 7 },
            { hex: P.sage, share: 6 },
            { hex: P.lilac, share: 4 },
            { hex: P.clay, share: 3 },
          ],
        },
      ],
    },
    {
      label: 'System palette',
      notes: ['For web and product use only: states and feedback.'],
      blocks: [
        {
          type: 'swatches',
          cols: 5,
          size: 'md',
          items: [
            { name: 'Success', hex: P.success, screenOnly: true },
            { name: 'Warning', hex: P.warning, screenOnly: true },
            { name: 'Error', hex: P.error, screenOnly: true },
            { name: 'Information', hex: P.info, screenOnly: true },
            { name: 'Neutral 500', hex: P.neutral, screenOnly: true },
          ],
        },
      ],
    },
    {
      label: 'Usage',
      notes: ['When to use each colour.'],
      blocks: [
        {
          type: 'rules',
          items: [
            'Ink and Paper carry most layouts: backgrounds, text and the logo.',
            'Signal is for one focal point per layout: a button, a key number, a highlight.',
            'Extended colours mark chapters, title slides and illustrations. Lorem ipsum.',
            'System colours only communicate state in product UI; never decorate with them.',
          ],
        },
      ],
    },
    {
      label: 'Accessibility',
      notes: ['Body text needs a contrast ratio of at least 4.5:1, large text 3:1 (WCAG 2.2 AA).'],
      blocks: [
        {
          type: 'contrast',
          items: [
            { fg: P.ink, bg: P.paper, label: 'Ink on Paper' },
            { fg: P.white, bg: P.ink, label: 'White on Ink' },
            { fg: P.white, bg: P.signal, label: 'White on Signal' },
            { fg: P.ink, bg: P.periwinkle, label: 'Ink on Periwinkle' },
          ],
        },
      ],
    },
  ],
};
