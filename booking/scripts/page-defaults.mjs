// Reads the pitch page's original texts from src/content/pitch.ts (the site)
// into src/page-defaults.json, so the dashboard can show and restore them.
// Run before deploying (the deploy workflow does): npm run defaults
import { writeFileSync } from 'node:fs';
import { pitch } from '../../src/content/pitch.ts';

const defaults = {
  eyebrow_brand: pitch.eyebrow.brand,
  eyebrow_rest: pitch.eyebrow.rest,
  intro: pitch.intro.join('\n\n'),
  submit: pitch.submit,
  sent: pitch.sent,
  privacy: pitch.privacy,
  ...Object.fromEntries(pitch.facts.map((f) => [f.key, f.value])),
};
writeFileSync(new URL('../src/page-defaults.json', import.meta.url), JSON.stringify(defaults, null, 2) + '\n');
console.log('page-defaults:', Object.keys(defaults).length, 'texts');
