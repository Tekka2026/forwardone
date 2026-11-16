/**
 * Robot arm visual, photorealistic (owner, 2026-11-16: "should feel super
 * photorealistic"), rendered with three.js. Same arm, size and behaviour as
 * the earlier hand-written WebGL version (src/components/visuals/RobotArm.astro
 * has the history): a six-axis arm in matte black powder coat holding the
 * yellow Sensorfact sensor, which follows the mouse while the pointer is over
 * the box, glances around near the viewer when idle, turns slowly on a
 * turntable, can be dragged to turn the view (it holds still meanwhile and
 * the view eases back), and opens the card's article on a click or tap.
 *
 * What makes it photoreal: physically based materials (powder-coat paint
 * with a fine grain in its roughness and relief, black anodised aluminium,
 * a glossy yellow cap), rounded edges on every part, image-based studio
 * lighting (RoomEnvironment) plus a key, fill and rim light that keep their
 * place relative to the camera, soft shadows on the arm itself and on the
 * floor, a contact shadow under the base, and filmic (Neutral) tone mapping.
 * The floor carries the work-envelope ring and the SENSORFACT label as a
 * printed marking (the drafting grid of the earlier version is gone).
 *
 * Units are millimetres. Joint frames: link 1 turns about Y at the base
 * (J1), 2 the upper arm about Z at the shoulder (J2), 3 the forearm about Z
 * at the elbow (J3), 4 forearm roll about X (J4), 5 wrist bend about Z (J5),
 * 6 flange turn about X (J6).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const D2R = Math.PI / 180;
const D1 = 327, A2 = 280, D4a = 120, D4b = 180, D6 = 52; // shoulder height, upper arm, forearm split, wrist, flange
const REACH = 475; // work envelope ring on the floor
const ORBIT = 2400; // camera distance from the orbit centre (mild perspective, as before)
const YC = 330; // height the camera orbits around
const HOME = { yaw: -0.6, pitch: 16 * D2R };
const RETURN_TIME = 4.5; // s the view takes to turn back after a drag
const LOOK_AHEAD = 380; // mm the pointer plane sits in front of the arm
const TOOL = D6 + 136; // wrist centre → face of the sensor
const ACCENT = 'rgb(196,160,20)'; // #FFEA6D darkened so it reads on light grey

/* ───────────── Geometry: parts built in "profile space" ─────────────
   A part's 2D profile lies in (u, v) and it is extruded along w; `axis` says
   which world axis w becomes: 'x' → (w, u, v), 'y' → (v, w, u), 'z' → (u, v, w),
   as in the earlier renderer. */
type Axis = 'x' | 'y' | 'z';
const AXIS: Record<Axis, THREE.Matrix4> = {
  x: new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1),
  y: new THREE.Matrix4().set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1),
  z: new THREE.Matrix4(),
};

// Box-projected UVs (in units of `scale` mm), so the paint grain has the same
// size on every part, whatever its shape.
function boxUV(g: THREE.BufferGeometry, scale = 70) {
  const p = g.getAttribute('position'), n = g.getAttribute('normal');
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let a: number, b: number;
    if (ax >= ay && ax >= az) { a = p.getY(i); b = p.getZ(i); }
    else if (ay >= az) { a = p.getX(i); b = p.getZ(i); }
    else { a = p.getX(i); b = p.getY(i); }
    uv[i * 2] = a / scale; uv[i * 2 + 1] = b / scale;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// A round part from w0 to w1, radius r (tapering by s0 → s1), centred on
// (cx, cy), every edge rounded by `bevel`.
function cyl(r: number, w0: number, w1: number, o: { s0?: number; s1?: number; cx?: number; cy?: number; bevel?: number; seg?: number } = {}) {
  const r0 = r * (o.s0 ?? 1), r1 = r * (o.s1 ?? 1);
  const b = Math.min(o.bevel ?? Math.min(6, r * 0.12), (w1 - w0) / 2 - 0.01, r0 * 0.5, r1 * 0.5);
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, w0)];
  const arc = (cx: number, cy: number, a0: number, a1: number) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + ((a1 - a0) * i) / 6;
      pts.push(new THREE.Vector2(cx + b * Math.cos(a), cy + b * Math.sin(a)));
    }
  };
  arc(r0 - b, w0 + b, -Math.PI / 2, 0);
  arc(r1 - b, w1 - b, 0, Math.PI / 2);
  pts.push(new THREE.Vector2(0, w1));
  const g = new THREE.LatheGeometry(pts, o.seg ?? 72);
  g.rotateX(Math.PI / 2); // lathe axis Y → w (Z)
  g.translate(o.cx ?? 0, o.cy ?? 0, 0);
  return g;
}

