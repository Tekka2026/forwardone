-- Emails the team sends to a group of founders from the dashboard's Send
-- screen (owner, 2026-11-19): what went out, when, by whom, to how many.
CREATE TABLE IF NOT EXISTS sends (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  by TEXT NOT NULL,
  grp TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  count INTEGER NOT NULL
);
