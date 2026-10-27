/**
 * Booking service for The Pitch at Slush (owner, 2026-10-26).
 *
 * Founders pick a time slot in the letter on /the-pitch; sending the letter
 * holds the slot as a pending request. A reviewer approves or denies it on
 * /review; denying (or the founder cancelling, or the hold expiring when
 * HOLD_DAYS is set) frees the slot again. One live request per slot and per
 * email address is enforced by the database (migrations/0001_init.sql).
 *
 *   GET  /slots            free and taken slots (public, CORS)
 *   POST /apply            JSON application (public, CORS)
 *   GET  /cancel?t=…       founder's cancel page (link from the email)
 *   POST /cancel           releases the slot
 *   GET  /review           reviewer page (login by email link)
 *   POST /review/login     sends a login link to a listed reviewer
 *   GET  /review/auth?t=…  sets the session
 *   POST /review/decide    approve / deny a pending request
 *   GET  /review/emails    the founder emails; /review/emails/<key> edits one
 *   POST /review/emails/save | test | reset
 *   GET  /review/page      the pitch page's editable texts; POST /review/page/save
 *   GET  /copy             saved page texts (public, CORS; the page loads them)
 *   POST /review/logout
 *
 * Cron: hourly, expiry (only with HOLD_DAYS); 17:00 UTC (18:00 Amsterdam in
 * winter), the daily overview to the reviewers (owner, 2026-10-26).
 */
import { currentReviewer, LOGIN_MS, logoutCookie, sessionCookie, sign, verify } from './auth';
import { copy, fill, isTemplateKey, SAMPLE, TEMPLATES, unknownVars } from './copy';
import { digest, founderEmail, template, templates, values } from './emails';
import { reviewers, type Application, type Env, type Slot, type Status } from './env';
import { ics, send } from './mail';
import { BUSY_JS, emailEditPage, emailsPage, esc, loginPage, page, pageTextPage, reviewPage } from './review';
import { PAGE_DEFAULTS, PAGE_KEYS, pageField } from './pagecopy';

/** 18:00 Amsterdam in winter (UTC+1); keep in step with wrangler.toml. */
const DIGEST_CRON = '0 17 * * *';

const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

function cors(env: Env, req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
  return allowed.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' }
    : { Vary: 'Origin' };
}

const redirect = (to: string, headers: HeadersInit = {}) => new Response(null, { status: 303, headers: { Location: to, ...headers } });

// ---- Public API ------------------------------------------------------------