// A flat part with a stadium outline (two circles and their hull), w0 to w1.
function stadium(c1: [number, number], r1: number, c2: [number, number], r2: number, w0: number, w1: number, bevel = 7) {
  const s = new THREE.Shape();
  // outline: around circle 2 on one side, back around circle 1 (tangent lines between)
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx), off = Math.acos((r1 - r2) / d);
  const R1 = r1 - bevel, R2 = r2 - bevel;
  s.absarc(c2[0], c2[1], R2, ang - off, ang + off, false);
  s.absarc(c1[0], c1[1], R1, ang + off, ang - off + 2 * Math.PI, false);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: w1 - w0 - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 48,
  });
  g.translate(0, 0, w0 + bevel);
  return g;
}

// A block w × h centred on (cx, cy), w0 to w1, rounded edges.
function block(w: number, h: number, cx: number, cy: number, w0: number, w1: number, radius = 3) {
  const g = new RoundedBoxGeometry(w, h, w1 - w0, 4, Math.min(radius, w / 2 - 0.01, h / 2 - 0.01, (w1 - w0) / 2 - 0.01));
  g.translate(cx, cy, (w0 + w1) / 2);
  return g;
}

/* ───────────── Materials ───────────── */
function grainTexture() {
  // fine powder-coat grain: value noise at three scales, tileable
  const N = 256, c = document.createElement('canvas');
  c.width = c.height = N;
  const g = c.getContext('2d')!, img = g.createImageData(N, N);
  const rnd = (x: number, y: number, s: number) => {
    const h = Math.sin((x % s) * 127.1 + (y % s) * 311.7 + s * 17.3) * 43758.5453;
    return h - Math.floor(h);
  };
  const noise = (x: number, y: number, s: number) => {
    const cells = N / s, gx = (x / N) * cells, gy = (y / N) * cells;
    const x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = rnd(x0, y0, cells), b = rnd(x0 + 1, y0, cells), cc = rnd(x0, y0 + 1, cells), dd = rnd(x0 + 1, y0 + 1, cells);
    return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + dd) * sx * sy;
  };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = noise(x, y, 2) * 0.7 + noise(x, y, 8) * 0.3;
    // a narrow band around 1: roughness and relief vary by a few percent only
    const k = (y * N + x) * 4, val = Math.round((0.86 + 0.14 * v) * 255);
    img.data[k] = img.data[k + 1] = img.data[k + 2] = val;
    img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}

function materials() {
  const grain = grainTexture();
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0x1c1d20, roughness: 0.6, metalness: 0, roughnessMap: grain, bumpMap: grain, bumpScale: 0.04,
    clearcoat: 0.18, clearcoatRoughness: 0.42, envMapIntensity: 1,
  });
  const dark = new THREE.MeshPhysicalMaterial({
    color: 0x141517, roughness: 0.52, metalness: 0, roughnessMap: grain, bumpMap: grain, bumpScale: 0.025,
    clearcoat: 0.25, clearcoatRoughness: 0.35,
  });
  const anodized = new THREE.MeshPhysicalMaterial({ color: 0x1a1b1e, roughness: 0.42, metalness: 0.75, envMapIntensity: 1.1 });
  const metal = new THREE.MeshPhysicalMaterial({ color: 0x2a2b2f, roughness: 0.36, metalness: 0.85, envMapIntensity: 1.2 });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xb9bcc0, roughness: 0.28, metalness: 1 }); // bolt heads
  const sensor = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFEA6D'), roughness: 0.34, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.18,
    sheen: 0.2, sheenRoughness: 0.6, sheenColor: new THREE.Color('#fff4b0'),
  });
  const rubber = new THREE.MeshPhysicalMaterial({ color: 0x0d0d0e, roughness: 0.82, metalness: 0 });
  return { paint, dark, anodized, metal, steel, sensor, rubber };
}

