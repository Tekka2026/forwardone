/**
 * Email through Resend's HTTP API (https://resend.com/docs/api-reference).
 * Without MAIL_FROM or RESEND_API_KEY the message is logged instead, so the
 * service runs before email is set up.
 */
import type { Env } from './env';

export interface Mail {
  to: string | string[];
  subject: string;
  text: string;
  attachments?: { filename: string; content: string; content_type?: string }[];
}

export async function send(env: Env, mail: Mail) {
  if (!env.MAIL_FROM || !env.RESEND_API_KEY) {
    console.log('mail (not sent, email not configured)', JSON.stringify({ to: mail.to, subject: mail.subject, text: mail.text }));
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, ...mail }),
  });
  if (!res.ok) console.error('mail failed', res.status, await res.text());
}

/** A one-event calendar file for an approved slot (times in UTC). */
export function ics(env: Env, uid: string, start: string, end: string, title: string) {
  const t = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FORWARD.one//The Pitch//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}@pitch.forward.one`,
    `DTSTAMP:${t(new Date().toISOString())}`,
    `DTSTART:${t(start)}`,
    `DTEND:${t(end)}`,
    `SUMMARY:${esc(title)}`,
    env.EVENT_LOCATION ? `LOCATION:${esc(env.EVENT_LOCATION)}` : '',
    `URL:${env.PAGE_URL}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return btoa(unescape(encodeURIComponent(lines.join('\r\n') + '\r\n')));
}
