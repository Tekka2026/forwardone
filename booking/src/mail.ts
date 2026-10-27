/**
 * Email through Resend's HTTP API (https://resend.com/docs/api-reference).
 * Without MAIL_FROM or RESEND_API_KEY the message is logged instead, so the
 * service runs before email is set up.
 */
import { reviewers, type Env } from './env';

export interface Mail {
  to: string | string[];
  subject: string;
  text: string;
  attachments?: { filename: string; content: string; content_type?: string }[];
}

/** Tells the reviewers that an email did not reach someone (CTO check,
 * 2026-10-27: failures used to go only to the Worker log). Never about the
 * reviewers' own mail, so a broken sender cannot loop. */
export async function warn(env: Env, to: string | string[], subject: string, why: string) {
  const team = reviewers(env);
  const list = (Array.isArray(to) ? to : [to]).map((s) => s.toLowerCase());
  if (!team.length || list.every((a) => team.includes(a))) return;
  await send(env, {
    to: team,
    subject: `Email not delivered: ${subject}`,
    text: [`An email from the pitch booking service did not reach ${list.join(', ')}.`, '', `Subject: ${subject}`, `Reason: ${why}`, '', 'Please contact them another way.'].join('\n'),
  });
}

export async function send(env: Env, mail: Mail) {
  if (!env.MAIL_FROM || !env.RESEND_API_KEY) {
    console.log('mail (not sent, email not configured)', JSON.stringify({ to: mail.to, subject: mail.subject, text: mail.text }));
    return;
  }
  let why = '';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM, ...mail }),
    });
    if (!res.ok) why = `Resend answered ${res.status}: ${(await res.text()).slice(0, 300)}`;
  } catch (e) {
    why = `Resend could not be reached: ${String((e as Error).message)}`;
  }
  if (!why) return;
  console.error('mail failed', why);
  await warn(env, mail.to, mail.subject, why);
}

/**
 * Resend's webhook (Resend > Webhooks, events email.bounced and
 * email.complained) at POST /resend-events, signed the Svix way with
 * RESEND_WEBHOOK_SECRET ("whsec_…"). A bounce reaches the reviewers at once.
 */
export async function resendEvent(env: Env, req: Request) {
  if (!env.RESEND_WEBHOOK_SECRET) return new Response('Not configured', { status: 404 });
  const id = req.headers.get('svix-id') ?? '';
  const ts = req.headers.get('svix-timestamp') ?? '';
  const sigs = (req.headers.get('svix-signature') ?? '').split(' ').map((s) => s.split(',')[1]).filter(Boolean);
  const body = await req.text();
  if (!id || !ts || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return new Response('Bad request', { status: 400 });
  const secret = Uint8Array.from(atob(env.RESEND_WEBHOOK_SECRET.replace(/^whsec_/, '')), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${ts}.${body}`)));
  const expected = btoa(String.fromCharCode(...mac));
  if (!sigs.includes(expected)) return new Response('Bad signature', { status: 401 });

  const e = JSON.parse(body) as { type?: string; data?: { to?: string[]; subject?: string; bounce?: { message?: string } } };
  const d = e.data ?? {};
  if (e.type === 'email.bounced') await warn(env, d.to ?? [], d.subject ?? '(no subject)', `bounced. ${d.bounce?.message ?? ''}`.trim());
  if (e.type === 'email.complained') await warn(env, d.to ?? [], d.subject ?? '(no subject)', 'marked as spam by the recipient');
  return new Response('ok');
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
