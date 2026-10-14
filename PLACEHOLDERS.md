# Placeholders

Every value on the site that still has to be supplied. Each renders as a
visible dashed `[PLACEHOLDER …]` marker until replaced. Nothing here was
invented; replace the value in the file named and the marker disappears.

## Homepage (`src/content/home.ts`)

| Where | Key | Needed |
|---|---|---|
| Hero, stats, footnotes | `footnotes[0]` | Benchmark source and date for the top-5% ranking (footnote ¹). |
| Footnotes | `disclaimer` | Past performance disclaimer, to be supplied by compliance. |
| Proof slider | `caseStudies.groups[*].items[*].date` | Date at the top of each card, written as month and year, like "April 2022" (shown as "EXIT: APRIL 2022"): the exit date for Axign (Sensorfact and Mayht supplied). For QuantWare and Edmund (traction, no exit) decide which date to show, e.g. first investment. |
| Proof slider | `caseStudies.groups[*].items[*].visual` or `.video` | Visual per company card (Sensorfact, Mayht and QuantWare supplied as background videos). Either an image in the right half (transparent PNG/WebP works best on the dark card) or a short muted video filling the card (MP4; Claude adds a WebM copy and a poster frame). Drop files in `public/cases/`. |
| Proof slider | `caseStudies.groups[*].items[*].facts` | Optional: two or three short facts per company for the mono row at the card's bottom edge (like "Raw material origin · Carbon footprint"). Hidden while empty. |
| Proof slider | `caseStudies.groups[*].items[*].metric` | Outcome figure per company, e.g. "8× revenue in 3 years". Shown as a large figure in the card's top-right corner once filled; hidden while it is a placeholder. |
| Proof slider | `caseStudies.groups[*].items[*].logo` | Logo file per company (company pages). Drop SVGs in `public/logos/` and set the path. |
| Track record | `trackRecord.funds[1].status`, `trackRecord.funds[2].status` | Status of Fund II and Fund I (e.g. investing, follow-on only, harvesting). |
| The team | `partners.people[*].photo` | Portrait of each partner. Drop files in `public/team/` and set the path (4:5 crop). |
| The team | `partners.people[2].quote` | Quote from Robin van Boxsel. |
| The team | `partners.people[3].quote` | Quote from Paul Pruijmboom. |
| Insights | `insights.articles[*].category` | Category of each featured article. The repo has no news collection to pull it from. |
| Insights | `insights.articles[*].date` | Publication date (ISO) of each featured article. |
| Insights | `insights.articles[*].slug` | Slugs are derived from titles; match them to the CMS slugs when the news collection is migrated. |
| Newsletter | `insights.newsletter.action` | Email service endpoint. The form currently prevents submission and shows a confirmation only. |
| Investor portal preview | `portal.article.image` | Image for the article card in the dashboard illustration (the reference shows a photo of a man at a laptop). Drop a file in `public/portal/` and set the path. |
| Investor portal preview | `portal.classes.items[*].value` | Amount per asset class shown in the gauge's hover tooltip, for Equity, Fixed income and Cash accounts (only Cash deposits, EUR 800,100, was in the reference; the gauge shows the four largest classes only). The tooltip percentages are traced from the reference chart; correct them in `share` if you have the real split. |

## Navigation and footer (`src/content/nav.ts`)

| Where | Key | Needed |
|---|---|---|
| Utility nav, Investors menu, footer | `LP_LOGIN_URL` | URL of the LP reporting portal. |
| Footer | `footer.partners[*].src` | Invest Europe, EU and EIF logos from the current site. Drop files in `public/partners/` and set the path. |
| Nav bar prompt | `navGreeting.ask.handler` | Endpoint for the "How can we help you" text field. Submitting currently shows a not-connected message. |

## Brand

| Where | Needed |
|---|---|
| `src/components/ui/Logo.astro` | SVG wordmark from the current site. Renders as text until supplied. |
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