async function slots(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT s.id, s.label, s.starts_at, s.ends_at,
            NOT EXISTS (SELECT 1 FROM applications a WHERE a.slot_id = s.id AND a.status IN ('pending', 'approved')) AS free
       FROM slots s ORDER BY s.starts_at`,
  ).all<Slot & { free: number }>();
  return results.map((s) => ({ id: s.id, label: s.label, available: !!s.free }));
}

// The letter's fields (owner, 2026-10-27); phone is the only optional one.
const LIMITS: Record<string, number> = {
  company: 120, building: 280, name: 120, role: 120, linkedin: 300, surprise: 400, why: 800,
  slot: 8, email: 200, phone: 40, first_name: 60,
};
const REQUIRED = ['company', 'building', 'name', 'role', 'linkedin', 'surprise', 'why', 'slot', 'email', 'first_name'];

function clean(input: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const k of Object.keys(LIMITS)) {
    const v = typeof input[k] === 'string' ? (input[k] as string).trim().replace(/\s+/g, ' ') : '';
    if (v.length > LIMITS[k]) return { field: k };
    out[k] = v;
  }
  for (const k of REQUIRED) if (!out[k]) return { field: k };
  out.email = out.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return { field: 'email' };
  // LinkedIn: the page sends the handle ("jeroendelange1976", owner
  // 2026-10-27); stored as the full profile address. A full address or any
  // other link is kept, with https:// added when left out.
  const li = out.linkedin.match(/linkedin\.com\/in\/([^\/?#\s]+)/i);
  if (li) out.linkedin = `https://www.linkedin.com/in/${li[1]}`;
  else if (/^[\w\-%]+$/.test(out.linkedin)) out.linkedin = `https://www.linkedin.com/in/${out.linkedin}`;
  else if (!/^https?:\/\//i.test(out.linkedin)) out.linkedin = 'https://' + out.linkedin;
  if (!/^https?:\/\/[^\s.]+\.\S+$/i.test(out.linkedin)) return { field: 'linkedin' };
  return { data: out };
}

async function apply(env: Env, req: Request, ctx: ExecutionContext) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid', message: copy.errors.invalid }, 400);
  }
  // Honeypot: a field people never see.
  if (typeof body.website === 'string' && body.website) return json({ ok: true }, 201);
  const c = clean(body);
  if (!c.data) return json({ error: 'invalid', field: c.field, message: copy.errors.invalid }, 400);
  const d = c.data;
  const slot = await env.DB.prepare('SELECT * FROM slots WHERE id = ?').bind(d.slot).first<Slot>();
  if (!slot) return json({ error: 'unknown_slot', message: copy.errors.unknown_slot }, 409);

  const a: Application = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    slot_id: slot.id,
    status: 'pending',
    company: d.company,
    name: d.name,
    role: d.role || null,
    email: d.email,
    phone: d.phone || null,
    building: d.building,
    deck: null,
    linkedin: d.linkedin,
    surprise: d.surprise,
    why: d.why,
    first_name: d.first_name,
    decided_at: null,
    decided_by: null,
    cancel_token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
  };
  try {
    await env.DB.prepare(
      `INSERT INTO applications (id, created_at, slot_id, status, company, name, role, email, phone, building, linkedin, surprise, why, first_name, cancel_token)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(a.id, a.created_at, a.slot_id, a.company, a.name, a.role, a.email, a.phone, a.building, a.linkedin, a.surprise, a.why, a.first_name, a.cancel_token)
      .run();
  } catch (e) {
    const msg = String((e as Error).message);
    if (msg.includes('applications.slot_id')) return json({ error: 'slot_taken', message: copy.errors.slot_taken }, 409);
    if (msg.includes('applications.email')) return json({ error: 'already_applied', message: copy.errors.already_applied }, 409);
    throw e;
  }

  const base = new URL(req.url).origin;
  // The team hears about it in the daily overview, not per request.
  ctx.waitUntil(founderEmail(env, 'received', a, slot, `${base}/cancel?t=${a.cancel_token}`).then((m) => send(env, { to: a.email, ...m })));
  return json({ ok: true, slot: slot.label }, 201);
}

// ---- Founder cancels ---------------------------------------------------------

async function cancelPage(env: Env, url: URL) {
  const t = url.searchParams.get('t') ?? '';
  const a = await env.DB.prepare(
    `SELECT a.*, s.label FROM applications a JOIN slots s ON s.id = a.slot_id WHERE cancel_token = ? AND status IN ('pending', 'approved')`,
  )
    .bind(t)
    .first<Application & { label: string }>();
  if (!a) return page('Cancel', `<div><h1 class="t-title">${esc(env.EVENT_NAME)}</h1><p class="t-intro">${copy.pages.cancelGone}</p></div>`);
  // A button, not the link itself, so mail scanners that open links do not cancel.
  return page(
    'Cancel',
    `<div><h1 class="t-title">${esc(env.EVENT_NAME)}</h1>
     <p class="t-intro">Release the ${esc(a.label)} slot (Helsinki time) for ${esc(a.company)}? Someone else can then take it.</p></div>
     <form method="post" action="/cancel" data-busy="Releasing…"><input type="hidden" name="t" value="${t.replace(/[^a-f0-9]/g, '')}"><button class="btn btn--warn" type="submit">Release the slot</button></form>
     <script>${BUSY_JS}</script>`,
  );
}

async function cancel(env: Env, req: Request, ctx: ExecutionContext) {
  const form = await req.formData();
  const t = String(form.get('t') ?? '');
  const a = await env.DB.prepare(
    `UPDATE applications SET status = 'cancelled', decided_at = ?, decided_by = 'founder'
      WHERE cancel_token = ? AND status IN ('pending', 'approved') RETURNING *`,
  )
    .bind(new Date().toISOString(), t)
    .first<Application>();
  if (!a) return page('Cancel', `<div><h1 class="t-title">${esc(env.EVENT_NAME)}</h1><p class="t-intro">${copy.pages.cancelGone}</p></div>`);
  // Reported in the daily overview.
  return page('Cancelled', `<div><h1 class="t-title">${esc(env.EVENT_NAME)}</h1><p class="t-intro">${copy.pages.cancelled}</p></div>`);
}

// ---- Review ------------------------------------------------------------------

const sameOrigin = (req: Request) => req.headers.get('Origin') === new URL(req.url).origin;

async function review(env: Env, req: Request, url: URL, ctx: ExecutionContext) {
  // /review/ and /review are the same page (the menu links with a slash).
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path === '/review/login' && req.method === 'POST') {
    if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
    const email = String((await req.formData()).get('email') ?? '').trim().toLowerCase();
    if (reviewers(env).includes(email)) {
      const t = await sign(env, { email, kind: 'login', exp: Date.now() + LOGIN_MS });
      ctx.waitUntil(send(env, { to: email, ...copy.login(env, `${url.origin}/review/auth?t=${t}`) }));
    }
    return loginPage(env.EVENT_NAME, copy.pages.loginSent);
  }

  if (path === '/review/auth') {
    const email = await verify(env, url.searchParams.get('t') ?? '', 'login');
    if (!email) return loginPage(env.EVENT_NAME, 'That link has expired. Ask for a new one.');
    return redirect('/review', { 'Set-Cookie': await sessionCookie(env, email) });
  }

  if (path === '/review/logout' && req.method === 'POST') return redirect('/review', { 'Set-Cookie': logoutCookie });

  const who = await currentReviewer(env, req);
  if (!who) return path === '/review/decide' ? json({ error: 'auth', message: 'Your session has ended. Reload the page to log in again.' }, 401) : loginPage(env.EVENT_NAME);

  if (path === '/review/decide' && req.method === 'POST') {
    if (!sameOrigin(req)) return json({ error: 'forbidden', message: 'Forbidden.' }, 403);
    let body: { id?: unknown; decision?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      /* falls through to the check below */
    }
    const id = String(body.id ?? '');
    const decision = String(body.decision ?? '') as Status;
    if (decision !== 'approved' && decision !== 'denied') return json({ error: 'invalid', message: 'Unknown decision.' }, 400);
    const a = await env.DB.prepare(
      `UPDATE applications SET status = ?, decided_at = ?, decided_by = ? WHERE id = ? AND status = 'pending' RETURNING *`,
    )
      .bind(decision, new Date().toISOString(), who, id)
      .first<Application>();
    if (a) {
      const slot = (await env.DB.prepare('SELECT * FROM slots WHERE id = ?').bind(a.slot_id).first<Slot>())!;
      ctx.waitUntil(
        founderEmail(env, decision, a, slot).then((m) =>
          send(env, {
            to: a.email,
            ...m,
            attachments:
              decision === 'approved'
                ? [{ filename: 'the-pitch.ics', content: ics(env, a.id, slot.starts_at, slot.ends_at, `${plainTitle(env)}: ${a.company}`), content_type: 'text/calendar' }]
                : undefined,
          }),
        ),
      );
    }
    return a ? json({ ok: true, status: decision }) : json({ error: 'stale', message: 'This request was already decided. Reload to see the latest state.' }, 409);
  }

  // ---- Page text: the pitch page's editable texts.
  const pagePath = path.replace(/\/+$/, '');
  if (pagePath === '/review/page' && req.method === 'GET') {
    const { values, meta } = await pageCopy(env);
    return pageTextPage({ who, base: '/review', pageUrl: env.PAGE_URL, values, meta });
  }
  if (pagePath === '/review/page/save' && req.method === 'POST') {
    if (!sameOrigin(req)) return json({ error: 'forbidden', message: 'Forbidden.' }, 403);
    let body: { values?: Record<string, unknown> } = {};
    try {
      body = await req.json();
    } catch {
      /* checked below */
    }
    const values = body.values ?? {};
    const now = new Date().toISOString();
    const stmts: D1PreparedStatement[] = [];
    for (const key of PAGE_KEYS) {
      if (!(key in values)) continue;
      const v = String(values[key] ?? '').replace(/\r\n/g, '\n').trim();
      const f = pageField(key)!;
      if (v.length > f.max) return json({ error: 'invalid', message: `${f.label} is too long (at most ${f.max} characters).` }, 400);
      if (f.link && v && !/^https:\/\/\S+$/i.test(v)) return json({ error: 'invalid', message: `${f.label} must be a web address starting with https://.` }, 400);
      stmts.push(
        !v || v === PAGE_DEFAULTS[key]
          ? env.DB.prepare('DELETE FROM page_copy WHERE key = ?').bind(key)
          : env.DB.prepare(
              `INSERT INTO page_copy (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?)
               ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by
               WHERE page_copy.value <> excluded.value`,
            ).bind(key, v, now, who),
      );
    }
    if (stmts.length) await env.DB.batch(stmts);
    return json({ ok: true, values: (await pageCopy(env)).values });
  }

  // ---- Founder emails: list, edit, save, test, reset.
  const emailPath = path.replace(/\/+$/, '');
  if (emailPath === '/review/emails' && req.method === 'GET') return emailsPage({ who, base: '/review', templates: await templates(env) });
  const edit = emailPath.match(/^\/review\/emails\/([a-z]+)$/);
  if (edit && req.method === 'GET') {
    if (!isTemplateKey(edit[1])) return new Response('Not found', { status: 404 });
    const v = values(env, SAMPLE, SAMPLE.time, `${url.origin}/cancel?t=example`);
    return emailEditPage({ who, base: '/review', template: await template(env, edit[1]), emailConfigured: !!(env.MAIL_FROM && env.RESEND_API_KEY), sample: v });
  }
  const act = emailPath.match(/^\/review\/emails\/(save|test|reset)$/);
  if (act && req.method === 'POST') {
    if (!sameOrigin(req)) return json({ error: 'forbidden', message: 'Forbidden.' }, 403);
    let body: { key?: unknown; subject?: unknown; body?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      /* checked below */
    }
    const key = String(body.key ?? '');
    if (!isTemplateKey(key)) return json({ error: 'invalid', message: 'Unknown email.' }, 400);
    if (act[1] === 'reset') {
      await env.DB.prepare('DELETE FROM email_templates WHERE key = ?').bind(key).run();
      return json({ ok: true, template: await template(env, key) });
    }
    const subject = String(body.subject ?? '').trim();
    const text = String(body.body ?? '').replace(/\r\n/g, '\n').trim();
    if (!subject || !text) return json({ error: 'invalid', message: 'Subject and text cannot be empty.' }, 400);
    if (subject.length > 200 || text.length > 5000) return json({ error: 'invalid', message: 'The subject or text is too long.' }, 400);
    const unknown = unknownVars(key, subject + '\n' + text);
    if (unknown.length)
      return json({ error: 'invalid', message: `This email does not know ${unknown.map((u) => `{${u}}`).join(', ')}. Use only the placeholders listed.` }, 400);
    if (act[1] === 'test') {
      const v = values(env, SAMPLE, SAMPLE.time, `${url.origin}/cancel?t=test`);
      await send(env, { to: who, subject: `[Test] ${fill(subject, v)}`, text: fill(text, v) });
      return json({ ok: true, sentTo: who, emailConfigured: !!(env.MAIL_FROM && env.RESEND_API_KEY) });
    }
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO email_templates (key, subject, body, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (key) DO UPDATE SET subject = excluded.subject, body = excluded.body, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    )
      .bind(key, subject, text, now, who)
      .run();
    return json({ ok: true, template: await template(env, key) });
  }

  if (path === '/review' && req.method === 'GET') {
    const [s, apps] = await Promise.all([
      env.DB.prepare('SELECT * FROM slots ORDER BY starts_at').all<Slot>(),
      env.DB.prepare(
        `SELECT a.*, s.label FROM applications a JOIN slots s ON s.id = a.slot_id ORDER BY s.starts_at, a.created_at`,
      ).all<Application & { label: string }>(),
    ]);
    return reviewPage({
      base: '/review',
      event: env.EVENT_NAME,
      who,
      emailConfigured: !!(env.MAIL_FROM && env.RESEND_API_KEY),
      pageUrl: env.PAGE_URL,
      slots: s.results.map(({ id, label }) => ({ id, label })),
      apps: apps.results.map(({ cancel_token: _, decided_at: __, ...a }) => a),
    });
  }

  return new Response('Not found', { status: 404 });
}

