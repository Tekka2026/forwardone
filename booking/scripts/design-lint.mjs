// Dashboard design rules that the build can check (booking/DESIGN.md §7):
// colours only as tokens in :root, and no inline style attributes.
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/review.ts', import.meta.url), 'utf8');
const css = src.slice(src.indexOf('export const CSS = `'), src.indexOf('`;', src.indexOf('export const CSS = `')));
const outsideRoot = css.replace(/:root\s*\{[^}]*\}/, '');
const problems = [];
for (const m of outsideRoot.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g))
  problems.push(`colour literal outside :root: ${m[0]}`);
for (const m of src.matchAll(/style="[^"]*"/g)) problems.push(`inline style: ${m[0]}`);
for (const f of ['../src/index.ts'])
  for (const m of readFileSync(new URL(f, import.meta.url), 'utf8').matchAll(/style="[^"]*"/g)) problems.push(`inline style in ${f}: ${m[0]}`);
if (problems.length) {
  console.error('Design rules (booking/DESIGN.md):\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('design-lint: ok');
