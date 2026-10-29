/**
 * The team's review dashboard (/review) and its login, built on the
 * dashboard design rules in booking/DESIGN.md (owner, 2026-10-26).
 *
 * The server sends a shell with the data as JSON; the client script below
 * renders the table, filters, sorting, dialog and toasts, and calls
 * `window.REVIEW_API` for decisions. The preview on the site
 * (scripts/preview.mjs → booking/preview-site/, local only) uses this same
 * file with sample data and a local stand-in for the API, so the preview and
 * the real dashboard cannot drift apart.
 */
import { VARIABLES, TEMPLATES, type TemplateKey } from './copy.ts'; // .ts: also loaded by Node in scripts/preview.mjs
import { PAGE_DEFAULTS, PAGE_FIELDS } from './pagecopy.ts';
import type { Application, Slot } from './env';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">';

/* Every value comes from a token (booking/DESIGN.md §1); `npm run check`
   fails on a colour literal outside :root (scripts/design-lint.mjs). */
export const CSS = `
:root {
  --bg: #f9f9fa; --bg-elev: #ffffff;
  --border: #eaeaea; --border-strong: #d4d4d4;
  --fg: #000000; --fg-muted: #666666; --fg-faint: #8f8f8f; --placeholder: #b3b3b3;
  --accent: #000000; --accent-fg: #ffffff;
  --geist-blue: #0070f3;
  --ok-bg: #ecfdf5; --ok-border: #a7f3d0; --ok-fg: #047857;
  --err-bg: #fef2f2; --err-border: #fecaca; --err-fg: #b91c1c;
  --warn-bg: #fff7ed; --warn-border: #fed7aa; --warn-fg: #c2410c;
  --neutral-bg: #f5f5f5; --neutral-border: #e5e5e5; --neutral-fg: #666666;
  --scrim: rgba(0, 0, 0, 0.4); --focus-field: rgba(0, 0, 0, 0.1);
  --radius: 10px; --radius-sm: 6px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05); --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.08);
  --font: "Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --btn: 40px; --btn-sm: 32px;
  --toast-ms: 4500ms; --t-fast: 120ms;
  --gutter: 16px; --page-max: 1100px;
  color-scheme: light;
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
#banners:empty { display: none; }
body {
  margin: 0; background: var(--bg); color: var(--fg); font-family: var(--font); font-size: 14px;
  line-height: 1.5; letter-spacing: -0.011em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
main {
  max-width: var(--page-max); margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px;
  padding-block: 32px 64px;
  padding-left: max(var(--gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--gutter), env(safe-area-inset-right, 0px));
}
:focus-visible { outline: 2px solid var(--geist-blue); outline-offset: 2px; }
a { color: inherit; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.block { width: 100%; }
.flush { margin: 0; }
.mono { font-family: var(--mono); letter-spacing: 0; }

/* Typography: five levels (§2). */
.t-title { font-size: 26px; font-weight: 700; line-height: 1.2; margin: 0; text-wrap: balance; }
.t-intro { font-size: 14.5px; color: var(--fg-muted); line-height: 1.55; margin: 6px 0 0; max-width: 65ch; }
.t-section { font-size: 15px; font-weight: 600; color: var(--fg); margin: 0; }
.t-label { display: block; font-size: 13px; font-weight: 500; color: var(--fg-muted); margin-bottom: 7px; }
.t-eyebrow { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.045em; color: var(--fg-faint); }
.t-help { font-size: 12.5px; color: var(--fg-faint); margin: 6px 0 0; }

.head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.who { display: flex; align-items: center; gap: 8px; color: var(--fg-muted); font-size: 13px; }

/* Buttons: 40px and 32px only (§3). */
.btn {
  font: inherit; font-size: 14px; font-weight: 500; height: var(--btn); padding: 0 16px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong); background: var(--bg-elev); color: var(--fg); cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px; text-decoration: none; white-space: nowrap;
  transition: border-color var(--t-fast), background-color var(--t-fast);
}
.btn:hover { border-color: var(--fg-faint); }
.btn--sm { height: var(--btn-sm); padding: 0 12px; font-size: 13px; }
.btn--primary { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
.btn--primary:hover { border-color: var(--accent); }
.btn--warn { color: var(--warn-fg); border-color: var(--warn-border); }
.btn--warn:hover { border-color: var(--warn-fg); }
.btn--danger { background: var(--err-fg); color: var(--accent-fg); border-color: var(--err-fg); }
.btn:disabled { cursor: default; opacity: 0.55; }

/* Fields (§4). */
.field {
  font: inherit; font-size: 14px; padding: 9px 11px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--bg-elev); color: var(--fg); min-width: 0;
}
.field::placeholder { color: var(--placeholder); }
.field:focus { outline: none; border-color: var(--fg); box-shadow: 0 0 0 3px var(--focus-field); }
.field:focus-visible { outline: none; }
select.field {
  appearance: none; -webkit-appearance: none; padding-right: 32px; cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--fg-muted) 50%), linear-gradient(135deg, var(--fg-muted) 50%, transparent 50%);
  background-position: calc(100% - 15px) 50%, calc(100% - 10px) 50%; background-size: 5px 5px; background-repeat: no-repeat;
}

/* Card: dashboards and details only, never lists (§4). */
.card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: grid; gap: 16px; }
.card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }

.slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 8px; }
.slot { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; display: grid; gap: 4px; align-content: start; min-height: 74px; }
.slot-time { font-weight: 600; font-variant-numeric: tabular-nums; }
.slot-who { font-size: 13px; overflow-wrap: anywhere; }

/* Status pills (§4). */
.pill { display: inline-block; font-size: 12px; font-weight: 500; line-height: 20px; padding: 0 8px; border-radius: 999px; border: 1px solid; white-space: nowrap; }
.pill--ok { background: var(--ok-bg); border-color: var(--ok-border); color: var(--ok-fg); }
.pill--err { background: var(--err-bg); border-color: var(--err-border); color: var(--err-fg); }
.pill--warn { background: var(--warn-bg); border-color: var(--warn-border); color: var(--warn-fg); }
.pill--neutral { background: var(--neutral-bg); border-color: var(--neutral-border); color: var(--neutral-fg); }

/* Banner: the state of the page (§4). */
.banner { border: 1px solid; border-radius: var(--radius-sm); padding: 10px 12px; font-size: 13.5px; }
.banner--warn { background: var(--warn-bg); border-color: var(--warn-border); color: var(--warn-fg); }
.banner--neutral { background: var(--neutral-bg); border-color: var(--neutral-border); color: var(--neutral-fg); }
.banner--ok { background: var(--ok-bg); border-color: var(--ok-border); color: var(--ok-fg); }
.banner--err { background: var(--err-bg); border-color: var(--err-border); color: var(--err-fg); }

/* Toolbar: search and filters left, export right (§5). */
.toolbar { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: center; }
.toolbar-left { display: flex; gap: 8px; flex-wrap: wrap; flex: 1 1 320px; }
.toolbar-left .field { height: var(--btn-sm); padding-block: 0; }
.toolbar-left input.field { flex: 1 1 200px; max-width: 320px; }

/* Records: a real table in a bordered wrapper (§4). */
.table-wrap { background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius); overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th {
  text-align: left; font-size: 12px; font-weight: 600; color: var(--fg-muted); background: var(--bg);
  padding: 9px 14px; border-bottom: 1px solid var(--border); white-space: nowrap;
}
th button { all: unset; cursor: pointer; display: inline-flex; gap: 4px; align-items: center; }
th button:focus-visible { outline: 2px solid var(--geist-blue); outline-offset: 2px; }
th [aria-hidden] { color: var(--fg-faint); }
td { padding: 11px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
tr:last-child td { border-bottom: 0; }
tbody tr { transition: box-shadow var(--t-fast); }
tbody tr:hover { box-shadow: inset 0 0 0 1px var(--border-strong); }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.cell-sub { color: var(--fg-muted); font-size: 12.5px; }
.row-actions { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; }
.only-sm, .only-sm-block { display: none; }
.answer { font-weight: 500; }
.cell-note { font-size: 13px; margin-top: 6px; max-width: 60ch; }
.cell-note .t-eyebrow { margin-right: 4px; }

/* Empty state (§4). */
.empty {
  border: 1px dashed var(--border-strong); border-radius: var(--radius); padding: 32px 16px;
  display: grid; justify-items: center; gap: 12px; text-align: center; color: var(--fg-muted);
}

/* Toast: what an action just did, top right (§4). */
.toasts {
  position: fixed; z-index: 30; display: grid; gap: 8px; width: min(360px, calc(100vw - 32px));
  top: calc(16px + env(safe-area-inset-top, 0px)); right: calc(16px + env(safe-area-inset-right, 0px));
}
.toast {
  background: var(--accent); color: var(--accent-fg); border-radius: var(--radius); padding: 12px 14px;
  box-shadow: var(--shadow-md); display: flex; gap: 12px; align-items: flex-start; font-size: 13.5px;
}
.toast p { margin: 0; flex: 1; }
.toast button { all: unset; cursor: pointer; color: var(--fg-faint); font-size: 13px; }
.toast button:focus-visible { outline: 2px solid var(--geist-blue); outline-offset: 2px; }

/* Confirm dialog (§4). */
dialog {
  border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; max-width: min(420px, calc(100vw - 32px));
  box-shadow: var(--shadow-md); background: var(--bg-elev); color: var(--fg);
}
dialog::backdrop { background: var(--scrim); }
.dialog-body { display: grid; gap: 8px; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; flex-wrap: wrap; }

/* Login. */
.login { max-width: 420px; display: grid; gap: 20px; }
.login form { display: grid; gap: 12px; }

/* App layout: sidebar + content (§4 Zijbalk). */
.app { display: grid; grid-template-columns: 232px minmax(0, 1fr); min-height: 100vh; }
.side {
  position: sticky; top: 0; height: 100vh; display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
  border-right: 1px solid var(--border); background: var(--bg-elev);
}
.side-top { padding: 16px; display: grid; gap: 12px; border-bottom: 1px solid var(--border); }
.brand { font-weight: 600; text-decoration: none; letter-spacing: 0; }
.side-search { height: var(--btn-sm); padding-block: 0; width: 100%; font-size: 13px; }
.side-nav { overflow-y: auto; padding: 12px 8px; display: grid; align-content: start; gap: 2px; }
.nav-head { padding: 8px 8px 4px; margin: 0; }
.nav-item { display: block; padding: 6px 8px; border-radius: var(--radius-sm); text-decoration: none; color: var(--fg-muted); font-size: 13.5px; }
.nav-item:hover { color: var(--fg); background: var(--bg); }
.nav-item[aria-current="page"] { color: var(--fg); background: var(--bg); font-weight: 500; }
.side-foot { padding: 12px 16px; border-top: 1px solid var(--border); display: grid; gap: 8px; font-size: 13px; color: var(--fg-muted); }
.side-foot span { overflow-wrap: anywhere; }
.app main { max-width: var(--page-max); margin: 0; width: 100%; }
.crumb { font-size: 13px; color: var(--fg-muted); text-decoration: none; }
.crumb:hover { color: var(--fg); }

/* Page text. */
.page-row { display: grid; gap: 8px; }
.page-row + .page-row { border-top: 1px solid var(--border); padding-top: 16px; }
.page-row textarea.field { min-height: 0; }
.save-bar {
  position: sticky; bottom: 0; display: flex; gap: 12px; align-items: center; padding: 12px 0;
  background: var(--bg); border-top: 1px solid var(--border);
}

/* Email editor. */
.form { display: grid; gap: 16px; }
textarea.field { min-height: 280px; resize: vertical; line-height: 1.55; width: 100%; font-family: var(--font); }
.form-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.grid-2 { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 24px; align-items: start; }
.sample { white-space: pre-wrap; font-size: 13.5px; margin: 0; overflow-wrap: anywhere; }
.sample-subject { font-weight: 600; margin: 0; overflow-wrap: anywhere; }
tr[data-href] { cursor: pointer; }
.var-table td { padding: 7px 0; vertical-align: top; }
.var-table td:first-child { padding-right: 12px; white-space: nowrap; }

@media (max-width: 900px) {
  .grid-2 { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .app { grid-template-columns: minmax(0, 1fr); }
  .side { position: static; height: auto; grid-template-rows: auto auto auto; border-right: 0; border-bottom: 1px solid var(--border); }
  .side-nav { display: flex; flex-wrap: wrap; overflow: visible; padding: 8px; }
  .nav-head { display: none; }
  .side-foot { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
  .hide-sm { display: none; }
  .only-sm { display: flex; }
  .only-sm-block { display: block; }
  .row-actions { justify-content: flex-start; margin-top: 8px; }
  td, th { padding-left: 10px; padding-right: 10px; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

export function page(title: string, body: string, extraHead = '') {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex"><title>${esc(title)}</title>${FONTS}<style>${CSS}</style>${extraHead}</head><body><main>${body}</main></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

/** The menu: one source for the sidebar and the ⌘K search (§4). */
export const NAV = [
  { group: 'The Pitch', items: [
    { label: 'Requests', path: '/' },
    { label: 'Emails', path: '/emails/' },
    { label: 'Page text', path: '/page/' },
  ] },
];

export type Shell = { who: string; base: string; active: string; logout?: 'form' | 'button' };

export function appHtml(sh: Shell, content: string) {
  const nav = NAV.map(
    (g) => `<p class="t-eyebrow nav-head">${esc(g.group)}</p>` +
      g.items.map((i) => `<a class="nav-item" data-nav="${esc(i.label)}" href="${esc(sh.base + i.path)}"${i.label === sh.active ? ' aria-current="page"' : ''}>${esc(i.label)}</a>`).join(''),
  ).join('');
  const logout = sh.logout === 'button'
    ? '<button class="btn btn--sm" type="button" id="logout">Log out</button>'
    : `<form method="post" action="${esc(sh.base)}/logout"><button class="btn btn--sm" type="submit">Log out</button></form>`;
  return `<div class="app">
    <aside class="side" aria-label="Menu">
      <div class="side-top">
        <a class="brand" href="${esc(sh.base)}/">FORWARD.one</a>
        <label class="sr-only" for="nav-q">Go to</label>
        <input class="field side-search" id="nav-q" type="search" placeholder="Go to…  ⌘K" autocomplete="off">
      </div>
      <nav class="side-nav" id="nav">${nav}</nav>
      <div class="side-foot"><span id="who">${esc(sh.who)}</span>${logout}</div>
    </aside>
    <main>${content}</main>
  </div>
  <div class="toasts" id="toasts" aria-live="polite"></div>
  <dialog id="confirm" aria-labelledby="confirm-h">
    <div class="dialog-body"><h2 class="t-section" id="confirm-h"></h2><p class="t-intro flush" id="confirm-text"></p></div>
    <div class="dialog-actions">
      <button class="btn" type="button" id="confirm-cancel">Cancel</button>
      <button class="btn btn--danger" type="button" id="confirm-ok"></button>
    </div>
  </dialog>
  <script>${SHARED_JS}</script>`;
}

/** A full page with the app layout (no <main> wrapper from page()). */
export function appPage(title: string, sh: Shell, content: string, script: string) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex"><title>${esc(title)}</title>${FONTS}<style>${CSS}</style></head><body>${appHtml(sh, content)}<script>${script}</script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

export function loginHtml(eventName: string, message = '') {
  return `<section class="login" aria-labelledby="login-h">
    <div>
      <h1 class="t-title" id="login-h">Log in</h1>
      <p class="t-intro">Pitch requests for ${esc(eventName)}. Reviewers log in with a link sent to their email; only addresses on the reviewers list get one.</p>
    </div>
    ${message ? `<p class="banner banner--neutral" role="status">${esc(message)}</p>` : ''}
    <form method="post" action="/review/login" data-busy="Sending…">
      <div>
        <label class="t-label" for="login-email">Email address</label>
        <input class="field block" type="email" id="login-email" name="email" required autocomplete="email" placeholder="you@forward.one">
        <p class="t-help">The link works for 15 minutes.</p>
      </div>
      <div><button class="btn btn--primary" type="submit">Send me a link</button></div>
    </form>
  </section>
  <script>${BUSY_JS}</script>`;
}

export function loginPage(eventName: string, message = '') {
  return page('Log in', loginHtml(eventName, message));
}

export type ReviewData = {
  base: string;
  event: string;
  who: string;
  emailConfigured: boolean;
  pageUrl: string;
  slots: Pick<Slot, 'id' | 'label'>[];
  apps: (Pick<Application, 'id' | 'slot_id' | 'status' | 'company' | 'name' | 'role' | 'email' | 'phone' | 'building' | 'deck' | 'linkedin' | 'surprise' | 'why' | 'first_name' | 'created_at' | 'decided_by'> & { label: string })[];
};

/** The dashboard's markup: a shell the client script fills in. */
export function dashboardHtml(data: ReviewData) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<div>
      <h1 class="t-title">Requests</h1>
      <p class="t-intro" id="intro">${esc(data.event)}. Times are Helsinki time.</p>
    </div>
    <div id="banners">${data.emailConfigured ? '' : '<p class="banner banner--warn">Emails are not sent yet: the email service is not connected. Decisions are saved, but founders are not told.</p>'}</div>
    <section class="card" aria-labelledby="slots-h">
      <div class="card-head"><h2 class="t-section" id="slots-h">Slots</h2><span class="t-eyebrow" id="slot-count"></span></div>
      <div class="slots" id="slots"></div>
    </section>
    <div class="toolbar" role="search">
      <div class="toolbar-left">
        <label class="sr-only" for="q">Search</label>
        <input class="field" type="search" id="q" placeholder="Search company, founder or email" autocomplete="off">
        <label class="sr-only" for="status">Status</label>
        <select class="field" id="status">
          <option value="">All statuses</option>
          <option value="pending">Waiting</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <button class="btn btn--sm" type="button" id="export">Export CSV</button>
    </div>
    <div id="list"></div>
    <script type="application/json" id="review-data">${json}</script>`;
}

