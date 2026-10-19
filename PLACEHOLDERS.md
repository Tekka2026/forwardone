# Placeholders

Every value on the site that still has to be supplied. Each renders as a
visible dashed `[PLACEHOLDER …]` marker until replaced. Nothing here was
invented; replace the value in the file named and the marker disappears.

## Homepage (`src/content/home.ts`)

| Where | Key | Needed |
|---|---|---|
| Hero, stats, footnotes | `footnotes[0]` | Benchmark source and date for the top-5% ranking (footnote ¹). |
| Footnotes | `disclaimer` | Past performance disclaimer, to be supplied by compliance. |
| Founders strip | `founders.people[*].name`, `.photo` | Name and photo (portrait, 5:7, at least 800 × 1120) of each of the 20 founders (CEOs). Photos go in `public/founders/`. Done: Optics11 Life (Jacquelien ten Dam, name and photo); ROCSYS (Crijn Bouman, CEO & Co-founder; photo still needed). |
| Founders strip | `founders.people[*].company` | Three of the 20 slots still need a company (17 are filled from forward.one/portfolio). Never a Proof company (`caseStudies`) or an exit (`trackRecord.exits`): the build fails if one is. |
| Founders strip | `founders.people[*].colour` | Brand colour (hex) per company card. Empty falls back to a site tone. |
| Founders strip | `founders.people[*].blurb` | Check the one-liners under the company names (paraphrased from the forward.one portfolio pages). |
| Founders strip | `founders.clips[*].video`, `.poster`, `.person`, `.caption` | Five short vertical videos of FORWARD.one team members (MP4, about 9:16, cropped to 5:7; muted autoplay), with a poster frame, the person's name and role, and a one-line caption. Until then all five play `public/founders/clip-placeholder.mp4` (the owner's placeholder clip, 2026-10-19). |
| Founders strip | `founders.clip.handle` | The social handle shown on the clips (e.g. the TikTok or Instagram account). |
| Proof slider | `caseStudies.groups[*].items[*].date` | Date at the top of each card, written as month and year, like "April 2022" (shown as "EXIT: APRIL 2022"): the exit date for Axign (Sensorfact and Mayht supplied). For QuantWare and Edmund (traction, no exit) decide which date to show, e.g. first investment. |
| Proof slider | `caseStudies.groups[*].items[*].visual` or `.video` | Visual per company card (Sensorfact, Mayht and QuantWare supplied as background videos). Either an image in the right half (transparent PNG/WebP works best on the dark card) or a short muted video filling the card (MP4; Claude adds a WebM copy and a poster frame). Drop files in `public/cases/`. |
| Proof slider | `caseStudies.groups[*].items[*].facts` | Optional: two or three short facts per company for the mono row at the card's bottom edge (like "Raw material origin · Carbon footprint"). Hidden while empty. |
| Proof slider | `caseStudies.groups[*].items[*].metric` | Outcome figure per company, e.g. "8× revenue in 3 years". Shown as a large figure in the card's top-right corner once filled; hidden while it is a placeholder. |
| Proof slider | `caseStudies.groups[*].items[*].logo` | Logo file per company (company pages). Drop SVGs in `public/logos/` and set the path. |
| Track record | `trackRecord.funds[1].status`, `trackRecord.funds[2].status` | Status of Fund II and Fund I (e.g. investing, follow-on only, harvesting). |
| The team | `partners.people[*].photo` | Portrait of each partner. Drop files in `public/team/` and set the path (4:5 crop). |
| The team | `partners.people[2].quote` | Quote from Robin van Boxsel. |
| The team | `partners.people[3].quote` | Quote from Paul Pruijmboom. |
| Insights | `insights.articles[2].image` | Visual for the third featured article (the first has the robot arm, the second the Munich map), 5:7 portrait (cropped to 7:5 landscape on phones, so keep the subject centred). Drop files in `public/insights/` and set the path; until then a flat light grey box. |
| Insights | `insights.articles[*].slug` | Slugs are derived from titles; match them to the CMS slugs when the news collection is migrated. |

## Navigation and footer (`src/content/nav.ts`)

| Where | Key | Needed |
|---|---|---|
| Utility nav, Investors menu, footer | `LP_LOGIN_URL` | URL of the LP reporting portal. |
| Nav bar prompt | `navGreeting.ask.handler` | Endpoint for the "How can we help you" text field. Submitting currently shows a not-connected message. |

## Brand

| Where | Needed |
|---|---|
| `css/global.css` colour tokens | Brand colours. Current values are neutral placeholders. |

## Stub pages (`src/content/pages.ts`)

Every route other than the homepage renders a heading, a one-line intro and
`TODO` blocks listing the content it needs. See that file for the full list.
The `/founders` page needs a pitch email address or form URL.

## Hosting

| Item | Needed |
|---|---|
| 301 redirects | GitHub Pages cannot send server redirects. The legacy URLs work via meta-refresh pages and the 404 fallback. For true 301s, deploy the map in `src/content/redirects.mjs` on Netlify, Vercel or Cloudflare Pages. |
| Custom domain | When forward.one is attached, set `BASE_PATH=/` and `SITE_URL=https://forward.one` in `.github/workflows/deploy.yml`. |

## Team profiles (`src/content/team.ts`)

| Where | Key | Needed |
|---|---|---|
| Profile of the clip presenter (`/about/team/presenter`) | `team[0]` | Name (the URL changes to their name then), role, city, one-line intro, a three-paragraph bio, focus sectors, year joined, LinkedIn URL and email, background (roles and education with years), the portfolio companies they work with, their articles, and a portrait of at least 1200 × 1500 (the current photo is the 536 × 536 avatar). |
