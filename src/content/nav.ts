/**
 * Site structure, navigation, utility links and footer.
 * Everything the header and footer render comes from here.
 */

export type NavChild = {
  label: string;
  href: string;
  /** External links open in a new tab and get the ↗ marker. */
  external?: boolean;
};

export type NavSection = {
  label: string;
  href: string;
  children: NavChild[];
};

/**
 * Placeholder for the LP portal URL. Replace with the real login URL.
 * Listed in PLACEHOLDERS.md.
 */
export const LP_LOGIN_URL = 'https://example.com/LP_LOGIN_URL';

/** Primary menu, left → right. Children render as dropdown / accordion. */
export const primaryNav: NavSection[] = [
  {
    label: 'Strategy',
    href: '/strategy',
    children: [
      { label: 'Investment focus', href: '/strategy/focus' },
      { label: 'The Playbook', href: '/strategy/playbook' },
      { label: 'Fund III', href: '/strategy/fund-iii' },
    ],
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    children: [
      { label: 'All companies', href: '/portfolio' },
      { label: 'Case studies', href: '/portfolio/case-studies' },
      { label: 'Exits', href: '/portfolio/exits' },
    ],
  },
  {
    label: 'Investors',
    href: '/investors',
    children: [
      { label: 'Why FORWARD.one', href: '/investors' },
      { label: 'Funds & track record', href: '/investors/funds' },
      { label: 'Responsible investing (SFDR)', href: '/investors/sfdr' },
      { label: 'Reporting & LP login', href: LP_LOGIN_URL, external: true },
      { label: 'Contact IR', href: '/investors/contact' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
    children: [
      { label: 'The Playbook articles', href: '/insights/playbook' },
      { label: 'News', href: '/insights/news' },
      { label: 'Media kit', href: '/insights/media-kit' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Manifesto', href: '/about' },
      { label: 'Team', href: '/about/team' },
      { label: 'Venture partners', href: '/about/venture-partners' },
      { label: 'Careers', href: '/about/careers' },
    ],
  },
];

/**
 * Greeting typed into the navigation bar (typewriter effect).
 * `first` shows while the menu is closed. Pressing the bar opens the menu:
 * the AI mark appears and `second` is typed, then the grey placeholder.
 */
export const navGreeting = {
  first: 'Welcome to FORWARD.one',
  second: 'How can I help you?',
  /** Click-to-type prompt in the bar. No backend yet (see PLACEHOLDERS.md). */
  ask: {
    label: 'Ask FORWARD.one a question',
    /** Grey "Type your question" step after the question. Off for now. */
    placeholderEnabled: false,
    placeholder: 'Type your question',
    /** How long `second` stays before it erases into the placeholder. */
    placeholderAfterMs: 2000,
    /** Shown after submit until an assistant endpoint exists. */
    notConnected: 'Thanks. The assistant is not connected yet.',
    handler: '[PLACEHOLDER: assistant handler]',
  },
};

/** Utility links, shown inside the navigation panel. */
export const utilityNav = {
  lpLogin: { label: 'LP Login', href: LP_LOGIN_URL, external: true },
  pitch: { label: 'Pitch us', href: '/founders' },
};

export const footer = {
  /** Same sections and children as the primary menu. */
  columns: primaryNav,
  contact: {
    heading: 'Contact',
    lines: [
      { label: 'General', value: 'info@forward.one', href: 'mailto:info@forward.one' },
      { label: 'Investor relations', value: 'ir@forward.one', href: 'mailto:ir@forward.one' },
      { label: 'Media', value: 'media@forward.one', href: 'mailto:media@forward.one' },
    ],
    address: ['Dorpsstraat 28', '1182 JD Amstelveen', 'the Netherlands'],
  },
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'SFDR', href: '/investors/sfdr' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
  /**
   * Partner logos from the current site. Files are not in this repo yet:
   * drop them in public/partners/ and set `src`. Listed in PLACEHOLDERS.md.
   */
  partners: [
    { name: 'Invest Europe', src: '[PLACEHOLDER: /partners/invest-europe.svg]' },
    { name: 'European Union', src: '[PLACEHOLDER: /partners/eu.svg]' },
    { name: 'European Investment Fund', src: '[PLACEHOLDER: /partners/eif.svg]' },
  ],
  tagline: 'Performance-engineered venture capital.',
  company: 'FORWARD.one',
};

export const site = {
  name: 'FORWARD.one',
  description:
    'Early-stage venture capital for Europe’s industrial technology. Amsterdam.',
  skipLinkLabel: 'Skip to content',
};
