/**
 * Founder emails from the editable templates, and the team's daily overview
 * (owner, 2026-10-26: one email a day instead of one per request).
 */
import { fill, plain, TEMPLATE_KEYS, TEMPLATES, type TemplateKey } from './copy';
import type { Application, Env, Slot } from './env';

export type Template = {
  key: TemplateKey;
  subject: string;
  body: string;
  changed: boolean;
  updated_at: string | null;
  updated_by: string | null;
};

type Row = { key: string; subject: string; body: string; updated_at: string; updated_by: string };

export async function templates(env: Env): Promise<Template[]> {
  const { results } = await env.DB.prepare('SELECT * FROM email_templates').all<Row>();
  const saved = new Map(results.map((r) => [r.key, r]));
  return TEMPLATE_KEYS.map((key) => {
    const r = saved.get(key);
    return r
      ? { key, subject: r.subject, body: r.body, changed: true, updated_at: r.updated_at, updated_by: r.updated_by }
      : { key, subject: TEMPLATES[key].subject, body: TEMPLATES[key].body, changed: false, updated_at: null, updated_by: null };
  });
}

export async function template(env: Env, key: TemplateKey) {
  return (await templates(env)).find((t) => t.key === key)!;
}

export function values(env: Env, a: Pick<Application, 'name' | 'company'>, time: string, cancelLink = '') {
  return {
    name: a.name,
    company: a.company,
    time,
    event: env.EVENT_NAME,
    event_plain: plain(env),
    cancel_link: cancelLink,
    page_link: env.PAGE_URL,
  };
}

/** A founder email, ready to send. */
export async function founderEmail(env: Env, key: TemplateKey, a: Application, slot: Slot, cancelLink = '') {
  const t = await template(env, key);
  const v = values(env, a, slot.label, cancelLink);
  return { subject: fill(t.subject, v), text: fill(t.body, v) };
}

// ---- Daily overview -----------------------------------------------------------

type Listed = Application & { label: string };

/** The overview since `since`, or null when there is nothing to report. */
export async function digest(env: Env, since: string, reviewUrl: string) {
  const all = (
    await env.DB.prepare(
      `SELECT a.*, s.label FROM applications a JOIN slots s ON s.id = a.slot_id ORDER BY s.starts_at`,
    ).all<Listed>()
  ).results;
  const slotCount = (await env.DB.prepare('SELECT COUNT(*) AS n FROM slots').first<{ n: number }>())?.n ?? 0;
  const fresh = all.filter((a) => a.created_at > since);
  const cancelled = all.filter((a) => a.status === 'cancelled' && (a.decided_at ?? '') > since);
  const waiting = all.filter((a) => a.status === 'pending');
  const taken = all.filter((a) => a.status === 'pending' || a.status === 'approved').length;
  if (!fresh.length && !cancelled.length && !waiting.length) return null;

  const line = (a: Listed) => `${a.label}  ${a.company}, ${a.name}${a.role ? ` (${a.role})` : ''}: ${a.building}`;
  const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
  const text = [
    `Today: ${n(fresh.length, 'new request', 'new requests')}, ${n(cancelled.length, 'cancellation', 'cancellations')}.`,
    `Waiting for review: ${waiting.length}. Slots taken: ${taken} of ${slotCount}.`,
    ...(fresh.length ? ['', 'New today (Helsinki time):', ...fresh.map(line)] : []),
    ...(cancelled.length ? ['', 'Cancelled today:', ...cancelled.map((a) => `${a.label}  ${a.company}`)] : []),
    ...(waiting.length ? ['', 'Waiting for review:', ...waiting.map(line)] : []),
    '',
    `Approve or deny: ${reviewUrl}`,
  ].join('\n');
  return {
    subject: `${env.EVENT_NAME}: ${n(fresh.length, 'new request', 'new requests')} today, ${waiting.length} waiting`,
    text,
  };
}