/* ───────────── The arm ───────────── */
type Mats = ReturnType<typeof materials>;
function buildArm(M: Mats) {
  const mesh = (g: THREE.BufferGeometry, axis: Axis, m: THREE.Material, shift?: [number, number, number]) => {
    g.applyMatrix4(AXIS[axis]);
    if (shift) g.translate(...shift);
    boxUV(g);
    const o = new THREE.Mesh(g, m);
    o.castShadow = o.receiveShadow = true;
    return o;
  };
  const L = Array.from({ length: 7 }, () => new THREE.Group());
  L[0].add(L[1]);
  L[1].add(L[2]); L[2].position.set(0, D1, 0);
  L[2].add(L[3]); L[3].position.set(0, A2, 0);
  L[3].add(L[4]); L[4].position.set(D4a, 0, 0);
  L[4].add(L[5]); L[5].position.set(D4b, 0, 0);
  L[5].add(L[6]); L[6].position.set(D6, 0, 0);

  // 0 · base: plate, column, cable connector at the back, six bolts on the plate
  L[0].add(
    mesh(cyl(98, 0, 14, { bevel: 3 }), 'y', M.dark),
    mesh(cyl(84, 14, 92, { bevel: 5 }), 'y', M.paint),
    mesh(block(40, 50, 52, 0, -122, -78, 5), 'x', M.dark),
    mesh(cyl(9, -134, -122, { cx: 52, bevel: 2, seg: 32 }), 'x', M.metal),
  );
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    L[0].add(mesh(cyl(5.5, 14, 19, { cx: 91 * Math.sin(a), cy: 91 * Math.cos(a), bevel: 1.5, seg: 6 }), 'y', M.steel));
  }
  // 1 · waist and shoulder housing
  L[1].add(
    mesh(cyl(80, 94, 200, { bevel: 4 }), 'y', M.paint),
    mesh(cyl(78, 200, 280, { s1: 0.84, bevel: 6 }), 'y', M.paint),
    mesh(cyl(70, -64, 74, { bevel: 8 }), 'z', M.paint, [0, D1, 0]),
    mesh(cyl(52, 74, 76.5, { bevel: 1 }), 'z', M.dark, [0, D1, 0]), // seal ring between the shoulder and the upper arm
  );
  // 2 · upper arm, offset to the side of the shoulder, motor covers
  L[2].add(
    mesh(stadium([0, 0], 64, [0, A2], 52, 76, 142, 8), 'z', M.paint),
    mesh(cyl(46, 142, 162, { bevel: 4 }), 'z', M.dark),
    mesh(cyl(30, 162, 165, { bevel: 1.2 }), 'z', M.anodized),
    mesh(cyl(38, 142, 156, { cy: A2, bevel: 3 }), 'z', M.dark),
    mesh(cyl(24, 156, 158.5, { cy: A2, bevel: 1 }), 'z', M.anodized),
  );
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    L[2].add(mesh(cyl(3.2, 162, 165, { cx: 38 * Math.cos(a), cy: 38 * Math.sin(a), bevel: 1, seg: 6 }), 'z', M.steel));
  }
  // 3 · elbow and rear of the forearm
  L[3].add(
    mesh(cyl(56, -58, 74, { bevel: 7 }), 'z', M.paint),
    mesh(cyl(54, -78, D4a - 2, { bevel: 6 }), 'x', M.paint),
  );
  // 4 · forearm tube and wrist fork (a seam ring at the roll joint)
  L[4].add(
    mesh(cyl(50, -2, 2, { bevel: 1 }), 'x', M.dark),
    mesh(cyl(48, 2, 112, { s1: 0.86, bevel: 5 }), 'x', M.paint),
    mesh(stadium([104, 0], 40, [D4b, 0], 35, -38, 38, 6), 'z', M.paint),
  );
  // 5 · wrist
  L[5].add(
    mesh(cyl(33, -44, 44, { bevel: 5 }), 'z', M.paint),
    mesh(cyl(29, 0, D6, { bevel: 3 }), 'x', M.dark),
  );
  // 6 · flange, tool changer, gripper, sensor
  L[6].add(
    mesh(cyl(31, 0, 9, { bevel: 1.5 }), 'x', M.metal),
    mesh(cyl(37, 9, 32, { bevel: 3 }), 'x', M.metal),
    mesh(block(26, 16, 0, 40, 12, 28, 3), 'x', M.dark), // locking lever
    mesh(block(76, 60, 0, 0, 32, 86, 5), 'x', M.anodized),
    // the two fingers grip the cap from above and below
    mesh(block(48, 36, 54, 0, 62, 86, 3), 'x', M.metal),
    mesh(block(48, 36, -54, 0, 62, 86, 3), 'x', M.metal),
    mesh(block(14, 36, 69, 0, 86, 128, 3), 'x', M.metal),
    mesh(block(14, 36, -69, 0, 86, 128, 3), 'x', M.metal),
    mesh(cyl(60, 92, 132, { bevel: 6, seg: 96 }), 'x', M.sensor),
    mesh(stadium([0, -8], 15, [0, 40], 15, 132, 136, 1.5), 'x', M.rubber), // name plate
  );
  for (const a of [45, 135, 225, 315]) {
    L[6].add(mesh(cyl(12, 92, 112, { cx: 60 * Math.cos(a * D2R), cy: 60 * Math.sin(a * D2R), bevel: 3, seg: 32 }), 'x', M.sensor));
  }
  return L;
}

