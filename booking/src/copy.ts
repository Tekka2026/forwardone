/**
 * Every text the service sends or shows, in one place so it can be edited
 * without touching the logic. Times are Helsinki time (the slot labels).
 */
import type { Application, Env, Slot } from './env';

export const copy = {
  errors: {
    invalid: 'Some details are missing or not valid.',
    slot_taken: 'That time was just taken. Please pick another one.',
    already_applied: 'There is already a request with this email address.',
    unknown_slot: 'That time is not available.',
    server: 'Something went wrong on our side. Please try again in a minute.',
  },

  received: (env: Env, a: Application, s: Slot, cancelUrl: string) => ({
    subject: `${env.EVENT_NAME}: your request for ${s.label}`,
    text: [
      `Hi ${a.name},`,
      '',
      `Thank you for applying to ${env.EVENT_NAME} with ${a.company}.`,
      `We have put the ${s.label} slot (Helsinki time) on hold for you while we read your application. You will hear from us by email whether it is confirmed.`,
      '',
      `Can no longer make it? Release the slot here: ${cancelUrl}`,
      '',
      'FORWARD.one',
    ].join('\n'),
  }),

  approved: (env: Env, a: Application, s: Slot) => ({
    subject: `${env.EVENT_NAME}: you pitch at ${s.label}`,
    text: [
      `Hi ${a.name},`,
      '',
      `${a.company} pitches at ${env.EVENT_NAME} at ${s.label} (Helsinki time). The calendar invite is attached.`,
      '',
      'FORWARD.one',
    ].join('\n'),
  }),

  denied: (env: Env, a: Application) => ({
    subject: `${env.EVENT_NAME}: your request`,
    text: [
      `Hi ${a.name},`,
      '',
      `Thank you for applying to ${env.EVENT_NAME} with ${a.company}. We cannot offer you a pitch slot this time, so we have released the time you asked for.`,
      '',
      'FORWARD.one',
    ].join('\n'),
  }),

  expired: (env: Env, a: Application, s: Slot) => ({
    subject: `${env.EVENT_NAME}: your request for ${s.label}`,
    text: [
      `Hi ${a.name},`,
      '',
      `We could not confirm the ${s.label} slot for ${a.company} in time, so the hold has ended. You are welcome to request a time again on ${env.PAGE_URL}`,
      '',
      'FORWARD.one',
    ].join('\n'),
  }),

  newRequest: (env: Env, a: Application, s: Slot, reviewUrl: string) => ({
    subject: `New pitch request: ${a.company} at ${s.label}`,
    text: [
      `${a.company} asks for the ${s.label} slot.`,
      `${a.name}${a.role ? `, ${a.role}` : ''} <${a.email}>`,
      `Building: ${a.building}`,
      a.deck ? `Deck: ${a.deck}` : 'No deck link.',
      '',
      `Approve or deny: ${reviewUrl}`,
    ].join('\n'),
  }),

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
