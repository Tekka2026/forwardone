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
  /**
   * Says what FORWARD.one does; the headline does not. `lead` is visible
   * from the start, `rest` ticks in word by word alongside the H1.
   */
  eyebrow: { lead: 'Early-stage VC', rest: 'for European industrial tech' },
  /** `\n` forces the line break. */
  title: 'Performance,\nengineered.',
  /** `text`, then the footnote marker, then `after`. */
  sub: {
    text: 'Our Funds I and II rank in the top 5% of European VC.',
    footnote: 1,
    after: 'Fund III invests early and puts most of its capital behind the companies that prove it.',
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

/**
 * Founders strip (owner, 2026-10-19): between the intro and the track record,
 * a big horizontal scroll of 5:7 cards, three grid columns wide, with the 20
 * founders, in three card types:
 * - 'founder': the CEO's photo, name, and "CEO, company";
 * - 'company': the company's brand colour, its name and a line of body copy;
 * - clips (every fifth card): a TikTok-style video of a FORWARD.one team
 *   member, with Like and Share.
 * RULE (owner, 2026-10-19): no company here may also be a Proof company
 * (`caseStudies`). Founders.astro fails the build if one is. So only Aito
 * and Nuventura (portfolio exits named in the track record, not in Proof)
 * are filled in; founder names, photos, the other companies, brand colours
 * (empty = a site tone is used), lines, the videos and their captions are
 * placeholders (see PLACEHOLDERS.md and A0012).
 */
export type FounderEntry = {
  card: 'founder' | 'company';
  name: string;
  company: string;
  /** Founder card: path under public/, or a placeholder. */
  photo: string;
  /** Company card: brand colour as hex; empty = a site tone. */
  colour: string;
  /** Company card: one line under the name. */
  blurb: string;
};
export type FounderClip = { video: string; webm?: string; poster: string; person: string; caption: string };

const PH = {
  name: '[PLACEHOLDER: founder name]',
  company: '[PLACEHOLDER: company]',
  photo: '[PLACEHOLDER: CEO photo]',
  blurb: '[PLACEHOLDER: one line about the company]',
};
const founder = (company = PH.company): FounderEntry => ({ card: 'founder', name: PH.name, company, photo: PH.photo, colour: '', blurb: '' });
const company = (name = PH.company, blurb = PH.blurb): FounderEntry => ({ card: 'company', name: PH.name, company: name, photo: '', colour: '', blurb });

export const founders = {
  eyebrow: 'Founders',
  title: 'The founders we back.',
  role: 'CEO',
  /** 20 founders; the card type alternates. */
  people: [
    founder(),
    company('Aito'),
    founder(),
    company('Nuventura'),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
    founder(),
    company(),
  ] as FounderEntry[],
  /** A clip after every `clipEvery` founder cards. */
  clipEvery: 4,
  // Until the team videos are supplied every clip plays the same neutral
  // placeholder video (owner, 2026-10-19: generated, dark drifting light
  // with "PLACEHOLDER VIDEO" written on it), each from a different moment.
  clips: [1, 2, 3, 4, 5].map(() => ({
    video: '/founders/placeholder.mp4',
    webm: '/founders/placeholder.webm',
    poster: '/founders/placeholder.jpg',
    person: '[PLACEHOLDER: team member, role]',
    caption: '[PLACEHOLDER: one-line caption]',
  })) as FounderClip[],
  clip: {
    handle: '[PLACEHOLDER: social handle]',
    sound: 'original sound · FORWARD.one',
    like: 'Like',
    liked: 'Liked',
    share: 'Share',
    copied: 'Link copied',
  },
  /** Fallback colours for company cards without a brand colour: the site's own tones. */
  tones: ['#FFEA6D', '#111111', '#26175A', '#E9E4D6', '#DB8E00', '#820400', '#C3D3DE'],
};

export const trackRecord = {
  eyebrow: 'Track record',
  /**
   * Headline figure, centred above the title: the number at twice the H1
   * size, prefix and suffix at H1 size. The sum of the three fund sizes
   * below: €31,951,000 + €139,082,800 + €217,250,000 = €388,283,800.
   * (Excludes the six co-investment SPVs, €114,499,762.04 together.)
   */
  figure: { prefix: '€', value: '388', suffix: 'M' },
  title: 'Three funds. One discipline.',
  /** Body copy, centred under the title. */
  body: 'Every fund has been more ambitious than the last. The strategy hasn’t changed: invest early in European industrial tech, then put most of the capital behind the companies that deliver.',
  /** Column headings, in table order. Also the labels on mobile cards. */
  columns: { fund: 'Fund', size: 'Size', companies: 'Companies', status: 'Status' },
  caption: 'FORWARD.one funds by size, number of companies and status',
  /**
   * Size = total commitments at the last closing, from the owner's fund
   * overview (2026-10-15), rounded to whole millions:
   * Fund I (vintage 2018) €31,951,000; Fund II (2021) €139,082,800;
   * Fund III (2025) €217,250,000.
   */
  funds: [
    { fund: 'Fund III', size: '€217M (hard cap €250M)', companies: '~30 (target)', status: 'Investing' },
    { fund: 'Fund II', size: '€139M', companies: '20', status: '[PLACEHOLDER: status]' },
    { fund: 'Fund I', size: '€32M', companies: '12', status: '[PLACEHOLDER: status]' },
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
  body: 'Fund III has reached €217M of a €250M hard cap, backed by investors including ABN AMRO Corporate Investments and the European Investment Fund.',
  cta: { label: 'Talk to investor relations', href: '/investors/contact' } as Cta,
};

/**
 * Investor portal preview under Fund III: a desktop dashboard illustration.
 * The top bar (logo, tabs, icons) and the greeting row follow the earlier
 * EFG-style reference; the body is the LP's investor-report overview, laid
 * out after the owner's portal screenshot (2026-10-19): per fund the LP's
 * commitment, paid-in capital, distributions, unfunded commitment, capital
 * account at fair value, TVPI and net IRR, plus a link to the latest report.
 *
 * ILLUSTRATIVE DATA (owner, 2026-10-19): the investor entity and the
 * portfolio companies are invented names, and every amount is invented, of
 * the same size as the real screenshot's. No email address is shown. The
 * figures are internally consistent: unfunded = commitment − paid-in;
 * TVPI = (distributed + capital account) ÷ paid-in; the total row adds up
 * the fund rows (the look-through row under Fund III is not counted twice).
 */
export type PortalFigures = {
  commitment: string;
  paidIn: string;
  distributed: string;
  unfunded: string;
  capitalAccount: string;
  tvpi: string;
  irr: string;
};
export type PortalHolding = {
  name: string;
  /** Look-through row: the LP's share held via another vehicle (shown indented and muted). */
  via?: string;
  figures: PortalFigures;
};
export type PortalFund = {
  name: string;
  currency: string;
  /** Latest report, e.g. "Q3 2026"; none yet when omitted. */
  report?: string;
  holdings: PortalHolding[];
};

const LP = 'Corvane Investment Holding B.V.';

export const portal = {
  label: 'Illustration of the FORWARD.one investor portal: an overview of investor reports per fund',
  nav: [
    { label: 'Home', active: true },
    { label: 'Wealth', menu: true },
    { label: 'Transactions', menu: true },
    { label: 'Documents' },
  ],
  /** Unread messages: shown as `from`, then counts up to `to` once the dashboard is in view (a new message arrives). */
  unread: { from: '3', to: '4' },
  /** Picked from the viewer's local time: morning 05–12, afternoon 12–18, evening otherwise. */
  greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
  /** Followed by the viewer's current date and time, e.g. "Monday, 05.02.2030 13:52". */
  valueDate: { label: 'Value date', fallback: 'Monday, 05.02.2030 13:52' },
  filter: 'Filter',
  /** Column heads. The first four are cash flows; the last three (tinted) are valuation. */
  columns: {
    commitment: 'Commitment',
    paidIn: 'Paid-in capital',
    distributed: 'Distributed',
    unfunded: 'Unfunded commitment',
    capitalAccount: 'Capital account at fair value',
    tvpi: 'Fund multiple TVPI',
    irr: 'Fund net IRR',
  } as Record<keyof PortalFigures, string>,
  /** "View {report} report". */
  reportLink: { before: 'View', after: 'report' },
  funds: [
    {
      name: 'FORWARD.one Fund I',
      currency: 'EUR',
      report: 'Q3 2026',
      holdings: [{ name: LP, figures: { commitment: '450,000', paidIn: '449,610', distributed: '(871,240)', unfunded: '390', capitalAccount: '152,310', tvpi: '2.28x', irr: '33.84%' } }],
    },
    {
      name: 'FORWARD.one Fund II',
      currency: 'EUR',
      report: 'Q3 2026',
      holdings: [{ name: LP, figures: { commitment: '800,000', paidIn: '663,420', distributed: '(27,350)', unfunded: '136,580', capitalAccount: '901,770', tvpi: '1.40x', irr: '15.92%' } }],
    },
    {
      name: 'FORWARD.one Co-Investment II Ferrolis',
      currency: 'EUR',
      report: 'H1 2026',
      holdings: [{ name: LP, figures: { commitment: '100,000', paidIn: '100,000', distributed: '–', unfunded: '–', capitalAccount: '92,415', tvpi: '0.92x', irr: '–' } }],
    },
    {
      name: 'FORWARD.one Fund III',
      currency: 'EUR',
      report: 'Q3 2026',
      holdings: [
        { name: 'FORWARD.one GP Investments B.V.', figures: { commitment: '6,250,000', paidIn: '1,003,750', distributed: '–', unfunded: '5,246,250', capitalAccount: '893,340', tvpi: '0.89x', irr: '(28.45%)' } },
        { name: LP, via: 'FORWARD.one GP Investments B.V.', figures: { commitment: '1,250,000', paidIn: '200,750', distributed: '–', unfunded: '1,049,250', capitalAccount: '178,670', tvpi: '0.89x', irr: '(28.45%)' } },
      ],
    },
    {
      name: 'FORWARD.one Co-Investment V Qubitra',
      currency: 'EUR',
      report: 'H1 2026',
      holdings: [{ name: LP, figures: { commitment: '100,000', paidIn: '48,920', distributed: '–', unfunded: '51,080', capitalAccount: '49,310', tvpi: '1.01x', irr: '0.38%' } }],
    },
    {
      name: 'FORWARD.one Co-Investment VI Lumenade',
      currency: 'EUR',
      holdings: [{ name: LP, figures: { commitment: '100,250', paidIn: '52,180', distributed: '–', unfunded: '48,070', capitalAccount: '–', tvpi: '–', irr: '–' } }],
    },
  ] as PortalFund[],
  total: {
    label: 'Total',
    figures: { commitment: '7,800,250', paidIn: '2,317,880', distributed: '(898,590)', unfunded: '5,482,370', capitalAccount: '2,089,145', tvpi: '', irr: '' } as PortalFigures,
  },
};

export type Article = {
  title: string;
  slug: string;
  /** Two lines of body copy under the title, introducing the article. */
  intro: string;
  /** Visual above the article (5:7, portrait). Path under public/, or a placeholder. */
  image: string;
  /** Instead of an image: a coded visual from src/components/visuals/. */
  visual?: 'robot-arm' | 'munich-map';
};

export const insights = {
  eyebrow: 'Insights',
  title: 'Intelligence from the front line of European industrial tech.',
  /**
   * Default featured articles from the existing news collection. Slugs are
   * derived from the titles and must be matched to the CMS slugs when the
   * collection is migrated. Titles in sentence case. No category or date on
   * the cards (owner, 2026-10-19); instead a two-line intro, drafted by
   * Claude from the titles and the site's own copy (no new facts or
   * figures): replace it with each article's own standfirst when migrated.
   */
  articles: [
    {
      title: 'What the exit of Sensorfact taught us about early-stage investing',
      slug: 'what-the-exit-of-sensorfact-taught-us-about-early-stage-investing',
      intro: 'Building, backing and selling an industrial company: the lessons we take into every early-stage investment.',
      image: '',
      visual: 'robot-arm',
    },
    {
      title: 'Why Munich matters for Europe’s next generation of industrial tech',
      slug: 'why-munich-matters-for-europes-next-generation-of-industrial-tech',
      intro: 'Universities, industrial leaders and a growing founder scene: why we look closely at Munich.',
      image: '',
      visual: 'munich-map',
    },
    {
      title: 'Fund III: doubling down on Europe’s industrial technology winners',
      slug: 'fund-iii-doubling-down-on-europes-industrial-technology-winners',
      intro: 'Why our third fund keeps the same discipline: invest early, then back the companies that deliver.',
      image: '[PLACEHOLDER: image]',
    },
  ] as Article[],
  allLink: { label: 'All insights', href: '/insights' } as Cta,
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
