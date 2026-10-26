/**
 * The team's review page: every slot with who holds it, and the requests
 * with Approve / Deny. Plain server-rendered HTML in the site's look
 * (Inter, black on white, pill buttons); no script.
 */
import type { Application, Env, Slot } from './env';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap');
  :root { --fg:#111; --muted:#666; --hair:rgba(0,0,0,.14); --ok:#05a85a; --no:#e0251b; }
  * { box-sizing: border-box; }
  body { margin:0; font:16px/1.5 Inter, system-ui, sans-serif; color:var(--fg); background:#fff; }
  main { max-width:1100px; margin:0 auto; padding:24px; }
  h1 { font-weight:500; font-size:32px; margin:24px 0 8px; }
  h2 { font-weight:500; font-size:20px; margin:40px 0 12px; }
  p { margin:8px 0; }
  .muted { color:var(--muted); }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th, td { text-align:left; vertical-align:top; padding:10px 8px; border-top:1px solid var(--hair); }
  th { font-weight:500; color:var(--muted); }
  .slots { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:8px; }
  .slot { border:1px solid var(--hair); padding:8px 12px; font-size:14px; }
  .slot b { font-weight:500; }
  .tag { display:inline-block; font-size:12px; padding:0 8px; border-radius:999px; border:1px solid var(--hair); }
  .tag--approved { border-color:var(--ok); color:var(--ok); }
  .tag--pending { border-color:#c98a00; color:#a06e00; }
  form { display:inline; margin:0; }
  button, input[type=email] { font:inherit; font-size:14px; height:32px; border-radius:999px; padding:0 14px; }
  button { border:0; background:#111; color:#fff; cursor:pointer; }
  button.ghost { background:#fff; color:#111; box-shadow:inset 0 0 0 1px var(--hair); }
  input[type=email] { border:1px solid var(--hair); min-width:260px; }
  .row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .top { display:flex; justify-content:space-between; align-items:center; gap:16px; }
  a { color:inherit; }
`;

export function page(title: string, body: string) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title><style>${STYLE}</style></head><body><main>${body}</main></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

export function loginPage(env: Env, message = '') {
  return page(
    'Review: log in',
    `<h1>${esc(env.EVENT_NAME)}: review</h1>
     <p class="muted">Reviewers log in with a link sent to their email.</p>
     ${message ? `<p>${esc(message)}</p>` : ''}
     <form method="post" action="/review/login" class="row">
       <input type="email" name="email" required autocomplete="email" placeholder="you@forward.one" aria-label="Email address">
       <button type="submit">Send me a link</button>
     </form>`,
  );
}

export function reviewPage(env: Env, who: string, slots: Slot[], apps: (Application & { label: string })[], flash = '') {
  const holder = new Map(apps.filter((a) => a.status === 'pending' || a.status === 'approved').map((a) => [a.slot_id, a]));
  const slotList = slots.length
    ? `<div class="slots">${slots
        .map((s) => {
          const a = holder.get(s.id);
          return `<div class="slot"><b>${esc(s.label)}</b><br>${
            a ? `${esc(a.company)} <span class="tag tag--${a.status}">${a.status}</span>` : '<span class="muted">free</span>'
          }</div>`;
        })
        .join('')}</div>`
    : '<p class="muted">No slots yet (booking/slots.json).</p>';

  const row = (a: Application & { label: string }) => `<tr>
      <td><b>${esc(a.label)}</b></td>
      <td><b>${esc(a.company)}</b><br>${esc(a.building)}${a.deck ? `<br><a href="${esc(a.deck)}" rel="noopener noreferrer" target="_blank">Deck</a>` : ''}</td>
      <td>${esc(a.name)}${a.role ? `, ${esc(a.role)}` : ''}<br><a href="mailto:${esc(a.email)}">${esc(a.email)}</a>${a.phone ? `<br>${esc(a.phone)}` : ''}</td>
      <td class="muted">${esc(a.created_at.slice(0, 16).replace('T', ' '))} UTC</td>
      <td>${
        a.status === 'pending'
          ? `<div class="row">
               <form method="post" action="/review/decide"><input type="hidden" name="id" value="${esc(a.id)}"><input type="hidden" name="decision" value="approved"><button type="submit">Approve</button></form>
               <form method="post" action="/review/decide"><input type="hidden" name="id" value="${esc(a.id)}"><input type="hidden" name="decision" value="denied"><button type="submit" class="ghost">Deny</button></form>
             </div>`
          : `<span class="tag tag--${a.status}">${a.status}</span>${a.decided_by ? `<br><span class="muted">${esc(a.decided_by)}</span>` : ''}`
      }</td>
    </tr>`;
  const table = (list: (Application & { label: string })[]) =>
    list.length
      ? `<table><thead><tr><th>Time</th><th>Company</th><th>Founder</th><th>Received</th><th></th></tr></thead><tbody>${list.map(row).join('')}</tbody></table>`
      : '<p class="muted">None.</p>';

  return page(
    'Review',
    `<div class="top"><h1>${esc(env.EVENT_NAME)}: review</h1>
       <form method="post" action="/review/logout"><button type="submit" class="ghost">Log out</button></form></div>
     <p class="muted">Logged in as ${esc(who)}. Times are Helsinki time. Denying a request frees its slot at once.</p>
     ${flash ? `<p>${esc(flash)}</p>` : ''}
     <h2>Slots</h2>${slotList}
     <h2>To review</h2>${table(apps.filter((a) => a.status === 'pending'))}
     <h2>Decided</h2>${table(apps.filter((a) => a.status !== 'pending'))}`,
  );
}