/* ───────────── Floor: marking texture (ring, ticks, label) and contact shadow ───────────── */
function floorMarking(labelAngle: number) {
  const S = 1200, N = 2048, k = N / S, c = document.createElement('canvas');
  c.width = c.height = N;
  const g = c.getContext('2d')!;
  g.translate(N / 2, N / 2);
  g.scale(k, k);
  g.strokeStyle = ACCENT;
  g.globalAlpha = 0.55;
  g.lineWidth = 2.2;
  g.setLineDash([12, 10]);
  g.beginPath(); g.arc(0, 0, REACH, 0, Math.PI * 2); g.stroke();
  g.setLineDash([]);
  g.globalAlpha = 0.75;
  g.lineWidth = 2.4;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    g.beginPath();
    g.moveTo((REACH - 12) * Math.cos(a), (REACH - 12) * Math.sin(a));
    g.lineTo((REACH + 12) * Math.cos(a), (REACH + 12) * Math.sin(a));
    g.stroke();
  }
  // SENSORFACT, printed just outside the tick facing the viewer at the start,
  // reading towards the viewer
  g.save();
  g.translate((REACH + 40) * Math.cos(labelAngle), (REACH + 40) * Math.sin(labelAngle));
  g.rotate(labelAngle - Math.PI / 2);
  g.fillStyle = ACCENT;
  g.globalAlpha = 0.85;
  g.font = '500 22px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  if ('letterSpacing' in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '5px';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('SENSORFACT', 0, 0);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(S, S),
    new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
  );
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  return m;
}

function contactShadow() {
  const N = 256, c = document.createElement('canvas');
  c.width = c.height = N;
  const g = c.getContext('2d')!, grad = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)');
  grad.addColorStop(0.35, 'rgba(0,0,0,0.28)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.07)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, N, N);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(330, 330),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, toneMapped: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.6;
  return m;
}

