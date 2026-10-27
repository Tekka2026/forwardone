/**
 * The pitch page's texts that the team edits on the dashboard
 * (/review/page, owner 2026-10-27). The page loads saved versions from
 * GET /copy on every visit. Originals come from the site's
 * src/content/pitch.ts via page-defaults.json (npm run defaults).
 */
import DEFAULTS from './page-defaults.json' with { type: 'json' };

export type PageField = { key: keyof typeof DEFAULTS; label: string; help: string; rows?: number; max: number; link?: boolean };

export const PAGE_FIELDS: { group: string; fields: PageField[] }[] = [
  {
    group: 'Top of the page',
    fields: [
      { key: 'eyebrow_brand', label: 'Eyebrow, in colour', help: 'The coloured first word above the heading.', max: 40 },
      { key: 'eyebrow_rest', label: 'Eyebrow, rest', help: 'Follows the coloured word, in black. Start with a comma or space.', max: 80 },
      { key: 'intro', label: 'Text under the heading', help: 'An empty line starts a new paragraph. “Balnord” links to balnord.vc.', rows: 6, max: 1500 },
    ],
  },
  {
    group: 'Form',
    fields: [
      { key: 'submit', label: 'Button', help: 'The send button under the letter.', max: 40 },
      { key: 'privacy', label: 'Privacy note', help: 'Small text under the button, before the Privacy policy link. It promises that requests are deleted three months after Slush, which the service does on 18 February 2027.', rows: 3, max: 600 },
      { key: 'sent', label: 'Thank-you message', help: 'Shown after a founder sends the letter.', rows: 3, max: 400 },
    ],
  },
  {
    group: 'Event facts',
    fields: [
      { key: 'fact_when', label: 'When', help: 'A new line starts a new line on the page.', rows: 2, max: 200 },
      { key: 'fact_where', label: 'Where', help: 'A new line starts a new line on the page.', rows: 2, max: 200 },
      { key: 'fact_where_link', label: 'Where, map link', help: 'The address on the page links here, e.g. a Google Maps link. Starts with https://.', max: 500, link: true },
      { key: 'fact_apply_by', label: 'Apply by', help: 'A new line starts a new line on the page.', rows: 2, max: 200 },
      { key: 'fact_panel', label: 'The panel', help: 'A new line starts a new line on the page.', rows: 2, max: 200 },
    ],
  },
];

export const PAGE_DEFAULTS: Record<string, string> = DEFAULTS;
export const PAGE_KEYS = PAGE_FIELDS.flatMap((g) => g.fields.map((f) => f.key as string));
export const pageField = (k: string) => PAGE_FIELDS.flatMap((g) => g.fields).find((f) => f.key === k);
