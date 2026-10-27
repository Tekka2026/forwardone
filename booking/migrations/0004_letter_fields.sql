-- The new letter (owner, 2026-10-27): LinkedIn, what LinkedIn does not tell,
-- why they belong in the room, and the sign-off name. The deck link is no
-- longer asked for (the column stays for earlier requests).
ALTER TABLE applications ADD COLUMN linkedin TEXT;
ALTER TABLE applications ADD COLUMN surprise TEXT;
ALTER TABLE applications ADD COLUMN why TEXT;
ALTER TABLE applications ADD COLUMN first_name TEXT;
