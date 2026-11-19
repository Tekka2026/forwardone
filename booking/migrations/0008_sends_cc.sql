-- Whether the investors (dashboard logins) were in CC of a send (owner,
-- 2026-11-19: so founders and investors have each other's address).
ALTER TABLE sends ADD COLUMN cc INTEGER NOT NULL DEFAULT 0;