/** Busy state on every submit button: disabled, other text (§3). */
export const BUSY_JS = `document.querySelectorAll('form[data-busy]').forEach(function (f) {
  f.addEventListener('submit', function () { var b = f.querySelector('[type=submit]'); if (b) { b.disabled = true; b.textContent = f.dataset.busy; } });
});`;

/** The dashboard's behaviour. Decisions go through window.REVIEW_API. */
export const CLIENT_JS = String.raw`(function () {
  var data = JSON.parse(document.getElementById('review-data').textContent);
  var api = window.REVIEW_API || {
    decide: function (id, decision) {
      return fetch(data.base + '/decide', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: id, decision: decision }) })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.message || 'The decision was not saved.'); return d; }); });
    },
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var STATUS = {
    pending: ['Waiting', 'warn'], approved: ['Approved', 'ok'], denied: ['Denied', 'err'],
    cancelled: ['Cancelled', 'neutral'], expired: ['Expired', 'neutral'],
  };
  // Row actions; on phones they sit under the status instead of in their own column.
  var actions = function (a, cls) {
    return a.status === 'pending' ? '<div class="row-actions ' + cls + '"><button class="btn btn--sm" type="button" data-approve="' + esc(a.id) + '">Approve</button><button class="btn btn--sm btn--warn" type="button" data-deny="' + esc(a.id) + '">Deny</button></div>' : '';
  };
  // Founder: name, role, LinkedIn, email, phone. On phones it sits in the company cell.
  var founder = function (a) {
    return esc(a.name) + (a.role ? ', ' + esc(a.role) : '') +
      (a.linkedin ? '<div class="cell-sub"><a href="' + esc(a.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>' : '') +
      '<div class="cell-sub mono">' + esc(a.email) + '</div>' + (a.phone ? '<div class="cell-sub mono">' + esc(a.phone) + '</div>' : '');
  };
  var pill = function (s) { return '<span class="pill pill--' + STATUS[s][1] + '">' + STATUS[s][0] + '</span>'; };
  var live = function (a) { return a.status === 'pending' || a.status === 'approved'; };
  var when = function (iso) { var d = new Date(iso); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };

  // ---- Filters and sorting: instant, kept in the URL, back button works.
  var q = document.getElementById('q'), status = document.getElementById('status');
  var state = { q: '', status: '', sort: 'time', dir: 1 };
  function readUrl() {
    var p = new URLSearchParams(location.search);
    state.q = p.get('q') || ''; state.status = p.get('status') || '';
    state.sort = p.get('sort') || 'time'; state.dir = p.get('dir') === 'desc' ? -1 : 1;
    q.value = state.q; status.value = state.status;
  }
  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.status) p.set('status', state.status);
    if (state.sort !== 'time') p.set('sort', state.sort);
    if (state.dir < 0) p.set('dir', 'desc');
    var s = p.toString();
    try { history.pushState(null, '', location.pathname + (s ? '?' + s : '')); } catch (e) {}
  }
  var timer, shown = [];
  q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { state.q = q.value.trim(); writeUrl(); render(); }, 300); });
  status.addEventListener('change', function () { state.status = status.value; writeUrl(); render(); });
  window.addEventListener('popstate', function () { readUrl(); render(); });

  var KEYS = {
    time: function (a) { return a.label; }, company: function (a) { return a.company.toLowerCase(); },
    received: function (a) { return a.created_at; }, status: function (a) { return a.status; },
  };
  function sortBy(key) { if (state.sort === key) state.dir = -state.dir; else { state.sort = key; state.dir = 1; } writeUrl(); render(); }

  var toast = window.UI.toast, confirmAsk = window.UI.confirm;

  // ---- Decisions.
  function decide(a, decision, btn) {
    btn.disabled = true; btn.textContent = decision === 'approved' ? 'Approving…' : 'Denying…';
    api.decide(a.id, decision).then(function () {
      a.status = decision; a.decided_by = data.who;
      toast(decision === 'approved'
        ? 'Approved ' + a.company + ' for ' + a.label + '.' + (data.emailConfigured ? ' The confirmation with a calendar invite is on its way.' : '')
        : 'Denied ' + a.company + '. The ' + a.label + ' slot is free again.' + (data.emailConfigured ? ' The founder gets an email.' : ''));
      render();
    }).catch(function (e) { toast(e.message || 'The decision was not saved. Try again.', true); render(); });
  }

  // ---- Render.
  function render() {
    var holder = {};
    data.apps.filter(live).forEach(function (a) { holder[a.slot_id] = a; });
    document.getElementById('slots').innerHTML = data.slots.length ? data.slots.map(function (s) {
      var a = holder[s.id];
      return '<div class="slot"><span class="slot-time">' + esc(s.label) + '</span>' +
        (a ? '<span class="slot-who">' + esc(a.company) + '</span><span>' + pill(a.status) + '</span>' : '<span><span class="pill pill--neutral">Free</span></span>') + '</div>';
    }).join('') : '<div class="empty">No slots yet. They come from booking/slots.json.</div>';
    var taken = Object.keys(holder).length;
    document.getElementById('slot-count').textContent = taken + ' of ' + data.slots.length + ' taken';

    var waiting = data.apps.filter(function (a) { return a.status === 'pending'; }).length;
    document.getElementById('intro').textContent = data.event + '. ' + data.apps.length + (data.apps.length === 1 ? ' request, ' : ' requests, ') + waiting + ' waiting for review. Times are Helsinki time.';

    var needle = state.q.toLowerCase();
    var rows = data.apps.filter(function (a) {
      if (state.status && a.status !== state.status) return false;
      if (!needle) return true;
      return [a.company, a.name, a.email, a.building, a.why, a.surprise].join(' ').toLowerCase().indexOf(needle) > -1;
    });
    var key = KEYS[state.sort] || KEYS.time;
    rows.sort(function (x, y) { var a = key(x), b = key(y); return a < b ? -state.dir : a > b ? state.dir : 0; });

    shown = rows;
    var list = document.getElementById('list');
    if (!data.apps.length) {
      list.innerHTML = '<div class="empty"><p class="flush">No requests yet. They appear here as soon as a founder sends the letter.</p><a class="btn btn--sm" href="' + esc(data.pageUrl) + '" target="_blank" rel="noopener">Open the pitch page</a></div>';
      return;
    }
    if (!rows.length) {
      list.innerHTML = '<div class="empty"><p class="flush">No requests match these filters.</p><button class="btn btn--sm" type="button" id="clear">Clear filters</button></div>';
      document.getElementById('clear').addEventListener('click', function () { state.q = ''; state.status = ''; q.value = ''; status.value = ''; writeUrl(); render(); });
      return;
    }
    var th = function (k, label, cls) {
      var on = state.sort === k;
      return '<th' + (cls ? ' class="' + cls + '"' : '') + ' aria-sort="' + (on ? (state.dir > 0 ? 'ascending' : 'descending') : 'none') + '"><button type="button" data-sort="' + k + '">' + label + (on ? ' <span aria-hidden="true">' + (state.dir > 0 ? '↑' : '↓') + '</span>' : '') + '</button></th>';
    };
    list.innerHTML = '<div class="table-wrap"><table><thead><tr>' +
      th('time', 'Time') + th('company', 'Company') + '<th class="hide-sm">Founder</th>' + th('received', 'Received', 'hide-sm') + th('status', 'Status') + '<th class="hide-sm"><span class="sr-only">Actions</span></th>' +
      '</tr></thead><tbody>' + rows.map(function (a) {
        return '<tr>' +
          '<td class="mono">' + esc(a.label) + '</td>' +
          '<td><div class="answer">' + esc(a.company) + '</div><div class="cell-sub">' + esc(a.building) + '</div>' +
            '<div class="cell-note only-sm-block">' + founder(a) + '</div>' +
            (a.why ? '<div class="cell-note"><span class="t-eyebrow">Why us</span> ' + esc(a.why) + '</div>' : '') +
            (a.surprise ? '<div class="cell-note"><span class="t-eyebrow">Not on LinkedIn</span> ' + esc(a.surprise) + '</div>' : '') +
            (a.deck ? '<div class="cell-sub"><a href="' + esc(a.deck) + '" target="_blank" rel="noopener noreferrer">Deck</a></div>' : '') + '</td>' +
          '<td class="hide-sm">' + founder(a) + '</td>' +
          '<td class="hide-sm cell-sub">' + esc(when(a.created_at)) + '</td>' +
          '<td>' + pill(a.status) + (a.decided_by && a.status !== 'pending' ? '<div class="cell-sub">' + esc(a.decided_by) + '</div>' : '') + actions(a, 'only-sm') + '</td>' +
          '<td class="hide-sm">' + actions(a, '') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-sort]'); if (s) return sortBy(s.dataset.sort);
    var ap = e.target.closest('[data-approve]');
    if (ap) { var a = data.apps.find(function (x) { return x.id === ap.dataset.approve; }); return decide(a, 'approved', ap); }
    var dn = e.target.closest('[data-deny]');
    if (dn) {
      var d = data.apps.find(function (x) { return x.id === dn.dataset.deny; });
      confirmAsk('Deny ' + d.company + '?', 'The ' + d.label + ' slot becomes free again' + (data.emailConfigured ? ' and the founder gets an email that they cannot pitch this time.' : '.'), 'Yes, deny', function () { decide(d, 'denied', dn); });
    }
  });

  // ---- Export: the table as it is filtered now.
  // A founder's answer that starts like a formula (=, +, -, @) would run in
  // Excel; a leading ' keeps it text. Phone numbers (+358 …) stay as they are.
  function cell(v) {
    var s = String(v == null ? '' : v);
    return /^[=@\t\r]/.test(s) || /^[+-](?![\d\s()./-]*$)/.test(s) ? "'" + s : s;
  }
  document.getElementById('export').addEventListener('click', function () {
    var cols = ['label', 'company', 'building', 'why', 'surprise', 'name', 'first_name', 'role', 'linkedin', 'email', 'phone', 'status', 'created_at', 'decided_by'];
    var csv = [cols.join(',')].concat(shown.map(function (a) {
      return cols.map(function (c) { return '"' + cell(a[c]).replace(/"/g, '""') + '"'; }).join(',');
    })).join('\n');
    var link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'pitch-requests.csv';
    document.body.appendChild(link); link.click(); link.remove();
  });

  readUrl();
  render();
})();`;

