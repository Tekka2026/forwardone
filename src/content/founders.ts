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
export type PortfolioItem = { name: string; logo: string };

export const forFounders = {
  meta: {
    title: 'For founders | FORWARD.one',
    description: 'We back European deeptech founders, from lab to exit. First checks up to €5M, follow-on up to €100M.',
  },

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

  /** A scroll-driven deck after lassie.ai (owner, 2026-10-26): one visual
   * per card, the text beside it, alternating left and right. */
  why: {
    eyebrow: 'Why founders pick us',
    title: 'Capital that keeps up when building gets expensive.',
    cards: [
      { title: 'We’ve sat in your seat.', body: 'Our team are former founders and operators. We know what the next eighteen months of building feel like.' },
      { title: 'Partners decide.', body: 'The partners you meet are the ones who decide. No waiting for an investment committee you never see.' },
      { title: 'Capital that keeps up.', body: 'We start with up to €5M and have followed on with up to €100M per company, so we can keep backing you when building gets expensive.' },
      { title: 'Terms we would sign ourselves.', body: 'We offer the terms we would have wanted for our own companies: simple, with no surprises.' },
    ] as TitledLine[],
    /** One visual per card (owner, 2026-10-26): a placeholder with the card's
     * title in it until the visuals are supplied. */
    visual: PH('visual'),
  },

  /** Same pattern as the homepage Playbook. */
  how: {
    eyebrow: 'How we work with you',
    title: 'We don’t just advise on growth, we help you drive it.',
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

  /** Eyebrow and title for the founders strip (the homepage component, owner
   * 2026-10-26: its cards come from `founders` in home.ts), then the
   * portfolio grid and the exits line. */
  backed: {
    eyebrow: 'Founders we back',
    title: 'Hear it from the people building.',
    portfolioTitle: 'In the portfolio',
    /** Logo tiles (owner, 2026-10-26): one square per company with its SVG
     * logo in the middle. Logos go in src/assets/portfolio/<logo>.svg
     * (single colour, inlined in the text colour); until a file is there the
     * tile shows the name and a placeholder marker. */
    portfolio: [
      { name: 'QuantWare', logo: 'quantware' },
      { name: 'QuiX Quantum', logo: 'quix-quantum' },
      { name: 'Optics11', logo: 'optics11' },
      { name: 'ExRobotics', logo: 'exrobotics' },
      { name: 'Fizyr', logo: 'fizyr' },
      { name: 'Voltfang', logo: 'voltfang' },
      { name: 'ORE Energy', logo: 'ore-energy' },
      { name: 'Sapient Perception', logo: 'sapient-perception' },
      { name: 'Fibersail', logo: 'fibersail' },
      { name: 'SenseGlove', logo: 'senseglove' },
      { name: 'Collo', logo: 'collo' },
      { name: 'ZuriQ', logo: 'zuriq' },
    ] as PortfolioItem[],
    logoMissing: PH('SVG logo'),
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
