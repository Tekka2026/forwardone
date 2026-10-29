// Builds the dashboard preview locally (booking/preview-site/, not in git and
// not on the site: taken offline when the campaign went live, owner 2026-10-29)
// from src/review.ts itself, with invented sample data and a local stand-in
// for the API, so the preview always matches the real dashboard.
//   index.html                  Requests (with the login step first)
//   emails/index.html           Emails
//   emails/<key>/index.html     the editor for one email
// Changes saved in the preview stay in the viewer's own browser only.
// Usage: node --experimental-strip-types scripts/preview.mjs [fragment-out.html]
import { writeFileSync, mkdirSync } from 'node:fs';
import { TEMPLATES, TEMPLATE_KEYS, SAMPLE, plain } from '../src/copy.ts';
import { CLIENT_JS, CSS, EMAIL_JS, FONTS, PAGE_JS, appHtml, dashboardHtml, emailEditHtml, emailsHtml, loginHtml, pageTextHtml } from '../src/review.ts';

const BASE = '/forwardone/the-pitch/review-preview';
const EVENT = 'The _____ Pitch at Slush';
const PAGE = 'https://tekka2026.github.io/forwardone/the-pitch/';

// The real slots (slots.json: 18 November, 08:00 to 16:00, 30 minutes).
const slots = Array.from({ length: 16 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  const label = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  return { id: label.replace(':', ''), label };
});
const at = (h, m) => `2026-10-26T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`;
const app = (id, label, status, company, building, name, role, email, created, extra = {}) => ({
  id, slot_id: label.replace(':', ''), label, status, company, building, name, role, email,
  first_name: name.split(' ')[0], linkedin: `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}-example`,
  surprise: 'Example answer: something LinkedIn would not tell you.',
  why: 'Example answer: one or two sentences on why this team belongs in the room.',
  phone: null, deck: null, created_at: created, decided_by: null, ...extra,
});
const data = {
  base: BASE,
  event: EVENT,
  who: 'you@forward.one',
  emailConfigured: true,
  pageUrl: PAGE,
  slots,
  apps: [
    app('a1', '09:00', 'pending', 'Northwind Robotics', 'robots that fold laundry', 'Ann Example', 'CEO', 'ann@northwind.example', at(8, 12)),
    app('a2', '10:30', 'approved', 'Lumen Labs', 'batteries from seaweed', 'Bo Sample', 'Founder', 'bo@lumen.example', at(9, 40), { phone: '+358 40 000 0000', decided_by: 'reviewer@forward.one' }),
    app('a3', '11:00', 'pending', 'Quill', 'contracts that read themselves', 'Cy Demo', 'CTO', 'cy@quill.example', at(10, 3)),
    app('a4', '13:30', 'pending', 'Fjord Sensors', 'wind turbine blades that report their own cracks', 'Dee Placeholder', 'CEO', 'dee@fjord.example', at(10, 31)),
    app('a5', '08:30', 'denied', 'Tundra Foods', 'protein from forest fungi', 'Eli Test', 'Founder', 'eli@tundra.example', at(7, 55), { decided_by: 'reviewer@forward.one' }),
  ],
};
const sample = {
  ...SAMPLE, event: EVENT, event_plain: plain({ EVENT_NAME: EVENT }),
  cancel_link: 'https://forwardone-pitch-booking.workers.dev/cancel?t=example', page_link: PAGE,
};
const defaults = TEMPLATE_KEYS.map((key) => ({ key, subject: TEMPLATES[key].subject, body: TEMPLATES[key].body, changed: false, updated_at: null, updated_by: null }));

const notice = '<p class="banner banner--neutral">Preview with invented sample data. Everything works on this page only: nothing is sent, decisions are not saved, and email changes stay in your own browser. Any email address gets in.</p>';

// Local stand-ins for the API, plus the preview's own login step and the
// saved email texts (kept in this browser so the list and editor agree).
const SHIM = String.raw`
var PREVIEW_KEY = 'pitch-preview-emails';
function previewEmails() { try { return JSON.parse(localStorage.getItem(PREVIEW_KEY) || '{}'); } catch (e) { return {}; } }
function previewSave(all) { try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(all)); } catch (e) {} }
var later = function (v) { return new Promise(function (ok) { setTimeout(function () { ok(v); }, 450); }); };
window.REVIEW_API = { decide: function () { return later({ ok: true }); } };
window.EMAIL_API = {
  save: function (b) {
    var all = previewEmails(); all[b.key] = { subject: b.subject, body: b.body, updated_at: new Date().toISOString(), updated_by: 'you (preview)' }; previewSave(all);
    return later({ ok: true, template: { key: b.key, subject: b.subject, body: b.body, changed: true } });
  },
  test: function () { return later({ ok: true, sentTo: 'you@forward.one', emailConfigured: true }); },
  reset: function (b) {
    var all = previewEmails(); delete all[b.key]; previewSave(all);
    var def = window.PREVIEW_DEFAULTS[b.key];
    return later({ ok: true, template: { key: b.key, subject: def.subject, body: def.body, changed: false } });
  },
};
try { var w = sessionStorage.getItem('pitch-preview-who'); if (w) document.getElementById('who').textContent = w; } catch (e) {}
window.PAGE_API = {
  save: function (values) {
    var defaults = JSON.parse(document.getElementById('page-data').textContent).defaults, out = {};
    Object.keys(values).forEach(function (k) { var v = values[k].trim(); if (v && v !== defaults[k]) out[k] = v; });
    try { localStorage.setItem('pitch-preview-page', JSON.stringify(out)); } catch (e) {}
    return later({ ok: true, values: out });
  },
};
document.getElementById('logout').addEventListener('click', function () {
  try { sessionStorage.removeItem('pitch-preview-in'); } catch (e) {}
  location.href = '${BASE}/';
});`;

