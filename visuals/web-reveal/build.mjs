// Two 1920 × 1080 videos of the website's reveals (owner, 2026-11-26), in
// 8086 white (#F5F5F5) on Space black (#0F121A), the site's own white and
// black:
// - fwd-reveal.mp4: the FWD letters of the homepage's "What we do" visual
//   (src/assets/brand/fwd-letters.svg), 685 px wide, coming in as on the
//   site (WhatWeDo.astro): F and W snap up in 80 ms steps, 90 ms apart, the
//   D rises smoothly, each out of a mask at its own baseline.
// - h1-reveal.mp4: the homepage H1 "Every proven step / earns the next",
//   its first line 1356 px wide, word by word as on the site
//   (src/components/ui/Sentences.astro), the last word rising smoothly and
//   tinted from Solar yellow to white (the dark theme's gradient).
// The timings and keyframes are the site's (--reveal-frame 80 ms,
// --reveal-stagger 90 ms, --reveal-step 0.02 em, --reveal-tint-duration
// 32 frames). Each page is rendered in Chromium and stepped through its
// animations frame by frame at 60 fps, then encoded with ffmpeg (H.264).
//
// Run: node visuals/web-reveal/build.mjs   → public/visuals/fwd-reveal.mp4, h1-reveal.mp4

import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const out = join(root, 'public/visuals');
const BG = '#0F121A';
const INK = '#F5F5F5';
const TINT = '#FFEA6D'; // the dark theme's --reveal-tint (Solar)
const FPS = 60;
const font = (f) => pathToFileURL(join(root, 'src/assets/fonts', f)).href;

const base = `
  html, body { margin: 0; width: 1920px; height: 1080px; background: ${BG}; overflow: hidden; }
  :root { --reveal-frame: 80ms; --reveal-stagger: 90ms; --reveal-start: 500ms; }
  @font-face { font-family: "Aeonik Trial"; font-weight: 100 399; src: url("${font('aeonik-trial/AeonikTRIAL-Regular.woff2')}") format("woff2"); }
  @font-face { font-family: "KMR Apparat"; font-weight: 300; src: url("${font('kmr-apparat/KMR-Apparat-Light.woff2')}") format("woff2"); }
`;

