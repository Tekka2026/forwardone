# Working conventions for this repository

## Reporting

- **Always end a task with the URL of the live webpage**, not the repository:
  `https://tekka2026.github.io/forwardone/` (plus the page path if the work was
  on a specific page). The live site is built by GitHub Actions from the
  **default branch**, so it only shows work that has reached that branch.
- **Action codes.** Anything the user must do themselves (a setting only they
  can change, a decision, a credential) is listed as a numbered action item
  with a code: `A0001`, `A0002`, … Codes are sequential across the whole
  project and never reused. Keep the running list below up to date: add new
  items, mark done ones.

## Publishing

- The owner (jeroen@havok.nl) gave standing permission on 2026-10-12 to push
  to the default branch (`claude/forwardone-web-gl4kz9`) without asking.
- After every push to a working branch, fast-forward the default branch to the
  same commit so the live site reflects the latest work:
  `git push origin HEAD:claude/forwardone-web-gl4kz9`.
- `.github/workflows/deploy.yml` builds the Astro site on every push to the
  default branch and deploys it to GitHub Pages (Pages source must be
  "GitHub Actions", see A0003). A deploy takes one to two minutes.
- The workflow also runs on a schedule at 00:05 and 01:05 Amsterdam time on
  1 January, so the footer's build-time year (`© FORWARD.one <year>.`) rolls
  over without a push. Builds run with `TZ=Europe/Amsterdam`.
- Before pushing, run `npm run check` and `npm run build` locally. Both must
  be clean.
- Since 2026-10-26 a second session works on `/the-pitch` only (branch
  `claude/the-pitch`) and also fast-forwards the default branch. Before
  every push, fetch the default branch and merge it in; never force-push
  it.

## Stack

- Astro (static output), no UI framework. Content lives in `src/content/`
  (`home.ts`, `nav.ts`, `pages.ts`, `team.ts`, `pitch.ts`, `founders.ts`, `redirects.mjs`); components contain no
  copy. Internal links go through `href()` from `src/lib/href.ts` so the
  `/forwardone` base path is applied.
- Unknown values are visible `[PLACEHOLDER …]` markers and are listed in
  `PLACEHOLDERS.md`. Never invent a number, quote or outcome.

## Design

- `DESIGN.md` and `css/global.css` are the layout source of truth. Read
  `DESIGN.md` before any page or component work.

## Action items

| Code  | Status | Action |
|-------|--------|--------|
| A0001 | cancelled | Disable GitHub Pages. Withdrawn: the live site is wanted, so Pages stays on. |
| A0002 | done   | Live site updates via the default branch. Decided 2026-10-12: see "Publishing" above. |
| A0003 | done   | Pages source is GitHub Actions. The first workflow deploy succeeded on 2026-10-12 without a settings change. |
| A0004 | open   | Supply the values in `PLACEHOLDERS.md` (benchmark source, disclaimer, Proof outcome figures and logos, Fund I and II status, partner photos and two quotes, LP login URL, article images). |
| A0005 | done   | Geist spacing values in `DESIGN.md` §6 (transcribed from memory of Geist's CSS variables): accepted as they are by the owner on 2026-10-26, no check against vercel.com/geist needed. |
| A0006 | done   | Live homepage checked by the owner on 2026-10-13: Clash Display headings render, no console errors. |
| A0007 | done   | Button reference supplied by the owner on 2026-10-13 (vercel.com screenshot). Buttons take Geist's shape only (pill, sizes, type size); colours stay the site's own. |
| A0008 | done   | Pages source switched to GitHub Actions by the owner on 2026-10-13. |
| A0009 | open   | Run https://pagespeed.web.dev on the live homepage (mobile) and share the LCP. The H1 is the LCP element and its intro animation waits `--reveal-start` (800ms), which adds to LCP; local mobile emulation measured 2.6s (good is 2.5s or less). Decide whether to shorten the delay. |
| A0010 | cancelled | Licence for KMR Apparat. Withdrawn 2026-10-17: the headings went back to Clash Display and the font was removed. |
| A0011 | done   | Fundrbird logo icon supplied by the owner on 2026-10-19; redrawn as a line icon in the portal preview's top-bar icon row. |
| A0012 | open   | Supply the founders strip content (see `PLACEHOLDERS.md`, Founders strip): the founders' names and CEO photos, three more companies, brand colours, checked one-liners, five short vertical team videos with a caption and the presenter's photo. |
| A0013 | done   | Portfolio list for the founders strip: 17 current companies taken from forward.one/portfolio via web search on 2026-10-19 (the site itself stays unreachable from Claude's environment; allowing `www.forward.one` under Network access would let Claude read it directly). |
| A0014 | open   | Supply the details for the clip presenter's team profile (`/about/team/presenter`, see `PLACEHOLDERS.md`, Team profiles): name, role, city, bio, focus, year joined, LinkedIn and email, background, the companies they work with, their articles, and a larger portrait. |
| A0015 | cancelled | Licence for CB Install (Calame Bureau). Withdrawn 2026-10-21: the headings went back to Clash Display and the trial font was removed. |
| A0016 | open   | The Pitch at Slush (`/the-pitch`, see `PLACEHOLDERS.md`, The ____ Pitch): give the date, venue and deadline; supply the privacy note (applications go to the booking service, A0018). The prize wording "term sheet" was confirmed by the owner on 2026-10-21; the second VC is Balnord (2026-10-22). |
| A0017 | open   | Founders page (`/founders`, see `PLACEHOLDERS.md`, Founders page): four visuals for the "Why founders pick us" deck, the 12 portfolio logos as SVG (the company sites are unreachable from Claude's environment), the reply time (days) and decision time (weeks), the pitch form URL or mailto, and the pitch email. |
| A0018 | open   | The Pitch booking service (`booking/`, built 2026-10-26: founders pick a time, FORWARD.one approves or denies on `/review`, a denied request frees the slot). To switch it on, see booking/README.md "Setup": (1) a Cloudflare account and an API token (Workers Scripts: Edit, D1: Edit); (2) GitHub Actions secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `PITCH_REVIEWERS` (reviewers' emails), `RESEND_API_KEY`; (3) a Resend account with forward.one verified (DNS) and the sender address; (4) the pitch date and time slots; (5) whether unreviewed requests should expire after N days. |
| A0019 | open   | The Pitch on Webflow: live there since 2026-10-26 (owner), pasted from `webflow/the-pitch/` (`head` into Inside <head>, `body-all` into Before </body>; see `webflow/README.md`). After each page change, paste both again. Send Claude the Webflow page URL (needed for the booking service's allowed origins, A0018). |
