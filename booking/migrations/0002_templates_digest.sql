-- Editable founder emails (owner, 2026-10-26): one row per changed email;
-- an email without a row uses its default text from src/copy.ts.
CREATE TABLE email_templates (
  key TEXT PRIMARY KEY,         -- received | approved | denied | expired
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Small settings, e.g. when the last daily overview went out.
CREATE TABLE meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