// ---- Expiry (only with HOLD_DAYS) ------------------------------------------------

async function expire(env: Env) {
  const days = Number(env.HOLD_DAYS);
  if (!env.HOLD_DAYS || !(days > 0)) return;
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const { results } = await env.DB.prepare(
    `UPDATE applications SET status = 'expired', decided_at = ?, decided_by = 'expiry'
      WHERE status = 'pending' AND created_at < ? RETURNING *`,
  )
    .bind(new Date().toISOString(), cutoff)
    .all<Application>();
  for (const a of results) {
    const slot = await env.DB.prepare('SELECT * FROM slots WHERE id = ?').bind(a.slot_id).first<Slot>();
    if (slot) await send(env, { to: a.email, ...(await founderEmail(env, 'expired', a, slot)) });
  }
}

/** Saved page texts (only the ones that differ from the page's originals). */
async function pageCopy(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM page_copy').all<{ key: string; value: string; updated_at: string; updated_by: string }>();
  const known = results.filter((r) => PAGE_KEYS.includes(r.key));
  return {
    values: Object.fromEntries(known.map((r) => [r.key, r.value])) as Record<string, string>,
    meta: Object.fromEntries(known.map((r) => [r.key, { updated_at: r.updated_at, updated_by: r.updated_by }])),
  };
}

