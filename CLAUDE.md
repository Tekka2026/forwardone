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
- Before pushing, run `npm run check` and `npm run build` locally. Both must
  be clean.

## Stack

- Astro (static output), no UI framework. Content lives in `src/content/`
  (`home.ts`, `nav.ts`, `pages.ts`, `redirects.mjs`); components contain no
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
| A0004 | open   | Supply the values in `PLACEHOLDERS.md` (benchmark source, disclaimer, Proof outcome figures and logos, Fund I and II status, partner photos and two quotes, LP login URL, article categories and dates, newsletter endpoint). |
| A0005 | open   | Verify the Geist spacing values in `DESIGN.md` §6 against https://vercel.com/geist (spacing, Stack, Button). The site is unreachable from Claude's build environment, so the values were transcribed from memory of Geist's CSS variables. |
| A0006 | done   | Live homepage checked by the owner on 2026-10-13: Clash Display headings render, no console errors. |
| A0007 | done   | Button reference supplied by the owner on 2026-10-13 (vercel.com screenshot). Buttons take Geist's shape only (pill, sizes, type size); colours stay the site's own. |
| A0008 | open   | Repo Settings → Pages → Build and deployment → Source: choose **GitHub Actions**. Every push also starts a branch-based "pages build and deployment" (Jekyll) run that fails; the Astro workflow is what serves the site. |
