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
// Each page lists its formats on <html data-formats="5x7:2100 4x5:1875">
// (name:height); the first is the plain name, the others get -<format>.
const formats = (name) => {
  const m = readFileSync(new URL(`${name}/index.html`, import.meta.url), 'utf8').match(/data-formats="([^"]*)"/);
  return (m ? m[1] : '5x7:2100').split(/\s+/).map((f, i) => ({ suffix: i ? `-${f.split(':')[0]}` : '', h: f.split(':')[1] }));
};
for (const name of names) {
  for (const { suffix, h } of formats(name)) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
    await page.goto(`http://localhost:4600/visuals/${name}/?h=${h}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => document.fonts.check('500 100px "Inter"') && document.fonts.check('500 40px "Geist Mono"'));
    if (!ok) throw new Error(`${name}: fonts did not load`);
    await (await page.$('#card')).screenshot({ path: new URL(`out/${name}${suffix}.png`, import.meta.url).pathname });
    console.log('rendered', name + suffix);
  }
}
await browser.close();
