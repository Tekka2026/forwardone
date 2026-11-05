import type { BrandPage } from './types';
import { P } from './palette';
import { brandSite } from './site';

export const graphics: BrandPage = {
  slug: 'graphics',
  title: 'Graphics',
  lead: 'Graphics play a functional and expressive role in our identity. Lorem ipsum: this is where the system comes to life.',
  tile: { color: P.lilac, icon: 'pen', cover: { art: 'shapes', tone: 'color', color: P.lilac } },
  sections: [
    {
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'phone', tone: 'color', color: P.stone, ratio: 'landscape' } },
            { media: { art: 'ui', tone: 'dark', ratio: 'landscape' } },
            { media: { art: 'ui', tone: 'grey', ratio: 'landscape' } },
          ],
        },
      ],
    },
    {
      label: 'Categories',
      notes: ['Graphics are split into product UI, illustrations, iconography and patterns. Lorem ipsum dolor sit amet.'],
      button: { label: 'Graphics Library', href: brandSite.downloadHref },
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'ui', tone: 'dark', ratio: 'video', tag: 'Product UI' } },
            { media: { art: 'shapes', tone: 'white', ratio: 'video', tag: 'Illustrations' } },
            { media: { art: 'icons', tone: 'color', color: P.periwinkle, ratio: 'video', tag: 'Iconography' } },
            { media: { art: 'arcs', tone: 'dark', ratio: 'video', tag: 'Patterns' } },
          ],
        },
      ],
    },
    {
      label: 'Product UI',
      notes: [
        'Show the product at its best: device mockups, isometric angles, close-ups of one interaction, or abstracted UI.',
        'Note: product UI always gets a corner radius (see Layout, Corner radius).',
      ],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'ui', tone: 'dark', ratio: 'landscape' } },
            { media: { art: 'phone', tone: 'color', color: P.clay, ratio: 'landscape' } },
            { media: { art: 'ui', tone: 'color', color: P.periwinkle, ratio: 'landscape' } },
          ],
        },
      ],
    },
    {
      label: 'Illustrations',
      notes: ['Simple geometric shapes in flat brand colours. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'shapes', tone: 'white', ratio: 'landscape' } },
            { media: { art: 'shapes', tone: 'color', color: P.sage, ratio: 'landscape' } },
            { media: { art: 'shapes', tone: 'color', color: P.lilac, ratio: 'landscape' } },
          ],
        },
      ],
    },
    {
      label: 'Iconography',
      notes: ['Line icons on a 24 px grid with a 1.5 px stroke and round caps. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'items',
          cols: 4,
          items: [
            { icon: 'box', title: 'Box', body: 'icon-box' },
            { icon: 'pin', title: 'Pin', body: 'icon-pin' },
            { icon: 'globe', title: 'Globe', body: 'icon-globe' },
            { icon: 'chat', title: 'Chat', body: 'icon-chat' },
            { icon: 'bolt', title: 'Bolt', body: 'icon-bolt' },
            { icon: 'users', title: 'Users', body: 'icon-users' },
            { icon: 'target', title: 'Target', body: 'icon-target' },
            { icon: 'download', title: 'Download', body: 'icon-download' },
          ],
        },
      ],
    },
    {
      label: 'Patterns',
      notes: ['Graphic devices for backgrounds and chapter slides. One pattern per layout.'],
      blocks: [
        {
          type: 'media',
          cols: 4,
          items: [
            { media: { art: 'dots', tone: 'dark', ratio: 'square' }, caption: 'Dots' },
            { media: { art: 'lines', tone: 'light', ratio: 'square' }, caption: 'Lines' },
            { media: { art: 'grid', tone: 'white', ratio: 'square' }, caption: 'Grid' },
            { media: { art: 'arcs', tone: 'dark', ratio: 'square' }, caption: 'Arcs' },
          ],
        },
      ],
    },
    {
      label: 'Usage examples',
      notes: ['Lorem ipsum dolor sit amet: graphics combined with type and the logo.'],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'slide', tone: 'dark', ratio: 'video' }, caption: 'Pattern behind a title slide' },
            { media: { art: 'post', tone: 'color', color: P.sage, ratio: 'video' }, caption: 'Illustration in a social post' },
          ],
        },
      ],
    },
  ],
};
