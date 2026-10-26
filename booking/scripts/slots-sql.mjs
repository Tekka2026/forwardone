// slots.json -> SQL that brings the slots table in line with the list:
// new and changed slots are upserted; slots no longer listed are removed
// unless an application refers to them. Usage: node scripts/slots-sql.mjs > slots.sql
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('../slots.json', import.meta.url), 'utf8'));
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const time = /^([01]\d|2[0-3]):[0-5]\d$/;
const lines = [];
const ids = [];
if (cfg.slots.length && !/^\d{4}-\d{2}-\d{2}$/.test(cfg.date)) throw new Error('slots.json: set "date" (YYYY-MM-DD)');
for (const s of cfg.slots) {
  if (!time.test(s.start) || !time.test(s.end)) throw new Error(`slots.json: bad time in ${JSON.stringify(s)}`);
  const id = s.start.replace(':', '');
  const start = new Date(`${cfg.date}T${s.start}:00${cfg.offset}`).toISOString();
  const end = new Date(`${cfg.date}T${s.end}:00${cfg.offset}`).toISOString();
  if (end <= start) throw new Error(`slots.json: ${s.start} ends before it starts`);
  ids.push(id);
  lines.push(
    `INSERT INTO slots (id, label, starts_at, ends_at) VALUES (${q(id)}, ${q(s.start)}, ${q(start)}, ${q(end)}) ` +
      `ON CONFLICT (id) DO UPDATE SET label = excluded.label, starts_at = excluded.starts_at, ends_at = excluded.ends_at;`,
  );
}
lines.push(
  `DELETE FROM slots WHERE id NOT IN (${ids.map(q).join(', ') || "''"}) AND id NOT IN (SELECT slot_id FROM applications);`,
);
process.stdout.write(lines.join('\n') + '\n');