/* ───────────── Inverse kinematics (as before) ───────────── */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
function solve(T: THREE.Vector3): number[] {
  const q1 = Math.atan2(-T.z, T.x);
  const r = Math.hypot(T.x, T.z), h = T.y - D1;
  const dist = Math.hypot(r, h), ux = r / (dist || 1), uy = h / (dist || 1);
  const L1 = A2, L2 = D4a + D4b;
  const reachW = clamp(dist - TOOL - 40, 140, L1 + L2 - 20);
  const wx = ux * reachW, wy = uy * reachW;
  const d = Math.hypot(wx, wy), phi = Math.atan2(wy, wx);
  const alpha = phi + Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const q2 = clamp(Math.PI / 2 - alpha, -60 * D2R, 110 * D2R);
  const ex = L1 * Math.sin(q2), ey = L1 * Math.cos(q2);
  const q3 = clamp(-Math.atan2(wy - ey, wx - ex) - q2, -120 * D2R, 80 * D2R);
  const fx = ex + L2 * Math.cos(-(q2 + q3)), fy = ey + L2 * Math.sin(-(q2 + q3));
  const q5 = clamp(-Math.atan2(h - fy, r - fx) - q2 - q3, -115 * D2R, 115 * D2R);
  return [q1, q2, q3, 0, q5, 0];
}
const angLerp = (a: number, b: number, t: number) => {
  let d = (b - a) % (2 * Math.PI);
  if (d > Math.PI) d -= 2 * Math.PI;
  else if (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
};

/* ───────────── Mount ───────────── */
export function mountRobotArm(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the box stays empty
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  scene.environmentIntensity = 0.85;

  // The earlier renderer's world was mirrored (left-handed); mirroring the
  // whole set keeps the same composition: the arm reaching to the left.
  const world = new THREE.Group();
  world.scale.z = -1;
  scene.add(world);

  const M = materials();
  const links = buildArm(M);
  world.add(links[0]);

  // floor: soft shadow catcher, printed marking, contact shadow
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.ShadowMaterial({ opacity: 0.2 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.receiveShadow = true;
  world.add(catcher, contactShadow());

  // Lights that keep their place relative to the camera (as the earlier
  // studio lighting did): key from the upper left in front, fill from the
  // right, rim from behind. They live in a rig that turns with the view.
  const rig = new THREE.Group();
  scene.add(rig);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-650, 2200, -900);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -750, right: 750, top: 750, bottom: -750, near: 100, far: 4500 });
  key.shadow.radius = 14;
  key.shadow.blurSamples = 24;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.6;
  key.target.position.set(0, 250, 0);
  const fill = new THREE.DirectionalLight(0xf2f5ff, 0.55);
  fill.position.set(1400, 500, -700);
  const rim = new THREE.DirectionalLight(0xffffff, 1.3);
  rim.position.set(500, 900, 1600);
  rig.add(key, key.target, fill, rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, 0.25));

  const camera = new THREE.PerspectiveCamera(20, 1, 50, 20000);
  let W = 0, H = 0;

  function place(yaw: number, pitch: number) {
    const cp = Math.cos(pitch);
    camera.position.set(-ORBIT * Math.sin(yaw) * cp, YC + ORBIT * Math.sin(pitch), -ORBIT * Math.cos(yaw) * cp);
    camera.lookAt(0, YC, 0);
    rig.rotation.y = Math.atan2(camera.position.x, camera.position.z) + Math.PI;
  }

  // The label sits at the tick facing the viewer at the start. The marking
  // is outside the mirrored set, so its text reads the right way round (the
  // ring is symmetric).
  place(HOME.yaw, HOME.pitch);
  {
    let best = { a: 0, d: Infinity };
    const v = new THREE.Vector3();
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      v.set(REACH * Math.cos(a), 0, REACH * Math.sin(a));
      const d = v.distanceTo(camera.position);
      if (d < best.d) best = { a, d };
    }
    scene.add(floorMarking(best.a));
  }

  // Fit, as before: the box around the arm's space (±360 mm, 0–860 mm high)
  // fills 90% of the width or 82% of the height, centred.
  function resize() {
    W = root.clientWidth; H = root.clientHeight;
    if (!W || !H) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.zoom = 1;
    camera.clearViewOffset();
    place(HOME.yaw, HOME.pitch);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const v = new THREE.Vector3();
    for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) for (const y of [0, 860]) {
      v.set(x * 360, y, z * 360).project(camera);
      x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
    }
    const fit = Math.min((0.9 * 2) / (x1 - x0), (0.82 * 2) / (y1 - y0));
    camera.zoom = fit;
    const mx = ((x0 + x1) / 2) * fit, my = ((y0 + y1) / 2) * fit;
    camera.setViewOffset(W, H, (mx * W) / 2, (-my * H) / 2, W, H);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(root);
  resize();

  let onScreen = true;
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }).observe(root);

  /* ── State and interaction ── */
  let autoYaw = HOME.yaw, dYaw = 0, dPitch = 0;
  let back: { t0: number; yaw: number; pitch: number } | null = null;
  const auto = !reduced, follow = !reduced;
  let lastX = 0, lastY = 0, haveLast = false;
  const glance = { x: 0.5, y: 0.38, next: 0 };
  let qFollow: number[] | null = null;
  const pointers = new Map<number, { x: number; y: number }>();
  let press: { x: number; y: number; t: number; moved: number } | null = null;

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(), hit = new THREE.Vector3();
  const fwd = new THREE.Vector3(), anchor = new THREE.Vector3();
  function pointerTarget(px: number, py: number) {
    // the pointer, on a plane facing the camera a little in front of the arm
    camera.getWorldDirection(fwd);
    anchor.set(0, 380, 0).addScaledVector(fwd, -LOOK_AHEAD);
    plane.setFromNormalAndCoplanarPoint(fwd, anchor);
    ndc.set((px / W) * 2 - 1, -(py / H) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(plane, hit)) hit.copy(anchor);
    world.worldToLocal(hit);
    hit.y = Math.max(40, hit.y);
    return hit;
  }

  root.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect();
    lastX = Math.min(W * 0.92, Math.max(W * 0.08, e.clientX - r.left));
    lastY = Math.min(H * 0.9, Math.max(H * 0.1, e.clientY - r.top));
    haveLast = true;
  }, { passive: true });
  root.addEventListener('pointerleave', () => { haveLast = false; });

  const cardLink = () => root.closest('.article, article, li')?.querySelector<HTMLAnchorElement>('a[href]');
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    press = pointers.size === 1 ? { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 } : null;
    canvas.classList.add('drag');
    back = null;
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId);
    if (!p || pointers.size > 1) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (press) press.moved += Math.hypot(dx, dy);
    dYaw += dx * 0.006;
    dPitch = Math.min(1.45, Math.max(-0.05, HOME.pitch + dPitch + dy * 0.005)) - HOME.pitch;
  });
  const release = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size) return;
    const link = cardLink();
    if (e.type === 'pointerup' && press && press.moved < 6 && performance.now() - press.t < 600 && link) {
      press = null; canvas.classList.remove('drag');
      if (e.metaKey || e.ctrlKey) window.open(link.href, '_blank'); else location.href = link.href;
      return;
    }
    press = null;
    dYaw = Math.atan2(Math.sin(dYaw), Math.cos(dYaw));
    back = { t0: performance.now(), yaw: dYaw, pitch: dPitch };
    canvas.classList.remove('drag');
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  /* ── Loop ── */
  let last = performance.now();
  function frame(now: number) {
    requestAnimationFrame(frame);
    if (!W || !H || !onScreen) { last = now; return; }
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    if (auto) autoYaw += dt * 0.07;
    if (!pointers.size && back) {
      const u = Math.min(1, (now - back.t0) / (RETURN_TIME * 1000));
      const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      dYaw = back.yaw * (1 - e); dPitch = back.pitch * (1 - e);
      if (u >= 1) back = null;
    }
    place(autoYaw + dYaw, HOME.pitch + dPitch);
    camera.updateMatrixWorld();

    const dragging = pointers.size > 0;
    const active = follow && haveLast && !dragging;
    if (dragging) glance.next = now + 1400;
    else if (!active && !reduced && now > glance.next) {
      glance.x = 0.5 + (Math.random() - 0.5) * 0.34;
      glance.y = 0.38 + (Math.random() - 0.5) * 0.22;
      glance.next = now + 1400 + Math.random() * 1800;
    }
    if (!dragging || !qFollow) {
      const want = solve(active ? pointerTarget(lastX, lastY) : pointerTarget(W * glance.x, H * glance.y));
      qFollow = qFollow || want.slice();
      const k = reduced ? 1 : Math.min(1, dt * (active ? 5 : 2.5));
      qFollow = qFollow.map((v, i) => angLerp(v, want[i], k));
    }
    const q = qFollow;
    links[1].rotation.y = q[0];
    links[2].rotation.z = -q[1];
    links[3].rotation.z = -q[2];
    links[4].rotation.x = q[3];
    links[5].rotation.z = -q[4];
    links[6].rotation.x = q[5];
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
