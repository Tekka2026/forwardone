// Renders each visuals/<name>/index.html to visuals/out/<name>.png at the
// size of its #card element, once its fonts have loaded. Runs in GitHub
// Actions (.github/workflows/render-visuals.yml).
// Usage: node visuals/render.mjs   (serve the repository root on :4600 first)
import { readdirSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const names = readdirSync(new URL('.', import.meta.url), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(new URL(`${d.name}/index.html`, import.meta.url)))
  // Videos are recorded by animate.mjs.
  .filter((d) => !/<body data-video>/.test(readFileSync(new URL(`${d.name}/index.html`, import.meta.url), 'utf8')))
  .map((d) => d.name);
mkdirSync(new URL('out/', import.meta.url), { recursive: true });
const browser = await chromium.launch();
for (const name of names) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
  await page.goto(`http://localhost:4600/visuals/${name}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => document.fonts.check('500 100px "Inter"') && document.fonts.check('500 40px "Geist Mono"'));
  if (!ok) throw new Error(`${name}: fonts did not load`);
  await (await page.$('#card')).screenshot({ path: new URL(`out/${name}.png`, import.meta.url).pathname });
  console.log('rendered', name);
}
await browser.close();
