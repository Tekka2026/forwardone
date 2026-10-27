/**
 * Keeping /apply for people (owner, 2026-10-27, CTO check):
 * - a limit per sender: at most RATE_MAX letters per hour from one IP
 *   address (stored only as a keyed hash, kept for a day);
 * - Cloudflare Turnstile, an invisible bot check, once TURNSTILE_SITE_KEY
 *   and TURNSTILE_SECRET are both set (until then the page shows no check
 *   and the service asks for none).
 * And the data's end date: on DELETE_AFTER every request is deleted.
 */
import type { Env } from './env';

export const RATE_MAX = 5;
const HOUR = 3600000;

async function senderKey(env: Env, req: Request) {
  const ip = req.headers.get('CF-Connecting-IP') ?? '';
  const data = new TextEncoder().encode(`${env.SESSION_SECRET ?? ''}|${ip}`);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  return [...hash.slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Counts this letter; true when the sender is over the limit. */
export async function tooMany(env: Env, req: Request) {
  const key = await senderKey(env, req);
  const since = new Date(Date.now() - HOUR).toISOString();
  const n = (await env.DB.prepare('SELECT COUNT(*) AS n FROM attempts WHERE key = ? AND at > ?').bind(key, since).first<{ n: number }>())?.n ?? 0;
  if (n >= RATE_MAX) return true;
  await env.DB.prepare('INSERT INTO attempts (key, at) VALUES (?, ?)').bind(key, new Date().toISOString()).run();
  return false;
}

export const turnstileOn = (env: Env) => Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET);

export async function human(env: Env, req: Request, token: unknown) {
  if (!turnstileOn(env)) return true;
  if (typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET!);
  form.append('response', token);
  const ip = req.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch (e) {
    // Cloudflare's check itself unreachable: let the letter through rather
    // than lose a founder (the per-sender limit still applies).
    console.error('turnstile unreachable', e);
    return true;
  }
}

/** Hourly: drop old attempt counts; after DELETE_AFTER, every request. */
export async function tidy(env: Env) {
  await env.DB.prepare('DELETE FROM attempts WHERE at < ?').bind(new Date(Date.now() - 24 * HOUR).toISOString()).run();
  if (env.DELETE_AFTER && new Date().toISOString().slice(0, 10) >= env.DELETE_AFTER) {
    const r = await env.DB.prepare('DELETE FROM applications').run();
    if (r.meta.changes) console.log(`deleted ${r.meta.changes} requests (DELETE_AFTER ${env.DELETE_AFTER})`);
  }
}
