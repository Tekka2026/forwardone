-- Texts on the pitch page edited on the dashboard (owner, 2026-10-27): one
-- row per changed text; a text without a row keeps the page's original.
CREATE TABLE page_copy (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
