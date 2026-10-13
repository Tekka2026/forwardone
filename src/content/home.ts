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
  /** Says what FORWARD.one does; the headline does not. */
  eyebrow: 'Early-stage VC for European industrial tech',
  /** `\n` forces the line break. */
  title: 'Performance,\nengineered.',
  /** `text`, then the footnote marker, then `after`. */
  sub: {
    text: 'Funds I and II rank in the top 5% of European VC.',
    footnote: 1,
    after:
      'Fund III backs founders from pre-seed to Series A in robotics, compute, energy and dual-use, and keeps most of its capital for the companies that prove commercial traction.',
  },
  primary: { label: 'See the track record', href: '/investors/funds' } as Cta,
  secondary: { label: 'Invest with us', href: '/investors/contact' } as Cta,
};

/** `value` renders first in the DOM and on top visually; it never wraps. */
export type Stat = { value: string; label: string; footnote?: number };

export const stats: Stat[] = [
  { value: 'Top 5%', label: 'European VC (Funds I & II)', footnote: 1 },
  { value: '5', label: 'exits to strategic buyers' },
  { value: '~8 of 2,500', label: 'companies backed per year' },
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
  /**
   * Month and year at the top of the card, e.g. "April 2022"; shown after
   * the group label ("Exit: April 2022").
   */
  date: string;
  outcome: string;
  /**
   * Headline outcome, e.g. "8× revenue in 3 years". Shown as a large figure
   * on the card when filled; hidden while empty or a placeholder.
   */
  metric: string;
  /** Logo path under public/. Placeholder until supplied. */
  logo: string;
  /** Card visual (image path under public/). Placeholder until supplied. */
  visual: string;
  /**
   * Optional background video for the whole card (paths under public/):
   * WebM (VP9) first, MP4 (H.264) as the fallback Safari uses, and a still
   * `poster` shown before it plays and under reduced motion. Replaces the
   * visual.
   */
  video?: { webm?: string; mp4: string; poster: string };
  /** Short mono facts along the card's bottom edge. Optional; hidden when empty. */
  facts: string[];
};

/** `label` is the stage shown on each card ("01 Exit", "04 Traction"). */
export type CaseGroup = { label: string; items: CaseStudy[] };

export const caseStudies = {
  eyebrow: 'Proof',
  title: 'From lab to exit.',
  /** Line to the right of the heading. */
  intro: 'Five exits so far. Five engineering companies that global industry leaders chose to buy.',
  groups: [
    {
      label: 'Exit',
      items: [
        {
          name: 'Sensorfact',
          slug: 'sensorfact',
          date: 'January 2025',
          outcome: 'Energy intelligence for SMEs. Acquired by ABB.',
          metric: '[PLACEHOLDER: outcome figure]',
          logo: '[PLACEHOLDER: /logos/sensorfact.svg]',
          visual: '',
          video: { webm: '/cases/sensorfact.webm', mp4: '/cases/sensorfact.mp4', poster: '/cases/sensorfact.jpg' },
          facts: [],
        },
        {
          name: 'Mayht',
          slug: 'mayht',
          date: 'April 2022',
          outcome: 'Loudspeaker technology. Acquired by Sonos.',
          metric: '[PLACEHOLDER: outcome figure]',
          logo: '[PLACEHOLDER: /logos/mayht.svg]',
          visual: '',
          video: { webm: '/cases/mayht.webm', mp4: '/cases/mayht.mp4', poster: '/cases/mayht.jpg' },
          facts: [],
        },
        {
          name: 'Axign',
          slug: 'axign',
          date: '[PLACEHOLDER: exit date]',
          outcome: 'Audio semiconductors. Acquired by MPS.',
          metric: '[PLACEHOLDER: outcome figure]',
          logo: '[PLACEHOLDER: /logos/axign.svg]',
          visual: '[PLACEHOLDER: image]',
          facts: [],
        },
      ],
    },
    {
      label: 'Traction',
      items: [
        {
          name: 'QuantWare',
          slug: 'quantware',
          date: '[PLACEHOLDER: date]',
          outcome: 'Largest private round for a dedicated quantum processor company.',
          metric: '[PLACEHOLDER: outcome figure]',
          logo: '[PLACEHOLDER: /logos/quantware.svg]',
          visual: '',
          video: { webm: '/cases/quantware.webm', mp4: '/cases/quantware.mp4', poster: '/cases/quantware.jpg' },
          facts: [],
        },
        {
          name: 'Edmund',
          slug: 'edmund',
          date: '[PLACEHOLDER: date]',
          outcome: 'Selling to top-tier industrial customers within 12 months.',
          metric: '[PLACEHOLDER: outcome figure]',
          logo: '[PLACEHOLDER: /logos/edmund.svg]',
          visual: '[PLACEHOLDER: image]',
          facts: [],
        },
      ],
    },
  ] as CaseGroup[],
  cta: { label: 'See all case studies', href: '/portfolio/case-studies' } as Cta,
};

