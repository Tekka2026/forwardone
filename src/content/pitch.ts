/**
 * "The ____ Pitch" (owner, 2026-10-21): landing page for a live pitch event
 * FORWARD.one runs at Slush in Helsinki. Founders pitch to FORWARD.one and a
 * second VC; the winner gets a term sheet. Page: src/pages/the-pitch.astro.
 *
 * The H1 has a blank line; the first field of the form (company name) is
 * written onto it in handwriting as the visitor types. The form is a
 * fill-in-the-blanks letter: `letter` alternates copy and fields.
 *
 * Unknowns (date, venue, deadline, the second VC, where applications go, the
 * privacy note) are visible placeholders, listed in PLACEHOLDERS.md.
 */

const PH = (what: string) => `[PLACEHOLDER: ${what}]`;

export type PitchField = {
  name: string;
  /** Accessible label (visually hidden; the hint shows in the empty field). */
  label: string;
  /** Hint inside the empty blank. */
  hint: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  autocomplete?: string;
  required?: boolean;
};

/** A run of copy, a field, or a placeholder rendered as a marker. */
export type LetterPart = string | { field: PitchField } | { placeholder: string };

export const pitch = {
  meta: {
    title: 'The Pitch at Slush | FORWARD.one',
    description: 'Pitch your company live to FORWARD.one and a second VC at Slush in Helsinki. The winner gets a term sheet.',
  },
  eyebrow: 'FORWARD.one at Slush, Helsinki',
  /** H1, either side of the blank line. */
  title: { before: 'The', after: 'Pitch' },
  /** The fill-in letter. The first field is the company name: it is written on the H1's line. */
  letter: [
    'Dear FORWARD.one, we are',
    { field: { name: 'company', label: 'Company name', hint: 'company name', autocomplete: 'organization', required: true } },
    '. I’m',
    { field: { name: 'name', label: 'Your full name', hint: 'your name', autocomplete: 'name', required: true } },
    ', our',
    { field: { name: 'role', label: 'Your role', hint: 'role', autocomplete: 'organization-title' } },
    '. You’ll find us at',
    { field: { name: 'street', label: 'Street and number', hint: 'street and number', autocomplete: 'street-address', required: true } },
    ',',
    { field: { name: 'postcode', label: 'Postcode', hint: 'postcode', autocomplete: 'postal-code', required: true } },
    { field: { name: 'city', label: 'City', hint: 'city', autocomplete: 'address-level2', required: true } },
    ',',
    { field: { name: 'country', label: 'Country', hint: 'country', autocomplete: 'country-name', required: true } },
    '. Reach me at',
    { field: { name: 'email', label: 'Email address', hint: 'email', type: 'email', autocomplete: 'email', required: true } },
    'or',
    { field: { name: 'phone', label: 'Phone number', hint: 'phone', type: 'tel', autocomplete: 'tel' } },
    '. In one line, we are building',
    { field: { name: 'building', label: 'What you are building, in one line', hint: 'what you are building', required: true } },
    '. Our deck is at',
    { field: { name: 'deck', label: 'Link to your pitch deck (optional)', hint: 'link (optional)', type: 'url' } },
    '. We’d like to pitch live to FORWARD.one and',
    { placeholder: PH('second VC') },
    'at Slush, for the term sheet that goes to the winner.',
  ] as LetterPart[],
  submit: 'Send our pitch',
  /** Where the form posts (a form service or CRM endpoint). Until set, submitting shows `notSent`. */
  action: PH('form endpoint'),
  notSent: 'Applications are not sent yet: the form endpoint still has to be connected.',
  sent: 'Thank you. We read every application and will be in touch.',
  privacy: PH('privacy note: what happens with the details, with a link to the privacy policy'),
  /** Event facts under the form. */
  facts: [
    { label: 'When', value: PH('date and time at Slush') },
    { label: 'Where', value: PH('stage or venue at Slush, Helsinki') },
    { label: 'Apply by', value: PH('deadline') },
    { label: 'The panel', value: `FORWARD.one and ${PH('second VC')}` },
  ],
};
