/**
 * Plectrum studio: renders the brand plectrum (an SVG, extruded to 3D) on a
 * FORWARD.one gradient, for /brand/backgrounds.
 *
 * Pipeline per frame, all on the GPU:
 * 1. Render the plectrum N times into a multisampled float target, each with a
 *    slightly different rotation or position (motion blur), and average the
 *    samples into an accumulation target.
 * 2. Optional gaussian blur of that layer (two separable passes).
 * 3. Final pass: gradient background + plectrum layer + grain, to the canvas.
 */
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** y/x/z: spin about an axis; h/v: slide; p1–p3: sweep in the plectrum's own
 *  plane around one of its three points (the blur fans out from that point). */
export type MotionAxis = 'y' | 'x' | 'z' | 'h' | 'v' | 'p1' | 'p2' | 'p3';

export interface StudioState {
  /** Base format "w:h" as listed; `turn` swaps it. */
  ratio: string;
  turn: boolean;
  stops: string[];
  gradType: 'linear' | 'radial';
  /** Linear gradient direction in degrees, CSS-style: 0 = to top, 90 = to right. */
  angle: number;
  color: string;
  /** 0–100: matte to glossy. */
  gloss: number;
  /** 0–100. */
  metal: number;
  /** Extrusion depth and bevel, in the SVG's units (the shape is 97 high). */
  depth: number;
  bevel: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Plectrum height as % of the frame height. */
  size: number;
  /** Offset as % of the frame width / height. */
  posX: number;
  posY: number;
  /** Motion blur: degrees of rotation (centred on the pose; for a sweep, from the
   *  pose onwards), or % of the frame for a slide. */
  motion: number;
  axis: MotionAxis;
  /** Gaussian blur radius in px at 1080 px frame height. */
  blur: number;
  grain: boolean;
  /** 0–100. */
  grainAmount: number;
}

const MAX_STOPS = 8;
const FOV = 28;

const quadVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const accumFrag = /* glsl */ `
uniform sampler2D tex;
uniform float weight;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(tex, vUv) * weight; }
`;

const blurFrag = /* glsl */ `
uniform sampler2D tex;
uniform vec2 stepUv;
varying vec2 vUv;
void main() {
  vec4 c = vec4(0.0);
  float wsum = 0.0;
  for (int i = -16; i <= 16; i++) {
    float x = float(i) / 16.0;
    float w = exp(-x * x * 4.0);
    c += texture2D(tex, vUv + stepUv * float(i)) * w;
    wsum += w;
  }
  gl_FragColor = c / wsum;
}
`;

const finalFrag = /* glsl */ `
uniform sampler2D tObj;
uniform float uAspect;
uniform vec3 uStops[${MAX_STOPS}];
uniform int uCount;
uniform int uType;
uniform float uAngle;
uniform float uGrain;
uniform float uGrainPx;
uniform float uSeed;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 toSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

vec3 gradient(vec2 uv) {
  vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
  float t;
  if (uType == 0) {
    vec2 d = vec2(sin(uAngle), cos(uAngle));
    float ext = 0.5 * (abs(d.x) * uAspect + abs(d.y));
    t = dot(p, d) / ext * 0.5 + 0.5;
  } else {
    t = length(p) / (0.5 * sqrt(uAspect * uAspect + 1.0));
  }
  t = clamp(t, 0.0, 1.0);
  if (uCount < 2) return uStops[0];
  float f = t * float(uCount - 1);
  vec3 col = uStops[0];
  for (int i = 0; i < ${MAX_STOPS - 1}; i++) {
    if (i >= uCount - 1) break;
    float k = clamp(f - float(i), 0.0, 1.0);
    if (f >= float(i)) col = mix(uStops[i], uStops[i + 1], k);
  }
  return col;
}

void main() {
  vec4 obj = texture2D(tObj, vUv);
  vec3 bg = toLinear(gradient(vUv));
  vec3 col = obj.rgb + bg * (1.0 - clamp(obj.a, 0.0, 1.0));
  vec3 outc = toSrgb(clamp(col, 0.0, 1.0));
  vec2 cell = floor(gl_FragCoord.xy / uGrainPx);
  outc += (hash(cell + uSeed) - 0.5) * uGrain * 0.22;
  outc += (hash(gl_FragCoord.xy * 1.37 + 17.0) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(outc, 0.0, 1.0), 1.0);
}
`;

