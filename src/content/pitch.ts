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
 * privacy note) are visible placeholders, listed in PLACEHOLDERS.md.
 */

const PH = (what: string) => `[PLACEHOLDER: ${what}]`;

export type PitchField = {
  name: string;
  /** Accessible label (visually hidden; the hint shows in the empty field). */
  label: string;
  /** Hint inside the empty blank. */
  hint: string;
  /** `slot`: a choice of the free pitch times (from the booking service). */
  type?: 'text' | 'email' | 'tel' | 'url' | 'slot';
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
  /** Logos next to FORWARD.one in the header: a joint effort (owner,
   * 2026-10-26). `logo` names the SVG in src/assets/brand/. */
  hosts: [
    { name: 'Balnord', href: 'https://www.balnord.vc/', logo: 'balnord' },
    { name: 'HCVC', logo: 'hcvc' },
  ],
  /** The fill-in letter, one sentence per step. Only the first step shows at
   * first; each next step appears once the first required field of the step
   * before is filled (owner, 2026-10-21). The first field is the company
   * name: it is written on the H1's line. The button comes with the last step. */
  steps: [
    ['Hi investors, we are', { field: { name: 'company', label: 'Company name', hint: 'company name', autocomplete: 'organization', required: true } }, '.'],
    [
      'I’m',
      { field: { name: 'name', label: 'Your full name', hint: 'your name', autocomplete: 'name', required: true } },
      ', our',
      { field: { name: 'role', label: 'Your role', hint: 'role', autocomplete: 'organization-title' } },
      '.',
    ],
    [
      'Reach me at',
      { field: { name: 'email', label: 'Email address', hint: 'email', type: 'email', autocomplete: 'email', required: true } },
      'or',
      { field: { name: 'phone', label: 'Phone number', hint: 'phone', type: 'tel', autocomplete: 'tel' } },
      '.',
    ],
    ['In one line, we are building', { field: { name: 'building', label: 'What you are building, in one line', hint: 'what you are building', required: true } }, '.'],
    ['We’d like to pitch at', { field: { name: 'slot', label: 'Pitch time, Helsinki time', hint: 'time', type: 'slot', required: true } }, ', Helsinki time.'],
    [
      'Our deck is at',
      { field: { name: 'deck', label: 'Link to your pitch deck (optional)', hint: 'link (optional)', type: 'url' } },
      '. We’d like to pitch live to FORWARD.one, Balnord and HCVC at Slush, for the term sheet that goes to the winner.',
    ],
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
  privacy: PH('privacy note: what happens with the details, with a link to the privacy policy'),
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
