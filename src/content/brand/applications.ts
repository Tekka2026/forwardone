import type { BrandPage } from './types';
import { P } from './palette';

export const applications: BrandPage = {
  slug: 'applications',
  title: 'Applications',
  lead: 'The brand in the world. Lorem ipsum dolor sit amet: product, social, merchandise and the places we show up.',
  tile: { color: P.ice, icon: 'shirt', cover: { art: 'phone', tone: 'dark' } },
  draft: 'Placeholder page: the applications shown are mock-ups until real ones are supplied.',
  sections: [
    {
      label: 'Product UI',
      notes: ['Lorem ipsum dolor sit amet: the interface carries the brand quietly through colour, type and radius.'],
      blocks: [
        { type: 'media', cols: 1, items: [{ media: { art: 'ui', tone: 'dark', ratio: 'wide' } }] },
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'phone', tone: 'color', color: P.gold, ratio: 'square' } },
            { media: { art: 'ui', tone: 'grey', ratio: 'square' } },
          ],
        },
      ],
    },
    {
      label: 'Social',
      notes: ['Templates for stories and posts. Lorem ipsum: one message, one image, the icon as avatar.'],
      blocks: [
        {
          type: 'media',
          cols: 4,
          items: [
            { media: { art: 'story', tone: 'photo', ratio: 'story', seed: 61 }, caption: 'Story, 9:16' },
            { media: { art: 'story', tone: 'dark', ratio: 'story' }, caption: 'Story, 9:16' },
            { media: { art: 'post', tone: 'color', color: P.ice, ratio: 'story' }, caption: 'Quote' },
            { media: { art: 'post', tone: 'photo', ratio: 'story', seed: 62 }, caption: 'Spotlight' },
          ],
        },
      ],
    },
    {
      label: 'Apparel\n& merch',
      notes: ['Small logos, quality blanks, one colour print. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'tee', tone: 'grey', ratio: 'square' }, caption: 'T-shirt' },
            { media: { art: 'cap', tone: 'color', color: P.cream, ratio: 'square' }, caption: 'Cap' },
            { media: { art: 'tote', tone: 'color', color: P.amber, ratio: 'square' }, caption: 'Tote' },
            { media: { art: 'card', tone: 'photo', ratio: 'square', seed: 63 }, caption: 'Business cards' },
          ],
        },
      ],
    },
    {
      label: 'Vehicle\n& environmental',
      notes: ['Large-scale applications: keep it simple, the logo big and the colour flat.'],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'van', tone: 'color', color: P.ice, ratio: 'video' }, caption: 'Vehicle' },
            { media: { art: 'sign', tone: 'photo', ratio: 'video', seed: 64 }, caption: 'Signage' },
          ],
        },
      ],
    },
  ],
};
