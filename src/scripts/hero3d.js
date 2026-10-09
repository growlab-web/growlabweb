/**
 * Hero 3D: un único sistema de partículas que cambia de forma con el scroll
 *   esfera cerrada  →  (explosión)  →  galaxia espiral  →  (explosión)  →  cerebro
 * El cursor deja un orbe luminoso y aparta/ilumina las partículas de forma sutil.
 * El cerebro se construye con la silueta y los surcos de data/brainData.js.
 * Los degradados del fondo ([data-aurora]) derivan solos y cambian con cada etapa.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BRAIN_DATA from '../data/brainData.js';
import { buildShape, isServiceShape } from './shapes.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero3D() {
  const hero = document.querySelector('[data-hero]');
  const canvas = hero && hero.querySelector('#hero3d');
  if (!canvas) return { start() {}, ready: Promise.resolve() };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const PR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.25 : 2);   // en móvil se dibuja a menos resolución: va bastante más fluido
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.z = 5;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const isMobile = () => window.innerWidth < 800;
  const MOB = isMobile();
  const COUNT = MOB ? 28000 : 90000;     // la casi-esfera usa todas
  const N1 = MOB ? 26000 : 86000;        // galaxia (densa)
  const N2 = MOB ? 26000 : 62000;        // cerebro (muy fino)
  const N0 = COUNT;

  /* ================= Utilidades ================= */
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const PURPLE = [0.16, 0.32, 0.8], LILAC = [0.5, 0.68, 0.98], BLUE = [0.22, 0.435, 0.87];
  const WHITE = [0.92, 0.96, 1.0], CYAN = [0.45, 0.72, 0.97], TEAL = [0.5, 0.8, 0.6], GREEN = [0.43, 0.95, 0.75];
  const sparkle = (c, p) => (Math.random() < p ? mix3(c, [1, 1, 1], 0.65) : c);

  /* ================= Buffers ================= */
  const mk = () => new Float32Array(COUNT * 3);
  const P0 = mk(), NR0 = mk(), P1 = mk(), C1 = mk(), P2 = mk(), N2v = mk();
  const SC = mk(), VIS = mk(), RN = new Float32Array(COUNT);
  const PATH = new Float32Array(COUNT).fill(-1);          // posición a lo largo de una línea (pulsos de datos), -1 = estática
  const serviceShape = isServiceShape(hero.dataset.shape || ''); // páginas de servicio: la forma 2 es su estructura propia
  const set3 = (arr, i, x, y, z) => { arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; };
  const copy3 = (arr, to, from) => { arr[to * 3] = arr[from * 3]; arr[to * 3 + 1] = arr[from * 3 + 1]; arr[to * 3 + 2] = arr[from * 3 + 2]; };
  const fill = (n, arrs) => { for (let i = n; i < COUNT; i++) { const s = (Math.random() * n) | 0; arrs.forEach((a) => copy3(a, i, s)); } };

  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), rad = 3 + Math.random() * 4;
    set3(SC, i, rad * Math.sin(ph) * Math.cos(th), rad * Math.sin(ph) * Math.sin(th), rad * Math.cos(ph));
    RN[i] = Math.random();
    set3(VIS, i, 1, i < N1 ? 1 : 0, i < N2 ? 1 : 0);
  }

  /* --- 1) Esfera cerrada de puntos (sin hueco central) --- */
  const SR = 1.32;
  for (let i = 0; i < N0; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    const x = s * Math.cos(th), y = u, z = s * Math.sin(th);
    set3(P0, i, SR * x, SR * y, SR * z);
    set3(NR0, i, x, y, z);
  }

  /* --- 2) Galaxia: núcleo blanco-violeta del que nacen dos brazos en S, 3 anillos (cian → turquesa → verde) y polvo --- */
  const GSZ = new Float32Array(COUNT).fill(1);              // tamaño propio de cada partícula de la galaxia
  const SPD = new Float32Array(COUNT);                    // velocidad de giro propia de cada partícula (rad/s)
  const GAL_SPIN = 0.16;                                  // giro del núcleo y los brazos (rad/s)
  const dustSpeed = (rr) => 0.05 + 0.14 / (rr + 0.6);     // polvo suelto: gira más lento cuanto más lejos del núcleo
  // Las plataformas en órbita (Universe.astro) son un planeta más del disco: piden aquí la posición en pantalla de un punto de la galaxia
  const orbitV = new THREE.Vector3();
  const galaxyOrbit = (window.__galaxyOrbit = {
    t: 0, unit: 1, speed: dustSpeed, tilt: 0.27, yaw: 0, roll: 0,   // unit: píxeles por unidad de la galaxia
    project(r, th, out) {                                            // mismo camino que el sombreador: yaw (Y) → inclinación (X) → roll (Z) → grupo → cámara
      const x = Math.cos(th) * r, z = Math.sin(th) * r;
      const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw), ct = Math.cos(this.tilt), st = Math.sin(this.tilt), cr = Math.cos(this.roll), sr = Math.sin(this.roll);
      const x1 = cy * x + sy * z, z1 = -sy * x + cy * z, y2 = -st * z1, z2 = ct * z1;
      orbitV.set(cr * x1 - sr * y2, sr * x1 + cr * y2, z2).applyMatrix4(group.matrixWorld).project(camera);
      out.x = (orbitV.x + 1) * 0.5 * hero.clientWidth; out.y = (1 - orbitV.y) * 0.5 * hero.clientHeight;
      out.depth = clamp01((z1 / r + 1) / 2);                         // 0 = detrás, 1 = delante
      return out;
    },
  });
  const VIO = [0.56, 0.36, 1.0], DEEP = [0.27, 0.24, 0.82], GCY = [0.32, 0.78, 1.0], GTL = [0.16, 0.82, 0.72], GGR = [0.43, 0.95, 0.75];   // GGR = verde del sitio #6df2c0
  if (!serviceShape) for (let i = 0; i < N1; i++) {
    const q = Math.random();
    let rr, th = Math.random() * Math.PI * 2, y = 0, col, spd, gsz = 1;
    if (q < 0.055) {                          // núcleo: punto fijo muy denso y luminoso
      rr = Math.abs(g()) * 0.085 + 0.003; y = g() * 0.03; spd = GAL_SPIN; gsz = 1.35;
      col = mix3([1, 1, 1], VIO, Math.min(1, rr / 0.16));
    } else if (q < 0.2) {                   // resplandor violeta alrededor del núcleo
      rr = Math.pow(Math.random(), 1.2) * 0.75; y = g() * 0.06 * (1.15 - rr); spd = GAL_SPIN;
      col = mix3(VIO, DEEP, Math.min(1, rr / 0.7)).map((x) => x * 0.8);
    } else if (q < 0.6) {                    // dos brazos continuos: nacen en el núcleo y dan vuelta y media hasta el borde (sin anillos cerrados)
      const t = Math.pow(Math.random(), 0.9);
      rr = Math.pow(t, 1.08) * 2.08;
      th = Math.floor(Math.random() * 2) * Math.PI + t * Math.PI * 3.0;
      rr += g() * (0.012 + 0.028 * t * t) + (t > 0.94 ? g() * (t - 0.94) * 2 : 0);   // la punta se deshace en polvo
      y = g() * (0.012 + 0.02 * t); spd = GAL_SPIN;
      col = t < 0.1 ? mix3([1, 1, 1], VIO, t / 0.1) : t < 0.3 ? mix3(VIO, GCY, (t - 0.1) / 0.2) : t < 0.62 ? mix3(GCY, GTL, (t - 0.3) / 0.32) : mix3(GTL, GGR, (t - 0.62) / 0.38);
      if (t > 0.94) col = col.map((x) => x * (1 - (t - 0.94) * 9));
    } else {                                 // polvo y estrellas sueltas por todo el disco
      rr = 0.2 + Math.pow(Math.random(), 1.3) * 2.4; y = g() * (0.03 + rr * 0.035);   // más denso hacia el centro, se va vaciando hacia el borde
      spd = dustSpeed(rr);
      gsz = 0.95 + Math.pow(Math.random(), 3) * 1.4;        // puntos sueltos: se tienen que ver uno a uno
      if (Math.random() < 0.13) {                           // partículas sueltas más allá del borde: el final queda irregular
        rr = 1.9 + Math.pow(Math.random(), 1.7) * 1.35; y = g() * (0.08 + (rr - 1.9) * 0.22); gsz = 0.9 + Math.pow(Math.random(), 4) * 1.8;
      }
      col = (rr < 0.9 ? mix3(DEEP, GCY, rr / 0.9) : mix3(GCY, GGR, Math.min(1, (rr - 0.9) / 1.2))).map((x) => x * 0.8);
    }
    col = sparkle(col, 0.06);
    set3(P1, i, Math.cos(th) * rr, y, Math.sin(th) * rr);
    set3(C1, i, col[0], col[1], col[2]);
    SPD[i] = spd; GSZ[i] = gsz;
  }
  if (serviceShape) {                      // estructura propia del servicio (embudo, red, panel…)
    const sh = buildShape(hero.dataset.shape, N1);
    for (let i = 0; i < N1; i++) {
      set3(P1, i, sh.pos[i * 3], sh.pos[i * 3 + 1], sh.pos[i * 3 + 2]);
      set3(C1, i, sh.col[i * 3], sh.col[i * 3 + 1], sh.col[i * 3 + 2]);
      PATH[i] = sh.path[i];
    }
  }
  for (let i = N1; i < COUNT; i++) { const k = (Math.random() * N1) | 0; copy3(P1, i, k); copy3(C1, i, k); PATH[i] = PATH[k]; SPD[i] = SPD[k]; GSZ[i] = GSZ[k]; }

  /* --- 3) Cerebro: silueta + surcos reales de la referencia, inflados en 3D con perfil redondo --- */
  (function buildBrain() {
    const B = BRAIN_DATA;
    const W = B.w, H = B.h, bin = atob(B.d), D = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) D[i] = bin.charCodeAt(i) / 255;
    const mask = new Uint8Array(W * H);
    let minY = H, maxY = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (D[y * W + x] > 0.12) { mask[y * W + x] = 1; minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    // silueta maciza: todo lo que queda dentro del contorno cuenta, aunque el dibujo tenga zonas oscuras entre surcos
    // (si no, el relieve se hunde hasta el centro en cada hueco y de lado el cerebro se ve hecho de capas)
    const outside = new Uint8Array(W * H), queue = [];
    for (let x = 0; x < W; x++) queue.push(x, (H - 1) * W + x);
    for (let y = 0; y < H; y++) queue.push(y * W, y * W + W - 1);
    while (queue.length) {
      const i = queue.pop();
      if (outside[i] || mask[i]) continue;
      outside[i] = 1;
      const x = i % W, y = (i / W) | 0;
      if (x > 0) queue.push(i - 1); if (x < W - 1) queue.push(i + 1); if (y > 0) queue.push(i - W); if (y < H - 1) queue.push(i + W);
    }
    let dist = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) dist[i] = outside[i] ? 0 : 1e6;
    for (let y = 1; y < H; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; dist[i] = Math.min(dist[i], dist[i - 1] + 1, dist[i - W] + 1, dist[i - W - 1] + 1.41, dist[i - W + 1] + 1.41); }
    for (let y = H - 2; y >= 0; y--) for (let x = W - 2; x >= 1; x--) { const i = y * W + x; dist[i] = Math.min(dist[i], dist[i + 1] + 1, dist[i + W] + 1, dist[i + W + 1] + 1.41, dist[i + W - 1] + 1.41); }
    for (let i = 0; i < W * H; i++) if (dist[i] > 1e5) dist[i] = 0;
    // la distancia al borde sale en escalones: se suaviza para que la superficie sea continua
    for (let pass = 0; pass < 3; pass++) {
      const next = new Float32Array(W * H);
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        next[i] = outside[i] ? 0 : (dist[i - W - 1] + dist[i - W] + dist[i - W + 1] + dist[i - 1] + dist[i] + dist[i + 1] + dist[i + W - 1] + dist[i + W] + dist[i + W + 1]) / 9;
      }
      dist = next;
    }
    let dmax = 0; for (let i = 0; i < W * H; i++) dmax = Math.max(dmax, dist[i]);
    // perfil redondo (un cuarto de círculo): el borde sube en vertical y el centro queda abombado, como un cuerpo con volumen
    const Z = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) { const u = Math.min(1, dist[i] / (dmax * 0.9)); Z[i] = Math.sqrt(1 - (1 - u) * (1 - u)); }
    const sample = (A, fx, fy) => {                       // lectura entre píxeles: sin esto cada píxel es un escalón plano
      const x = Math.min(W - 1.001, Math.max(0, fx)), y = Math.min(H - 1.001, Math.max(0, fy));
      const x0 = x | 0, y0 = y | 0, tx = x - x0, ty = y - y0, i = y0 * W + x0;
      return (A[i] * (1 - tx) + A[i + 1] * tx) * (1 - ty) + (A[i + W] * (1 - tx) + A[i + W + 1] * tx) * ty;
    };
    const S = 2.55 / (maxY - minY), cx = W / 2, cy = (minY + maxY) / 2, thick = 1.1;
    const cdf = new Float32Array(W * H); let acc = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      // en los costados la superficie está de canto y ocupa pocos píxeles: se le dan más partículas para que no queden vacíos al girar
      const gx = (Z[y * W + Math.min(W - 1, x + 1)] - Z[y * W + Math.max(0, x - 1)]) * thick / (2 * S);
      const gy = (Z[Math.min(H - 1, y + 1) * W + x] - Z[Math.max(0, y - 1) * W + x]) * thick / (2 * S);
      acc += D[i] > 0.04 && !outside[i] ? (0.1 + 0.9 * Math.pow(D[i], 1.5)) * Math.min(2.4, Math.sqrt(1 + gx * gx + gy * gy)) : 0;
      cdf[i] = acc;
    }
    for (let n = 0; n < N2; n++) {
      const t = Math.random() * acc; let lo = 0, hi = W * H - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < t) lo = m + 1; else hi = m; }
      const fx = (lo % W) + Math.random() - 0.5, fy = ((lo / W) | 0) + Math.random() - 0.5;
      const side = Math.random() < 0.8 ? 1 : -1;            // casi todas en la cara que se ve: la de atrás queda apagada
      const zf = sample(Z, fx, fy);
      // normal hacia fuera de la superficie (en la cara de atrás sólo cambia el sentido en profundidad)
      let nx = -(sample(Z, fx + 1.5, fy) - sample(Z, fx - 1.5, fy)) * thick / (3 * S);
      let ny = (sample(Z, fx, fy + 1.5) - sample(Z, fx, fy - 1.5)) * thick / (3 * S);
      const nl = Math.hypot(nx, ny, 1);
      nx /= nl; ny /= nl; const nz = side / nl;
      const bump = (sample(D, fx, fy) - 0.5) * 0.07 + (Math.random() - 0.5) * 0.015;   // los pliegues sobresalen un poco, siguiendo la curvatura
      set3(P2, n, (fx + 0.5 - cx) * S + nx * bump, -(fy + 0.5 - cy) * S + ny * bump, side * zf * thick + nz * bump);
      set3(N2v, n, nx, ny, nz);
    }
    fill(N2, [P2, N2v]);
  })();

  const geo = new THREE.BufferGeometry();
  const attr = (name, arr, n) => geo.setAttribute(name, new THREE.BufferAttribute(arr, n || 3));
  attr('position', P0); attr('normal', NR0);
  attr('aP1', P1); attr('aC1', C1); attr('aP2', P2); attr('aN2', N2v);
  attr('aScatter', SC); attr('aVis', VIS); attr('aRand', RN, 1); attr('aPath', PATH, 1); attr('aSpd', SPD, 1); attr('aSz', GSZ, 1);

  const noiseGLSL = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`;

  const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;   // solo con ratón: en táctil el efecto no aporta y cuesta rendimiento
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    defines: { ...(CAN_HOVER ? { HOVER: 1 } : {}), ...(MOB ? { LITE: 1 } : {}) },   // LITE: móvil, sin los ruidos secundarios
    uniforms: {
      uTime: { value: 0 }, uIntro: { value: 0 }, uPR: { value: PR }, uSize: { value: MOB ? 2.4 : 2.3 }, uSm: { value: MOB ? new THREE.Vector3(0.85, 0.58, 0.72) : new THREE.Vector3(1.0, 0.92, 1.1) },
      uMouse: { value: new THREE.Vector3(99, 99, 0) }, uPush: { value: 0 }, uRadius: { value: 0.7 },
      uMorph: { value: 0 }, uGal: { value: serviceShape ? 0 : 1 },
      uTilt: { value: new THREE.Vector3(1.2, 0.26, 0.0) },
      uGrad: { value: new THREE.Vector2(-0.15, 0.86) },          // centro y escala del objeto: el degradado de color lo recorre entero en cualquier pantalla
      uYaw: { value: new THREE.Vector3(0, 0, 0) },
      uRoll: { value: new THREE.Vector3(0, 0, 0) },
      uSpark: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 0, -1)) },
      uVoice: { value: 0 }, uVDir: { value: new THREE.Vector3(0, 1, 0) }, uVDir2: { value: new THREE.Vector3(1, 0, 0) },
    },
    vertexShader: `
      uniform float uTime, uIntro, uPR, uSize, uPush, uRadius, uMorph, uGal, uVoice;
      uniform vec3 uMouse, uTilt, uYaw, uRoll, uVDir, uVDir2, uSm;
      uniform vec2 uGrad;
      uniform vec4 uSpark[8];
      attribute vec3 aP1, aP2, aN2, aC1, aScatter, aVis; attribute float aRand, aPath, aSpd, aSz;
      varying vec3 vColor; varying float vAlpha;
      ${noiseGLSL}
      vec3 rotY(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
      vec3 rotX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
      vec3 rotZ(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
      vec3 xf(vec3 p,float tilt,float yaw,float roll){return rotZ(rotX(rotY(p,yaw),tilt),roll);}
      void main(){
        float fl = floor(uMorph + 0.0001);
        float rf = clamp(uMorph - fl, 0.0, 1.0);
        float m = fl + smoothstep(0.0, 1.0, rf);
        float w0 = clamp(1.0 - m, 0.0, 1.0);
        float w1 = clamp(1.0 - abs(m - 1.0), 0.0, 1.0);
        float w2 = clamp(m - 1.0, 0.0, 1.0);
        float burst = pow(sin(3.14159 * rf), 1.5);

        // casi-esfera con relieve de ruido
        vec3 p0 = position;
        float n = snoise(p0*1.5 + vec3(0.0,uTime*0.22,uTime*0.15));
        #ifdef LITE
        float n2 = 0.0;
        #else
        float n2 = snoise(p0*4.0 - uTime*0.3);
        #endif
        p0 += normal * (n*0.2 + n2*0.03);
        // "voz": como un asistente que habla, la esfera se abulta a golpes en direcciones que van cambiando
        float lobe = pow(max(dot(normal, uVDir), 0.0), 2.5) + 0.65 * pow(max(dot(normal, uVDir2), 0.0), 2.5);
        #ifdef LITE
        float rip = 0.9;
        #else
        float rip = 0.8 + 0.2 * snoise(p0*2.0 + uTime*0.6);
        #endif
        p0 += normal * uVoice * lobe * 0.3 * rip;

        vec3 q0 = xf(p0, uTilt.x, uYaw.x, uRoll.x);
        // galaxia: cada partícula gira a su ritmo alrededor del núcleo y el disco ondula un poco (volumen)
        vec3 g1 = rotY(aP1, -aSpd * uTime * uGal);
        float gr = length(g1.xz);
        g1.y += uGal * sin(atan(g1.z, g1.x) * 2.0 + uTime * 0.45) * 0.012 * gr * smoothstep(0.15, 1.2, gr);
        vec3 q1 = xf(g1, uTilt.y, uYaw.y, uRoll.y);
        vec3 q2 = xf(aP2, uTilt.z, uYaw.z, uRoll.z);
        vec3 p = q0*w0 + q1*w1 + q2*w2;
        #ifndef LITE
        p += normalize(p + vec3(1e-4)) * (w1 + w2) * snoise(p*3.0 + uTime*0.3) * 0.012;
        #endif

        // explosión entre formas (algunas partículas pasan muy cerca de la cámara)
        #ifdef LITE
        vec3 bdir = vec3(aScatter.xy*0.75, aScatter.z*0.3 + 0.35);          // móvil: la explosión no se acerca a la cámara (partículas enormes = tirones)
        #else
        vec3 bdir = vec3(aScatter.xy*0.75, aScatter.z*0.45 + 1.3);
        #endif
        p += bdir * burst * (0.6 + aRand*0.8);

        // ensamblado inicial
        float e = smoothstep(0.0, 1.0, clamp(uIntro*1.4 - aRand*0.4, 0.0, 1.0));
        // las partículas suben desde abajo, abiertas en abanico, y se juntan en el centro
        vec3 from = vec3(aScatter.x * 0.75, -3.4 - abs(aScatter.y) * 0.45 - aRand * 1.2, aScatter.z * 0.35);
        p = mix(from, p, e);
        p.x += sin(e * 3.14159) * aScatter.z * 0.06;                     // ligera curva al subir

        vec4 wp = modelMatrix * vec4(p,1.0);

        #ifdef HOVER
        // cursor: aparta e ilumina muy poco las partículas cercanas
        vec3 d = wp.xyz - uMouse;
        float dist = length(d.xy);
        float sw = clamp(w0 + w1 * uGal + w2, 0.0, 1.0);                 // esfera, galaxia y cerebro: el cursor dispersa las partículas en una zona pequeña
        // el borde de la zona afectada es irregular y cambia con el tiempo (no se nota una "bola" pasando)
        float jit = snoise(vec3(wp.xy * 2.6, uTime * 0.18 + aRand * 3.0));
        float rm = (1.0 - sw) + (w0 + w2) * 0.8 + w1 * uGal * 0.46;
        float f = smoothstep(uRadius * rm, 0.0, dist * (1.0 + 0.45 * jit * sw));
        vec2 dir = normalize(d.xy + 1e-4);
        vec3 push = vec3(dir * f * (0.06 + 0.05*uPush), f * (0.1 + 0.12*uPush) * (n*0.6+0.4));
        // galaxia: las partículas cercanas se dispersan en todas las direcciones (sin dejar un hueco limpio)
        // cada partícula sale en su propia dirección (azar + remolino), unas mucho y otras casi nada
        vec3 swirl = vec3(snoise(wp.xyz * 2.2 + uTime * 0.16), snoise(wp.yzx * 2.2 - uTime * 0.13), snoise(wp.zxy * 2.2 + uTime * 0.11));
        vec3 rdir = normalize(normalize(aScatter) + swirl * 1.3);
        rdir.z *= 0.35;                                                  // casi sin acercarse a la cámara: se dispersan pero no crecen
        float amp = 0.04 + 1.9 * pow(fract(aRand * 13.7 + 0.31), 2.6);
        vec3 spray = rdir * f * (0.4 + 0.6 * f) * (0.13 + 0.16*uPush) * amp * (1.0 + (w0 + w2) * 0.7) * (0.8 + 0.2*sin(uTime*0.7 + aRand*50.0));
        float gm = w1 * uGal;
        wp.xyz += mix(push, spray, sw);
        #else
        // pantallas táctiles: sin efecto de cursor (ahorra tres cálculos de ruido por partícula)
        float f = 0.0, sw = 0.0, gm = w1 * uGal;
        #endif

        vec4 mv = viewMatrix * wp;
        gl_Position = projectionMatrix * mv;

        // profundidad: lo de adelante más grande y brillante, lo de atrás un poco más oscuro
        float depth = smoothstep(-1.1, 1.1, wp.z);
        float dm = clamp(w0 + w2, 0.0, 1.0);
        float sizeD = mix(1.0, 0.75 + 0.5*depth, dm);
        float colD  = mix(1.0, 0.45 + 0.75*depth, dm);
        float alphD = mix(1.0, 0.5 + 0.5*depth, dm);

        // paquetes de datos que viajan por las líneas de las estructuras de servicio
        float pulse = aPath >= 0.0 ? pow(0.5 + 0.5*sin(aPath*16.0 - uTime*2.6), 10.0) : 0.0;
        float line = step(0.0, aPath) * w1;
        float sm = w0*uSm.x + w1*mix(1.15, uSm.y, uGal) + w2*uSm.z;      // tamaño por forma (en móvil, más fino)
        // cerebro: sinapsis → un destello en un punto y una onda que se propaga por las partículas vecinas
        float syn = 0.0, synPt = 0.0;
        for (int i = 0; i < 8; i++) {
          vec4 sp = uSpark[i];
          float on = step(0.0, sp.w), sd = distance(aP2, sp.xyz);
          synPt += on * exp(-sd*sd / 0.0014) * (1.0 - smoothstep(0.0, 0.3, sp.w)) * 4.5;       // nace en un solo punto muy brillante…
          float ra = sp.w, sr = (sd - ra * ra * 0.75) / (0.03 + 0.03 * ra);                       // …y la onda sale de él sin pausa, cada vez más rápida
          syn += on * exp(-sr*sr) * (1.0 - ra) * 0.9;
        }
        syn = (syn * (0.3 + 0.7 * step(0.4, fract(aRand * 5.3))) + synPt) * w2;
        float star = pow(fract(aRand*7.31 + 0.13), 16.0);                 // unas pocas estrellas mucho más grandes
        float szv = mix(0.6 + aRand*0.7, aSz*(0.5 + fract(aRand*3.7)*0.55) + star*2.6, gm);
        float sz = uSize * uPR * (5.0 / max(-mv.z, 0.3)) * szv * sm * sizeD * (1.0 + f*0.8*(1.0 - sw)) * (1.0 + pulse*0.9*line) * (1.0 + min(syn, 3.0) * 0.8);
        #ifdef LITE
        sz = min(sz, 9.0 * uPR);
        #else
        sz = min(sz, 40.0 * uPR);
        #endif
        gl_PointSize = sz;

        // cerebro: sólo la cara frontal brillante
        vec3 nb = xf(aN2, uTilt.z, uYaw.z, uRoll.z);
        vec3 vdir = normalize(cameraPosition - wp.xyz);
        float facing = dot(normalize(nb + vec3(1e-5)), vdir);
        float vis = mix(1.0, 0.03 + 0.97*smoothstep(-0.05, 0.3, facing), w2);
        // luz desde arriba a la izquierda: da volumen al cerebro (zonas iluminadas y en sombra)
        float lit = mix(1.0, 0.55 + 0.65 * max(dot(normalize(nb + vec3(1e-5)), normalize(vec3(-0.35, 0.55, 0.76))), 0.0), w2);
        float alive = aVis.x*w0 + aVis.y*w1 + aVis.z*w2;

        // degradado por altura en pantalla (verde arriba → azul → violeta abajo)
        // medido sobre el propio objeto (como si tuviera el tamaño y la posición de escritorio): en móvil, donde va más pequeño y más abajo, también llega al verde
        float hh = smoothstep(-1.0, 1.0, (wp.y - uGrad.x) / uGrad.y * 0.86 - 0.05);
        vec3 purple = vec3(0.16,0.32,0.8), blue = vec3(0.22,0.435,0.87), green = vec3(0.43,0.95,0.75);
        vec3 grad = mix(purple, blue, smoothstep(0.0,0.45,hh));
        grad = mix(grad, green, smoothstep(0.45,0.95,hh));
        vec3 col = mix(aC1, grad, dm);
        col = mix(col, vec3(1.0), step(0.95, aRand) * 0.5 * w2);

        col = mix(col, mix(col, vec3(1.0), 0.55), star * gm);
        col = mix(col, vec3(0.78, 1.0, 0.93), clamp(syn, 0.0, 1.0)) * (1.0 + syn * 0.7);
        vColor = col * colD * lit * (1.0 + burst*0.25) + f*0.12 + vec3(0.55,0.95,0.6) * pulse * line;
        float base = 0.9*w0 + mix(0.95, 0.62, uGal)*w1 + 1.0*w2;
        vAlpha = base * mix(1.0, 0.5 + 0.9*pulse, line) * (0.45 + 0.55*smoothstep(-0.2,0.8,n+0.4)) * e * vis * alive * alphD * (1.0 + syn * 1.4) / (1.0 + max(sz/uPR - 7.0, 0.0)*0.08);
      }`,
    fragmentShader: `
      varying vec3 vColor; varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, a * vAlpha);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* ---- Polvo flotante de fondo (redondo) ---- */
  const DUST = 160, dp = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { dp[i * 3] = (Math.random() - 0.5) * 12; dp[i * 3 + 1] = (Math.random() - 0.5) * 7; dp[i * 3 + 2] = (Math.random() - 0.5) * 6; }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dotCanvas = document.createElement('canvas'); dotCanvas.width = dotCanvas.height = 64;
  const dctx = dotCanvas.getContext('2d');
  const dgr = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  dgr.addColorStop(0, 'rgba(255,255,255,1)'); dgr.addColorStop(0.45, 'rgba(255,255,255,.85)'); dgr.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = dgr; dctx.fillRect(0, 0, 64, 64);
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.06, map: new THREE.CanvasTexture(dotCanvas), color: 0x8fb0ff, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  /* ---- Orbe gris-lila que sigue al cursor ---- */
  const orbCanvas = document.createElement('canvas'); orbCanvas.width = orbCanvas.height = 128;
  const og = orbCanvas.getContext('2d');
  const grd = og.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(215,228,250,.9)'); grd.addColorStop(0.5, 'rgba(150,180,235,.5)'); grd.addColorStop(1, 'rgba(110,150,230,0)');
  og.fillStyle = grd; og.fillRect(0, 0, 128, 128);
  const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(orbCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  orb.scale.setScalar(0.22);
  scene.add(orb);

  /* ---- Tamaño ---- */
  const base = { scale: 0.82, y: -0.15, gal: 0.82, galY: -0.15 };   // gal/galY: tamaño y altura propios de la galaxia (va con las plataformas en órbita)
  const HOME_X = 0;                                                // la esfera del inicio va exactamente al centro
  const pinned = hero.hasAttribute('data-pin');                       // inicio: secuencia completa con scroll
  const SHAPES = { sphere: 0, galaxy: 1, brain: 2 };                // páginas interiores: una forma fija
  const galaxyK = () => (window.innerWidth < 520 ? 0.62 : window.innerWidth < 1000 ? 0.78 : 1);
  const state = { scale: 1, morph: pinned ? 0 : serviceShape ? 1 : (SHAPES[hero.dataset.shape] ?? 0) };
  let lastW = 0, lastH = 0;
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    // en móvil la barra del navegador aparece y desaparece al hacer scroll y dispara "resize": si el tamaño no cambió de verdad, no se rehace nada
    if (w === lastW && (h === lastH || (MOB && Math.abs(h - lastH) < 140))) return;
    lastW = w; lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const W = window.innerWidth, phone = W < 520, narrow = W < 1000;     // narrow: móvil y tableta → el objeto va bajo el texto
    const shape = hero.dataset.shape;
    if (pinned) {                                                          // inicio
      group.position.x = HOME_X;
      // esfera y cerebro: en pantallas medianas se encogen de forma continua para no pisar los textos de la izquierda
      base.y = phone ? -0.22 : narrow ? -0.2 : -0.15;
      base.scale = phone ? (h < 740 ? 0.39 : 0.45) : narrow ? 0.58 : W < 1400 ? 0.54 + ((W - 1000) / 400) * 0.32 : 0.86;
      // móvil: la galaxia se ve tan de canto como en escritorio y cabe casi entera a lo ancho, para que las plataformas recorran su órbita completa
      base.galY = phone ? -0.22 : narrow ? -0.28 : -0.15;
      base.gal = phone ? 0.52 : (narrow ? 0.66 : W < 1400 ? 0.72 : 0.86) * galaxyK();
      base.galTilt = phone ? 0.25 : 0.27;
      base.brainDy = phone ? -0.24 : 0;                                  // móvil: el cerebro baja un poco para dejar sitio al texto
      galaxyOrbit.unit = (h / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z)) * base.gal;
      group.position.y = base.y;
    } else {                                                               // cabeceras de páginas interiores
      group.position.x = narrow ? 0 : serviceShape ? 1.55 : 1.8;
      group.position.y = base.y = base.galY = narrow ? (phone ? -1.05 : -0.95) : -0.15;
      base.scale = narrow ? (phone ? 0.4 : 0.5) : serviceShape ? 0.68 : shape === 'galaxy' ? 0.46 : 0.7;
      base.gal = base.scale * galaxyK();
    }
    group.scale.setScalar(base.scale * state.scale);
  }

  /* ---- Ratón ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, inside: false, speed: 0, ox: 0, oy: 0 };
  const ndc = new THREE.Vector3();
  if (CAN_HOVER) window.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouse.inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
  });
  function mouseToWorld(nx, ny) {
    ndc.set(nx, ny, 0.5).unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z; // plano z = 0
    return camera.position.clone().add(dir.multiplyScalar(t));
  }

  /* ---- "Voz" de la esfera: ráfagas tipo habla (sílabas y pausas) con dirección aleatoria en cada golpe ---- */
  const reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const voice = { v: 0, target: 0, next: 0, phraseEnd: 0, talking: false, d1: new THREE.Vector3(0, 1, 0), d2: new THREE.Vector3(1, 0, 0), t1: new THREE.Vector3(0, 1, 0), t2: new THREE.Vector3(1, 0, 0), last: 0 };
  const randDir = (v) => { const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, q = Math.sqrt(1 - u * u); return v.set(q * Math.cos(a), u * 0.8, q * Math.sin(a)).normalize(); };
  function updateVoice(t) {
    const dt = Math.min(0.05, t - voice.last); voice.last = t;
    if (reduceMo) return;
    if (t > voice.phraseEnd) {                                   // alterna frases (1,4–3,6 s) y silencios (0,7–2 s)
      voice.talking = !voice.talking;
      voice.phraseEnd = t + (voice.talking ? 2 + Math.random() * 2.5 : 0.9 + Math.random() * 1.4);
      voice.next = t;
    }
    if (t >= voice.next) {                                       // cada "sílaba": nueva intensidad y nueva dirección
      voice.next = t + 0.16 + Math.random() * 0.24;
      voice.target = voice.talking && Math.random() > 0.18 ? 0.35 + Math.random() * 0.65 : 0;
      if (voice.target > 0) { randDir(voice.t1); randDir(voice.t2); }
    }
    voice.v += (voice.target - voice.v) * Math.min(1, dt * (voice.target > voice.v ? 9 : 4.5));   // sube y baja con suavidad
    voice.d1.lerp(voice.t1, Math.min(1, dt * 5)).normalize(); voice.d2.lerp(voice.t2, Math.min(1, dt * 5)).normalize();
    mat.uniforms.uVoice.value = voice.v * mat.uniforms.uIntro.value;
    mat.uniforms.uVDir.value.copy(voice.d1); mat.uniforms.uVDir2.value.copy(voice.d2);
  }

  /* ---- Sinapsis del cerebro: destellos que nacen en puntos al azar y a veces se encadenan con uno vecino ---- */
  const sparks = mat.uniforms.uSpark.value.slice(0, 4).map((v, i) => ({ v, age: -1, dur: 1, wait: 0.4 + i * 0.9 + Math.random() }));   // pocos y espaciados
  let sparkLast = 0;
  const sparkPoint = (near) => {                                  // punto de la cara visible del cerebro; si hay "near", cerca de él
    let best = 0, bd = 1e9;
    for (let k = 0; k < (near ? 14 : 1); k++) {
      let n = 0;
      for (let tries = 0; tries < 20; tries++) { n = (Math.random() * N2) | 0; if (P2[n * 3 + 2] > 0.05) break; }
      if (!near) return n;
      const d = Math.abs(Math.hypot(P2[n * 3] - near.x, P2[n * 3 + 1] - near.y, P2[n * 3 + 2] - near.z) - 0.5);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  };
  function updateSparks(t) {
    const dt = Math.min(0.05, t - sparkLast); sparkLast = t;
    if (reduceMo || state.morph < 1.6) { sparks.forEach((sp) => { sp.age = -1; sp.v.w = -1; }); return; }
    for (const sp of sparks) {
      if (sp.age < 0) {
        sp.wait -= dt;
        if (sp.wait <= 0) {
          const n = sparkPoint(sp.chain ? sp.v : null);
          sp.v.set(P2[n * 3], P2[n * 3 + 1], P2[n * 3 + 2], 0); sp.age = 0; sp.dur = 1.0 + Math.random() * 0.6;
        }
      } else {
        sp.age += dt / sp.dur;
        if (sp.age >= 1) { sp.age = -1; sp.chain = Math.random() < 0.3; sp.wait = sp.chain ? 0.12 + Math.random() * 0.2 : 1.6 + Math.random() * 2.6; }
      }
      sp.v.w = sp.age;
    }
  }

  /* ---- Render ---- */
  let running = true, started = false;
  const t0 = performance.now();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uMorph.value = state.morph;
    updateVoice(t);
    updateSparks(t);
    {
      const w1 = clamp01(1 - Math.abs(state.morph - 1));                    // 1 cuando la forma es la galaxia
      group.scale.setScalar(state.scale * (base.scale + (base.gal - base.scale) * w1));
      group.position.y = base.y + (base.galY - base.y) * w1 + (base.brainDy || 0) * clamp01(state.morph - 1);
    }

    mat.uniforms.uGrad.value.set(group.position.y, Math.max(group.scale.x, 0.05));

    const px = mouse.x, py = mouse.y;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    const v = Math.hypot(mouse.x - px, mouse.y - py) * 12;
    mouse.speed += (Math.min(v, 1.5) - mouse.speed) * 0.1;

    const w = mouseToWorld(mouse.x, mouse.y);
    mat.uniforms.uMouse.value.set(mouse.inside ? w.x : 99, mouse.inside ? w.y : 99, 0);
    mat.uniforms.uPush.value = mouse.speed;

    mouse.ox += (w.x - mouse.ox) * 0.12; mouse.oy += (w.y - mouse.oy) * 0.12;
    orb.position.set(mouse.ox, mouse.oy, 0.3);
    orb.material.opacity += (0 - orb.material.opacity) * 0.08;   // sin resplandor: el puntero propio ya marca la posición

    // orientación de cada forma (inclinación mínima hacia el cursor)
    mat.uniforms.uTilt.value.set(1.2 - mouse.y * 0.1, serviceShape ? 0.12 - mouse.y * 0.06 : (base.galTilt || 0.27) + Math.sin(t * 0.23) * 0.025 - mouse.y * 0.08, -0.05 - mouse.y * 0.05);
    mat.uniforms.uYaw.value.set(mouse.x * 0.14 + t * 0.12, serviceShape ? Math.sin(t * 0.32) * 0.5 + mouse.x * 0.25 : mouse.x * 0.3, 0.12 + Math.sin(t * 0.3) * 0.3 + mouse.x * 0.3);

    mat.uniforms.uRoll.value.y = serviceShape ? 0 : mouse.x * 0.02;
    if (pinned) { galaxyOrbit.t = t; galaxyOrbit.tilt = mat.uniforms.uTilt.value.y; galaxyOrbit.yaw = mat.uniforms.uYaw.value.y; galaxyOrbit.roll = mat.uniforms.uRoll.value.y; }
    dust.rotation.y = t * 0.02;
    dust.position.y = Math.sin(t * 0.3) * 0.1;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  // el sombreador se compila en segundo plano (si el navegador lo permite) y se dibuja un primer fotograma antes de quitar la carga:
  // así el tirón de preparar la gráfica ocurre tras la pantalla de carga y no en el primer scroll
  const ready = Promise.resolve(renderer.compileAsync ? renderer.compileAsync(scene, camera) : null)
    .catch(() => {})
    .then(() => { renderer.render(scene, camera); frame(); });

  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (running = en.isIntersecting)).observe(hero);

  /* ---- Se llama al terminar la pantalla de carga ---- */
  function start(reduce) {
    if (started) return; started = true;
    if (reduce) { mat.uniforms.uIntro.value = 1; return; }
    gsap.to(mat.uniforms.uIntro, { value: 1, duration: 2.4, ease: 'power2.out' });
    gsap.from(state, { scale: 0.6, duration: 2, ease: 'expo.out', onUpdate: () => group.scale.setScalar(base.scale * state.scale) });

    // Degradados del fondo: deriva constante (posición); el resto lo controla el scroll
    [['a', MOB ? 30 : 12, MOB ? -14 : -6, 9, 14], ['b', MOB ? -34 : -16, MOB ? 12 : 5, 11, -12]].forEach(([k, x, y, d, sk]) => {
      gsap.to(`[data-aurora="${k}"]`, { x: x + 'vw', y: y + 'vw', duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(`[data-aurora="${k}"]`, { skewX: sk, skewY: -sk * 0.4, duration: d * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });   // además se deforman
    });

    if (!pinned) return;

    // Secuencia de scroll con el hero fijo: casi-esfera → galaxia → cerebro
    const A = '[data-aurora="a"]', B = '[data-aurora="b"]';
    const p1 = ['[data-hero-title]', '[data-foot-wrap]', '[data-actions]', '[data-logos]'];
    const hide = { autoAlpha: 0, y: -40, duration: 0.7, ease: 'power2.in' };
    const show = { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' };
    const E = 'power1.inOut';
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: MOB ? '+=170%' : '+=260%', pin: true,   // en móvil, menos recorrido de dedo entre etapas
        scrub: 0.35, anticipatePin: 1,
        // cada etapa se engancha sola: un gesto de scroll basta para pasar a la siguiente
        // en móvil el enganche espera a que el dedo y la inercia terminen, para no pelearse con el scroll del teléfono
        snap: MOB
          ? { snapTo: 'labelsDirectional', duration: { min: 0.25, max: 0.6 }, delay: 0.16, inertia: false, ease: 'power1.inOut' }
          : { snapTo: 'labelsDirectional', duration: { min: 0.15, max: 0.5 }, delay: 0.05, ease: 'power1.inOut' },
      },
    });
    const homeX = isMobile() ? 0 : HOME_X;
    tl.to(state, { morph: 1, duration: 1.7, ease: E }, 0.6)                                   // → galaxia
      .to(group.position, { x: 0, duration: 1.7, ease: E }, 0.6)                              // la galaxia va centrada bajo su titular
      .to(p1, hide, 0.7)
      .fromTo('[data-panel="2"]', { autoAlpha: 0, y: 40 }, show, 1.9)
      .from('[data-panel="2"] [data-in]', { autoAlpha: 0, y: 34, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 1.8)   // sus piezas entran una tras otra
      // fondo: franja azul en diagonal en la explosión; con la galaxia queda muy tenue
      .to(A, { opacity: 0.5, rotation: -30, scale: 1.3, xPercent: 18, yPercent: 30, duration: 0.9, ease: E }, 0.6)
      .to(A, { opacity: 0.16, rotation: -12, scale: 1.0, xPercent: 0, yPercent: 0, duration: 0.9, ease: E }, 1.5)
      .to(B, { opacity: 0.2, yPercent: -90, scale: 1.1, duration: 1.7, ease: E }, 0.6)
      .to(state, { morph: 2, duration: 1.7, ease: E }, 3.7)                                   // → cerebro
      .to(group.position, { x: homeX, duration: 1.7, ease: E }, 3.7)
      .to('[data-panel="2"]', hide, 3.8)
      .fromTo('[data-panel="3"]', { autoAlpha: 0, y: 40 }, show, 5.0)
      .from('[data-panel="3"] [data-in]', { autoAlpha: 0, y: 34, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 5.0)
      .to(A, { opacity: 0.45, rotation: -24, scale: 1.2, xPercent: 8, yPercent: 14, duration: 1.7, ease: E }, 3.7)
      .to(B, { opacity: 0.25, yPercent: -30, scale: 0.95, duration: 1.7, ease: E }, 3.7)
      .to({}, { duration: 0.25 }, 5.8)                                                       // pausa final mínima: tras el cerebro el scroll sigue enseguida
      .addLabel('esfera', 0).addLabel('galaxia', 2.75).addLabel('cerebro', 5.95);
  }

  return { start, ready };
}
