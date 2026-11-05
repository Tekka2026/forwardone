import type { BrandPage } from './types';
import { P } from './palette';
import { brandSite } from './site';

export const typography: BrandPage = {
  slug: 'typography',
  title: 'Typography',
  lead: 'At the heart of the identity is a lorem typographic voice. Type influences how every message is read and remembered.',
  tile: { color: P.sage, icon: 'type', cover: { art: 'none', tone: 'white' } },
  sections: [
    {
      label: 'Background',
      notes: ['We use two typefaces, each with its own job. Lorem ipsum dolor sit amet: a calm grotesk with just enough character.'],
      button: { label: 'Download Fonts', href: brandSite.downloadHref },
    },
    {
      label: 'Primary typeface',
      notes: [
        'Inter (placeholder) is a neutral sans serif with open shapes and clear forms. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Used for headlines, subheads and body copy across print and screen.',
      ],
      blocks: [{ type: 'specimen', name: 'Inter Semibold', by: 'Rasmus Andersson' }],
    },
    {
      label: 'Supporting typeface',
      notes: ['JetBrains Mono (placeholder) for labels, data and small captions. Never for headlines.'],
      blocks: [{ type: 'specimen', name: 'JetBrains Mono', by: 'JetBrains', mono: true }],
    },
    {
      label: 'Weights',
      notes: ['Weight gives hierarchy. Use only these weights.'],
      blocks: [
        {
          type: 'weights',
          items: [
            { name: 'Regular', weight: 400 },
            { name: 'Medium', weight: 500 },
            { name: 'Semibold', weight: 600 },
          ],
        },
      ],
    },
    {
      label: 'Type scale',
      notes: ['One scale for every layout. Sizes are for screen; print uses the same ratios.'],
      blocks: [
        {
          type: 'typeRows',
          rows: [
            { meta: ['Display', '88 / 88', 'Semibold'], sample: 'Lorem ipsum', style: 'display' },
            { meta: ['H1', '56 / 60', 'Semibold'], sample: 'Lorem ipsum dolor', style: 'h1' },
            { meta: ['H2', '40 / 44', 'Semibold'], sample: 'Lorem ipsum dolor sit', style: 'h2' },
            { meta: ['H3', '28 / 34', 'Semibold'], sample: 'Lorem ipsum dolor sit amet', style: 'h3' },
            { meta: ['H4', '22 / 28', 'Semibold'], sample: 'Lorem ipsum dolor sit amet, consectetur', style: 'h4' },
            { meta: ['Body', '18 / 28', 'Regular'], sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.', style: 'body' },
            { meta: ['Caption', '14 / 20', 'Regular'], sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', style: 'caption' },
            { meta: ['Mono', '13 / 20', 'Uppercase'], sample: 'Lorem ipsum label', style: 'mono' },
          ],
        },
      ],
    },
    {
      label: 'Setting type',
      notes: [
        'Leading is the space between lines of text. Keep it consistent across applications.',
        'Calculate it with the formulas below. Sizes are examples only.',
      ],
      blocks: [
        {
          type: 'typeRows',
          rows: [
            { meta: ['Headline', 'Inter Semibold', '80 / 88', 'Sentence case'], sample: 'Type size × 1.1 = leading. Headlines at 80 pt have 88 pt leading.', style: 'formula' },
            { meta: ['Body', 'Inter Regular', '15 / 21', 'Sentence case'], sample: 'Type size × 1.4 = leading. Body copy at 15 pt has 21 pt leading.', style: 'body' },
          ],
        },
      ],
    },
    {
      label: 'Testing type',
      notes: ['Click a field and type to try the typefaces.'],
      blocks: [
        { type: 'tester', meta: ['Headline', 'Inter Semibold', '64 / 70'], sample: 'Headlines nulla vitae euismod sem. Integer ut vehicula.', style: 'h1' },
        { type: 'tester', meta: ['Body', 'Inter Regular', '18 / 28'], sample: 'Body phasellus at ornare mauris, eu viverra tellus. Curabitur sit amet lorem ipsum, praesent vel turpis ex.', style: 'body' },
      ],
    },
    {
      label: 'Don’ts',
      notes: ['Do not diminish the value of typography. Avoid the following treatments.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'typeface' }, caption: 'Don’t use other typefaces', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'mono' }, caption: 'Don’t set headlines in the mono', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'tight' }, caption: 'Don’t set lines too close together', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'tracking' }, caption: 'Don’t track out the type', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'caps' }, caption: 'Don’t use all caps for headlines', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'size' }, caption: 'Don’t set levels too close in size', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'clash' }, caption: 'Don’t use clashing colour pairs', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'contrast' }, caption: 'Don’t use low-contrast pairs', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'colours' }, caption: 'Don’t use too many colours', verdict: 'bad' },
          ],
        },
      ],
    },
  ],
};
