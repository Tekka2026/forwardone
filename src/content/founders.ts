/**
 * The founders page (/founders), written for founders; the homepage is
 * written for investors. Copy supplied by the owner (2026-10-26), used
 * verbatim. Unknowns are visible placeholders, listed in PLACEHOLDERS.md.
 * Page: src/pages/founders.astro.
 *
 * Named `forFounders` to keep it apart from `founders` in home.ts (the
 * homepage founders strip).
 */
import type { Cta } from './home';

const PH = (what: string) => `[PLACEHOLDER: ${what}]`;

export type FounderStat = { value: string; label: string };
export type TitledLine = { title: string; body: string };
export type FounderQuote = { quote: string; name: string; role: string; company: string; photo: string };
export type PortfolioItem = { name: string; line: string };

export const forFounders = {
  meta: {
    title: 'For founders | FORWARD.one',
    description: 'We back European deeptech founders, from lab to exit. First checks up to €5M, follow-on up to €100M.',
  },

  /** Back to the investor homepage, above the hero. */
  investorsLink: { label: 'For investors', href: '/' } as Cta,

  hero: {
    eyebrow: 'For founders building the hard stuff',
    title: 'We back European deeptech, from lab to exit.',
    lede: 'We’ve sat in your seat. Our partners are former founders and operators, and the ones you meet are the ones who decide.',
    primary: { label: 'Pitch us', href: '#pitch' } as Cta,
    secondary: { label: 'Meet the partners', href: '#partners' } as Cta,
  },

  stats: [
    { value: 'Up to €5M', label: 'first check, pre-seed to Series A' },
    { value: 'Up to €100M', label: 'follow-on per company' },
    { value: '€250M', label: 'Fund III' },
    { value: '5 exits', label: 'to Sonos, ABB, MPS and others' },
  ] as FounderStat[],

  why: {
    eyebrow: 'Why founders pick us',
    title: 'Capital that keeps up when building gets expensive.',
    cards: [
      { title: 'We’ve sat in your seat.', body: 'Our team are former founders and operators. We know what the next eighteen months of building feel like.' },
      { title: 'Partners decide.', body: 'The partners you meet are the ones who decide. No waiting for an investment committee you never see.' },
      { title: 'Capital that keeps up.', body: 'We start with up to €5M and have followed on with up to €100M per company, so we can keep backing you when building gets expensive.' },
      { title: 'Terms we would sign ourselves.', body: 'We offer the terms we would have wanted for our own companies: simple, with no surprises.' },
    ] as TitledLine[],
  },

  /** Same pattern as the homepage Playbook. */
  how: {
    eyebrow: 'How we work with you',
    title: 'We roll up our sleeves on the commercial side.',
    body: 'Great technology still has to sell. We work with you on the steps deep-tech founders tend to skip, and we open doors to first customers, key hires, industrial partners and like-minded investors.',
    steps: [
      { title: 'First customers.', body: 'Paying customers early, before the product is perfect.' },
      { title: 'Pricing.', body: 'Priced on the value you create from day one.' },
      { title: 'Repeatable sales.', body: 'From founder-led deals to a process that scales.' },
      { title: 'Follow-on.', body: 'Most of each fund goes to the companies that prove it.' },
    ] as TitledLine[],
  },

  back: {
    eyebrow: 'What we back',
    title: 'European founders solving the hardest problems.',
    body: 'From the first prototype to industrial scale. First checks of up to €5M, and follow-on of up to €100M per company from our €250M Fund III.',
    sectors: ['Semicon', 'Quantum', 'Robotics', 'Energy', 'AI', 'Dual-use', 'Space', 'Industrial tech'],
  },

  backed: {
    eyebrow: 'Founders we back',
    title: 'Hear it from the people building.',
    quotes: [
      { quote: PH('founder quote'), name: 'Crijn Bouman', role: 'CEO & Co-founder', company: 'ROCSYS', photo: '/founders/rocsys.jpg' },
      { quote: PH('founder quote'), name: 'Tom Trill', role: 'CEO', company: 'Qualinx', photo: '/founders/qualinx.jpg' },
      { quote: PH('founder quote'), name: 'Jacquelien ten Dam', role: 'CEO', company: 'Optics11 Life', photo: '/founders/optics11-life.jpg' },
    ] as FounderQuote[],
    portfolioTitle: 'In the portfolio',
    portfolio: [
      { name: 'QuantWare', line: 'Quantum processors' },
      { name: 'QuiX Quantum', line: 'Photonic quantum computers' },
      { name: 'Optics11', line: 'Fibre-optic sensing for grids and seabed security' },
      { name: 'ExRobotics', line: 'Inspection robots for hazardous sites' },
      { name: 'Fizyr', line: 'Vision AI for robot picking' },
      { name: 'Voltfang', line: 'Grid storage from used EV batteries' },
      { name: 'ORE Energy', line: 'Iron-air long-duration storage' },
      { name: 'Sapient Perception', line: 'Sensing and edge AI for drones' },
      { name: 'Fibersail', line: 'Shape sensing for wind turbine blades' },
      { name: 'SenseGlove', line: 'Haptic gloves' },
      { name: 'Collo', line: 'Sensors that fingerprint liquids' },
      { name: 'ZuriQ', line: PH('one-line description') },
    ] as PortfolioItem[],
    exits: { lead: 'From lab to exit.', text: 'Mayht (acquired by Sonos), Sensorfact (ABB), Axign (MPS), Aito and Nuventura.' },
  },

  /** People, roles, photos and quotes come from `partners` in home.ts. */
  partners: {
    eyebrow: 'The partners',
    title: 'The people you meet are the people who decide.',
  },

  after: {
    eyebrow: 'After you pitch',
    title: 'Simple terms. No surprises.',
    steps: [
      { title: 'Send your deck.', body: 'A short description and your deck. No warm intro needed.' },
      { title: 'A partner reads it.', body: `You hear back within ${PH('X days')}, yes or no, with a reason.` },
      { title: 'Meet who decides.', body: 'Your first call is with the partner who makes the call.' },
      { title: 'A clear answer.', body: `A decision within ${PH('X weeks')} of the first meeting.` },
    ] as TitledLine[],
  },

  closing: {
    title: 'If it’s hard to build and Europe needs it, we want to hear about it.',
    cta: { label: 'Pitch us', href: PH('pitch form URL or mailto') } as Cta,
    emailLead: 'Or email',
    email: PH('pitch email'),
  },
};
