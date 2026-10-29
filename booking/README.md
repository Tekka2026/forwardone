# Pitch booking service

Time slots for **The Pitch at Slush** (`/the-pitch`). One day, a list of
times. A founder picks a free time in the letter on the page; sending the
letter holds that slot as a *pending* request. A reviewer approves or denies
it on `/review`. Denying frees the slot at once; so does the founder's own
cancel link, and (only when `HOLD_DAYS` is set) a request nobody decided on
within that many days.

A Cloudflare Worker with a D1 (SQLite) database; email through Resend.

| Path | What |
|------|------|
| `GET /slots` | The times and whether each is free (the page calls this) |
| `POST /apply` | The letter as JSON; `409 slot_taken` if someone was quicker |
| `GET /review` | The team's page: slots, requests, Approve / Deny |
| `GET /cancel?t=…` | The founder's link from the confirmation email |
| `GET /copy` | Saved page texts; the pitch page loads them on every visit |
| `GET /review/page` | The team edits the pitch page's texts (Page text) |
| `POST /resend-events` | Resend's webhook: bounces and spam complaints |

Rules the database enforces: one live (pending or approved) request per slot,
and one per email address.

A click-through preview of `/review` with invented sample data (login,
Approve, Deny; nothing sent or saved) is built by `npm run preview` from
`src/review.ts` into `preview-site/` (not in git). It was on the site until
the campaign went live and was taken offline then (owner, 2026-10-29); view
it locally with `npx serve preview-site`. Dashboard design rules:
`DESIGN.md` in this folder.

## The letter's fields

Owner's letter of 2026-10-27 (`src/content/pitch.ts` on the site;
migration 0004): company, building, name, role, linkedin, surprise (what
LinkedIn does not tell), why (why they belong in the room), slot, email,
phone (the only optional one), first_name (the sign-off). `/apply` checks
lengths and requires the rest. LinkedIn arrives as the handle (the page
shows "jeroendelange1976" for a pasted profile address) and is stored as
`https://www.linkedin.com/in/<handle>`; another link gets `https://` when
sent without it. The deck link is no longer asked for. The dashboard shows why and
"not on LinkedIn" under the company, LinkedIn with the founder; the CSV
has every field; emails can greet with `{first_name}`.

## Spam, privacy and failures (CTO check, owner 2026-10-27)

- **Per sender:** at most 5 letters an hour from one internet connection
  (`src/guard.ts`; the IP address is stored only as a keyed hash, and only
  for a day). More gets "Too many requests…".
- **Bot check:** Cloudflare Turnstile. On when the GitHub variable
  `PITCH_TURNSTILE_SITE_KEY` and the secret `PITCH_TURNSTILE_SECRET` are
  both set; the page gets the key from `GET /copy`, so switching it on
  needs no Webflow paste. If Cloudflare's check cannot be reached, a
  letter goes through (the limit still applies).
- **Deletion:** on `DELETE_AFTER` (`wrangler.toml`, 18 February 2027, three
  months after Slush) the hourly run deletes every request. The page's
  privacy note promises this; download the CSV before that day.
- **Failed emails:** when Resend refuses an email, or (with the webhook
  below) an email bounces or is marked as spam, the reviewers get one email
  naming the address and the reason. Never about the reviewers' own mail.
- **CSV:** answers that start like a spreadsheet formula (`=`, `+`, `-`,
  `@`) get a leading `'`, so Excel shows them as text; phone numbers stay.

## Page text

The team edits the pitch page's texts on the dashboard (**Page text**): the
eyebrow, the text under the heading, the button, the privacy note, the
thank-you message, the four event facts and the map link behind Where
(owner, 2026-10-27). The page,
on Webflow and on the preview site, fetches `GET /copy` on every visit and
swaps the saved texts in, so no republishing is needed (answers are cached
for a minute). Without an answer it keeps the texts it was built with. The
originals come from the site's `src/content/pitch.ts` (`npm run defaults`
writes `src/page-defaults.json`; the deploy workflow runs it); a text equal
to its original or left empty is not stored. The heading and the letter are
not editable here.

## Emails

| When | To | What |
|------|----|------|
| Request sent | founder | "Your slot is on hold", with a cancel link |
| Approved | founder | Confirmation with a calendar invite (`.ics`; venue from the Where fact on Page text, map link in the notes) |
| Denied | founder | Polite no; the slot is released |
| Hold expired (`HOLD_DAYS`) | founder | The hold has ended |
| Every day at 18:00 Amsterdam | reviewers | One overview: new requests of the day (company, founder, what they build, why they belong, what LinkedIn does not tell, LinkedIn), cancellations, who is waiting, slots taken. Not sent when there is nothing new and nothing waiting. |

The team edits the four founder emails on the dashboard (`/review/emails`):
subject and text with placeholders (`{name}`, `{company}`, `{time}`, …), a
live example, Send test to me, and Revert to the default. Saved texts live in
the `email_templates` table; the defaults are in `src/copy.ts`. Reviewers get
no email per request (owner, 2026-10-26), only the daily overview. Until `MAIL_FROM` and `RESEND_API_KEY` are
set, emails are written to the Worker log instead of sent (the review login
link too, so the team can log in during setup via `wrangler tail`).

## Setup (once)

1. **Cloudflare** (free plan is enough): create an account, then an API token
   with *Workers Scripts: Edit* and *D1: Edit* for the account.
2. **GitHub → Settings → Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - `PITCH_REVIEWERS`: the reviewers' emails, comma separated
   - `RESEND_API_KEY` (step 3)
   - `PITCH_SESSION_SECRET` is optional: without it the first deploy makes one.
   - `PITCH_TURNSTILE_SECRET` and the **variable** (Variables tab)
     `PITCH_TURNSTILE_SITE_KEY`: Cloudflare → Turnstile → Add widget
     (hostnames `forward.one`, `www.forward.one`, `tekka2026.github.io`;
     mode Managed).
   - `PITCH_RESEND_WEBHOOK_SECRET`: Resend → Webhooks → Add endpoint
     `https://forwardone-pitch-booking.jeroen-191.workers.dev/resend-events`,
     events `email.bounced` and `email.complained`; the signing secret
     (`whsec_…`).
3. **Email**: a Resend account; verify the sending domain (DNS records on
   forward.one). Put the sender in `wrangler.toml` as `MAIL_FROM`, e.g.
   `FORWARD.one <pitch@forward.one>`.
4. **Slots**: fill `slots.json` (date, times). Each deploy brings the
   database in line with it; a slot that already has a request is never
   deleted.
5. Run the workflow *Deploy the pitch booking service* (Actions tab), or push
   a change in `booking/`. It creates the database, applies
   `migrations/`, loads the slots, deploys and sets the secrets.
6. Put the Worker's address (`https://forwardone-pitch-booking.<account>.workers.dev`)
   in `src/content/pitch.ts` as `bookingApi`. If the page moves (Webflow,
   forward.one), add that origin to `ALLOWED_ORIGINS` in `wrangler.toml`.

## Local

```sh
npm install
printf 'SESSION_SECRET=dev\nREVIEWERS=you@example.com\nALLOWED_ORIGINS=http://localhost:4321\n' > .dev.vars
npx wrangler d1 migrations apply forwardone-pitch --local
node scripts/slots-sql.mjs > slots.sql && npx wrangler d1 execute forwardone-pitch --local --file slots.sql
npx wrangler dev
```

Login links and emails appear in the `wrangler dev` output.