/** Every case study across the Proof rows, for the company pages. */
export const allCaseStudies: CaseStudy[] = caseStudies.groups.flatMap((g) => g.items);

export type FundRow = {
  fund: string;
  size: string;
  companies: string;
  status: string;
};

export const trackRecord = {
  eyebrow: 'Track record',
  title: 'Three funds. One discipline.',
  /** Column headings, in table order. Also the labels on mobile cards. */
  columns: { fund: 'Fund', size: 'Size', companies: 'Companies', status: 'Status' },
  caption: 'FORWARD.one funds by size, number of companies and status',
  funds: [
    { fund: 'Fund III', size: '€200M (hard cap €250M)', companies: '~30 (target)', status: 'Investing' },
    { fund: 'Fund II', size: '€145M', companies: '20', status: '[PLACEHOLDER: status]' },
    { fund: 'Fund I', size: '€38M', companies: '12', status: '[PLACEHOLDER: status]' },
  ] as FundRow[],
  exits: {
    label: 'Exits:',
    items: ['Mayht (Sonos)', 'Sensorfact (ABB)', 'Axign (MPS)', 'Aito', 'Nuventura'],
  },
  link: { label: 'Funds & track record', href: '/investors/funds' } as Cta,
};

export type PlaybookStep = { title: string; line: string };

export const playbook = {
  eyebrow: 'The Playbook',
  title: 'We help them win. Then we double down.',
  body: 'We work hands-on with every company on the commercial side that deep-tech founders tend to skip. The ones that prove traction get most of our follow-on capital.',
  /** Numbered list, right column: a title and one line each. */
  list: [
    { title: 'First customers', line: 'Paying customers early, not after the product is perfect.' },
    { title: 'Pricing', line: 'Priced on value from day one.' },
    { title: 'Repeatable sales', line: 'From founder-led deals to a process that scales.' },
    { title: 'Follow-on', line: '75–80% of each fund goes to the companies that prove it.' },
  ] as PlaybookStep[],
  cta: { label: 'How we commercialize', href: '/strategy/playbook' } as Cta,
};

export type Partner = {
  name: string;
  role: string;
  /** Path under public/. Placeholder until supplied. */
  photo: string;
  quote: string;
};

export const partners = {
  eyebrow: 'The team',
  title: 'The partners behind the performance.',
  people: [
    {
      name: 'Arjan Göbel',
      role: 'General Partner',
      photo: '[PLACEHOLDER: photo]',
      quote: 'Set near-impossible deadlines, make them holy, and reach them.',
    },
    {
      name: 'Riemer Smink',
      role: 'Managing Partner',
      photo: '[PLACEHOLDER: photo]',
      quote: 'Commercial execution always beats technical elegance.',
    },
    {
      name: 'Robin van Boxsel',
      role: 'General Partner',
      photo: '[PLACEHOLDER: photo]',
      quote: '[PLACEHOLDER: quote]',
    },
    {
      name: 'Paul Pruijmboom',
      role: 'Managing Partner',
      photo: '[PLACEHOLDER: photo]',
      quote: '[PLACEHOLDER: quote]',
    },
  ] as Partner[],
  link: { label: 'Meet the team', href: '/about/team' } as Cta,
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
   * The repo has no news collection yet, so category and date stay
   * placeholders; slugs are derived from the titles and must be matched to
   * the CMS slugs when the collection is migrated. Titles in sentence case.
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
      title: 'Fund III: doubling down on Europe’s industrial technology winners',
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
