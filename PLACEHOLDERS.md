# Placeholders

Every value on the site that still has to be supplied. Each renders as a
visible dashed `[PLACEHOLDER …]` marker until replaced. Nothing here was
invented; replace the value in the file named and the marker disappears.

## Homepage (`src/content/home.ts`)

| Where | Key | Needed |
|---|---|---|
| Hero, stats, footnotes | `footnotes[0]` | Benchmark source and date for the top-5% ranking (footnote ¹). |
| Footnotes | `disclaimer` | Past performance disclaimer, to be supplied by compliance. |
| Case studies | `caseStudies.items[*].metric` | Outcome metric per company, e.g. "8× revenue in 3 years". The metric line is hidden while it is a placeholder. |
| Case studies | `caseStudies.items[*].logo` | Logo file per company. Drop SVGs in `public/logos/` and set the path. |
| Insights | `insights.articles[*].category` | Category of each featured article. |
| Insights | `insights.articles[*].date` | Publication date (ISO) of each featured article. |
| Insights | `insights.articles[*].slug` | Slugs are derived from titles; match them to the CMS slugs when the news collection is migrated. |
| Newsletter | `insights.newsletter.action` | Email service endpoint. The form currently prevents submission and shows a confirmation only. |

## Navigation and footer (`src/content/nav.ts`)

| Where | Key | Needed |
|---|---|---|
| Utility nav, Investors menu, footer | `LP_LOGIN_URL` | URL of the LP reporting portal. |
| Footer | `footer.partners[*].src` | Invest Europe, EU and EIF logos from the current site. Drop files in `public/partners/` and set the path. |
| Nav bar prompt | `navGreeting.ask.handler` | Endpoint for the "How can I help you" text field. Submitting currently shows a not-connected message. |

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