/** Low-discrepancy sub-pixel offsets in [0, 1) for sample i (Halton 2, 3). */
function halton(i: number): [number, number] {
  const h = (n: number, b: number) => {
    let f = 1;
    let r = 0;
    for (let k = n + 1; k > 0; k = Math.floor(k / b)) {
      f /= b;
      r += f * (k % b);
    }
    return r;
  };
  return [h(i, 2), h(i, 3)];
}

function hexToVec3(hex: string): THREE.Vector3 {
  const n = parseInt(hex.replace('#', ''), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function ratioSize(state: Pick<StudioState, 'ratio' | 'turn'>): { w: number; h: number } {
  const [a, b] = state.ratio.split(':').map(Number);
  return state.turn ? { w: b, h: a } : { w: a, h: b };
}

export class PlectrumStudio {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.01, 100);
  private mesh: THREE.Mesh;
  private material: THREE.MeshPhysicalMaterial;
  private shapes: THREE.Shape[];
  private shapeKey = '';
  private quad: THREE.Mesh;
  private quadScene = new THREE.Scene();
  private quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private accumMat: THREE.ShaderMaterial;
  private blurMat: THREE.ShaderMaterial;
  private finalMat: THREE.ShaderMaterial;
  private rtSample: THREE.WebGLRenderTarget;
  private rtAccum: THREE.WebGLRenderTarget;
  private rtA: THREE.WebGLRenderTarget;
  private rtB: THREE.WebGLRenderTarget;
  private state: StudioState;
  private frame = 0;
  /** The plectrum's three points, in the mesh's local space (see ensureGeometry). */
  private tips: THREE.Vector3[] = [];

  constructor(private canvas: HTMLCanvasElement, svgText: string, state: StudioState) {
    this.state = state;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, alpha: false });
    this.renderer.autoClear = false;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    // Soft reflections that keep brand colours saturated.
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(-1.5, 2, 3);
    this.scene.add(key);

    const data = new SVGLoader().parse(svgText);
    this.shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));

    this.material = new THREE.MeshPhysicalMaterial({ color: state.color });
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material);
    this.mesh.matrixAutoUpdate = false; // composed per sample in render()
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0, 0.5 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));

    const opts = { type: THREE.HalfFloatType, depthBuffer: false } as const;
    // No MSAA (some GPUs return an empty texture from a multisampled float target):
    // edges are smoothed by jittering the samples instead (see render()).
    this.rtSample = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
    this.rtAccum = new THREE.WebGLRenderTarget(1, 1, opts);
    this.rtA = new THREE.WebGLRenderTarget(1, 1, opts);
    this.rtB = new THREE.WebGLRenderTarget(1, 1, opts);

    const additive = {
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendEquation: THREE.AddEquation,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    };
    this.accumMat = new THREE.ShaderMaterial({ vertexShader: quadVert, fragmentShader: accumFrag, uniforms: { tex: { value: null }, weight: { value: 1 } }, depthTest: false, depthWrite: false, transparent: true, ...additive });
    this.blurMat = new THREE.ShaderMaterial({ vertexShader: quadVert, fragmentShader: blurFrag, uniforms: { tex: { value: null }, stepUv: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false });
    this.finalMat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: finalFrag,
      uniforms: {
        tObj: { value: null },
        uAspect: { value: 1 },
        uStops: { value: Array.from({ length: MAX_STOPS }, () => new THREE.Vector3()) },
        uCount: { value: 2 },
        uType: { value: 0 },
        uAngle: { value: 0 },
        uGrain: { value: 0 },
        uGrainPx: { value: 1 },
        uSeed: { value: 7 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.accumMat);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  setState(state: StudioState): void {
    this.state = state;
  }

  /** Extruded geometry, rebuilt only when depth or bevel change. Height 1, centred. */
  private ensureGeometry(): void {
    const { depth, bevel } = this.state;
    const key = `${depth}|${bevel}`;
    if (key === this.shapeKey) return;
    this.shapeKey = key;
    const geo = new THREE.ExtrudeGeometry(this.shapes, {
      depth: Math.max(0.5, depth),
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel * 0.8,
      bevelSegments: 8,
      curveSegments: 12,
    });
    geo.rotateX(Math.PI); // SVG y runs down; a rotation keeps the faces' winding
    geo.computeBoundingBox();
    const c = geo.boundingBox!.getCenter(new THREE.Vector3());
    geo.translate(-c.x, -c.y, -c.z);
    const h = geo.boundingBox!.max.y - geo.boundingBox!.min.y;
    geo.scale(1 / h, 1 / h, 1 / h);
    // The three points: the middles of the outline's three shortest edges,
    // taken through the same rotation, centring and scale as the geometry.
    const outline = this.shapes[0]?.getPoints() ?? [];
    const edges = outline.map((a, i) => {
      const b = outline[(i + 1) % outline.length];
      return { len: a.distanceTo(b), mid: new THREE.Vector2((a.x + b.x) / 2, (a.y + b.y) / 2) };
    }).filter((e) => e.len > 1e-6);
    this.tips = edges
      .sort((a, b) => a.len - b.len)
      .slice(0, 3)
      .map((e) => new THREE.Vector3((e.mid.x - c.x) / h, (-e.mid.y - c.y) / h, 0))
      // A little inside the edge, so the fan's centre is solid.
      .map((v) => v.multiplyScalar(0.94))
      // Point 1 is the one furthest right; then counter-clockwise.
      .sort((a, b) => ((Math.atan2(a.y, a.x) + 2 * Math.PI) % (2 * Math.PI)) - ((Math.atan2(b.y, b.x) + 2 * Math.PI) % (2 * Math.PI)));
    geo.computeVertexNormals();
    this.mesh.geometry.dispose();
    this.mesh.geometry = geo;
  }

  private sizeTargets(w: number, h: number): void {
    for (const rt of [this.rtSample, this.rtAccum, this.rtA, this.rtB]) {
      if (rt.width !== w || rt.height !== h) rt.setSize(w, h);
    }
  }

  private drawQuad(mat: THREE.Material, target: THREE.WebGLRenderTarget | null): void {
    this.quad.material = mat;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.quadScene, this.quadCam);
  }

  /** Renders the current state at the canvas's drawing-buffer size. */
  render(samples?: number): void {
    const s = this.state;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (!w || !h) return;
    this.sizeTargets(w, h);
    this.ensureGeometry();

    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    const gloss = s.gloss / 100;
    this.material.color.set(s.color);
    this.material.roughness = 0.95 - gloss * 0.8;
    this.material.metalness = s.metal / 100;
    this.material.clearcoat = gloss * 0.4;
    this.material.clearcoatRoughness = 0.15;

    // At least 8 samples: each is shifted by a sub-pixel offset, so averaging
    // them also smooths the edges.
    const n = Math.max(8, samples ?? (s.motion > 0 ? Math.min(96, 16 + Math.round(s.motion * 0.5)) : 8));
    const base = new THREE.Euler(
      THREE.MathUtils.degToRad(s.rotX),
      THREE.MathUtils.degToRad(s.rotY),
      THREE.MathUtils.degToRad(s.rotZ),
    );
    const scaleVec = new THREE.Vector3().setScalar(s.size / 100);
    const sweepTip = s.axis.startsWith('p') ? this.tips[Number(s.axis.slice(1)) - 1] : undefined;
    const euler = new THREE.Euler();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const sweep = new THREE.Matrix4();
    const px = (s.posX / 100) * aspect;
    const py = s.posY / 100;

    this.renderer.setRenderTarget(this.rtAccum);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    this.accumMat.uniforms.weight.value = 1 / n;
    this.accumMat.uniforms.tex.value = this.rtSample.texture;

    for (let i = 0; i < n; i++) {
      // Spins and slides spread evenly around the pose; a sweep starts at the
      // pose and fans out from there.
      const t = n === 1 ? 0 : sweepTip ? i / (n - 1) : i / (n - 1) - 0.5;
      const m = t * s.motion;
      euler.copy(base);
      pos.set(px, py, 0);
      if (s.axis === 'x') euler.x += THREE.MathUtils.degToRad(m);
      if (s.axis === 'y') euler.y += THREE.MathUtils.degToRad(m);
      if (s.axis === 'z') euler.z += THREE.MathUtils.degToRad(m);
      if (s.axis === 'h') pos.x += (m / 100) * aspect;
      if (s.axis === 'v') pos.y += m / 100;
      this.mesh.matrix.compose(pos, quat.setFromEuler(euler), scaleVec);
      if (sweepTip) {
        // Rotate in the plectrum's own plane (local Z) about the chosen point.
        sweep.makeTranslation(sweepTip.x, sweepTip.y, sweepTip.z)
          .multiply(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(m)))
          .multiply(new THREE.Matrix4().makeTranslation(-sweepTip.x, -sweepTip.y, -sweepTip.z));
        this.mesh.matrix.multiply(sweep);
      }
      this.mesh.matrixWorldNeedsUpdate = true;
      const [jx, jy] = halton(i);
      this.camera.setViewOffset(w, h, jx - 0.5, jy - 0.5, w, h);
      this.renderer.setRenderTarget(this.rtSample);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.drawQuad(this.accumMat, this.rtAccum);
    }

    this.camera.clearViewOffset();

    let layer = this.rtAccum;
    if (s.blur > 0) {
      const r = (s.blur * h) / 1080 / 16;
      this.blurMat.uniforms.tex.value = this.rtAccum.texture;
      this.blurMat.uniforms.stepUv.value.set(r / w, 0);
      this.drawQuad(this.blurMat, this.rtA);
      this.blurMat.uniforms.tex.value = this.rtA.texture;
      this.blurMat.uniforms.stepUv.value.set(0, r / h);
      this.drawQuad(this.blurMat, this.rtB);
      layer = this.rtB;
    }

    const u = this.finalMat.uniforms;
    u.tObj.value = layer.texture;
    u.uAspect.value = aspect;
    const stops = s.stops.length ? s.stops.slice(0, MAX_STOPS) : ['#000000'];
    stops.forEach((hex, i) => (u.uStops.value[i] as THREE.Vector3).copy(hexToVec3(hex)));
    u.uCount.value = stops.length;
    u.uType.value = s.gradType === 'radial' ? 1 : 0;
    u.uAngle.value = THREE.MathUtils.degToRad(s.angle);
    u.uGrain.value = s.grain ? s.grainAmount / 100 : 0;
    u.uGrainPx.value = Math.max(1, h / 1080);
    this.renderer.setRenderTarget(null);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.clear();
    this.drawQuad(this.finalMat, null);
    this.frame++;
  }

  /** Sets the drawing-buffer size for the on-screen preview. */
  resize(cssW: number, cssH: number): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(cssW, cssH, false);
  }

  /** Renders at full size with more samples and returns a PNG. */
  async exportPng(longSide: number): Promise<Blob> {
    const { w, h } = ratioSize(this.state);
    const W = w >= h ? longSide : Math.round((longSide * w) / h);
    const H = w >= h ? Math.round((longSide * h) / w) : longSide;
    const prev = { w: this.canvas.width, h: this.canvas.height, ratio: this.renderer.getPixelRatio(), cssW: this.canvas.style.width, cssH: this.canvas.style.height };
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(W, H, false);
    this.render(this.state.motion > 0 ? Math.min(256, Math.max(128, Math.round(this.state.motion))) : 32);
    const blob = await new Promise<Blob>((resolve, reject) =>
      this.canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png'),
    );
    this.renderer.setPixelRatio(prev.ratio);
    this.renderer.setSize(prev.w / prev.ratio, prev.h / prev.ratio, false);
    this.canvas.style.width = prev.cssW;
    this.canvas.style.height = prev.cssH;
    this.render();
    return blob;
  }
}
