// FWD → FORWARD wordmark animation (owner, 2026-11-16).
//
// Storyboard: storyboard-54.svg (FWD), storyboard-71.svg (in between),
// storyboard-72.svg (FORWARD), all 1920×1080 on #181818. F stays put; W and
// D move apart to their places in FORWARD; O and R come in between F and W,
// A and R between W and D, slowly, as the space opens. As in frame 71, each
// of those four has its own slot (slanted at the italic angle) that opens
// with the space: the gap between F and W splits into an O slot and an R
// slot, the gap between W and D into an A slot and an R slot. A letter
// slides out from behind its slot's left edge (its right part first), a
// little behind the slot, and fades in. Slots never overlap, so neither do
// the letters.
//
// The glyphs are the storyboard's own paths at their final (frame 72)
// places, moved with translate. Motion is sampled at 30 steps a second into
// SMIL keyframes, so it plays as a plain SVG (also in an <img> tag) with
// any easing.
//
// Run: node visuals/forward-wordmark/build.mjs
// Writes public/visuals/forward-wordmark.svg (plays once, ends on FORWARD)
// and public/visuals/forward-wordmark-loop.svg (FWD → FORWARD → FWD, again),
// and the same two without the fade (-nofade): solid letters, revealed by
// their slots only. -reverse and -reverse-nofade play FORWARD → FWD once.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../public/visuals');

