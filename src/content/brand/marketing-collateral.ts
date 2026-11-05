import type { BrandPage } from './types';
import { P } from './palette';

export const marketingCollateral: BrandPage = {
  slug: 'marketing-collateral',
  title: 'Marketing Collateral',
  lead: 'Below you will find our standard templates. Lorem ipsum: they are not co-branded, so ask the design team for a partner version.',
  tile: { color: P.white, icon: 'file', cover: { art: 'onepager', tone: 'dark' } },
  draft: 'Placeholder page: the templates and downloads are lorem ipsum until the files exist.',
  sections: [
    {
      label: 'One-pagers',
      notes: ['A4 and US Letter PDFs. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'downloads',
          items: [
            { name: 'Lorem-Overview.pdf', media: { art: 'onepager', tone: 'white' } },
            { name: 'Ipsum-Product.pdf', media: { art: 'onepager', tone: 'dark' } },
            { name: 'Dolor-Pricing.pdf', media: { art: 'onepager', tone: 'white' } },
            { name: 'Sit-Case-Study.pdf', media: { art: 'onepager', tone: 'photo', seed: 71 } },
            { name: 'Amet-Partners.pdf', media: { art: 'onepager', tone: 'white' } },
            { name: 'Elit-FAQ.pdf', media: { art: 'onepager', tone: 'white' } },
          ],
        },
        {
          type: 'downloads',
          title: 'SOPs',
          items: [
            { name: 'Lorem-SOP.pdf', media: { art: 'slide', tone: 'dark' } },
            { name: 'Ipsum-SOP.pdf', media: { art: 'slide', tone: 'dark' } },
            { name: 'Dolor-SOP.pdf', media: { art: 'slide', tone: 'dark' } },
          ],
        },
      ],
    },
    {
      label: 'Deck template',
      notes: [
        '16:9 at 1920 × 1080. Title, chapter and content layouts; 32 px corner radius, 1 px borders.',
        'Lorem ipsum: one idea per slide, the headline says the point.',
      ],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'slide', tone: 'dark', ratio: 'video' }, caption: 'Title' },
            { media: { art: 'slide', tone: 'color', color: P.ice, ratio: 'video' }, caption: 'Chapter' },
            { media: { art: 'slide', tone: 'white', ratio: 'video' }, caption: 'Content' },
          ],
        },
      ],
    },
    {
      label: 'Email header',
      notes: ['600 px wide. Logo top left on Ink, one image, one call to action.'],
      blocks: [{ type: 'media', cols: 2, offset: true, items: [{ media: { art: 'email', tone: 'white', ratio: 'portrait' } }] }],
    },
    {
      label: 'Social ad formats',
      notes: ['Lorem ipsum dolor sit amet. Keep text inside the safe zone, 10% from each edge.'],
      blocks: [
        {
          type: 'media',
          cols: 4,
          items: [
            { media: { art: 'post', tone: 'dark', ratio: 'square' }, caption: 'Square 1:1 (1080 × 1080)' },
            { media: { art: 'post', tone: 'color', color: P.cream, ratio: 'portrait' }, caption: 'Portrait 4:5 (1080 × 1350)' },
            { media: { art: 'story', tone: 'photo', ratio: 'story', seed: 72 }, caption: 'Story 9:16 (1080 × 1920)' },
            { media: { art: 'post', tone: 'color', color: P.gold, ratio: 'banner' }, caption: 'Link 1.91:1 (1200 × 628)' },
          ],
        },
      ],
    },
  ],
};
