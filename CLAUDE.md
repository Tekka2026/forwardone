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
- Password (owner, 2026-11-17, work in progress): the deploy workflow runs
  `scripts/protect.mjs` after the build. Every page except `/the-pitch` and
  `/brand` is encrypted with StatiCrypt and opens only with the password in
  the GitHub secret `SITE_PASSWORD` ("Remember me" keeps it 30 days per
  device); without that secret those pages show a plain "Work in progress."
  page. Local builds (`npm run build`) are not affected. To open the site
  to everyone again, remove the step from `.github/workflows/deploy.yml`.
- Since 2026-10-26 a second session works on `/the-pitch` only (branch
  `claude/the-pitch`) and also fast-forwards the default branch. Before
  every push, fetch the default branch and merge it in; never force-push
  it.

## Stack

- Astro (static output), no UI framework. Content lives in `src/content/`
  (`home.ts`, `nav.ts`, `pages.ts`, `team.ts`, `pitch.ts`, `founders.ts`, `redirects.mjs`, and `brand/` for the
  brand guidelines at `/brand`, see `src/content/brand/README.md`); components contain no
  copy. Internal links go through `href()` from `src/lib/href.ts` so the
  `/forwardone` base path is applied.
- `public/tools/dither-track/` is a standalone one-file tool (dither, overlays
  and tracking for videos, see `visuals/README.md`); it is not part of the
  site's design system.
- Unknown values are visible `[PLACEHOLDER …]` markers and are listed in
  `PLACEHOLDERS.md`. Never invent a number, quote or outcome.

## Changes

- Always check the project as a whole before finishing a change (owner,
  2026-10-27): what else depends on it. For `/the-pitch` that is the page
  (`src/content/pitch.ts`, `src/pages/the-pitch.astro`), the booking service
  (`booking/`: `/apply` validation, database migrations, emails and their
  placeholders, the daily overview, the dashboard and its CSV), the dashboard
  preview (`npm run preview` in `booking/`), the Webflow export
  (`node webflow/export.mjs`, and tell the owner to paste it again when
  layout or behaviour changed), and the docs (`DESIGN.md`,
  `booking/README.md`, `booking/DESIGN.md`, `PLACEHOLDERS.md`).

## Design

- `DESIGN.md` and `css/global.css` are the layout source of truth. Read
  `DESIGN.md` before any page or component work.

## Action items

