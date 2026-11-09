-- Waiting list (owner, 2026-11-09): once every slot is taken, a founder can
-- ask to be put on the list. Such a request has no slot (slot_id NULL) and
-- the status 'waitlist' until FORWARD.one assigns it a free slot (then it is
-- approved) or takes it off the list (denied), or the founder leaves it
-- (cancelled). SQLite cannot relax NOT NULL or a CHECK in place, so the
-- table is rebuilt with the same columns and data.
PRAGMA defer_foreign_keys = true;

CREATE TABLE applications_new (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  slot_id TEXT REFERENCES slots (id),   -- NULL while on the waiting list
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'denied', 'expired', 'cancelled', 'waitlist')),
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  building TEXT NOT NULL,
  deck TEXT,
  decided_at TEXT,
  decided_by TEXT,
  cancel_token TEXT NOT NULL,
  linkedin TEXT,
  surprise TEXT,
  why TEXT,
  first_name TEXT
);

INSERT INTO applications_new (id, created_at, slot_id, status, company, name, role, email, phone, building, deck, decided_at, decided_by, cancel_token, linkedin, surprise, why, first_name)
  SELECT id, created_at, slot_id, status, company, name, role, email, phone, building, deck, decided_at, decided_by, cancel_token, linkedin, surprise, why, first_name
  FROM applications;

DROP TABLE applications;
ALTER TABLE applications_new RENAME TO applications;

CREATE UNIQUE INDEX applications_one_per_slot
  ON applications (slot_id) WHERE status IN ('pending', 'approved');

-- One live request per founder email: a slot or a place on the list.
CREATE UNIQUE INDEX applications_one_per_email
  ON applications (email) WHERE status IN ('pending', 'approved', 'waitlist');

CREATE INDEX applications_status ON applications (status, created_at);
