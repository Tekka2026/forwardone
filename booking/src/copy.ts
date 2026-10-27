/**
 * Texts the service sends or shows. The four founder emails are templates
 * the team can edit on the dashboard (/review/emails, owner 2026-10-26); the
 * defaults below apply until someone saves a change, and "Revert to the
 * default" brings them back. Placeholders in {braces} are filled per email.
 * Times are Helsinki time (the slot labels).
 */
import type { Env } from './env';

export type TemplateKey = 'received' | 'approved' | 'denied' | 'expired';

/** What each placeholder means, shown next to the editor. */
export const VARIABLES: Record<string, string> = {
  first_name: 'Founder’s first name, as they signed the letter',
  name: 'Founder’s full name',
  company: 'Company name',
  time: 'Their slot, e.g. 09:30',
  event: 'Event name with the blank: The _____ Pitch at Slush',
  event_plain: 'Event name without the blank: The Pitch at Slush',
  cancel_link: 'Link that releases their slot',
  page_link: 'Link to the pitch page',
};

export const TEMPLATES: Record<
  TemplateKey,
  { title: string; when: string; vars: string[]; subject: string; body: string; note?: string }
> = {
  received: {
    title: 'Request received',
    when: 'Right after a founder sends the letter',
    vars: ['first_name', 'name', 'company', 'time', 'event', 'event_plain', 'cancel_link', 'page_link'],
    subject: '{event}: your request for {time}',
    body: [
      'Hi {first_name},',
      '',
      'Thank you for applying to The {company} Pitch at Slush.',
      'We have put the {time} slot (Helsinki time) on hold for you while we read your application. You will hear from us by email whether it is confirmed.',
      '',
      'Can no longer make it? Release the slot here: {cancel_link}',
      '',
      'FORWARD.one, Balnord, HCVC',
    ].join('\n'),
  },
  approved: {
    title: 'Approved',
    when: 'When a reviewer approves the request',
    vars: ['first_name', 'name', 'company', 'time', 'event', 'event_plain', 'page_link'],
    note: 'A calendar invite for the slot is attached automatically.',
    subject: '{event}: you pitch at {time}',
    body: [
      'Hi {first_name},',
      '',
      '{company} pitches at {event_plain} at {time} (Helsinki time). The calendar invite is attached.',
      '',
      'FORWARD.one, Balnord, HCVC',
    ].join('\n'),
  },
  denied: {
    title: 'Denied',
    when: 'When a reviewer denies the request',
    vars: ['first_name', 'name', 'company', 'time', 'event', 'event_plain', 'page_link'],
    subject: '{event}: your request',
    body: [
      'Hi {first_name},',
      '',
      'Thank you for applying to {event_plain}. Unfortunately, we aren’t able to offer you a pitch slot, and our schedules at Slush are fully booked, so we won’t be able to meet this time.',
      '',
      'Thanks again for your interest, and best of luck with {company}.',
      '',
      'FORWARD.one, Balnord, HCVC',
    ].join('\n'),
  },
  expired: {
    title: 'Hold ended',
    when: 'When nobody decided within the hold period (only if one is set)',
    vars: ['first_name', 'name', 'company', 'time', 'event', 'event_plain', 'page_link'],
    subject: '{event}: your request for {time}',
    body: [
      'Hi {first_name},',
      '',
      'We could not confirm the {time} slot for {company} in time, so the hold has ended. You are welcome to request a time again on {page_link}',
      '',
      'FORWARD.one, Balnord, HCVC',
    ].join('\n'),
  },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATES) as TemplateKey[];
export const isTemplateKey = (k: string): k is TemplateKey => k in TEMPLATES;

/** Placeholders used in a text that this email does not know. */
export function unknownVars(key: TemplateKey, text: string) {
  return [...new Set([...text.matchAll(/\{([a-z_]+)\}/g)].map((m) => m[1]))].filter((v) => !TEMPLATES[key].vars.includes(v));
}

export function fill(text: string, values: Record<string, string>) {
  return text.replace(/\{([a-z_]+)\}/g, (m, k: string) => (k in values ? values[k] : m));
}

/** The event name without the blank ("The Pitch at Slush"). */
export const plain = (env: Env) => env.EVENT_NAME.replace(/\s*_+\s*/, ' ');

/** Values for a sample email (Send test). */
export const SAMPLE = { first_name: 'Ann', name: 'Ann Example', company: 'Northwind Robotics', time: '09:30' };

export const copy = {
  errors: {
    invalid: 'Some details are missing or not valid.',
    slot_taken: 'That time was just taken. Please pick another one.',
    already_applied: 'There is already a request with this email address.',
    unknown_slot: 'That time is not available.',
    server: 'Something went wrong on our side. Please try again in a minute.',
  },

  login: (env: Env, link: string) => ({
    subject: `${env.EVENT_NAME}: your review link`,
    text: [`Log in to review the pitch requests (the link works for 15 minutes):`, link].join('\n'),
  }),

  pages: {
    cancelled: 'Your request is cancelled and the slot is free again.',
    cancelGone: 'This request is no longer active.',
    loginSent: 'If that address may review, a login link is on its way.',
  },
};