| Code  | Status | Action |
|-------|--------|--------|
| A0001 | cancelled | Disable GitHub Pages. Withdrawn: the live site is wanted, so Pages stays on. |
| A0002 | done   | Live site updates via the default branch. Decided 2026-10-12: see "Publishing" above. |
| A0003 | done   | Pages source is GitHub Actions. The first workflow deploy succeeded on 2026-10-12 without a settings change. |
| A0004 | open   | Supply the values in `PLACEHOLDERS.md` (benchmark source, disclaimer, Proof outcome figures and logos, partner photos and two quotes, LP login URL, article images). |
| A0005 | done   | Geist spacing values in `DESIGN.md` §6 (transcribed from memory of Geist's CSS variables): accepted as they are by the owner on 2026-10-26, no check against vercel.com/geist needed. |
| A0006 | done   | Live homepage checked by the owner on 2026-10-13: Clash Display headings render, no console errors. |
| A0007 | done   | Button reference supplied by the owner on 2026-10-13 (vercel.com screenshot). Buttons take Geist's shape only (pill, sizes, type size); colours stay the site's own. |
| A0008 | done   | Pages source switched to GitHub Actions by the owner on 2026-10-13. |
| A0009 | done   | Homepage LCP and the H1's `--reveal-start` delay (800ms; local mobile emulation measured 2.6s): accepted as it is by the owner on 2026-10-26, no PageSpeed run or change needed. |
| A0010 | cancelled | Licence for KMR Apparat. Withdrawn 2026-10-17: the headings went back to Clash Display and the font was removed. |
| A0011 | done   | Fundrbird logo icon supplied by the owner on 2026-10-19; redrawn as a line icon in the portal preview's top-bar icon row. |
| A0012 | open   | Supply the founders strip content (see `PLACEHOLDERS.md`, Founders strip): the founders' names and CEO photos, three more companies, brand colours, checked one-liners, five short vertical team videos with a caption and the presenter's photo. |
| A0013 | done   | Portfolio list for the founders strip: 17 current companies taken from forward.one/portfolio via web search on 2026-10-19 (the site itself stays unreachable from Claude's environment; allowing `www.forward.one` under Network access would let Claude read it directly). |
| A0014 | open   | Supply the details for the clip presenter's team profile (`/about/team/presenter`, see `PLACEHOLDERS.md`, Team profiles): name, role, city, bio, focus, year joined, LinkedIn and email, background, the companies they work with, their articles, and a larger portrait. |
| A0015 | cancelled | Licence for CB Install (Calame Bureau). Withdrawn 2026-10-21: the headings went back to Clash Display and the trial font was removed. |
| A0016 | done   | The Pitch at Slush venue and deadline: entered on the dashboard (Page text) by 2026-10-27: Where "Haaga-Helia Pasila Campus, Room 1206 (entrance level). Ratapihantie 13, 00520 Helsinki. A short walk from Slush.", Apply by "Friday Nov 6th". 18 November, 08:00–16:00 Helsinki time, 30-minute slots. The calendar invite takes its venue from Where. |
| A0017 | open   | Founders page (`/founders`, see `PLACEHOLDERS.md`, Founders page): four visuals for the "Why founders pick us" deck, the 12 portfolio logos as SVG (the company sites are unreachable from Claude's environment), the reply time (days) and decision time (weeks), the pitch form URL or mailto, and the pitch email. |
| A0018 | done   | The Pitch booking service (`booking/`; dashboard rules in `booking/DESIGN.md`): live since 2026-10-26 at https://forwardone-pitch-booking.jeroen-191.workers.dev (dashboard: `/review`; Cloudflare account of the owner; deployed by `.github/workflows/deploy-booking.yml`). Tested by the team 2026-10-26/27; the Webflow page carries the 2026-11-17 code (waiting list and closed message, smoke test). Expiry of unreviewed requests no longer needed: applications closed on 16 November (A0041). |
| A0019 | done   | The Pitch on Webflow: live at https://www.forward.one/events/2026/the-pitch-at-slush-2026 (owner, 2026-10-27), pasted from `webflow/the-pitch/` (`head` into Inside <head>, `body-all` into Before </body>; see `webflow/README.md`). Text edits come from the dashboard (Page text) without pasting; after a layout or behaviour change, paste both files again. |
| A0020 | done   | Repository location: FORWARD.one created FORWARDoneVC/forward.one (2026-10-26), but the owner decided the same day to keep the project in Tekka2026/forwardone for now. Moving later needs the Claude GitHub app installed on FORWARDoneVC by an owner of that organisation, and Admin rights for the owner. |
| A0021 | done   | www.forward.one did not resolve on 2026-10-27: the `www` CNAME to Webflow had been replaced by an `anthropic-domain-verification` TXT at TransIP that day (SOA serial 2026102700). Restored the same day (serial 2026102701): `www` → CNAME `cdn.webflow.com.`, site answers 200. Check again any time with `.github/workflows/dns-check.yml` (Actions tab). |
| A0022 | done   | CTO check of /the-pitch (2026-10-27): the owner chose fixes 1, 2, 3 and 6 (spam limit and bot check, privacy note and deletion after 18 February 2027, warnings on failed emails, safe CSV); built. Not chosen: shared account access, a page address of its own. |
| A0023 | open   | Turn on the bot check: Cloudflare → Turnstile → Add widget (hostnames forward.one, www.forward.one, tekka2026.github.io; Managed). Put the site key in GitHub as the variable `PITCH_TURNSTILE_SITE_KEY` and the secret key as the secret `PITCH_TURNSTILE_SECRET`, then run "Deploy the pitch booking service". **First** paste the latest Webflow files (they contain the check's spot): a page from before 2026-10-27 has none, and once the check is on its letters are refused. |
| A0024 | done   | Bounce warnings: Resend webhook to `https://forwardone-pitch-booking.jeroen-191.workers.dev/resend-events` (email.bounced, email.complained) and the secret `PITCH_RESEND_WEBHOOK_SECRET` set by the owner on 2026-10-27; deployed the same day, the endpoint now refuses unsigned calls (smoke test). |
| A0025 | done   | Two more dashboard logins (one at HCVC, one at Balnord): `PITCH_REVIEWERS` updated by the owner on 2026-10-27, deploy run the same day. Reviewer addresses live only in that secret, not in this public repository. Every reviewer also gets the daily overview and the failed-email warnings. |
| A0026 | done   | Names for the LinkedIn video (`visuals/linkedin-pitch-video/`), by investor, from the owner on 2026-10-28: FORWARD.one Quantware, Voltfang, Optics11; Balnord Sapient Perception, ATMOS Space Cargo; HCVC Alpine Eagle, Dyna Robotics. The video takes turns between the three. |
| A0027 | done   | Campaign launch, 2026-10-29: the six test requests deleted from the live database at the owner's request (`.github/workflows/booking-data.yml`, which lists requests without personal details), and the dashboard preview with sample data taken off the site (`npm run preview` now builds it locally, `booking/preview-site/`). |
| A0028 | open   | Decide whether to make the repository private (Claude's advice, 2026-10-29: yes, with GitHub Pro, which keeps the github.io preview site; nothing secret is in it, but the history holds email addresses). The Webflow page and the booking service work either way. |
| A0029 | done   | One more dashboard login (FORWARD.one): added to `PITCH_REVIEWERS` by the owner on 2026-10-30; the deploy that brings it to the service run the same day. A change to that secret only works after "Deploy the pitch booking service" runs. |
| A0030 | cancelled | Licence for KMR Apparat. Withdrawn 2026-11-06: Aeonik is the font going forward (A0038). KMR Apparat stays loaded only to fill the characters the Aeonik trial lacks, and goes once the licensed Aeonik is in. |
| A0031 | cancelled | Regola Pro S Light: tried on the headings and display numbers as a test on 2026-11-03; the owner switched back to KMR Apparat the same day and the font file was removed. |
| A0032 | done   | Network access to brand.curri.com for the brand guidelines reference: allowed by the owner on 2026-11-05. |
| A0033 | open   | Brand guidelines (`/brand`, built 2026-11-05 on brand.curri.com's structure). Filled the same day from the FORWARD.one Brand Foundation doc (Welcome, Foundations, Color), the site's fonts (Typography) and the supplied wordmark (Logo, with an SVG download). Still to supply: what `PLACEHOLDERS.md`, Brand guidelines lists (brand contact, figures and examples, logo rules, the five Draft pages). Decide whether to link `/brand` from the main site (now unlinked and `noindex`). |
| A0034 | open   | Brand Foundation doc: four comments from Sim (2026-10-30) propose new wording for Vision, Positioning, belief 2 (AI) and belief 5 (Founders lead). They are not in the doc's text, so `/brand` follows the text as it stands. Accept or reject them in the doc; Claude then updates `src/content/brand/foundations.ts`. |
| A0035 | cancelled | F37 Lineca Arabic (Book and Medium): tried on the headings and display numbers as a test on 2026-11-06; the owner switched back to KMR Apparat the same day and the font files were removed. |
| A0036 | cancelled | Aeonik TRIAL (CoType, Light and Medium): tried on the headings and display numbers as a test on 2026-11-06; the owner moved on to F37 Lineca one weight heavier the same day (A0037) and the trial files were removed. |
| A0037 | cancelled | F37 Lineca (Medium and Bold): tried on the headings and display numbers as a test on 2026-11-06; the owner meant Aeonik one weight heavier instead (A0038) and the font files were removed the same day. |
| A0038 | open   | Aeonik (CoType) is the font going forward (owner, 2026-11-06): Regular for the headings and the key figures, SemiBold for the €383M. The site still runs on the trial files, which are in the public repo and lack € % ’ quotes, dashes and accents (those fall back to KMR Apparat). Buy a web licence for Aeonik Regular and SemiBold and supply the WOFF2 files. Claude then swaps them in and removes the trial files and KMR Apparat. |
| A0039 | done   | What we do visual (the FWD artwork on light blue): supplied as a file by the owner on 2026-11-16 and placed the same day (`public/visuals/what-we-do.webp`). |
| A0040 | done   | Website password: `SITE_PASSWORD` set and "Deploy to GitHub Pages" run by the owner on 2026-11-17 (confirmed: "It works!"). Every page except /the-pitch and /brand asks for it. |
| A0041 | done   | /the-pitch closes Monday 16 November, 23:59 Helsinki time (owner, 2026-11-17; `CLOSES_AT` in `booking/wrangler.toml`): after it `/apply` refuses every letter and the page shows the closed message instead of the letter (editable on Page text, "Closed message"). Pasted on Webflow by the owner on 2026-11-17 (smoke test confirms). |
| A0042 | done   | "Final details" email (own time, location, map link, phone number) sent to every approved founder by the owner on 2026-11-17 from the dashboard (Requests → Email approved founders). The dashboard shows when it was last sent and to how many. |
| A0043 | done   | Section 1 background video: the file of ASML's brand film ("121_ASML_BRANDFILM-BLACK_60-90s", by Wolfstreet; Vimeo refuses downloads from Claude's environment) uploaded by the owner on 2026-11-18 and placed the same day as the homepage intro's background film (sound removed, cut before the ASML end card). |
| A0044 | open   | Replace the homepage intro film (`public/visuals/intro-film.mp4`) with FORWARD.one's own footage before the site opens to the public: it is ASML's brand film, for the password-protected preview only (owner, 2026-11-18). The owner chose to push it although the repository is public, so the file is in its history and reachable by its direct address. Now the owner's 34-second 1080p cut (2026-11-18); the first, 640 × 360 version is also in the history. Supply the replacement in at least 1920 × 1080. |
| A0045 | done   | Pitch page on Webflow: the files of 2026-11-17 (the text under the heading removed) pasted and published by the owner (confirmed 2026-11-19). |
| A0046 | done   | The owner is left out of "CC the investors" on the dashboard's Send screen: secret `PITCH_CC_SKIP` set by him on 2026-11-19, deployed the same day (the deploy uploaded CC_SKIP). The address stays out of this public repository. He still gets the daily overview and the failed-email warnings. |
