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

Rules the database enforces: one live (pending or approved) request per slot,
and one per email address.

A click-through preview of `/review` with invented sample data (login,
Approve, Deny; nothing sent or saved) is on the site at
`/the-pitch/review-preview/`, generated from `src/review.ts` by
`npm run preview` (not linked, `noindex`). Dashboard design rules:
`DESIGN.md` in this folder.

## Page text

The team edits the pitch page's texts on the dashboard (**Page text**): the
eyebrow, the text under the heading, the button, the privacy note, the
thank-you message and the four event facts (owner, 2026-10-27). The page,
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
| Approved | founder | Confirmation with a calendar invite (`.ics`) |
| Denied | founder | Polite no; the slot is released |
| Hold expired (`HOLD_DAYS`) | founder | The hold has ended |
| Every day at 18:00 Amsterdam | reviewers | One overview: new requests and cancellations of the day, who is waiting, slots taken. Not sent when there is nothing new and nothing waiting. |

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