export function reviewPage(data: ReviewData) {
  return appPage('Requests', { who: data.who, base: data.base, active: 'Requests' }, dashboardHtml(data), CLIENT_JS);
}


/** Shared by every screen: toasts, confirm dialog, busy buttons, ⌘K menu
 *  search, clickable rows. Exposes window.UI. */
export const SHARED_JS = String.raw`(function () {
  // Toasts: success fades after --toast-ms, an error stays until closed (§4).
  var toasts = document.getElementById('toasts');
  var toastMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toast-ms')) || 4500;
  function toast(text, isError) {
    var t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', isError ? 'alert' : 'status');
    t.innerHTML = '<p></p><button type="button" aria-label="Close">Close</button>';
    t.querySelector('p').textContent = text;
    t.querySelector('button').addEventListener('click', function () { t.remove(); });
    toasts.appendChild(t);
    if (!isError) setTimeout(function () { t.remove(); }, toastMs);
  }
  // Confirm dialog: Escape closes, focus starts on Cancel (§4).
  var dlg = document.getElementById('confirm'), pending = null;
  function confirmAsk(title, text, yes, then) {
    document.getElementById('confirm-h').textContent = title;
    document.getElementById('confirm-text').textContent = text;
    document.getElementById('confirm-ok').textContent = yes;
    pending = then; dlg.showModal(); document.getElementById('confirm-cancel').focus();
  }
  document.getElementById('confirm-cancel').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('close', function () { pending = null; });
  document.getElementById('confirm-ok').addEventListener('click', function () { var f = pending; pending = null; dlg.close(); if (f) f(); });
  // Busy state: disable and relabel while a request runs (§3).
  function busy(btn, text) {
    var old = btn.textContent; btn.disabled = true; btn.textContent = text;
    return function () { btn.disabled = false; btn.textContent = old; };
  }
  ${BUSY_JS}
  // Menu search: filters the menu (one source); ⌘K / Ctrl+K focuses it, Enter opens the first match.
  var navQ = document.getElementById('nav-q');
  var items = [].slice.call(document.querySelectorAll('[data-nav]'));
  navQ.addEventListener('input', function () {
    var n = navQ.value.trim().toLowerCase();
    items.forEach(function (a) { a.hidden = !!n && a.dataset.nav.toLowerCase().indexOf(n) === -1; });
  });
  navQ.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var first = items.find(function (a) { return !a.hidden; }); if (first) location.href = first.href; }
    if (e.key === 'Escape') { navQ.value = ''; navQ.dispatchEvent(new Event('input')); navQ.blur(); }
  });
  document.addEventListener('keydown', function (e) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); navQ.focus(); } });
  // Whole row clickable where a row has a detail page (§4).
  document.addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-href]');
    if (tr && !e.target.closest('a, button')) location.href = tr.dataset.href;
  });
  window.UI = { toast: toast, confirm: confirmAsk, busy: busy };
})();`;

