import type { BrandPage } from './types';
import { P } from './palette';

export const logo: BrandPage = {
  slug: 'logo',
  title: 'Logo',
  lead: 'Our logo is the most recognisable lorem ipsum of our brand. Treat it with consistency and care.',
  tile: { color: P.black, icon: 'logo', cover: { art: 'construction', tone: 'dark' } },
  draft: 'The logo shown is the real FORWARD.one wordmark; the rules on this page are placeholders until they are agreed.',
  sections: [
    {
      blocks: [
        {
          type: 'media',
          cols: 1,
          items: [{ media: { art: 'wordmark', tone: 'dark', ratio: 'wide' } }],
        },
      ],
    },
    {
      label: 'Background',
      notes: [
        'The logotype is drawn from simple geometric forms. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        'It fits neatly in a rectangle and locks up with almost any application because of its right-angled forms.',
      ],
      blocks: [{ type: 'media', cols: 1, items: [{ media: { art: 'construction', tone: 'dark', ratio: 'wide' } }] }],
    },
    {
      label: 'Logo',
      notes: [
        'Our logo is the primary identifier of the brand: lorem ipsum, mission and legacy.',
        'The icon is used sparingly, only where the full logo is not legible (favicons, avatars).',
      ],
      button: { label: 'Download Logo', href: '/brand/forwardone-logo.zip' },
      blocks: [
        { type: 'media', cols: 1, items: [{ media: { art: 'wordmark', tone: 'white', ratio: 'wide' }, caption: 'Primary logo' }] },
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'wordmark', tone: 'dark', ratio: 'video' }, caption: 'Reversed' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video' }, caption: 'Positive' },
          ],
        },
      ],
    },
    {
      label: 'Variations',
      notes: ['Three lockups cover every format. Pick the one that best fits the space; never build new ones.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'wordmark', tone: 'white', ratio: 'square' }, caption: 'Horizontal' },
            { media: { tone: 'grey', ratio: 'square', tag: 'Not yet designed' }, caption: 'Stacked' },
            { media: { tone: 'grey', ratio: 'square', tag: 'Not yet designed' }, caption: 'Icon only' },
          ],
        },
      ],
    },
    {
      label: 'Don’ts',
      notes: ['Do not alter the logo in any way. Avoid the following treatments.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'stretch' }, caption: 'Don’t stretch', verdict: 'bad' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'outline' }, caption: 'Don’t outline', verdict: 'bad' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'colour' }, caption: 'Don’t use unapproved colours', verdict: 'bad' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'shadow' }, caption: 'Don’t apply shadows or effects', verdict: 'bad' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'rotate' }, caption: 'Don’t rotate', verdict: 'bad' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', misuse: 'pattern' }, caption: 'Don’t place on busy patterns', verdict: 'bad' },
          ],
        },
      ],
    },
    {
      label: 'Logo colors',
      notes: ['The logo appears only in these colourways, so there is always enough contrast with the background.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { art: 'wordmark', tone: 'white', ratio: 'video' }, caption: 'Black' },
            { media: { art: 'wordmark', tone: 'dark', ratio: 'video' }, caption: 'White' },
            { media: { art: 'wordmark', tone: 'accent', ratio: 'video' }, caption: 'Single colour' },
          ],
        },
      ],
    },
    {
      label: 'On color',
      notes: ['On brand colours, use the black or white logo, whichever gives the higher contrast.'],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'wordmark', tone: 'color', color: P.ice, ratio: 'video' } },
            { media: { art: 'wordmark', tone: 'color', color: P.amber, ratio: 'video' } },
            { media: { art: 'wordmark', tone: 'color', color: P.cream, ratio: 'video' } },
            { media: { art: 'wordmark', tone: 'color', color: P.oxblood, ratio: 'video' } },
          ],
        },
      ],
    },
    {
      label: 'On photography',
      notes: ['Place the logo on calm areas of an image. Lorem ipsum dolor sit amet; add a subtle scrim if needed.'],
      blocks: [{ type: 'media', cols: 1, items: [{ media: { art: 'wordmark', tone: 'photo', ratio: 'wide', seed: 5 } }] }],
    },
    {
      label: 'Minimum size\n& clearspace',
      notes: [
        'Keep a clear zone around the logo equal to the height of the mark (x). Nothing enters it.',
        'Minimum size: 24 px tall on screen, 8 mm in print. The icon alone may go down to 16 px.',
      ],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'clearspace', tone: 'white', ratio: 'video' }, caption: 'Clearspace = x' },
            { media: { art: 'wordmark', tone: 'white', ratio: 'video', tag: 'min. 24 px / 8 mm' }, caption: 'Minimum size' },
          ],
        },
      ],
    },
    {
      label: 'Approved lockups',
      notes: ['With partners, separate the logos with a thin rule and equal clearspace. Lorem ipsum dolor sit amet.'],
      blocks: [
        {
          type: 'media',
          cols: 2,
          items: [
            { media: { art: 'lockup', tone: 'white', ratio: 'video' }, caption: 'Partner lockup, horizontal' },
            { media: { art: 'lockup', tone: 'dark', ratio: 'video' }, caption: 'Partner lockup, reversed' },
          ],
        },
      ],
    },
  ],
};
