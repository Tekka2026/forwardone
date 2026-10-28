// Records each visuals/<name>/index.html that has <body data-video> to
// visuals/out/<name>.mp4: window.frame(ms) sets every frame, so the timing is
// exact whatever the machine's speed. Identical frames are shot once.
// Usage: serve the repository root on :4600, then node visuals/animate.mjs
// (needs ffmpeg).
import { readdirSync, existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const FPS = 30;
const here = (p) => new URL(p, import.meta.url).pathname;
const names = readdirSync(here('.'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(here(`${d.name}/index.html`)) && /<body data-video>/.test(readFileSync(here(`${d.name}/index.html`), 'utf8')))
  .map((d) => d.name);
mkdirSync(here('out/'), { recursive: true });
const browser = await chromium.launch();
// Formats as in render.mjs: <html data-formats="5x7:2100 4x5:1875">.
const formats = (name) => {
  const m = readFileSync(here(`${name}/index.html`), 'utf8').match(/data-formats="([^"]*)"/);
  return (m ? m[1] : '5x7:2100').split(/\s+/).map((f, i) => ({ suffix: i ? `-${f.split(':')[0]}` : '', h: f.split(':')[1] }));
};
for (const base of names) for (const { suffix, h } of formats(base)) {
  const name = base + suffix;
  const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
  await page.goto(`http://localhost:4600/visuals/${base}/?h=${h}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-ready]');
  if (!(await page.evaluate(() => document.fonts.check('500 100px "Inter"') && document.fonts.check('100px "Covered By Your Grace"'))))
    throw new Error(`${name}: fonts did not load`);
  const card = await page.$('#card');
  const dir = here(`out/${name}-frames/`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir);
  const total = Math.ceil((await page.evaluate(() => window.DURATION)) / 1000 * FPS);
  const seen = new Map();
  for (let f = 0; f < total; f++) {
    const key = await page.evaluate((ms) => window.frame(ms), (f * 1000) / FPS);
    if (!seen.has(key)) seen.set(key, await card.screenshot());
    writeFileSync(`${dir}${String(f).padStart(5, '0')}.png`, seen.get(key));
  }
  // Video needs even sides: 1500 x 1875 (4:5) goes out at 1200 x 1500.
  const box = await card.boundingBox();
  const scale = Math.round(box.height) % 2 ? ['-vf', `scale=${Math.round(box.width * 0.8)}:${Math.round(box.height * 0.8)}:flags=lanczos`] : [];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}%05d.png`, ...scale,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', here(`out/${name}.mp4`)]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`recorded ${name}: ${total} frames, ${seen.size} distinct`);
}
await browser.close();
