-- The Pitch at Slush: time slots and applications (owner, 2026-10-26).
-- A slot is held by at most one pending or approved application; a denied,
-- expired or cancelled one releases it (the partial unique index below).

CREATE TABLE slots (
  id TEXT PRIMARY KEY,          -- "1400"
  label TEXT NOT NULL,          -- "14:00", Helsinki time
  starts_at TEXT NOT NULL,      -- ISO 8601, UTC
  ends_at TEXT NOT NULL
);

CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  slot_id TEXT NOT NULL REFERENCES slots (id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'denied', 'expired', 'cancelled')),
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,          -- lower case
  phone TEXT,
  building TEXT NOT NULL,
  deck TEXT,
  decided_at TEXT,
  decided_by TEXT,
  cancel_token TEXT NOT NULL
);

CREATE UNIQUE INDEX applications_one_per_slot
  ON applications (slot_id) WHERE status IN ('pending', 'approved');

-- One live request per founder email, so nobody holds several slots.
CREATE UNIQUE INDEX applications_one_per_email
  ON applications (email) WHERE status IN ('pending', 'approved');

CREATE INDEX applications_status ON applications (status, created_at);