// ---- FWD ----
const [D, W, F] = [...readFileSync(join(root, 'src/assets/brand/fwd-letters.svg'), 'utf8').matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
// The visible letters 685 px wide: the 407-unit frame holds 401.1 units of
// ink (measured), so the frame is a little wider.
const FWD_INK = 685;
const FWD_W = (FWD_INK * 407) / 401.1;
const FWD_H = (FWD_W * 159) / 407;
const fwdPage = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  svg { position: absolute; left: ${(1920 - FWD_W) / 2 + 6}px; /* +6: the ink sits left in its frame; centred on the ink */ top: ${(1080 - FWD_H) / 2}px; width: ${FWD_W}px; height: ${FWD_H}px; overflow: visible; }
  .l { animation: snap calc(var(--reveal-frame) * 4) step-end both; animation-delay: calc(var(--reveal-start) + var(--i) * var(--reveal-stagger)); }
  .l--d { animation: rise calc(var(--reveal-frame) * 9) cubic-bezier(0.2, 0.7, 0.2, 1) both; animation-delay: calc(var(--reveal-start) + var(--i) * var(--reveal-stagger)); }
  @keyframes snap { 0% { transform: translateY(170px); } 25% { transform: translateY(44px); } 50% { transform: translateY(22px); } 75%, 100% { transform: translateY(0); } }
  @keyframes rise { 0% { transform: translateY(170px); } 11.111% { transform: translateY(160px); } 100% { transform: translateY(0); } }
</style></head><body>
<svg viewBox="0 0 407 159"><defs><clipPath id="c" clipPathUnits="userSpaceOnUse"><rect x="-20" y="-2" width="447" height="162"/></clipPath></defs>
<g clip-path="url(#c)">
  <g class="l" style="--i:0"><path d="${F}" fill="${INK}"/></g>
  <g class="l" style="--i:1"><path d="${W}" fill="${INK}"/></g>
  <g class="l l--d" style="--i:2"><path d="${D}" fill="${INK}"/></g>
</g></svg></body></html>`;

// ---- H1 ----
const LINES = [['Every', 'proven', 'step'], ['earns', 'the', 'next']];
// The first line's visible letters 1356 px wide: its box holds the side
// bearings of "E" and "p" too (1.27% more, measured).
const LINE_INK = 1356;
const LINE_W = LINE_INK * 1.0127;
let n = 0;
const total = LINES.flat().length;
const h1Html = LINES.map((ws) => ws.map((w) => { const i = n++; return `<span class="rw${i === total - 1 ? ' rw--last' : ''}" style="--i:${i}">${w}</span>`; }).join(' ')).join(' <br>');
const h1Page = (fs) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  @property --rw-sweep { syntax: '<percentage>'; inherits: false; initial-value: 100%; }
  h1 { position: absolute; margin: 0; left: ${(1920 - LINE_W) / 2}px; top: 50%; transform: translateY(-50%);
       font-family: "Aeonik Trial", "KMR Apparat", sans-serif; font-weight: 300; font-size: ${fs}px; line-height: 0.98; letter-spacing: 0;
       color: ${INK}; --reveal-step: 0.02em; white-space: nowrap; }
  .rw { display: inline-block; opacity: 0; animation: rw-in calc(var(--reveal-frame) * 4) step-end forwards; animation-delay: calc(var(--reveal-start) + var(--i) * var(--reveal-stagger)); }
  .rw--last { --rw-sweep: 100%; background: linear-gradient(90deg, ${INK} var(--rw-sweep), ${TINT} calc(var(--rw-sweep) + 100%));
    padding-block: 0.25em; margin-block: -0.25em; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
    animation: rw-show calc(var(--reveal-frame) * 9) step-end forwards, rw-rise calc(var(--reveal-frame) * 9) cubic-bezier(0.2, 0.7, 0.2, 1) forwards, rw-tint calc(var(--reveal-frame) * 32) cubic-bezier(0.45, 0, 0.2, 1) both;
    animation-delay: calc(var(--reveal-start) + var(--i) * var(--reveal-stagger)), calc(var(--reveal-start) + var(--i) * var(--reveal-stagger)), calc(var(--reveal-start) + var(--i) * var(--reveal-stagger) + var(--reveal-frame)); }
  @keyframes rw-in { 0% { opacity: 0; transform: translateY(calc(2 * var(--reveal-step))); } 25% { opacity: 1; transform: translateY(calc(2 * var(--reveal-step))); } 50% { opacity: 1; transform: translateY(var(--reveal-step)); } 75%, 100% { opacity: 1; transform: translateY(0); } }
  @keyframes rw-show { 0% { opacity: 0; } 11.111%, 100% { opacity: 1; } }
  @keyframes rw-rise { 0% { transform: translateY(calc(7 * var(--reveal-step))); } 100% { transform: translateY(0); } }
  @keyframes rw-tint { from { --rw-sweep: 0%; } }
</style></head><body><h1>${h1Html}</h1></body></html>`;

const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
const browser = await chromium.launch();
const tmp = join(tmpdir(), 'web-reveal');
mkdirSync(tmp, { recursive: true });

async function record(name, html, seconds, prepare) {
  const file = join(tmp, `${name}.html`);
  writeFileSync(file, html);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  if (prepare) await prepare(page);
  const dir = join(tmp, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir);
  const frames = Math.round(seconds * FPS);
  for (let i = 0; i < frames; i++) {
    const t = (i * 1000) / FPS;
    await page.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, t);
    await page.screenshot({ path: join(dir, `${String(i).padStart(4, '0')}.png`) });
  }
  await page.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', join(dir, '%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(out, `${name}.mp4`)]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`${name}.mp4: ${frames} frames, ${seconds}s`);
}

// FWD: 0.5s dark, the reveal (~0.9s), then held to 3s.
await record('fwd-reveal', fwdPage, 3);

// H1: find the font size that makes the first line 1356 px wide.
const probe = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
writeFileSync(join(tmp, 'probe.html'), h1Page(100));
await probe.goto(pathToFileURL(join(tmp, 'probe.html')).href);
await probe.evaluate(() => document.fonts.ready);
const w100 = await probe.evaluate(() => { const s = [...document.querySelectorAll('.rw')].slice(0, 3); return s[2].getBoundingClientRect().right - s[0].getBoundingClientRect().left; });
await probe.close();
const fs = (100 * LINE_W) / w100;
console.log(`H1 font size ${fs.toFixed(2)}px (first line ${LINE_INK}px of ink)`);
// 0.5s dark, words from 0.5s to ~1.7s, tint to ~3.8s, held to 5s.
await record('h1-reveal', h1Page(fs), 5);

await browser.close();
