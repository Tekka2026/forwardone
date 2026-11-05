/**
 * Color: section 8 of the FORWARD.one Brand Foundation doc (2026-11-05).
 * Contrast ratios are computed at build time from the hex values.
 */
import type { BrandPage } from './types';
import { P } from './palette';

export const color: BrandPage = {
  slug: 'color',
  title: 'Color',
  lead: 'Our colors tell a story. Translated into color, that story becomes our core palette: seven tones, from Signal Red to Ice.',
  tile: { color: P.signalRed, icon: 'palette', cover: { art: 'steps', tone: 'dark' } },
  sections: [
    {
      label: 'Color story',
      blocks: [
        {
          type: 'prose',
          size: 'lead',
          paragraphs: [
            'It starts with a small red light: in 1964, IBM put red LEDs on its computer circuit boards, and a machine could signal its state for the first time. It runs, for now, to the deep cold that today’s superconducting quantum chips work in.',
            '[PLACEHOLDER: Riemer’s personal story may replace the 1964 starting point]',
          ],
        },
      ],
    },
    {
      label: 'Core palette',
      notes: ['Seven tones, always in this order, from Signal Red to Ice.'],
      blocks: [
        {
          type: 'proportion',
          items: [P.signalRed, P.oxblood, P.copper, P.amber, P.gold, P.cream, P.ice].map((hex) => ({ hex, share: 1 })),
        },
        {
          type: 'swatches',
          size: 'md',
          cols: 4,
          items: [
            { name: 'Signal Red', hex: P.signalRed, screenOnly: true, use: 'Accent and large type only' },
            { name: 'Oxblood', hex: P.oxblood, screenOnly: true, use: 'Text, headlines and fills; passes on white' },
            { name: 'Copper', hex: P.copper, screenOnly: true, use: 'Text, rules and icons; passes on white' },
            { name: 'Amber', hex: P.amber, screenOnly: true, use: 'Fills and highlights, with Ink text' },
            { name: 'Gold', hex: P.gold, screenOnly: true, use: 'Hero moments and fills, with Ink text' },
            { name: 'Cream', hex: P.cream, screenOnly: true, use: 'Warm backgrounds' },
            { name: 'Ice', hex: P.ice, screenOnly: true, use: 'Cool backgrounds and the far end of the scale' },
          ],
        },
      ],
    },
    {
      label: 'Neutrals',
      notes: ['Text and backgrounds.'],
      blocks: [
        {
          type: 'swatches',
          size: 'md',
          cols: 4,
          items: [
            { name: 'Ink', hex: P.ink, screenOnly: true, use: 'All body text' },
            { name: 'White', hex: P.white, screenOnly: true, use: 'Backgrounds' },
            { name: 'Black', hex: P.black, screenOnly: true, use: 'Dark backgrounds, hero and header' },
          ],
        },
      ],
    },
    {
      label: 'Rules',
      blocks: [
        {
          type: 'rules',
          items: [
            'Body text is Ink on light backgrounds and White on Black. Oxblood and Copper may also carry text on white.',
            'Signal Red carries large type only (24 px and up) on white.',
            'Amber, Gold, Cream and Ice never carry text on white; they take Ink text on top.',
            'On Black, Gold, Amber, Cream and Ice may carry text; Oxblood and Copper may not.',
          ],
        },
      ],
    },
    {
      label: 'Accessibility',
      notes: [
        'The pairs the rules allow, with their contrast ratio (WCAG 2.2). Body text needs 4.5:1; large text, 24 px and up, needs 3:1.',
      ],
      blocks: [
        {
          type: 'contrast',
          items: [
            { fg: P.ink, bg: P.white, label: 'Ink on White' },
            { fg: P.white, bg: P.black, label: 'White on Black' },
            { fg: P.oxblood, bg: P.white, label: 'Oxblood on White' },
            { fg: P.copper, bg: P.white, label: 'Copper on White' },
            { fg: P.signalRed, bg: P.white, label: 'Signal Red on White (large type)' },
            { fg: P.ink, bg: P.amber, label: 'Ink on Amber' },
            { fg: P.ink, bg: P.ice, label: 'Ink on Ice' },
            { fg: P.gold, bg: P.black, label: 'Gold on Black' },
          ],
        },
      ],
    },
  ],
};
