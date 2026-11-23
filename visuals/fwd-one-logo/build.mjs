// FWD.one → FORWARD.one logo animation, 1920 × 1080 (owner, 2026-11-23).
//
// From the owner's slides 13 (FWD.one) and 14 (FORWARD.one), both on
// #0F121A with the letters in #F5F5F5. The motion is the website logo's
// (src/lib/wordmark.mjs, the same glyphs): F stays put, W and D move apart
// to the right and O, R, A and R come in through slots that open with the
// space, solid letters revealed by their slots (as on the site).
// Owner, 2026-11-23 (second version): the F in one place throughout (where
// slide 14 has it, so the end matches that slide), opening to the right;
// "one" (lowercase, as on the slides, at 75%) comes in only once FORWARD
// is complete, rising from below its baseline, masked, as the site's
// ".ONE" does. (The first version kept the lockup centred and showed "one"
// before the opening, as on slide 13.)
//
// Run: node visuals/fwd-one-logo/build.mjs          → public/visuals/fwd-one-logo.svg
//      node visuals/fwd-one-logo/build.mjs --video  → also public/visuals/fwd-one-logo.mp4
//      (60 fps, H.264; needs Playwright's Chromium and ffmpeg)

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { GLYPHS, layout, easeInOutCubic } from '../../src/lib/wordmark.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../public/visuals');
const { F, O, R, W, A, R2, D } = GLYPHS;

const BG = '#0F121A';
const GAP = 5; // px of background between a letter coming in and its neighbours
const INK = '#F5F5F5';

// "one" from slide 14 (FORWARD.one), in that slide's coordinates.
const ONE = [
  'M1482.27 563.347C1469.89 563.347 1462.71 555.471 1462.71 544.219C1462.71 530.371 1471.71 518.168 1487.03 518.168C1498.02 518.168 1504.77 525.092 1504.77 535.132C1504.77 537.642 1504.6 539.892 1504.08 542.142H1469.98C1469.89 542.748 1469.89 543.267 1469.89 543.787C1469.89 550.797 1473.61 557.029 1482.53 557.029C1489.71 557.029 1493.09 553.48 1495.51 548.028H1502.69C1499.75 557.981 1492.22 563.347 1482.27 563.347ZM1471.28 536.17H1497.07C1497.15 535.564 1497.15 535.218 1497.15 534.612C1497.15 528.208 1492.91 524.4 1486.16 524.4C1478.81 524.4 1473.09 529.333 1471.28 536.17Z',
  'M1411.78 562.828L1419.57 518.687H1425.72L1425.63 524.4C1428.66 521.197 1433.51 518.168 1440.52 518.168C1449 518.168 1455.66 522.669 1455.66 533.055C1455.66 534.699 1455.49 536.517 1455.14 538.507L1450.82 562.828H1443.72L1447.96 538.853C1448.22 537.382 1448.48 535.824 1448.48 533.66C1448.48 528.121 1445.1 524.659 1438.87 524.659C1430.39 524.659 1424.59 531.064 1422.77 541.017L1418.88 562.828H1411.78Z',
  'M1382.61 563.347C1371.1 563.347 1363.39 555.298 1363.39 544.306C1363.39 529.246 1374.13 518.168 1388.15 518.168C1399.66 518.168 1407.36 526.217 1407.36 537.209C1407.36 552.269 1396.63 563.347 1382.61 563.347ZM1383.21 557.029C1393.6 557.029 1400.18 548.028 1400.18 537.555C1400.18 529.766 1394.9 524.486 1387.54 524.486C1377.16 524.486 1370.58 533.487 1370.58 543.96C1370.58 551.749 1375.86 557.029 1383.21 557.029Z',
];
// Slide 14 is the storyboard frame shifted by (−86.769, −0.172): its F's
// "M542.268 528.69" is the frame's "M629.038 528.862". "one" is placed in
// frame coordinates by undoing that, inside the D's group.
const S14 = { x: -86.769, y: -0.172 };
// The slide sits 0.172 px above the frame (S14.y): the whole lockup is moved by that.
const ONE_TOP = 515; // above the letters' x-height, in frame coordinates
const ONE_BASE = 563.6; // just under the baseline (o and e overshoot)
const ONE_LEFT = 1363 - S14.x - 12;

// ---- Timing (seconds) ----
const T = {
  open: 0.8, // FWD starts opening to FORWARD
  openDur: 2.8,
  rise: 3.8, // "one" starts rising in, once FORWARD is complete
  riseDur: 1.6, // as the site (cubic-bezier(0.33, 1, 0.68, 1))
  end: 7.0, // holds FORWARD.one until then
};
const clamp = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, p) => a + (b - a) * p;
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3); // ≈ cubic-bezier(0.33, 1, 0.68, 1)

function state(t) {
  const p = easeInOutCubic(clamp((t - T.open) / T.openDur));
  // Closed slots, solid letters, as the site logo; GAP narrows each slot on
  // both sides (owner, 2026-11-23: "a couple px negative space in between
  // the letters appearing").
  const l = layout(p, true, GAP);
  const rise = easeOutCubic(clamp((t - T.rise) / T.riseDur));
  return {
    ...l,
    shift: S14.x, // F fixed where slide 14 has it
    oneX: 0,
    oneY: (1 - rise) * 60, // 60: below the mask
    oneOpacity: 0.75, // as on slide 14
  };
}