const defaultsJs = `window.PREVIEW_DEFAULTS = ${JSON.stringify(Object.fromEntries(defaults.map((d) => [d.key, { subject: d.subject, body: d.body }])))};`;

function doc(title, inner, scripts) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<!-- Generated by booking/scripts/preview.mjs from booking/src/review.ts; sample data only. -->
<title>${title}</title>
${FONTS}
<style>${CSS}</style>
</head>
<body>${inner}<script>${defaultsJs}${SHIM}</script>${scripts}</body>
</html>
`;
}
const shell = (active) => ({ who: data.who, base: BASE, active, logout: 'button' });

// Requests, behind the preview's login step.
const loginGate = `<div class="login-gate" id="login-view"><main>${notice}${loginHtml(EVENT)}
  <div class="banner banner--ok" id="login-sent" hidden>
    <p class="flush">If <b id="login-to"></b> may review, a login link is on its way. In this preview no email is sent.</p>
    <p class="flush"><button class="btn btn--sm" type="button" id="login-open">Open the login link</button></p>
  </div></main></div>`;
const gateJs = String.raw`<script>(function () {
  var gate = document.getElementById('login-view'), app = document.querySelector('.app');
  var inside = false; try { inside = sessionStorage.getItem('pitch-preview-in') === '1'; } catch (e) {}
  function show(dash) { gate.hidden = dash; app.hidden = !dash; }
  show(inside);
  var form = gate.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.querySelector('input[type=email]').value.trim();
    setTimeout(function () {
      var b = form.querySelector('[type=submit]'); b.disabled = false; b.textContent = 'Send me a link';
      document.getElementById('login-to').textContent = email;
      document.getElementById('login-sent').hidden = false;
      document.getElementById('login-open').focus();
    }, 450);
  });
  document.getElementById('login-open').addEventListener('click', function () {
    var who = document.getElementById('login-to').textContent;
    try { sessionStorage.setItem('pitch-preview-in', '1'); sessionStorage.setItem('pitch-preview-who', who); } catch (e) {}
    document.getElementById('who').textContent = who;
    show(true);
  });
})();</script>`;
const requests = doc('Requests', loginGate + appHtml(shell('Requests'), notice + dashboardHtml(data)), gateJs + `<script>${CLIENT_JS}</script>`);

// Emails list: rows from the saved preview texts where there are any.
const emailsListJs = String.raw`<script>(function () {
  var all = previewEmails();
  document.querySelectorAll('tr[data-href]').forEach(function (tr) {
    var key = tr.dataset.href.replace(/\/$/, '').split('/').pop(), t = all[key];
    if (!t) return;
    tr.children[1].textContent = t.subject;
    tr.children[2].innerHTML = '<span class="pill pill--ok">Changed</span>';
    tr.children[3].innerHTML = 'you (preview)<br>' + t.updated_at.slice(0, 16).replace('T', ' ') + ' UTC';
  });
})();</script>`;
const emails = doc('Emails', appHtml(shell('Emails'), notice + emailsHtml(BASE, defaults)), emailsListJs);

// One editor per email; a saved preview text replaces the default on load.
const editors = defaults.map((t) => {
  const loadJs = String.raw`<script>(function () {
    var t = previewEmails()['${t.key}'];
    if (t) { document.getElementById('subject').value = t.subject; document.getElementById('body').value = t.body; }
    var d = JSON.parse(document.getElementById('email-data').textContent);
    if (t) { d.changed = true; document.getElementById('email-data').textContent = JSON.stringify(d);
      document.getElementById('state').innerHTML = '<span class="pill pill--ok">Changed</span>'; document.getElementById('reset').hidden = false; }
  })();</script>`;
  return [t.key, doc(TEMPLATES[t.key].title, appHtml(shell('Emails'), notice + emailEditHtml({ base: BASE, template: t, emailConfigured: true, sample })), loadJs + `<script>${EMAIL_JS}</script>`)];
});

// Page text: saved preview texts (this browser only) replace the originals on load.
const pageLoadJs = String.raw`<script>(function () {
  var saved = {}; try { saved = JSON.parse(localStorage.getItem('pitch-preview-page') || '{}'); } catch (e) {}
  Object.keys(saved).forEach(function (k) {
    var f = document.getElementById('pf-' + k); if (!f) return;
    f.value = saved[k];
    f.closest('.page-row').querySelector('[data-state]').innerHTML = '<span class="pill pill--ok">Changed</span>';
  });
})();</script>`;
const pageText = doc('Page text', appHtml(shell('Page text'), notice + pageTextHtml({ base: BASE, pageUrl: PAGE, values: {}, meta: {} })), pageLoadJs + `<script>${PAGE_JS}</script>`);

// Served at the same path as before: npx serve booking/preview-site
const root = new URL('../preview-site/forwardone/the-pitch/review-preview/', import.meta.url);
const write = (rel, html) => {
  const dir = new URL(rel, root);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL('index.html', dir), html);
};
write('./', requests);
write('emails/', emails);
write('page/', pageText);
for (const [key, html] of editors) write(`emails/${key}/`, html);
console.log(`preview: booking/preview-site/ (npx serve booking/preview-site, then /forwardone/the-pitch/review-preview/)`, ` (requests, emails, ${editors.length} editors, page text)`);

if (process.argv[2]) {
  // The Requests screen without the document skeleton (for a claude.ai artifact).
  writeFileSync(process.argv[2], requests.replace(/^[\s\S]*?<title>/, '<title>').replace(/<\/head>\s*<body>/, '').replace(/<\/body>\s*<\/html>\s*$/, '').replace('<meta charset="utf-8">', ''));
  console.log('fragment:', process.argv[2]);
}
