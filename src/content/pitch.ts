/**
 * "The ____ Pitch" (owner, 2026-10-21): landing page for a live pitch event
 * FORWARD.one runs at Slush in Helsinki. Founders pitch to FORWARD.one and a
 * second VC, Balnord (balnord.vc); the winner gets a term sheet. Page: src/pages/the-pitch.astro.
 *
 * The H1 has a blank line; the first field of the form (company name) is
 * written onto it in handwriting as the visitor types. The form is a
 * fill-in-the-blanks letter: `letter` alternates copy and fields.
 *
 * One field is the pitch time: a choice of the free slots, loaded from the
 * booking service (booking/, owner 2026-10-26). Sending the letter holds the
 * slot until FORWARD.one approves or denies the request.
 *
 * Unknowns (date, venue, deadline, the booking service's address, the
 * ) are visible placeholders, listed in PLACEHOLDERS.md.
 */

const PH = (what: string) => `[PLACEHOLDER: ${what}]`;

export type PitchField = {
  name: string;
  /** Accessible label (visually hidden; the hint shows in the empty field). */
  label: string;
  /** Hint inside the empty blank. */
  hint: string;
  /** `slot`: a choice of the free pitch times (from the booking service).
   * `long`: a blank for a sentence or two, on its own line below the copy
   * before it, growing with the text. `link`: a web address; "https://" is
   * added when left out. */
  type?: 'text' | 'email' | 'tel' | 'link' | 'slot' | 'long';
  /** On its own line under its question, full width (owner, 2026-10-27:
   * the three questions in the middle share one shape). `long` always is. */
  block?: boolean;
  maxlength?: number;
  autocomplete?: string;
  required?: boolean;
};

/** A run of copy, a field, or a placeholder rendered as a marker. */
export type LetterPart = string | { field: PitchField } | { placeholder: string };

export const pitch = {
  meta: {
    title: 'The Pitch at Slush | FORWARD.one',
    description: 'Pitch your company live to FORWARD.one, Balnord and HCVC at Slush in Helsinki. The winner gets a term sheet.',
  },
  /** Eyebrow: `brand` in the handwriting's gradient (Slush's colours),
   * `rest` in plain ink (owner, 2026-10-26). */
  eyebrow: { brand: 'Slush', rest: ', Helsinki' },
  /** H1, either side of the blank line. */
  title: { before: 'The', after: 'Pitch' },
  /** What the event is, under the H1: one paragraph per entry; Balnord is
   * linked where it is named (owner's wording, 2026-10-27). */
  intro: [
    '20 minutes, three deeptech investors, no slides. Tell us who you are and how big your ambitions are. If we have conviction, you could leave with a term sheet.',
  ],
  /** The second VC on the panel. */
  partner: { name: 'Balnord', href: 'https://www.balnord.vc/' },
  /** Links in the footer, after the copyright line (owner, 2026-10-27). */
  footerLinks: [{ label: 'Privacy', href: 'https://www.forward.one/privacy-policy' }],
  /** Logos next to FORWARD.one in the header: a joint effort (owner,
   * 2026-10-26). `logo` names the SVG in src/assets/brand/. */
  hosts: [
    { name: 'Balnord', href: 'https://www.balnord.vc/', logo: 'balnord' },
    { name: 'HCVC', logo: 'hcvc' },
  ],
  /** The fill-in letter (owner's wording, 2026-10-27), one step per sentence
   * or line. Only the first step shows at first; each next step appears once
   * every required blank of the step before is filled (owner, 2026-10-21).
   * A step whose copy starts with \n\n starts a paragraph (an even gap
   * above it); a step after a block answer starts on its own line; any
   * other \n is a line break. The first field is the company name: it is written on the
   * H1's line. The sign-off name is filled in from the full name when its
   * step opens, and can be changed. The button comes with the last step. */
  steps: [
    ['Hi investors,'],
    [
      '\n\nWe’re',
      { field: { name: 'company', label: 'Company name', hint: 'company name', autocomplete: 'organization', required: true, maxlength: 120 } },
      'and we’re building',
      { field: { name: 'building', label: 'What you’re building, in one line', hint: 'what you’re building, in one line', required: true, maxlength: 280 } },
      '.',
    ],
    [
      'I’m',
      { field: { name: 'name', label: 'Your full name', hint: 'full name', autocomplete: 'name', required: true, maxlength: 120 } },
      ',',
      { field: { name: 'role', label: 'Your role', hint: 'role', autocomplete: 'organization-title', required: true, maxlength: 120 } },
      '.',
    ],
    ['\n\nMy LinkedIn:', { field: { name: 'linkedin', label: 'Your LinkedIn profile (link or name)', hint: 'link', type: 'link', block: true, autocomplete: 'url', required: true, maxlength: 300 } }],
    ['What my LinkedIn doesn’t tell you:', { field: { name: 'surprise', label: 'What your LinkedIn doesn’t tell us', hint: 'something we wouldn’t guess', type: 'long', required: true, maxlength: 400 } }],
    ['Why we belong in that room:', { field: { name: 'why', label: 'Why you belong in that room', hint: 'one or two sentences', type: 'long', required: true, maxlength: 800 } }],
    [
      '\n\nI’d like to grab the',
      { field: { name: 'slot', label: 'Pitch time, Helsinki time', hint: 'pitch time', type: 'slot', required: true } },
      'slot, Helsinki time. Find me at',
      { field: { name: 'email', label: 'Email address', hint: 'email', type: 'email', autocomplete: 'email', required: true, maxlength: 200 } },
      'or',
      { field: { name: 'phone', label: 'Phone number (optional)', hint: 'phone', type: 'tel', autocomplete: 'tel', maxlength: 40 } },
      '.',
    ],
    ['\n\nSee you at Slush,\n', { field: { name: 'first_name', label: 'Your first name', hint: 'first name', autocomplete: 'given-name', required: true, maxlength: 60 } }],
  ] as LetterPart[][],
  submit: 'Send pitch',
  /** The booking service (booking/, a Cloudflare Worker): `/slots` lists the
   * times, `/apply` takes the letter. Until set, the time blank stays empty
   * and submitting shows `notSent`. */
  bookingApi: 'https://forwardone-pitch-booking.jeroen-191.workers.dev',
  notSent: 'Requests are not sent yet: the booking service still has to be connected.',
  sending: 'Sending…',
  sent: 'Thank you. Your time is on hold while we read your application. We’ll email you whether it is confirmed.',
  noSlots: 'All times are taken at the moment.',
  slotsFailed: 'The pitch times could not be loaded. Please try again in a minute.',
  failed: 'Your request could not be sent. Please try again in a minute.',
  /** Small note under the button. Empty: no note (owner, 2026-10-27, the
   * placeholder removed); it can be added on the dashboard (Page text). */
  privacy: '',
  /** Event facts under the form. A \n in a value starts a new line.
   * Texts marked editable can be changed on the booking dashboard
   * (/review/page, owner 2026-10-27): the page loads the saved versions on
   * every visit (booking/src/pagecopy.ts lists them). These values are the
   * originals, shown until a change is saved and whenever the service is
   * unreachable. */
  facts: [
    { key: 'fact_when', label: 'When', value: '18 November\n08:00–16:00 Helsinki time' },
    { key: 'fact_where', label: 'Where', value: PH('stage or venue at Slush, Helsinki') },
    { key: 'fact_apply_by', label: 'Apply by', value: PH('deadline') },
    { key: 'fact_panel', label: 'The panel', value: 'FORWARD.one, Balnord and HCVC' },
  ],
};
