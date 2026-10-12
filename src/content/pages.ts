/**
 * Stub pages: every route from the site structure other than the homepage.
 * Each has a heading, a one-line intro and TODO content blocks.
 * No copy is invented here; the TODOs say what the page needs.
 */

export type StubPage = {
  /** Route without base path, no trailing slash. */
  path: string;
  /** Section name shown as the eyebrow. */
  section: string;
  title: string;
  intro: string;
  todos: string[];
};

export const stubPages: StubPage[] = [
  // Strategy
  {
    path: '/strategy',
    section: 'Strategy',
    title: 'Strategy',
    intro: 'How FORWARD.one invests: stage, sectors, geography and the discipline behind follow-on capital.',
    todos: ['Strategy overview copy', 'Links to Investment focus, The Playbook and Fund III'],
  },
  {
    path: '/strategy/focus',
    section: 'Strategy',
    title: 'Investment focus',
    intro: 'Stage, ticket sizes, sectors and regions.',
    todos: ['Stage and ticket size detail', 'Sector descriptions', 'Geography', 'What we do not invest in'],
  },
  {
    path: '/strategy/playbook',
    section: 'Strategy',
    title: 'The Playbook',
    intro: 'How we co-engineer commercial success with portfolio companies.',
    todos: ['Playbook method: pricing, repeatable sales, first customers, partnerships', 'Follow-on decision criteria', 'Examples from the portfolio'],
  },
  {
    path: '/strategy/fund-iii',
    section: 'Strategy',
    title: 'Fund III',
    intro: 'The current fund: size, investors and status.',
    todos: ['Fund III terms and status', 'Anchor investors', 'Investor relations contact'],
  },

  // Portfolio
  {
    path: '/portfolio',
    section: 'Portfolio',
    title: 'All companies',
    intro: 'Every company FORWARD.one has backed.',
    todos: ['Company grid from the portfolio collection', 'Filters: fund, sector, status'],
  },
  {
    path: '/portfolio/case-studies',
    section: 'Portfolio',
    title: 'Case studies',
    intro: 'What happened after we invested.',
    todos: ['Case study list', 'Per-company outcome and metric'],
  },
  {
    path: '/portfolio/exits',
    section: 'Portfolio',
    title: 'Exits',
    intro: 'Companies acquired by strategic buyers.',
    todos: ['Exit list with acquirer and year'],
  },

  // Investors
  {
    path: '/investors',
    section: 'Investors',
    title: 'Why FORWARD.one',
    intro: 'The case for investing in Europe’s industrial technology through FORWARD.one.',
    todos: ['Investment thesis for LPs', 'Performance summary', 'Team and governance', 'Contact investor relations'],
  },
  {
    path: '/investors/funds',
    section: 'Investors',
    title: 'Funds & track record',
    intro: 'Fund I, Fund II and Fund III: size, vintage and performance.',
    todos: ['Fund table: vintage, size, status', 'Performance figures with benchmark source', 'Past performance disclaimer'],
  },
  {
    path: '/investors/sfdr',
    section: 'Investors',
    title: 'Responsible investing (SFDR)',
    intro: 'Sustainability-related disclosures under the EU Sustainable Finance Disclosure Regulation.',
    todos: ['SFDR disclosures (migrate from current /sfdr page)', 'Policy documents'],
  },
  {
    path: '/investors/contact',
    section: 'Investors',
    title: 'Contact investor relations',
    intro: 'For fund information, reporting and new investor enquiries.',
    todos: ['IR contact details (ir@forward.one)', 'Contact form or mailto'],
  },

  // Insights
  {
    path: '/insights',
    section: 'Insights',
    title: 'Insights',
    intro: 'Articles, news and resources from FORWARD.one.',
    todos: ['Featured articles', 'Links to The Playbook articles, News and Media kit'],
  },
  {
    path: '/insights/playbook',
    section: 'Insights',
    title: 'The Playbook articles',
    intro: 'Articles on commercializing industrial technology.',
    todos: ['Article list filtered to the Playbook category'],
  },
  {
    path: '/insights/news',
    section: 'Insights',
    title: 'News',
    intro: 'Announcements from FORWARD.one and the portfolio.',
    todos: ['News list from the existing news collection', 'Pagination'],
  },
  {
    path: '/insights/media-kit',
    section: 'Insights',
    title: 'Media kit',
    intro: 'Logos, boilerplate and press contact.',
    todos: ['Migrate content from current /media-kit', 'Downloadable assets', 'Press contact (media@forward.one)'],
  },

  // About
  {
    path: '/about',
    section: 'About',
    title: 'Manifesto',
    intro: 'What FORWARD.one stands for.',
    todos: ['Manifesto copy', 'Links to Team, Venture partners and Careers'],
  },
  {
    path: '/about/team',
    section: 'About',
    title: 'Team',
    intro: 'The people behind FORWARD.one.',
    todos: ['Team grid with photos, roles and bios'],
  },
  {
    path: '/about/venture-partners',
    section: 'About',
    title: 'Venture partners',
    intro: 'Operators and specialists who work with the portfolio.',
    todos: ['Venture partner list'],
  },
  {
    path: '/about/careers',
    section: 'About',
    title: 'Careers',
    intro: 'Open roles at FORWARD.one and in the portfolio.',
    todos: ['Open roles', 'Application contact'],
  },

  // Founders
  {
    path: '/founders',
    section: 'Founders',
    title: 'Pitch us',
    intro: 'Building industrial technology in Europe? Send us your deck.',
    todos: ['Pitch form or mailto link: [PLACEHOLDER: pitch email or form URL]', 'What we look for', 'What happens after you pitch'],
  },

  // Legal (footer)
  {
    path: '/privacy',
    section: 'Legal',
    title: 'Privacy',
    intro: 'How FORWARD.one handles personal data.',
    todos: ['Privacy policy (migrate from current site)'],
  },
  {
    path: '/disclaimer',
    section: 'Legal',
    title: 'Disclaimer',
    intro: 'Terms that apply to the use of this website.',
    todos: ['Disclaimer text (to be supplied by compliance)'],
  },
];
