/**
 * Homepage content. ALL copy and ALL numbers live here.
 * Components render this file; they contain no copy of their own.
 *
 * Conventions
 * - `footnote: n` renders a superscript linked to footnotes[n-1].
 * - Any value starting with "[PLACEHOLDER" is rendered as a visible marker
 *   in development and hidden where the spec says so (card metrics).
 *   Every placeholder is also listed in PLACEHOLDERS.md.
 */

export type Cta = { label: string; href: string };

export const hero = {
  eyebrow: 'FORWARD.one',
  title: 'Serious about performance.',
  sub: {
    text: 'Early-stage venture capital for Europe’s industrial technology. Funds I and II rank in the top 5% of European VC.',
    footnote: 1,
  },
  primary: { label: 'See the track record', href: '/investors/funds' } as Cta,
  secondary: { label: 'Invest with us', href: '/investors/contact' } as Cta,
};

export type Stat = { value: string; label: string; footnote?: number };

export const stats: Stat[] = [
  { value: 'Top 5%', label: 'European VC (Funds I & II)', footnote: 1 },
  { value: '€383M', label: 'across three funds' },
  { value: '5', label: 'exits to strategic buyers' },
  { value: '2,500 → ~8', label: 'companies screened → backed per year' },
  { value: '75–80%', label: 'of each fund reserved for follow-on' },
];

export const whatWeDo = {
  eyebrow: 'What we do',
  title: 'One strategy. Executed without exception.',
  blocks: [
    {
      title: 'Invest early.',
      body: 'Pre-seed to Series A, ideally as the first institutional investor. Initial tickets up to €4M.',
    },
    {
      title: 'Follow on deliberately.',
      body: 'Most of the fund is held back for companies that prove commercial traction, up to €30M each.',
    },
    {
      title: 'Industrial tech only.',
      body: 'Future of compute, robotics, autonomy, manufacturing, dual-use and energy. Benelux, DACH and the Nordics.',
    },
  ],
  link: { label: 'Our strategy', href: '/strategy' } as Cta,
};

export type CaseStudy = {
  name: string;
  slug: string;
  outcome: string;
  /** e.g. "8× revenue in 3 years". Hidden when it is a placeholder. */
  metric: string;
  /** Logo path under public/. Placeholder until supplied. */
  logo: string;
};

export const caseStudies = {
  eyebrow: 'Proof',
  title: 'From lab to exit.',
  items: [
    {
      name: 'Sensorfact',
      slug: 'sensorfact',
      outcome: 'Energy intelligence for SMEs. Acquired by ABB.',
      metric: '[PLACEHOLDER]',
      logo: '[PLACEHOLDER: /logos/sensorfact.svg]',
    },
    {
      name: 'Mayht',
      slug: 'mayht',
      outcome: 'Loudspeaker technology. Acquired by Sonos.',
      metric: '[PLACEHOLDER]',
      logo: '[PLACEHOLDER: /logos/mayht.svg]',
    },
    {
      name: 'Axign',
      slug: 'axign',
      outcome: 'Audio semiconductors. Acquired by MPS.',
      metric: '[PLACEHOLDER]',
      logo: '[PLACEHOLDER: /logos/axign.svg]',
    },
    {
      name: 'QuantWare',
      slug: 'quantware',
      outcome: 'The world’s largest private round for a dedicated quantum processor company.',
      metric: '[PLACEHOLDER]',
      logo: '[PLACEHOLDER: /logos/quantware.svg]',
    },
    {
      name: 'Edmund',
      slug: 'edmund',
      outcome: 'Selling to top-tier industrial customers within 12 months.',
      metric: '[PLACEHOLDER]',
      logo: '[PLACEHOLDER: /logos/edmund.svg]',
    },
  ] as CaseStudy[],
  cta: { label: 'See all case studies', href: '/portfolio/case-studies' } as Cta,
};

export const playbook = {
  eyebrow: 'The Playbook',
  title: 'Capital follows performance.',
  body: 'We co-engineer commercial success: pricing, repeatable sales, first customers, partnerships. Companies that perform get concentrated follow-on capital. Those that don’t, don’t.',
  list: ['Pricing', 'Repeatable sales', 'First customers', 'Partnerships'],
  cta: { label: 'How we commercialize', href: '/strategy/playbook' } as Cta,
};

export const fundIII = {
  eyebrow: 'Fund III',
  title: 'More capital. Same discipline.',
  body: 'Fund III has reached €200M of a €250M hard cap, backed by investors including ABN AMRO Corporate Investments and the European Investment Fund.',
  cta: { label: 'Talk to investor relations', href: '/investors/contact' } as Cta,
};

export type Article = {
  title: string;
  slug: string;
  category: string;
  /** ISO date, or a placeholder. */
  date: string;
};

export const insights = {
  eyebrow: 'Insights',
  title: 'Intelligence from the front line of European industrial tech.',
  /**
   * Default featured articles from the existing news collection.
   * Category and date were not supplied; slugs are derived from the titles
   * and must be matched to the CMS slugs when the collection is migrated.
   */
  articles: [
    {
      title: 'What the exit of Sensorfact taught us about early-stage investing',
      slug: 'what-the-exit-of-sensorfact-taught-us-about-early-stage-investing',
      category: '[PLACEHOLDER: category]',
      date: '[PLACEHOLDER: date]',
    },
    {
      title: 'Why Munich matters for Europe’s next generation of industrial tech',
      slug: 'why-munich-matters-for-europes-next-generation-of-industrial-tech',
      category: '[PLACEHOLDER: category]',
      date: '[PLACEHOLDER: date]',
    },
    {
      title: 'Fund III: Doubling Down on Europe’s Industrial Technology Winners',
      slug: 'fund-iii-doubling-down-on-europes-industrial-technology-winners',
      category: '[PLACEHOLDER: category]',
      date: '[PLACEHOLDER: date]',
    },
  ] as Article[],
  allLink: { label: 'All insights', href: '/insights' } as Cta,
  newsletter: {
    title: 'The Playbook, quarterly. No fluff.',
    emailLabel: 'Email address',
    emailPlaceholder: 'name@company.com',
    button: 'Subscribe',
    /** No real submission. Replace with the ESP endpoint. */
    action: '[PLACEHOLDER: newsletter handler]',
    confirmation: 'Thanks. Subscription handling is not connected yet.',
  },
};

export const closing = {
  title: 'Serious about performance? So are we.',
  primary: { label: 'Contact investor relations', href: '/investors/contact' } as Cta,
  secondary: { label: 'Founders: pitch us', href: '/founders' } as Cta,
};

/** footnotes[0] is ¹, footnotes[1] is ², ... */
export const footnotes = [
  '[PLACEHOLDER: benchmark source and date for top-5% ranking]',
];

export const disclaimer =
  '[PLACEHOLDER: past performance disclaimer, to be supplied by compliance]';

export const meta = {
  title: 'FORWARD.one | Serious about performance.',
  description:
    'Early-stage venture capital for Europe’s industrial technology. Funds I and II rank in the top 5% of European VC.',
};
