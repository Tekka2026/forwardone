import type { BrandPage } from './types';
import { P } from './palette';

export const layout: BrandPage = {
  slug: 'layout',
  title: 'Layout',
  lead: 'Now that we have everything together, here is lorem ipsum guidance for combining it into clear, consistent layouts.',
  tile: { color: P.amber, icon: 'layout', cover: { art: 'columns', tone: 'dark' } },
  draft: 'Placeholder page: the layout rules are lorem ipsum until they are agreed.',
  sections: [
    {
      label: 'Grids',
      notes: [
        'The grid is how we assemble brand elements into a whole.',
        'Whether it is a long presentation or a simple email, we always start from the grid.',
      ],
      blocks: [
        {
          type: 'columns',
          items: [
            {
              media: { art: 'margins', tone: 'white', ratio: 'landscape' },
              title: 'Margins',
              body: ['Divide the longest side of the document by 24 to find the margin. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
            },
            {
              media: { art: 'columns', tone: 'white', ratio: 'landscape' },
              title: 'Columns',
              body: ['Columns come in multiples of two, up to twelve. Wider formats use more columns, narrow ones fewer.'],
            },
            {
              media: { art: 'gutters', tone: 'white', ratio: 'landscape' },
              title: 'Gutters',
              body: ['Gutters are 50–100% of the margin. Lorem ipsum: 50% suits most needs, very wide layouts may need more.'],
            },
          ],
        },
      ],
    },
    {
      label: 'Vertical spacing',
      notes: ['Multiples of 8 with a 16 px base. Down to 4, 2 and 0 px for tight spots. Lorem ipsum dolor sit amet.'],
      blocks: [{ type: 'spacing', title: 'Vertical spacing', steps: [2, 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128] }],
    },
    {
      title: 'Applying the logo',
      notes: ['After the grid, the logo. This chapter covers its size and placement.'],
      band: true,
    },
    {
      label: 'Applying the logo\nScale',
      notes: [
        'Logo height in a layout is the margin divided by 1.25, rounded to the nearest multiple of 8.',
        'Use this as a baseline; very wide or tall layouts may need optical adjustment.',
      ],
      band: true,
      blocks: [
        {
          type: 'media',
          cols: 3,
          panel: 'white',
          items: [
            { media: { art: 'columns', tone: 'white', ratio: 'portrait', tag: 'logo 8 px' }, caption: 'Too small', verdict: 'bad' },
            { media: { art: 'columns', tone: 'white', ratio: 'portrait', tag: 'logo 16 px' }, caption: 'Better', verdict: 'ok' },
            { media: { art: 'columns', tone: 'white', ratio: 'portrait', tag: 'logo 24 px' }, caption: 'Best', verdict: 'good' },
          ],
        },
      ],
    },
    {
      label: 'Applying the logo\nPlacement',
      notes: ['Place the logo top left where possible; otherwise bottom left or top centre.', 'When in doubt, left align.'],
      band: true,
      blocks: [
        {
          type: 'media',
          cols: 3,
          panel: 'good',
          items: [
            { media: { art: 'wire-a', tone: 'white', ratio: 'portrait' }, caption: 'Upper left', verdict: 'good' },
            { media: { art: 'wire-b', tone: 'white', ratio: 'portrait' }, caption: 'Bottom left', verdict: 'good' },
            { media: { art: 'wire-c', tone: 'white', ratio: 'portrait' }, caption: 'Top centred', verdict: 'good' },
          ],
        },
        {
          type: 'media',
          cols: 3,
          panel: 'bad',
          items: [
            { media: { art: 'wire-a', tone: 'white', ratio: 'portrait' }, caption: 'Too small', verdict: 'bad' },
            { media: { art: 'wire-b', tone: 'white', ratio: 'portrait' }, caption: 'Too large', verdict: 'bad' },
            { media: { art: 'wire-c', tone: 'white', ratio: 'portrait' }, caption: 'Right aligned', verdict: 'bad' },
          ],
        },
      ],
    },
    {
      title: 'Applying type',
      notes: ['Rules for consistent type layout. Lorem ipsum dolor sit amet, consectetur.'],
      band: true,
    },
    {
      label: 'Applying type\nScale',
      notes: ['Headlines are always larger than the wordmark: at least 3:2. The wordmark is no larger than two thirds of the headline.'],
      band: true,
      blocks: [
        {
          type: 'typeRows',
          rows: [
            { meta: ['Headline', '≥ 1.5 × wordmark'], sample: 'Lorem ipsum dolor sit amet.', style: 'h2' },
            { meta: ['Wordmark', '≤ ⅔ headline'], sample: 'BRAND', style: 'h4' },
          ],
        },
      ],
    },
    {
      label: 'Applying type\nPlacement',
      notes: ['Copy goes top left by preference. If that does not work, use the alternatives below, in order.'],
      band: true,
      blocks: [
        {
          type: 'media',
          cols: 3,
          panel: 'white',
          items: [
            { media: { art: 'wire-a', tone: 'white', ratio: 'landscape' }, caption: '1. Top left', verdict: 'good' },
            { media: { art: 'wire-c', tone: 'white', ratio: 'landscape' }, caption: '2. Left column', verdict: 'good' },
            { media: { art: 'wire-b', tone: 'white', ratio: 'landscape' }, caption: '3. Bottom left', verdict: 'ok' },
          ],
        },
      ],
    },
    {
      label: 'Corner radius\n& border weight',
      notes: [
        'Radii are multiples of 8 with 16 as the base; stacked frames step down by 4 or 8. Buttons: 16 px. 1920 × 1080 slides: 32 px.',
        'Four border weights: none, small, medium and large. 1920 × 1080 slides always use 1 px.',
      ],
      blocks: [
        {
          type: 'radius',
          steps: [
            { label: 'Base', px: 16 },
            { label: 'Large', px: 24 },
            { label: 'X-Large', px: 32 },
            { label: 'Round', px: 64 },
          ],
          borders: [
            { label: 'Small', px: 1 },
            { label: 'Medium', px: 2 },
            { label: 'Large', px: 4 },
          ],
        },
      ],
    },
    {
      label: 'Example layouts',
      notes: ['Three starting points. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'wire-a', tone: 'white', ratio: 'landscape' }, caption: 'Hero + two rows' },
            { media: { art: 'wire-b', tone: 'white', ratio: 'landscape' }, caption: 'Four-up grid' },
            { media: { art: 'wire-c', tone: 'white', ratio: 'landscape' }, caption: 'Feature + sidebar' },
          ],
        },
      ],
    },
  ],
};