// ---- Glyphs, from frame 72 (order there: D, R, A, W, R, O, F) ----
const final = readFileSync(join(here, 'storyboard-72.svg'), 'utf8');
const paths = [...final.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
if (paths.length !== 7) throw new Error(`expected 7 glyphs in frame 72, found ${paths.length}`);
const [D, R2, A, W, R, O, F] = paths;

const BG = '#181818';
const INK = '#FFEA6D';

// Moves from FWD (frame 54) to FORWARD (frame 72), from the paths' own
// points: W's "M746.12 619" becomes "M1012.59 619", D's "M902.155 494.705"
// becomes "M1435.83 494.705".
const W_FROM = 746.12 - 1012.59; // -266.47
const D_FROM = 902.155 - 1435.83; // -533.675


// Italic slant of the letters' straight edges (dx per dy).
const SLANT = 0.1839;
// Edges at the cap line (y 461) in FORWARD: F's right, W's left and right,
// D's left. The gaps between them clip the letters coming in.
const F_RIGHT = 641.517;
const W_LEFT = 931.094;
const W_RIGHT = 1041.59;
const D_LEFT = 1331.62;
// Slot boundaries between the two letters in each gap (at the cap line):
// between O and R, and between A and R, with room on both sides in FORWARD.
const OR_EDGE = 786;
const AR_EDGE = 1186;
const K1 = (OR_EDGE - F_RIGHT) / (W_LEFT - F_RIGHT);
const K2 = (AR_EDGE - W_RIGHT) / (D_LEFT - W_RIGHT);

// The letters coming in. Each moves with the right edge of its slot (O with
// the O/R edge, R with W, A with the A/R edge, R with D), so it slides out
// from behind the slot's left edge as the slot opens: `from` is where that
// puts it in FWD, hidden. They come in slowly by fading, in reading order
// within each gap, over `fade` (as a share of SPREAD).
const IN = {
  O: { from: (F_RIGHT + (W_LEFT + W_FROM - F_RIGHT) * K1) - OR_EDGE, fade: [0.08, 0.7] },
  R: { from: W_FROM, fade: [0.2, 0.85] },
  A: { from: (W_RIGHT + W_FROM + (D_LEFT + D_FROM - W_RIGHT - W_FROM) * K2) - AR_EDGE, fade: [0.12, 0.78] },
  R2: { from: D_FROM, fade: [0.25, 0.92] },
};
// Without the fade the slots must be shut in FWD, or slivers of the four
// letters would show in the narrow spaces between F, W and D. There each
// gap opens from zero width with the spread (its right edge a few pixels
// short of W or D until it arrives), and the letters start further left.
const IN_CLOSED = {
  O: F_RIGHT - OR_EDGE,
  R: F_RIGHT - W_LEFT,
  A: W_RIGHT + W_FROM - AR_EDGE,
  R2: W_RIGHT + W_FROM - D_LEFT,
};
const Y_TOP = 430;
const Y_BOTTOM = 650;

// ---- Timing (seconds) ----
const HOLD = 0.8; // FWD before it opens
const SPREAD = 2.8; // F, W and D moving apart, the slots opening
const FORWARD_END = HOLD + SPREAD;
const FPS = 30;

const clamp = (x) => Math.min(1, Math.max(0, x));
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

// State at time t on the forward run (0 = FWD, FORWARD_END = FORWARD).
function state(t, closed = false) {
  const u = (t - HOLD) / SPREAD; // 0..1
  const p = easeInOutCubic(clamp(u));
  const s = {
    p,
    W: W_FROM * (1 - p),
    D: D_FROM * (1 - p),
  };
  for (const [k, v] of Object.entries(IN)) {
    s[k] = (closed ? IN_CLOSED[k] : v.from) * (1 - p);
    s[k + 'o'] = easeInOutSine(clamp((u - v.fade[0]) / (v.fade[1] - v.fade[0])));
  }
  return s;
}

const f = (n) => (Math.round(n * 100) / 100).toString();
function gap(left, right) {
  // Parallelogram between two slanted edges given at the cap line.
  const at = (x461, y) => x461 - SLANT * (y - 461);
  return [
    [at(left, Y_TOP), Y_TOP],
    [at(right, Y_TOP), Y_TOP],
    [at(right, Y_BOTTOM), Y_BOTTOM],
    [at(left, Y_BOTTOM), Y_BOTTOM],
  ]
    .map(([x, y]) => `${f(x)},${f(y)}`)
    .join(' ');
}

// Build one SVG from a timeline: `times` (seconds, 0..dur) mapped to states.
function build({ dur, sample, loop, title, fades = true }) {
  const closed = !fades;
  const times = [];
  for (let i = 0; i <= Math.round(dur * FPS); i++) times.push(Math.min(dur, i / FPS));
  if (times[times.length - 1] !== dur) times.push(dur);
  const states = times.map((t) => sample(t));
  const keyTimes = times.map((t) => f(t / dur)).join(';');
  const timing = `dur="${f(dur)}s" begin="0s" calcMode="linear" keyTimes="${keyTimes}" ${loop ? 'repeatCount="indefinite"' : 'fill="freeze"'}`;
  const move = (key) =>
    `<animateTransform attributeName="transform" type="translate" ${timing} values="${states.map((s) => `${f(s[key])},0`).join(';')}"/>`;
  const fade = (key) => `<animate attributeName="opacity" ${timing} values="${states.map((s) => f(s[key + 'o'])).join(';')}"/>`;
  const first = states[0];
  // Slot edges at the cap line, from F, W and D.
  const end1 = (s) => (closed ? F_RIGHT + (W_LEFT - F_RIGHT) * s.p : W_LEFT + s.W);
  const end2 = (s) => (closed ? W_RIGHT + s.W + (D_LEFT - W_RIGHT) * s.p : D_LEFT + s.D);
  const or = (s) => F_RIGHT + (end1(s) - F_RIGHT) * K1;
  const ar = (s) => W_RIGHT + s.W + (end2(s) - W_RIGHT - s.W) * K2;
  const slots = {
    O: (s) => gap(F_RIGHT, or(s)),
    R: (s) => gap(or(s), end1(s)),
    A: (s) => gap(W_RIGHT + s.W, ar(s)),
    R2: (s) => gap(ar(s), end2(s)),
  };
  const clip = (key) =>
    `<clipPath id="fwd-slot-${key}" clipPathUnits="userSpaceOnUse"><polygon points="${slots[key](first)}"><animate attributeName="points" ${timing} values="${states.map(slots[key]).join(';')}"/></polygon></clipPath>`;
  // Without fades (owner, 2026-11-16, to compare) the letters are solid
  // and only the slots reveal them.
  const letter = (key, d) =>
    fades
      ? `<g clip-path="url(#fwd-slot-${key})"><g transform="translate(${f(first[key])},0)" opacity="${f(first[key + 'o'])}">${move(key)}${fade(key)}<path d="${d}" fill="${INK}"/></g></g>`
      : `<g clip-path="url(#fwd-slot-${key})"><g transform="translate(${f(first[key])},0)">${move(key)}<path d="${d}" fill="${INK}"/></g></g>`;

  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<title>${title}</title>
<!-- Generated by visuals/forward-wordmark/build.mjs; edit that, not this. -->
<defs>
${clip('O')}
${clip('R')}
${clip('A')}
${clip('R2')}
</defs>
<rect width="1920" height="1080" fill="${BG}"/>
<path d="${F}" fill="${INK}"/>
${letter('O', O)}
${letter('R', R)}
${letter('A', A)}
${letter('R2', R2)}
<g transform="translate(${f(first.W)},0)">${move('W')}<path d="${W}" fill="${INK}"/></g>
<g transform="translate(${f(first.D)},0)">${move('D')}<path d="${D}" fill="${INK}"/></g>
</svg>
`;
}

mkdirSync(out, { recursive: true });

// Once: FWD, opens to FORWARD, stays.
const once = build({ dur: FORWARD_END, sample: state, loop: false, title: 'FORWARD' });
writeFileSync(join(out, 'forward-wordmark.svg'), once);
const onceSolid = build({ dur: FORWARD_END, sample: (t) => state(t, true), loop: false, title: 'FORWARD', fades: false });
writeFileSync(join(out, 'forward-wordmark-nofade.svg'), onceSolid);

// Loop: FWD → FORWARD, holds, closes back to FWD a little quicker.
const HOLD_OPEN = 2.4;
const CLOSE = (FORWARD_END - HOLD) * 0.8;
const LOOP = FORWARD_END + HOLD_OPEN + CLOSE;
const loopSample = (closed) => (t) => {
  if (t <= FORWARD_END) return state(t, closed);
  if (t <= FORWARD_END + HOLD_OPEN) return state(FORWARD_END, closed);
  const back = (t - FORWARD_END - HOLD_OPEN) / CLOSE; // 0..1
  return state(FORWARD_END - back * (FORWARD_END - HOLD), closed);
};
const loop = build({ dur: LOOP, loop: true, title: 'FORWARD', sample: loopSample(false) });
writeFileSync(join(out, 'forward-wordmark-loop.svg'), loop);
const loopSolid = build({ dur: LOOP, loop: true, title: 'FORWARD', sample: loopSample(true), fades: false });
writeFileSync(join(out, 'forward-wordmark-loop-nofade.svg'), loopSolid);

// Reverse (owner, 2026-11-16): FORWARD, then closes to FWD and stays.
// Holds FORWARD as long as the forward run holds FWD.
const reverseSample = (closed) => (t) => state(Math.max(HOLD, FORWARD_END - Math.max(0, t - HOLD)), closed);
writeFileSync(
  join(out, 'forward-wordmark-reverse.svg'),
  build({ dur: FORWARD_END, sample: reverseSample(false), loop: false, title: 'FWD' }),
);
writeFileSync(
  join(out, 'forward-wordmark-reverse-nofade.svg'),
  build({ dur: FORWARD_END, sample: reverseSample(true), loop: false, title: 'FWD', fades: false }),
);

console.log(`forward-wordmark.svg ${(once.length / 1024).toFixed(0)} KB, ${FORWARD_END.toFixed(2)}s`);
console.log(`forward-wordmark-loop.svg ${(loop.length / 1024).toFixed(0)} KB, ${LOOP.toFixed(2)}s`);