const ago = (iso: string | null) => (iso ? iso.slice(0, 16).replace('T', ' ') + ' UTC' : '');

export type EmailRow = { key: TemplateKey; subject: string; body: string; changed: boolean; updated_at: string | null; updated_by: string | null };

export function emailsHtml(base: string, list: EmailRow[]) {
  return `<div>
      <h1 class="t-title">Emails</h1>
      <p class="t-intro">The ${list.length} emails founders get. Open one to change its text; the change applies to every email sent after you save. The team’s daily overview at 18:00 is not editable.</p>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Email</th><th class="hide-sm">Subject</th><th>Text</th><th class="hide-sm">Last changed</th></tr></thead>
      <tbody>${list
        .map((t) => {
          const href = `${base}/emails/${t.key}/`;
          return `<tr data-href="${esc(href)}">
            <td><a href="${esc(href)}">${esc(TEMPLATES[t.key].title)}</a><div class="cell-sub">${esc(TEMPLATES[t.key].when)}</div></td>
            <td class="hide-sm mono">${esc(t.subject)}</td>
            <td>${t.changed ? '<span class="pill pill--ok">Changed</span>' : '<span class="pill pill--neutral">Default</span>'}</td>
            <td class="hide-sm cell-sub">${t.changed ? `${esc(t.updated_by)}<br>${esc(ago(t.updated_at))}` : ''}</td>
          </tr>`;
        })
        .join('')}</tbody>
    </table></div>`;
}