const f = (n) => (Math.round(n * 100) / 100).toString();
const oneGroup = (s) =>
  `<clipPath id="one-mask" clipPathUnits="userSpaceOnUse"><rect x="${f(ONE_LEFT)}" y="${ONE_TOP}" width="300" height="${f(ONE_BASE - ONE_TOP)}"/></clipPath>`;

// One frame as a static SVG (for the video).
export function frame(t) {
  const s = state(t);
  const letter = (k, d) =>
    `<g clip-path="url(#slot-${k})"><g transform="translate(${f(s[k])},0)"><path d="${d}" fill="${INK}"/></g></g>`;
  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>${['O', 'R', 'A', 'R2'].map((k) => `<clipPath id="slot-${k}" clipPathUnits="userSpaceOnUse"><polygon points="${s.slots[k]}"/></clipPath>`).join('')}${oneGroup(s)}</defs>
<rect width="1920" height="1080" fill="${BG}"/>
<g transform="translate(${f(s.shift)},${S14.y})">
<path d="${F}" fill="${INK}"/>
${letter('O', O)}${letter('R', R)}${letter('A', A)}${letter('R2', R2)}
<g transform="translate(${f(s.W)},0)"><path d="${W}" fill="${INK}"/></g>
<g transform="translate(${f(s.D)},0)"><path d="${D}" fill="${INK}"/>
<g clip-path="url(#one-mask)"><g transform="translate(${f(s.oneX - S14.x)},${f(s.oneY)})" opacity="${f(s.oneOpacity)}">${ONE.map((d) => `<path d="${d}" fill="${INK}"/>`).join('')}</g></g>
</g>
</g>
</svg>
`;
}

// The animated SVG: every value sampled at 30 steps a second into SMIL
// keyframes, plays once and stays on FORWARD.one.
function animated() {
  const FPS = 30;
  const times = [];
  for (let i = 0; i <= Math.round(T.end * FPS); i++) times.push(Math.min(T.end, i / FPS));
  const st = times.map(state);
  const keyTimes = times.map((t) => f(t / T.end)).join(';');
  const timing = `dur="${f(T.end)}s" begin="0s" calcMode="linear" keyTimes="${keyTimes}" fill="freeze"`;
  const tr = (fn) => `<animateTransform attributeName="transform" type="translate" ${timing} values="${st.map(fn).join(';')}"/>`;
  const s0 = st[0];
  const slot = (k) =>
    `<clipPath id="slot-${k}" clipPathUnits="userSpaceOnUse"><polygon points="${s0.slots[k]}"><animate attributeName="points" ${timing} values="${st.map((s) => s.slots[k]).join(';')}"/></polygon></clipPath>`;
  const letter = (k, d) =>
    `<g clip-path="url(#slot-${k})"><g transform="translate(${f(s0[k])},0)">${tr((s) => `${f(s[k])},0`)}<path d="${d}" fill="${INK}"/></g></g>`;
  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FORWARD.one">
<title>FORWARD.one</title>
<!-- Generated by visuals/fwd-one-logo/build.mjs; edit that, not this. -->
<defs>${['O', 'R', 'A', 'R2'].map(slot).join('\n')}${oneGroup(s0)}</defs>
<rect width="1920" height="1080" fill="${BG}"/>
<g transform="translate(${f(s0.shift)},${S14.y})">${tr((s) => `${f(s.shift)},${S14.y}`)}
<path d="${F}" fill="${INK}"/>
${letter('O', O)}
${letter('R', R)}
${letter('A', A)}
${letter('R2', R2)}
<g transform="translate(${f(s0.W)},0)">${tr((s) => `${f(s.W)},0`)}<path d="${W}" fill="${INK}"/></g>
<g transform="translate(${f(s0.D)},0)">${tr((s) => `${f(s.D)},0`)}<path d="${D}" fill="${INK}"/>
<g clip-path="url(#one-mask)"><g transform="translate(${f(s0.oneX - S14.x)},${f(s0.oneY)})" opacity="${f(s0.oneOpacity)}">${tr((s) => `${f(s.oneX - S14.x)},${f(s.oneY)}`)}<animate attributeName="opacity" ${timing} values="${st.map((s) => f(s.oneOpacity)).join(';')}"/>${ONE.map((d) => `<path d="${d}" fill="${INK}"/>`).join('')}</g></g>
</g>
</g>
</svg>
`;
}

mkdirSync(out, { recursive: true });
const svg = animated();
writeFileSync(join(out, 'fwd-one-logo.svg'), svg);
console.log(`fwd-one-logo.svg ${(svg.length / 1024).toFixed(0)} KB, ${T.end}s`);

if (process.argv.includes('--video')) {
  // The repository's Playwright, or the one installed globally.
  const { chromium } = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
  const FPS = 60;
  const dir = join(tmpdir(), 'fwd-one-logo-frames');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const n = Math.round(T.end * FPS);
  for (let i = 0; i < n; i++) {
    await page.setContent(`<html><body style="margin:0">${frame(i / FPS)}</body></html>`);
    await page.screenshot({ path: join(dir, `${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', join(dir, '%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    join(out, 'fwd-one-logo.mp4')]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`fwd-one-logo.mp4 ${n} frames at ${FPS} fps`);
}
