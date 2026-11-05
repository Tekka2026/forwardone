/**
 * Foundations: sections 1–7 of the FORWARD.one Brand Foundation doc
 * (2026-11-05), copy as written there. [Brackets] are open values.
 */
import type { BrandPage } from './types';
import { P } from './palette';

export const foundations: BrandPage = {
  slug: 'foundations',
  title: 'Foundations',
  lead: 'Where we come from, what we stand for and how we show up.',
  tile: { color: P.oxblood, icon: 'compass', cover: { art: 'wordmark', tone: 'dark' } },
  sections: [
    {
      label: 'Our promise',
      blocks: [
        { type: 'statement', text: 'Serious about performance.' },
        {
          type: 'prose',
          size: 'lead',
          paragraphs: [
            'That is our promise, and our name explains how we keep it: one step at a time. Capital follows performance, and every proven step earns the next.',
          ],
        },
      ],
    },
    {
      label: 'Mission',
      blocks: [
        {
          type: 'statement',
          text: 'We turn Europe’s breakthrough technologies into commercial victories. We bridge the gap between great engineering and real market traction, backing founders who prove performance, not promises.',
        },
      ],
    },
    {
      label: 'Vision',
      blocks: [
        {
          type: 'statement',
          text: 'A Europe where industrial innovation doesn’t stall after the prototype stage, but scales into global market leaders.',
        },
      ],
    },
    {
      label: 'Positioning',
      blocks: [
        {
          type: 'prose',
          size: 'lead',
          paragraphs: [
            'FORWARD.one is Europe’s most commercially oriented industrial technology VC. We help founders turn complex technology into scalable, investable, high-performing businesses through a commercialization-first approach that accelerates real market success.',
          ],
        },
      ],
    },
    {
      label: 'What we believe',
      notes: ['Five beliefs guide how we invest and how we speak.'],
      blocks: [
        {
          type: 'items',
          cols: 2,
          items: [
            { icon: 'arrow', title: 'Every leap is a step.', body: 'Breakthroughs that look sudden were built on the work before them. We look for what comes next.' },
            { icon: 'spark', title: 'AI makes industrial technology move faster.', body: 'Applied AI turns better chips, robots and sensors into systems that learn. We back it where it meets the physical world. Example: [portfolio company].' },
            { icon: 'target', title: 'A breakthrough counts when it reaches the market.', body: 'Until someone pays for it, a new technology is just expensive science. We back the move from lab to customer.' },
            { icon: 'box', title: 'Hardware is Europe’s edge.', body: 'Many investors see hardware as slow and capital-hungry. We see Europe’s engineering base as its competitive advantage, so we go where others hesitate.' },
            { icon: 'users', title: 'Founders lead, we work alongside.', body: 'Our job is to help them take the next step faster.' },
          ],
        },
      ],
    },
    {
      label: 'Who we are',
      notes: ['We invest early in Europe’s industrial technology, and the numbers show it works.'],
      blocks: [
        {
          type: 'stats',
          items: [
            { value: 'Top 5%', text: 'Funds I and II rank in the top 5% of European VC ([benchmark], [year]).' },
            { value: '5 exits', text: 'Mayht to Sonos, Sensorfact to ABB, Axign to MPS, Aito to [buyer] and Nuventura to [buyer].' },
            { value: 'About 1 in 300', text: 'We screen about 2,500 companies a year and back about 8.' },
            { value: '75–80%', text: 'Of each fund kept for follow-on investment in the companies that perform.' },
          ],
        },
        {
          type: 'prose',
          paragraphs: [
            '**The team.** We are a small team that works closely with every founder we back.',
            '[PLACEHOLDER: the partners, with one line each on what they bring]',
          ],
        },
      ],
    },
    {
      label: 'What we do',
      notes: [
        'We are European investors for European founders, investing early in industrial technology, from pre-seed to Series A. AI runs through every sector.',
      ],
      blocks: [
        {
          type: 'items',
          cols: 3,
          items: [
            { icon: 'grid', title: 'Future of compute', body: 'Chips, quantum processors and the infrastructure AI runs on.', meta: 'Example: QuantWare' },
            { icon: 'bolt', title: 'Robotics', body: 'Machines that sense, learn and act in the physical world.', meta: 'Example: [portfolio company]' },
            { icon: 'compass', title: 'Autonomy', body: 'Vehicles and systems that operate reliably without a human at the controls.', meta: 'Example: [portfolio company]' },
            { icon: 'box', title: 'Manufacturing', body: 'Production technology, from fab processes to the factory floor.', meta: 'Example: [portfolio company]' },
            { icon: 'shield', title: 'Dual-use', body: 'Technology that strengthens Europe’s security and its industry.', meta: 'Example: [portfolio company]' },
            { icon: 'leaf', title: 'Energy', body: 'The systems that generate, store and save power.', meta: 'Example: Sensorfact (exit to ABB)' },
          ],
        },
        {
          type: 'prose',
          paragraphs: [
            'We invest early and follow on deliberately, so the strongest companies get more. We bring capital, a network across Europe, fast decisions, and staying power when a company hits a setback.',
          ],
        },
      ],
    },
    {
      label: 'What founders prove\nto earn follow-on',
      blocks: [
        {
          type: 'rules',
          items: [
            '**Customers who pay.** We measure success in traction, not decks, rounds or lab results.',
            '**A product that works outside the lab,** at a cost customers accept.',
            '**Dated milestones,** met on time.',
          ],
        },
      ],
    },
    {
      label: 'How we show up',
      notes: [
        'Every step forward needs two feet: one planted, one moving. Our character lives in that balance. Our values come in pairs, and neither half works alone.',
      ],
      blocks: [
        {
          type: 'items',
          cols: 2,
          items: [
            { title: 'Demanding & Supportive', body: 'We set the bar high and tell founders where they stand, straight away. Then we help them clear it. That is tough love: high standards and real help.' },
            { title: 'Confident & Calm', body: 'Our claims are bold because our results back them. We deliver them calmly: the facts carry the weight, so we never need to raise our voice.' },
            { title: 'Contrarian & Grounded', body: 'We question conventional VC thinking: where others see hardware as slow and capital-hungry, we see Europe’s edge. Every contrarian view rests on homework: the lab visit, the paper and the customer call.' },
            { title: 'Precise & Warm', body: 'We say exactly what we mean, with numbers, names and dates. And we never forget there’s a team behind every number.' },
          ],
        },
      ],
    },
    {
      label: 'Communication',
      notes: [
        'We speak the way we invest: with discipline, precision and purpose. Our voice in one line: performance, engineered into language.',
        'Tone by audience and by moment, writing mechanics, word lists and the publishing checklist live in the Tone of Voice framework.',
      ],
      blocks: [
        {
          type: 'rules',
          items: [
            '**Lead with proof.** A number or a named outcome before an adjective.',
            '**Say it once.** No repetition, no padding: if a sentence can go, it goes.',
            '**Bold claims, calm delivery.** Confidence comes from the facts.',
            '**Plain and simple.** Explain complex technology in everyday words. Use jargon only when the reader needs it.',
            '**Same voice, different emphasis.** Founders and investors hear the same FORWARD.one; what changes is which proof leads.',
          ],
        },
      ],
    },
    {
      label: 'Why we matter',
      blocks: [
        { type: 'statement', text: 'The next breakthroughs will be built somewhere. We make sure Europe builds its share.' },
        {
          type: 'prose',
          paragraphs: [
            'That takes investors who understand both the machine and the AI inside it, and who help companies move fast from lab to market. The European Investment Fund and ABN AMRO back us to do exactly that.',
          ],
        },
        {
          type: 'items',
          cols: 3,
          items: [
            { title: 'For founders', body: 'A partner who has taken hard technology to market before and works alongside them.' },
            { title: 'For investors', body: 'A top-5% track record, with most of each fund going to the companies that perform.' },
            { title: 'For Europe', body: 'Companies that build the chips, energy systems and security technology the continent depends on.' },
          ],
        },
      ],
    },
  ],
};