export function emailsPage(o: { who: string; base: string; templates: EmailRow[] }) {
  return appPage('Emails', { who: o.who, base: o.base, active: 'Emails' }, emailsHtml(o.base, o.templates), '');
}

export type EmailEdit = { base: string; template: EmailRow; emailConfigured: boolean; sample: Record<string, string> };

export function emailEditHtml(e: EmailEdit) {
  const t = e.template, def = TEMPLATES[t.key];
  const data = JSON.stringify({ base: e.base, key: t.key, vars: def.vars, sample: e.sample, changed: t.changed, emailConfigured: e.emailConfigured }).replace(/</g, '\\u003c');
  return `<div>
      <a class="crumb" href="${esc(e.base)}/emails/">Emails</a>
      <h1 class="t-title">${esc(def.title)}</h1>
      <p class="t-intro">${esc(def.when)}.${def.note ? ' ' + esc(def.note) : ''}</p>
    </div>
    <div id="banners">${e.emailConfigured ? '' : '<p class="banner banner--warn">Emails are not sent yet: the email service is not connected, so Send test does nothing for now. Saving works.</p>'}</div>
    <div class="grid-2">
      <section class="card" aria-labelledby="edit-h">
        <div class="card-head"><h2 class="t-section" id="edit-h">Text</h2><span id="state">${t.changed ? `<span class="pill pill--ok">Changed</span>` : '<span class="pill pill--neutral">Default</span>'}</span></div>
        <form class="form" id="email-form">
          <div>
            <label class="t-label" for="subject">Subject</label>
            <input class="field block" id="subject" name="subject" maxlength="200" required value="${esc(t.subject)}">
          </div>
          <div>
            <label class="t-label" for="body">Text</label>
            <textarea class="field" id="body" name="body" maxlength="5000" required>${esc(t.body)}</textarea>
            <p class="t-help">Placeholders in braces, like {name}, are filled in for each founder. The list is on the right.</p>
          </div>
          <div class="form-actions">
            <button class="btn btn--primary" type="submit" id="save">Save</button>
            <button class="btn" type="button" id="test">Send test to me</button>
            <button class="btn btn--warn" type="button" id="reset"${t.changed ? '' : ' hidden'}>Revert to the default</button>
          </div>
        </form>
      </section>
      <div class="form">
        <section class="card" aria-labelledby="ex-h">
          <div class="card-head"><h2 class="t-section" id="ex-h">Example</h2><span class="t-eyebrow">As a founder sees it</span></div>
          <p class="sample-subject" id="ex-subject"></p>
          <p class="sample" id="ex-body"></p>
        </section>
        <section class="card" aria-labelledby="vars-h">
          <h2 class="t-section" id="vars-h">Placeholders</h2>
          <table class="var-table"><tbody>${def.vars.map((v) => `<tr><td class="mono">{${esc(v)}}</td><td class="cell-sub">${esc(VARIABLES[v])}</td></tr>`).join('')}</tbody></table>
        </section>
      </div>
    </div>
    <script type="application/json" id="email-data">${data}</script>`;
}