const plainTitle = (env: Env) => env.EVENT_NAME.replace(/\s*_+\s*/, ' ');

// ---- Daily overview to the reviewers -------------------------------------------

async function meta(env: Env, key: string) {
  return (await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(key).first<{ value: string }>())?.value ?? null;
}
async function setMeta(env: Env, key: string, value: string) {
  await env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value').bind(key, value).run();
}

async function dailyOverview(env: Env) {
  const to = reviewers(env);
  if (!to.length) return;
  const now = new Date().toISOString();
  const since = (await meta(env, 'last_digest_at')) ?? new Date(Date.now() - 86400000).toISOString();
  const origin = (await meta(env, 'origin')) ?? '';
  const d = await digest(env, since, `${origin}/review`);
  if (d) await send(env, { to, ...d });
  await setMeta(env, 'last_digest_at', now);
}

// The scheduled run has no request to learn its own address from, so the
// address is kept from the first request this copy of the service sees.
let originSaved = '';

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(req.url);
    if (originSaved !== url.origin) {
      originSaved = url.origin;
      ctx.waitUntil(setMeta(env, 'origin', url.origin).catch(() => {}));
    }
    try {
      if (url.pathname === '/copy') {
        const h = cors(env, req);
        if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
        return json({ values: (await pageCopy(env)).values }, 200, { ...h, 'Cache-Control': 'public, max-age=60' });
      }
      if (url.pathname === '/slots' || url.pathname === '/apply') {
        const h = cors(env, req);
        if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
        if (url.pathname === '/slots' && req.method === 'GET') return json({ slots: await slots(env) }, 200, h);
        if (url.pathname === '/apply' && req.method === 'POST') {
          const res = await apply(env, req, ctx);
          Object.entries(h).forEach(([k, v]) => res.headers.set(k, v));
          return res;
        }
        return json({ error: 'method' }, 405, h);
      }
      if (url.pathname === '/cancel') return req.method === 'POST' ? cancel(env, req, ctx) : cancelPage(env, url);
      if (url.pathname === '/review' || url.pathname.startsWith('/review/')) return await review(env, req, url, ctx);
      if (url.pathname === '/') return redirect(env.PAGE_URL);
      return new Response('Not found', { status: 404 });
    } catch (e) {
      console.error(e);
      return json({ error: 'server', message: copy.errors.server }, 500, cors(env, req));
    }
  },
  async scheduled(controller: ScheduledController, env: Env) {
    if (controller.cron === DIGEST_CRON) await dailyOverview(env);
    else await expire(env);
  },
} satisfies ExportedHandler<Env>;
