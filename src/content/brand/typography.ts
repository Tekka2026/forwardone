/**
 * Typography: the typefaces and scale the FORWARD.one site uses
 * (css/global.css; headline font Aeonik since 2026-11-06). The don'ts are general guidance.
 */
import type { BrandPage } from './types';
import { P } from './palette';

export const typography: BrandPage = {
  slug: 'typography',
  title: 'Typography',
  lead: 'Three typefaces, each with one job: Aeonik for headlines and key figures, Inter for reading, Geist Mono for labels.',
  tile: { color: P.cream, icon: 'type', cover: { art: 'dots', tone: 'dark' } },
  sections: [
    {
      label: 'Headlines',
      notes: [
        'Aeonik Regular for display headlines and section titles, Aeonik SemiBold for key figures.',
        'A commercial font. [PLACEHOLDER: web licence, needed before the site goes public]',
      ],
      blocks: [{ type: 'specimen', name: 'Aeonik Regular', font: 'display', meta: ['Headlines', 'Regular', 'Key figures: SemiBold'] }],
    },
    {
      label: 'Body',
      notes: ['Inter for third-level headings and below, body copy and the interface.'],
      blocks: [{ type: 'specimen', name: 'Inter', font: 'sans', meta: ['Body and interface', 'Weights 400–600'] }],
    },
    {
      label: 'Labels',
      notes: ['Geist Mono for eyebrows, labels and figures in small type, set in capitals with wide tracking.'],
      blocks: [{ type: 'specimen', name: 'Geist Mono', font: 'mono', meta: ['Labels', 'Weights 400 and 500', 'SIL Open Font License'] }],
    },
    {
      label: 'Type scale',
      notes: ['The scale of forward.one. Sizes are for screen; the smaller value applies on phones.'],
      blocks: [
        {
          type: 'typeRows',
          rows: [
            { meta: ['Display', 'Aeonik Regular', '52–120 px / 0.98'], sample: 'Serious about performance.', style: 'display' },
            { meta: ['Section', 'Aeonik Regular', '30–56 px / 1.06'], sample: 'Every leap is a step.', style: 'h1' },
            { meta: ['Card title', 'Inter', '19 px / 1.3'], sample: 'Founders lead, we work alongside.', style: 'h4' },
            { meta: ['Lede', 'Inter', '18–21 px / 1.5'], sample: 'We turn Europe’s breakthrough technologies into commercial victories.', style: 'lede' },
            { meta: ['Body', 'Inter', '17 px / 1.55'], sample: 'We invest early and follow on deliberately, so the strongest companies get more. We bring capital, a network across Europe, fast decisions, and staying power when a company hits a setback.', style: 'body' },
            { meta: ['Small', 'Inter', '15 px / 1.55'], sample: 'We screen about 2,500 companies a year and back about 8.', style: 'caption' },
            { meta: ['Label', 'Geist Mono', '12 px, capitals, +0.16 em'], sample: 'Future of compute', style: 'mono' },
          ],
        },
      ],
    },
    {
      label: 'Testing type',
      notes: ['Click a field and type to try the typefaces.'],
      blocks: [
        { type: 'tester', meta: ['Headline', 'Aeonik Regular'], sample: 'Hardware is Europe’s edge.', style: 'h1' },
        { type: 'tester', meta: ['Body', 'Inter Regular', '17 px / 1.55'], sample: 'Many investors see hardware as slow and capital-hungry. We see Europe’s engineering base as its competitive advantage, so we go where others hesitate.', style: 'body' },
      ],
    },
    {
      label: 'Don’ts',
      notes: ['Avoid the following treatments.'],
      blocks: [
        {
          type: 'media',
          cols: 3,
          items: [
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'typeface' }, caption: 'Don’t use other typefaces', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'mono' }, caption: 'Don’t set headlines in the mono', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'tight' }, caption: 'Don’t set lines too close together', verdict: 'bad' },
            { media: { tone: 'dark', ratio: 'landscape', typeMisuse: 'tracking' }, caption: 'Don’t track out headlines', verdict: 'bad' },
            { media: { tone: 'white', ratio: 'landscape', typeMisuse: 'size' }, caption: 'Don’t set levels too close in size', verdict: 'bad' },
            { media: { tone: 'color', color: P.gold, ratio: 'landscape', typeMisuse: 'white' }, caption: 'Don’t put text on Amber, Gold, Cream or Ice without Ink', verdict: 'bad' },
          ],
        },
      ],
    },
  ],
};