export function emailEditPage(o: { who: string; base: string; template: EmailRow; emailConfigured: boolean; sample: Record<string, string> }) {
  return appPage(TEMPLATES[o.template.key].title, { who: o.who, base: o.base, active: 'Emails' }, emailEditHtml(o), EMAIL_JS);
}

/** The email editor: live example, save, test, revert; warns on leaving unsaved. */
export const EMAIL_JS = String.raw`(function () {
  var d = JSON.parse(document.getElementById('email-data').textContent);
  var post = function (what, body) {
    return fetch(d.base + '/emails/' + what, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (x) { if (!r.ok) throw new Error(x.message || 'That did not work. Try again.'); return x; }); });
  };
  var api = window.EMAIL_API || {
    save: function (b) { return post('save', b); },
    test: function (b) { return post('test', b); },
    reset: function (b) { return post('reset', b); },
  };
  var form = document.getElementById('email-form'), subject = document.getElementById('subject'), body = document.getElementById('body');
  var saved = { subject: subject.value, body: body.value };
  var dirty = function () { return subject.value !== saved.subject || body.value !== saved.body; };
  var fill = function (text) { return text.replace(/\{([a-z_]+)\}/g, function (m, k) { return k in d.sample ? d.sample[k] : m; }); };
  function preview() {
    document.getElementById('ex-subject').textContent = fill(subject.value);
    document.getElementById('ex-body').textContent = fill(body.value);
  }
  function state(changed) {
    document.getElementById('state').innerHTML = changed ? '<span class="pill pill--ok">Changed</span>' : '<span class="pill pill--neutral">Default</span>';
    document.getElementById('reset').hidden = !changed;
  }
  subject.addEventListener('input', preview); body.addEventListener('input', preview);
  window.addEventListener('beforeunload', function (e) { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var done = UI.busy(document.getElementById('save'), 'Saving…');
    api.save({ key: d.key, subject: subject.value, body: body.value }).then(function (x) {
      saved = { subject: x.template.subject, body: x.template.body };
      subject.value = saved.subject; body.value = saved.body; preview(); state(true);
      UI.toast('Saved. Every email from now on uses this text.');
    }).catch(function (err) { UI.toast(err.message, true); }).then(done);
  });
  document.getElementById('test').addEventListener('click', function () {
    var done = UI.busy(this, 'Sending…');
    api.test({ key: d.key, subject: subject.value, body: body.value }).then(function (x) {
      UI.toast(x.emailConfigured ? 'Test sent to ' + x.sentTo + ', with example details.' : 'Not sent: the email service is not connected yet.', !x.emailConfigured);
    }).catch(function (err) { UI.toast(err.message, true); }).then(done);
  });
  document.getElementById('reset').addEventListener('click', function () {
    var btn = this;
    UI.confirm('Revert to the default text?', 'Your changes to this email are replaced by the original text. Emails already sent stay as they were.', 'Yes, revert', function () {
      var done = UI.busy(btn, 'Reverting…');
      api.reset({ key: d.key }).then(function (x) {
        saved = { subject: x.template.subject, body: x.template.body };
        subject.value = saved.subject; body.value = saved.body; preview(); state(false);
        UI.toast('Reverted to the default text.');
      }).catch(function (err) { UI.toast(err.message, true); }).then(done);
    });
  });
  preview();
})();`;


