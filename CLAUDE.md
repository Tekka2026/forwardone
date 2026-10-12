# Working conventions for this repository

## Reporting

- **Always end a task with the URL.** When work is done, the final message
  includes the GitHub URL of the branch (or the pull request, if one exists).
  Branch URL format: `https://github.com/Tekka2026/forwardone/tree/<branch>`.
- **Action codes.** Anything the user must do themselves (a setting only they
  can change, a decision, a credential) is listed as a numbered action item
  with a code: `A0001`, `A0002`, … Codes are sequential across the whole
  project and never reused. Keep the running list below up to date: add new
  items, mark done ones.

## Design

- `DESIGN.md` and `css/global.css` are the layout source of truth. Read
  `DESIGN.md` before any page or component work.

## Action items

| Code  | Status | Action |
|-------|--------|--------|
| A0001 | open   | Disable GitHub Pages: repo Settings → Pages → Source: None. The API path is blocked from Claude sessions. |
