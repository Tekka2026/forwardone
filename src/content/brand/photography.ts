import type { BrandPage, Figure } from './types';
import { P } from './palette';
import { brandSite } from './site';

/** Six photo placeholders for a bucket grid. */
const six = (from: number): Figure[] =>
  Array.from({ length: 6 }, (_, i) => ({ media: { tone: 'photo' as const, ratio: 'landscape' as const, seed: from + i } }));

export const photography: BrandPage = {
  slug: 'photography',
  title: 'Photography',
  lead: 'Our photography is one of the most lorem ipsum assets in our toolkit: real moments, real people, real dolor.',
  tile: { color: P.copper, icon: 'image', cover: { tone: 'photo', seed: 7 } },
  draft: 'Placeholder page: the photography rules and images are lorem ipsum until they are supplied.',
  sections: [
    {
      title: 'Ethos',
      notes: [
        'Our photography is rooted in real moments and real stories. Every customer, user and partner has a story to tell.',
        'It shows a wide range of people and use cases. Lorem ipsum dolor sit amet.',
      ],
    },
    {
      title: 'Principles',
      notes: ['Lorem ipsum dolor sit amet: what our photography is, and what it isn’t.'],
      blocks: [
        {
          type: 'wordlist',
          columns: [
            { title: 'Our photography is…', words: ['Cinematic', 'Authentic', 'Considered', 'Familiar', 'Human'], verdict: 'good' },
            { title: 'Our photography isn’t…', words: ['Ominous', 'Clinical', 'Generic', 'Unattainable', 'Staged'], verdict: 'bad' },
          ],
        },
      ],
    },
    {
      label: 'Photo buckets',
      notes: ['Imagery is split into the following categories.'],
      button: { label: 'Photo Library', href: brandSite.downloadHref },
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { tone: 'photo', ratio: 'video', seed: 11, tag: 'People & places' } },
            { media: { tone: 'photo', ratio: 'video', seed: 12, tag: 'Customers' } },
            { media: { tone: 'photo', ratio: 'video', seed: 13, tag: 'Industries & materials' } },
            { media: { tone: 'photo', ratio: 'video', seed: 14, tag: 'Landscapes' } },
          ],
        },
      ],
    },
    {
      label: 'People\n& places',
      notes: ['People are shown focused and at ease, in their own environment. Lorem ipsum dolor sit amet, consectetur.'],
      blocks: [{ type: 'media', cols: 3, items: six(20) }],
    },
    {
      label: 'Customers',
      notes: ['Candid shots of customers at work, using the product, and occasionally enjoying the job.'],
      blocks: [{ type: 'media', cols: 3, items: six(30) }],
    },
    {
      label: 'Industries\n& materials',
      notes: ['Close-ups of textures and materials. Lorem ipsum dolor sit amet, sed posuere consectetur.'],
      blocks: [{ type: 'media', cols: 3, items: six(40) }],
    },
    {
      label: 'Landscapes',
      notes: ['Wide, quiet views with room for type. Lorem ipsum dolor sit amet, consectetur adipiscing.'],
      blocks: [{ type: 'media', cols: 3, items: six(50) }],
    },
    {
      label: 'Lighting\n& mood',
      notes: ['Natural light, soft contrast and a slightly warm grade. Avoid flash, heavy filters and stock-style gloss.'],
      blocks: [
        {
          type: 'items',
          cols: 3,
          items: [
            { icon: 'spark', title: 'Natural light', body: 'Shoot by windows or outdoors. Lorem ipsum dolor sit amet.' },
            { icon: 'eye', title: 'Honest framing', body: 'Eye-level, unposed, with space around the subject.' },
            { icon: 'palette', title: 'Calm grade', body: 'Muted colour, lifted blacks, a touch of warmth.' },
          ],
        },
      ],
    },
  ],
};