// ---- Page text: the pitch page's editable texts (owner, 2026-10-27). -------

export type PageText = { base: string; pageUrl: string; values: Record<string, string>; meta: Record<string, { updated_at: string; updated_by: string }> };

export function pageTextHtml(o: PageText) {
  const data = JSON.stringify({ base: o.base, defaults: PAGE_DEFAULTS }).replace(/</g, '\\u003c');
  const field = (f: (typeof PAGE_FIELDS)[number]['fields'][number]) => {
    const value = o.values[f.key] ?? PAGE_DEFAULTS[f.key];
    const changed = f.key in o.values;
    const m = o.meta[f.key];
    const input = f.rows
      ? `<textarea class="field block page-field" id="pf-${f.key}" name="${f.key}" rows="${f.rows}" maxlength="${f.max}">${esc(value)}</textarea>`
      : `<input class="field block page-field" id="pf-${f.key}" name="${f.key}" maxlength="${f.max}" value="${esc(value)}">`;
    return `<div class="page-row" data-key="${f.key}">
        <div class="card-head"><label class="t-label flush" for="pf-${f.key}">${esc(f.label)}</label>
          <span class="row-actions"><span data-state>${changed ? '<span class="pill pill--ok">Changed</span>' : '<span class="pill pill--neutral">Original</span>'}</span>
          <button class="btn btn--sm" type="button" data-original${changed ? '' : ' hidden'}>Use original</button></span></div>
        ${input}
        <p class="t-help">${esc(f.help)}${m ? ` Last changed by ${esc(m.updated_by)}, ${esc(m.updated_at.slice(0, 16).replace('T', ' '))} UTC.` : ''}</p>
      </div>`;
  };
  return `<div>
      <h1 class="t-title">Page text</h1>
      <p class="t-intro">The texts on the pitch page. After you save, the live page shows them within a minute, on Webflow and on the preview site, without republishing. The heading and the letter itself are not editable here.</p>
    </div>
    <div class="toolbar"><span></span><a class="btn btn--sm" href="${esc(o.pageUrl)}" target="_blank" rel="noopener">Open the pitch page</a></div>
    <form class="form" id="page-form">
      ${PAGE_FIELDS.map((g) => `<section class="card" aria-label="${esc(g.group)}"><h2 class="t-section">${esc(g.group)}</h2>${g.fields.map(field).join('')}</section>`).join('')}
      <div class="save-bar"><button class="btn btn--primary" type="submit" id="page-save">Save</button><span class="t-help flush" id="page-dirty"></span></div>
    </form>
    <script type="application/json" id="page-data">${data}</script>`;
}

