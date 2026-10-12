# Working conventions for this repository

## Reporting

- **Always end a task with the URL of the live webpage**, not the repository:
  `https://tekka2026.github.io/forwardone/` (plus the page path if the work was
  on a specific page). GitHub Pages serves the **default branch** from its root,
  so the live site only shows work that has reached the default branch.
  `index.html` at the root is the entry page.
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
- Pages takes a minute or so to rebuild after a push.

## Design

- `DESIGN.md` and `css/global.css` are the layout source of truth. Read
  `DESIGN.md` before any page or component work.

## Action items

| Code  | Status | Action |
|-------|--------|--------|
| A0001 | cancelled | Disable GitHub Pages. Withdrawn: the live site is wanted, so Pages stays on. |
| A0002 | done   | Live site updates via the default branch. Decided 2026-10-12: see "Publishing" above. |
