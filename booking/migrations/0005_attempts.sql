-- Letters per sender per hour (src/guard.ts): a keyed hash of the IP
-- address, never the address itself; rows older than a day are deleted.
CREATE TABLE IF NOT EXISTS attempts (
  key TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS attempts_key_at ON attempts (key, at);
