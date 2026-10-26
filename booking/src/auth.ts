/**
 * Reviewer login without passwords: a reviewer asks for a link, the link
 * carries a short-lived signed token, and following it sets a signed
 * session cookie. Tokens are HMAC-SHA256 over a small JSON payload, keyed
 * with SESSION_SECRET.
 */
import { reviewers, type Env } from './env';

const enc = new TextEncoder();
const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function key(env: Env) {
  if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET is not set');
  return crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

type Payload = { email: string; kind: 'login' | 'session'; exp: number };

export async function sign(env: Env, p: Payload) {
  const body = b64url(enc.encode(JSON.stringify(p)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await key(env), enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

export async function verify(env: Env, token: string, kind: Payload['kind']): Promise<string | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await key(env), unb64url(sig), enc.encode(body));
    if (!ok) return null;
    const p = JSON.parse(new TextDecoder().decode(unb64url(body))) as Payload;
    if (p.kind !== kind || p.exp < Date.now()) return null;
    // Still on the list (a removed reviewer loses access at once).
    return reviewers(env).includes(p.email) ? p.email : null;
  } catch {
    return null;
  }
}

export const LOGIN_MS = 15 * 60 * 1000;
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE = 'pitch_review';

export async function sessionCookie(env: Env, email: string) {
  const t = await sign(env, { email, kind: 'session', exp: Date.now() + SESSION_MS });
  return `${COOKIE}=${t}; Path=/review; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MS / 1000}`;
}

export function sessionToken(req: Request) {
  const m = (req.headers.get('Cookie') ?? '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

export async function currentReviewer(env: Env, req: Request) {
  const t = sessionToken(req);
  return t ? verify(env, t, 'session') : null;
}

export const logoutCookie = `${COOKIE}=; Path=/review; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
