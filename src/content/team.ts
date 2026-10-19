/**
 * Team profiles (owner, 2026-10-19): a rich profile page per FORWARD.one team
 * member at /about/team/:slug, laid out after the team pages of Index
 * Ventures (e.g. indexventures.com/team/julia-andre): portrait, name, role and
 * location, a short intro, key facts and contact links, then the full bio,
 * background, the companies they work with, their clips from the founders
 * strip and their insights.
 *
 * The avatar on a clip in the founders strip links here (`founders.clips[*]
 * .profile`). Only the photo of the first profile is known (the owner's
 * avatar for the placeholder clip); everything else is a visible placeholder
 * until supplied (PLACEHOLDERS.md, A0014). Never invent a bio, a role, a date
 * or a deal.
 */

export type TeamMember = {
  /** URL part: /about/team/<slug>. Use the person's name once known. */
  slug: string;
  name: string;
  role: string;
  location: string;
  /** Portrait, path under public/ (at least 1200 × 1500), or a placeholder. */
  photo: string;
  /** One line under the name. */
  intro: string;
  /** Full bio, one string per paragraph. */
  bio: string[];
  /** Key facts in the hero: label and value. */
  facts: { label: string; value: string }[];
  /** Contact and social links. */
  links: { label: string; href: string }[];
  /** Career and education, most recent first. */
  background: { period: string; title: string; detail: string }[];
  /** Portfolio companies they work with (names as on the founders strip). */
  companies: string[];
  /** Index into `founders.clips` of the clips they present. */
  clips: number[];
  /** Their articles: title and link. */
  insights: { title: string; href: string }[];
};

const PH = (what: string) => `[PLACEHOLDER: ${what}]`;

export const teamLabels = {
  back: 'Team',
  about: 'About',
  background: 'Background',
  companies: 'Works with',
  clips: 'On the road',
  insights: 'Insights',
  contact: 'Get in touch',
};

export const team: TeamMember[] = [
  {
    slug: 'presenter',
    name: PH('name'),
    role: PH('role, e.g. Partner'),
    location: PH('city'),
    photo: '/team/presenter.jpg',
    intro: PH('one line on what they do at FORWARD.one'),
    bio: [PH('bio, first paragraph'), PH('bio, second paragraph'), PH('bio, third paragraph')],
    facts: [
      { label: 'Based in', value: PH('city') },
      { label: 'Focus', value: PH('sectors, e.g. robotics, energy') },
      { label: 'Joined', value: PH('year') },
    ],
    links: [
      { label: 'LinkedIn', href: PH('LinkedIn URL') },
      { label: 'Email', href: PH('email address') },
    ],
    background: [
      { period: PH('years'), title: PH('role, organisation'), detail: PH('one line') },
      { period: PH('years'), title: PH('role, organisation'), detail: PH('one line') },
      { period: PH('years'), title: PH('degree, university'), detail: PH('one line') },
    ],
    companies: [PH('portfolio company'), PH('portfolio company'), PH('portfolio company')],
    clips: [0],
    insights: [{ title: PH('article title'), href: '' }],
  },
];

export const teamBySlug = (slug: string) => team.find((m) => m.slug === slug);