export function pageTextPage(o: PageText & { who: string }) {
  return appPage('Page text', { who: o.who, base: o.base, active: 'Page text' }, pageTextHtml(o), PAGE_JS);
}

/** The page text form: save all changed fields, use original per field, warn on leaving unsaved. */
export const PAGE_JS = String.raw`(function () {
  var d = JSON.parse(document.getElementById('page-data').textContent);
  var api = window.PAGE_API || {
    save: function (values) {
      return fetch(d.base + '/page/save', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ values: values }) })
        .then(function (r) { return r.json().then(function (x) { if (!r.ok) throw new Error(x.message || 'Not saved. Try again.'); return x; }); });
    },
  };
  var form = document.getElementById('page-form');
  var fields = [].slice.call(form.querySelectorAll('.page-field'));
  var saved = {}; fields.forEach(function (f) { saved[f.name] = f.value; });
  var dirty = function () { return fields.some(function (f) { return f.value !== saved[f.name]; }); };
  function mark() {
    var n = fields.filter(function (f) { return f.value !== saved[f.name]; }).length;
    document.getElementById('page-dirty').textContent = n ? n + (n === 1 ? ' unsaved change' : ' unsaved changes') : '';
    fields.forEach(function (f) {
      var row = f.closest('.page-row'), changed = f.value.trim() !== d.defaults[f.name];
      row.querySelector('[data-original]').hidden = !changed;
    });
  }
  form.addEventListener('input', mark);
  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-original]'); if (!b) return;
    var f = b.closest('.page-row').querySelector('.page-field');
    f.value = d.defaults[f.name]; mark(); f.focus();
  });
  window.addEventListener('beforeunload', function (e) { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var values = {}; fields.forEach(function (f) { values[f.name] = f.value; });
    var done = UI.busy(document.getElementById('page-save'), 'Saving…');
    api.save(values).then(function (x) {
      fields.forEach(function (f) {
        var v = f.name in x.values ? x.values[f.name] : d.defaults[f.name];
        f.value = v; saved[f.name] = v;
        f.closest('.page-row').querySelector('[data-state]').innerHTML = f.name in x.values ? '<span class="pill pill--ok">Changed</span>' : '<span class="pill pill--neutral">Original</span>';
      });
      mark();
      UI.toast('Saved. The pitch page shows the new texts within a minute.');
    }).catch(function (err) { UI.toast(err.message, true); }).then(done);
  });
  mark();
})();`;
