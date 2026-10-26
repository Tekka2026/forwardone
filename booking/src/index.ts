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
 *   POST /review/logout
 */
import { currentReviewer, LOGIN_MS, logoutCookie, sessionCookie, sign, verify } from './auth';
import { copy } from './copy';
import { reviewers, type Application, type Env, type Slot, type Status } from './env';
import { ics, send } from './mail';
import { loginPage, page, reviewPage } from './review';

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

const LIMITS: Record<string, number> = { company: 120, name: 120, role: 120, email: 200, phone: 40, building: 280, deck: 500, slot: 8 };
const REQUIRED = ['company', 'name', 'email', 'building', 'slot'];

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
  if (out.deck && !/^https?:\/\/\S+$/i.test(out.deck)) return { field: 'deck' };
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
    deck: d.deck || null,
    decided_at: null,
    decided_by: null,
    cancel_token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
  };
  try {
    await env.DB.prepare(
      `INSERT INTO applications (id, created_at, slot_id, status, company, name, role, email, phone, building, deck, cancel_token)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(a.id, a.created_at, a.slot_id, a.company, a.name, a.role, a.email, a.phone, a.building, a.deck, a.cancel_token)
      .run();
  } catch (e) {
    const msg = String((e as Error).message);
    if (msg.includes('applications.slot_id')) return json({ error: 'slot_taken', message: copy.errors.slot_taken }, 409);
    if (msg.includes('applications.email')) return json({ error: 'already_applied', message: copy.errors.already_applied }, 409);
    throw e;
  }

  const base = new URL(req.url).origin;
  ctx.waitUntil(
    Promise.all([
      send(env, { to: a.email, ...copy.received(env, a, slot, `${base}/cancel?t=${a.cancel_token}`) }),
      reviewers(env).length ? send(env, { to: reviewers(env), ...copy.newRequest(env, a, slot, `${base}/review`) }) : null,
    ]),
  );
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
  if (!a) return page('Cancel', `<h1>${env.EVENT_NAME}</h1><p>${copy.pages.cancelGone}</p>`);
  // A button, not the link itself, so mail scanners that open links do not cancel.
  return page(
    'Cancel',
    `<h1>${env.EVENT_NAME}</h1>
     <p>Release the ${a.label} slot (Helsinki time) for ${a.company.replace(/[<>&"]/g, '')}?</p>
     <form method="post" action="/cancel"><input type="hidden" name="t" value="${t.replace(/[^a-f0-9]/g, '')}"><button type="submit">Release the slot</button></form>`,
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
  if (!a) return page('Cancel', `<h1>${env.EVENT_NAME}</h1><p>${copy.pages.cancelGone}</p>`);
  if (reviewers(env).length)
    ctx.waitUntil(
      send(env, { to: reviewers(env), subject: `Pitch request cancelled: ${a.company}`, text: `${a.company} released slot ${a.slot_id}. It is free again.` }),
    );
  return page('Cancelled', `<h1>${env.EVENT_NAME}</h1><p>${copy.pages.cancelled}</p>`);
}

// ---- Review ------------------------------------------------------------------

const sameOrigin = (req: Request) => req.headers.get('Origin') === new URL(req.url).origin;

async function review(env: Env, req: Request, url: URL, ctx: ExecutionContext) {
  const path = url.pathname;

  if (path === '/review/login' && req.method === 'POST') {
    if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
    const email = String((await req.formData()).get('email') ?? '').trim().toLowerCase();
    if (reviewers(env).includes(email)) {
      const t = await sign(env, { email, kind: 'login', exp: Date.now() + LOGIN_MS });
      ctx.waitUntil(send(env, { to: email, ...copy.login(env, `${url.origin}/review/auth?t=${t}`) }));
    }
    return loginPage(env, copy.pages.loginSent);
  }

  if (path === '/review/auth') {
    const email = await verify(env, url.searchParams.get('t') ?? '', 'login');
    if (!email) return loginPage(env, 'That link has expired. Ask for a new one.');
    return redirect('/review', { 'Set-Cookie': await sessionCookie(env, email) });
  }

  if (path === '/review/logout' && req.method === 'POST') return redirect('/review', { 'Set-Cookie': logoutCookie });

  const who = await currentReviewer(env, req);
  if (!who) return loginPage(env);

  if (path === '/review/decide' && req.method === 'POST') {
    if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
    const form = await req.formData();
    const id = String(form.get('id') ?? '');
    const decision = String(form.get('decision') ?? '') as Status;
    if (decision !== 'approved' && decision !== 'denied') return new Response('Bad request', { status: 400 });
    const a = await env.DB.prepare(
      `UPDATE applications SET status = ?, decided_at = ?, decided_by = ? WHERE id = ? AND status = 'pending' RETURNING *`,
    )
      .bind(decision, new Date().toISOString(), who, id)
      .first<Application>();
    if (a) {
      const slot = (await env.DB.prepare('SELECT * FROM slots WHERE id = ?').bind(a.slot_id).first<Slot>())!;
      ctx.waitUntil(
        decision === 'approved'
          ? send(env, {
              to: a.email,
              ...copy.approved(env, a, slot),
              attachments: [{ filename: 'the-pitch.ics', content: ics(env, a.id, slot.starts_at, slot.ends_at, `${env.EVENT_NAME}: ${a.company}`), content_type: 'text/calendar' }],
            })
          : send(env, { to: a.email, ...copy.denied(env, a) }),
      );
    }
    return redirect(`/review?done=${a ? decision : 'stale'}`);
  }

  if (path === '/review' && req.method === 'GET') {
    const [s, apps] = await Promise.all([
      env.DB.prepare('SELECT * FROM slots ORDER BY starts_at').all<Slot>(),
      env.DB.prepare(
        `SELECT a.*, s.label FROM applications a JOIN slots s ON s.id = a.slot_id ORDER BY s.starts_at, a.created_at`,
      ).all<Application & { label: string }>(),
    ]);
    const done = url.searchParams.get('done');
    const flash = done === 'approved' ? 'Approved. The founder gets an email with the calendar invite.' : done === 'denied' ? 'Denied. The slot is free again and the founder gets an email.' : done === 'stale' ? 'That request was already decided.' : '';
    return reviewPage(env, who, s.results, apps.results, flash);
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
    if (slot) await send(env, { to: a.email, ...copy.expired(env, a, slot) });
  }
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(req.url);
    try {
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
  async scheduled(_: ScheduledController, env: Env) {
    await expire(env);
  },
} satisfies ExportedHandler<Env>;
