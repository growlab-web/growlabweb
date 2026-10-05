/**
 * Hero 3D: un único sistema de partículas que cambia de forma con el scroll
 *   casi-esfera  →  (explosión)  →  galaxia espiral  →  (explosión)  →  cerebro
 * El cursor deja un orbe luminoso y aparta/ilumina las partículas de forma sutil.
 * El cerebro se construye con la silueta y los surcos de data/brainData.js.
 * Los degradados del fondo ([data-aurora]) derivan solos y cambian con cada etapa.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BRAIN_DATA from '../data/brainData.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero3D() {
  const hero = document.querySelector('[data-hero]');
  const canvas = hero && hero.querySelector('#hero3d');
  if (!canvas) return { start() {} };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const PR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.z = 5;

  const isMobile = () => window.innerWidth < 800;
  const MOB = isMobile();
  const COUNT = MOB ? 40000 : 90000;     // la casi-esfera usa todas
  const N1 = MOB ? 26000 : 64000;        // galaxia (densa)
  const N2 = MOB ? 34000 : 62000;        // cerebro (muy fino)
  const N0 = COUNT;

  /* ================= Utilidades ================= */
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const PURPLE = [0.42, 0.3, 1.0], LILAC = [0.62, 0.45, 1.0], BLUE = [0.3, 0.55, 1.0];
  const WHITE = [0.95, 0.9, 1.0], CYAN = [0.45, 0.82, 1.0], TEAL = [0.28, 1.0, 0.72], GREEN = [0.26, 0.96, 0.62];
  const sparkle = (c, p) => (Math.random() < p ? mix3(c, [1, 1, 1], 0.65) : c);

  /* ================= Buffers ================= */
  const mk = () => new Float32Array(COUNT * 3);
  const P0 = mk(), NR0 = mk(), P1 = mk(), C1 = mk(), P2 = mk(), N2v = mk();
  const SC = mk(), VIS = mk(), RN = new Float32Array(COUNT);
  const set3 = (arr, i, x, y, z) => { arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; };
  const copy3 = (arr, to, from) => { arr[to * 3] = arr[from * 3]; arr[to * 3 + 1] = arr[from * 3 + 1]; arr[to * 3 + 2] = arr[from * 3 + 2]; };
  const fill = (n, arrs) => { for (let i = n; i < COUNT; i++) { const s = (Math.random() * n) | 0; arrs.forEach((a) => copy3(a, i, s)); } };

  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), rad = 3 + Math.random() * 4;
    set3(SC, i, rad * Math.sin(ph) * Math.cos(th), rad * Math.sin(ph) * Math.sin(th), rad * Math.cos(ph));
    RN[i] = Math.random();
    set3(VIS, i, 1, i < N1 ? 1 : 0, i < N2 ? 1 : 0);
  }

  /* --- 1) Casi-esfera: toroide grueso de puntos --- */
  const R = 0.78, r = 0.62;
  for (let i = 0; i < N0; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2;
    const cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v);
    set3(P0, i, (R + r * cv) * cu, r * sv, (R + r * cv) * su);
    set3(NR0, i, cv * cu, sv, cv * su);
  }

  /* --- 2) Galaxia: núcleo morado con espiral + 3 anillos + polvo (denso) --- */
  for (let i = 0; i < N1; i++) {
    const q = Math.random();
    let rr, th = Math.random() * Math.PI * 2, y = 0, col;
    if (q < 0.28) {                          // núcleo en espiral (denso, morado, centro blanco)
      const t = Math.random(); rr = 0.015 + Math.pow(t, 1.25) * 0.74;
      th = rr * 6.5 + Math.floor(Math.random() * 2) * Math.PI + g() * 0.5;
      y = g() * 0.055 * (1.1 - rr);
      col = rr < 0.2 ? mix3(WHITE, LILAC, rr / 0.2) : mix3(LILAC, PURPLE, (rr - 0.2) / 0.55);
    } else if (q < 0.4) {                    // anillo interior (azul-cian)
      rr = 0.95 + g() * 0.045; y = g() * 0.02; col = mix3(BLUE, CYAN, Math.random());
    } else if (q < 0.54) {                   // anillo medio (verde)
      rr = 1.27 + g() * 0.05; y = g() * 0.025; col = mix3(CYAN, TEAL, 0.5 + Math.random() * 0.5);
    } else if (q < 0.78) {                   // anillo exterior (verde, ancho y punteado)
      rr = 2.0 + g() * 0.075; y = g() * 0.04; col = mix3(TEAL, GREEN, Math.random());
    } else {                                 // polvo suelto alrededor
      rr = 0.5 + Math.pow(Math.random(), 0.85) * 2.2; y = g() * 0.12;
      col = mix3(TEAL, CYAN, Math.random()).map((x) => x * 0.85);
    }
    col = sparkle(col, 0.07);
    set3(P1, i, Math.cos(th) * rr, y, Math.sin(th) * rr);
    set3(C1, i, col[0], col[1], col[2]);
  }
  fill(N1, [P1, C1]);

  /* --- 3) Cerebro: silueta + surcos reales de la referencia, inflados en 3D --- */
  (function buildBrain() {
    const B = BRAIN_DATA;
    const W = B.w, H = B.h, bin = atob(B.d), D = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) D[i] = bin.charCodeAt(i) / 255;
    const mask = new Uint8Array(W * H);
    let minY = H, maxY = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (D[y * W + x] > 0.12) { mask[y * W + x] = 1; minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    const dist = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) dist[i] = mask[i] ? 1e6 : 0;
    for (let y = 1; y < H; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; dist[i] = Math.min(dist[i], dist[i - 1] + 1, dist[i - W] + 1, dist[i - W - 1] + 1.41, dist[i - W + 1] + 1.41); }
    for (let y = H - 2; y >= 0; y--) for (let x = W - 2; x >= 1; x--) { const i = y * W + x; dist[i] = Math.min(dist[i], dist[i + 1] + 1, dist[i + W] + 1, dist[i + W + 1] + 1.41, dist[i + W - 1] + 1.41); }
    let dmax = 0; for (let i = 0; i < W * H; i++) if (dist[i] < 1e5) dmax = Math.max(dmax, dist[i]);
    const Z = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) Z[i] = mask[i] ? Math.sqrt(Math.min(1, dist[i] / (dmax * 0.9))) : 0;
    const cdf = new Float32Array(W * H); let acc = 0;
    for (let i = 0; i < W * H; i++) { acc += D[i] > 0.04 ? 0.3 + 0.7 * D[i] : 0; cdf[i] = acc; }
    const S = 2.55 / (maxY - minY), cx = W / 2, cy = (minY + maxY) / 2, thick = 1.0;
    for (let n = 0; n < N2; n++) {
      const t = Math.random() * acc; let lo = 0, hi = W * H - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < t) lo = m + 1; else hi = m; }
      const px = lo % W, py = (lo / W) | 0;
      const x = (px + Math.random() - cx) * S, y = -(py + Math.random() - cy) * S;
      const zf = Z[py * W + px];
      const side = Math.random() < 0.62 ? 1 : -1;
      const zl = Z[py * W + Math.max(0, px - 2)], zr = Z[py * W + Math.min(W - 1, px + 2)];
      const zu = Z[Math.max(0, py - 2) * W + px], zd = Z[Math.min(H - 1, py + 2) * W + px];
      const nx = -(zr - zl) * thick / (4 * S) * side, ny = (zd - zu) * thick / (4 * S) * side, nz = side;
      const nl = Math.hypot(nx, ny, nz) || 1;
      set3(P2, n, x, y, side * zf * thick); set3(N2v, n, nx / nl, ny / nl, nz / nl);
    }
    fill(N2, [P2, N2v]);
  })();

  const geo = new THREE.BufferGeometry();
  const attr = (name, arr, n) => geo.setAttribute(name, new THREE.BufferAttribute(arr, n || 3));
  attr('position', P0); attr('normal', NR0);
  attr('aP1', P1); attr('aC1', C1); attr('aP2', P2); attr('aN2', N2v);
  attr('aScatter', SC); attr('aVis', VIS); attr('aRand', RN, 1);

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

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uIntro: { value: 0 }, uPR: { value: PR }, uSize: { value: MOB ? 2.4 : 2.3 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) }, uPush: { value: 0 }, uRadius: { value: 0.7 },
      uMorph: { value: 0 },
      uTilt: { value: new THREE.Vector3(1.2, 0.26, 0.0) },
      uYaw: { value: new THREE.Vector3(0, 0, 0) },
      uRoll: { value: new THREE.Vector3(0, 0, 0) },
    },
    vertexShader: `
      uniform float uTime, uIntro, uPR, uSize, uPush, uRadius, uMorph;
      uniform vec3 uMouse, uTilt, uYaw, uRoll;
      attribute vec3 aP1, aP2, aN2, aC1, aScatter, aVis; attribute float aRand;
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
        float n2 = snoise(p0*4.0 - uTime*0.3);
        p0 += normal * (n*0.2 + n2*0.03);

        vec3 q0 = xf(p0, uTilt.x, uYaw.x, uRoll.x);
        vec3 q1 = xf(aP1, uTilt.y, uYaw.y, uRoll.y);
        vec3 q2 = xf(aP2, uTilt.z, uYaw.z, uRoll.z);
        vec3 p = q0*w0 + q1*w1 + q2*w2;
        p += normalize(p + vec3(1e-4)) * (w1 + w2) * snoise(p*3.0 + uTime*0.3) * 0.012;

        // explosión entre formas (algunas partículas pasan muy cerca de la cámara)
        vec3 bdir = vec3(aScatter.xy*0.75, aScatter.z*0.45 + 1.3);
        p += bdir * burst * (0.6 + aRand*0.8);

        // ensamblado inicial
        float e = smoothstep(0.0, 1.0, clamp(uIntro*1.4 - aRand*0.4, 0.0, 1.0));
        p = mix(aScatter, p, e);

        vec4 wp = modelMatrix * vec4(p,1.0);

        // cursor: aparta e ilumina muy poco las partículas cercanas
        vec3 d = wp.xyz - uMouse;
        float dist = length(d.xy);
        float f = smoothstep(uRadius, 0.0, dist);
        vec2 dir = normalize(d.xy + 1e-4);
        wp.xy += dir * f * (0.06 + 0.05*uPush);
        wp.z  += f * (0.1 + 0.12*uPush) * (n*0.6+0.4);

        vec4 mv = viewMatrix * wp;
        gl_Position = projectionMatrix * mv;

        // profundidad: lo de adelante más grande y brillante, lo de atrás un poco más oscuro
        float depth = smoothstep(-1.1, 1.1, wp.z);
        float dm = clamp(w0 + w2, 0.0, 1.0);
        float sizeD = mix(1.0, 0.75 + 0.5*depth, dm);
        float colD  = mix(1.0, 0.45 + 0.75*depth, dm);
        float alphD = mix(1.0, 0.5 + 0.5*depth, dm);

        float sm = w0*1.0 + w1*1.15 + w2*1.1;
        float sz = uSize * uPR * (5.0 / max(-mv.z, 0.3)) * (0.6 + aRand*0.7) * sm * sizeD * (1.0 + f*0.8);
        sz = min(sz, 40.0 * uPR);
        gl_PointSize = sz;

        // cerebro: sólo la cara frontal brillante
        vec3 nb = xf(aN2, uTilt.z, uYaw.z, uRoll.z);
        vec3 vdir = normalize(cameraPosition - wp.xyz);
        float facing = dot(normalize(nb + vec3(1e-5)), vdir);
        float vis = mix(1.0, 0.03 + 0.97*smoothstep(-0.05, 0.3, facing), w2);
        float alive = aVis.x*w0 + aVis.y*w1 + aVis.z*w2;

        // degradado por altura en pantalla (verde arriba → azul → violeta abajo)
        float hh = smoothstep(-1.0, 1.0, wp.y + 0.1);
        vec3 purple = vec3(0.62,0.35,1.0), blue = vec3(0.25,0.55,1.0), green = vec3(0.25,1.0,0.65);
        vec3 grad = mix(purple, blue, smoothstep(0.0,0.45,hh));
        grad = mix(grad, green, smoothstep(0.45,0.95,hh));
        vec3 col = mix(aC1, grad, dm);
        col = mix(col, vec3(1.0), step(0.95, aRand) * 0.5 * w2);

        vColor = col * colD * (1.0 + burst*0.25) + f*0.12;
        float base = 0.9*w0 + 0.95*w1 + 1.0*w2;
        vAlpha = base * (0.45 + 0.55*smoothstep(-0.2,0.8,n+0.4)) * e * vis * alive * alphD / (1.0 + max(sz/uPR - 7.0, 0.0)*0.08);
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
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.06, map: new THREE.CanvasTexture(dotCanvas), color: 0x8f9bff, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  /* ---- Orbe gris-lila que sigue al cursor ---- */
  const orbCanvas = document.createElement('canvas'); orbCanvas.width = orbCanvas.height = 128;
  const og = orbCanvas.getContext('2d');
  const grd = og.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(225,220,245,.9)'); grd.addColorStop(0.5, 'rgba(180,175,225,.5)'); grd.addColorStop(1, 'rgba(150,150,220,0)');
  og.fillStyle = grd; og.fillRect(0, 0, 128, 128);
  const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(orbCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  orb.scale.setScalar(0.22);
  scene.add(orb);

  /* ---- Tamaño ---- */
  const base = { scale: 0.82 };
  const state = { scale: 1, morph: 0 };
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const mobile = isMobile();
    group.position.x = 0;
    group.position.y = mobile ? -0.2 : -0.15;
    base.scale = mobile ? 0.55 : 0.82;
    group.scale.setScalar(base.scale * state.scale);
  }

  /* ---- Ratón ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, inside: false, speed: 0, ox: 0, oy: 0 };
  const ndc = new THREE.Vector3();
  window.addEventListener('pointermove', (e) => {
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

  /* ---- Render ---- */
  let running = true, started = false;
  const t0 = performance.now();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uMorph.value = state.morph;

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
    orb.material.opacity += ((mouse.inside ? 0.7 : 0) - orb.material.opacity) * 0.08;

    // orientación de cada forma (inclinación mínima hacia el cursor)
    mat.uniforms.uTilt.value.set(1.2 - mouse.y * 0.1, 0.26 - mouse.y * 0.05, -0.05 - mouse.y * 0.05);
    mat.uniforms.uYaw.value.set(mouse.x * 0.14 + t * 0.12, mouse.x * 0.1 + t * 0.08, 0.25 + Math.sin(t * 0.35) * 0.22 + mouse.x * 0.3);

    dust.rotation.y = t * 0.02;
    dust.position.y = Math.sin(t * 0.3) * 0.1;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();

  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (running = en.isIntersecting)).observe(hero);

  /* ---- Se llama al terminar la pantalla de carga ---- */
  function start(reduce) {
    if (started) return; started = true;
    if (reduce) { mat.uniforms.uIntro.value = 1; return; }
    gsap.to(mat.uniforms.uIntro, { value: 1, duration: 2.6, ease: 'power3.out' });
    gsap.from(state, { scale: 0.6, duration: 2.6, ease: 'expo.out', onUpdate: () => group.scale.setScalar(base.scale * state.scale) });

    // Degradados del fondo: deriva constante (posición); el resto lo controla el scroll
    [['a', 9, -5, 9], ['b', -12, 4, 11], ['c', 10, 8, 13]].forEach(([k, x, y, d]) =>
      gsap.to(`[data-aurora="${k}"]`, { x: x + 'vw', y: y + 'vw', duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 }));

    // Secuencia de scroll con el hero fijo: casi-esfera → galaxia → cerebro
    const A = '[data-aurora="a"]', B = '[data-aurora="b"]', C = '[data-aurora="c"]';
    const p1 = ['[data-hero-title]', '[data-foot-wrap]', '[data-actions]'];
    const hide = { autoAlpha: 0, y: -40, duration: 0.7, ease: 'power2.in' };
    const show = { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' };
    const E = 'power1.inOut';
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=420%', pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    tl.to(state, { morph: 1, duration: 1.7, ease: E }, 0.6)                                   // → galaxia
      .to(p1, hide, 0.7)
      .fromTo('[data-panel="2"]', { autoAlpha: 0, y: 40 }, show, 1.9)
      // fondo: franja teal en diagonal en la explosión, luego banda verde abajo y violeta arriba
      .to(A, { opacity: 0.8, rotation: -30, scale: 1.3, xPercent: 18, yPercent: 30, duration: 0.9, ease: E }, 0.6)
      .to(A, { opacity: 0.35, rotation: -12, scale: 1.0, xPercent: 0, yPercent: 0, duration: 0.9, ease: E }, 1.5)
      .to(B, { opacity: 0.55, yPercent: -90, scale: 1.1, duration: 1.7, ease: E }, 0.6)
      .to(C, { opacity: 0.55, duration: 1.7, ease: E }, 0.6)
      .to(state, { morph: 2, duration: 1.7, ease: E }, 3.7)                                   // → cerebro
      .to('[data-panel="2"]', hide, 3.8)
      .fromTo('[data-panel="3"]', { autoAlpha: 0, y: 40 }, show, 5.0)
      .fromTo('[data-hero-title]', { autoAlpha: 0, y: 30 }, { ...show, immediateRender: false }, 5.0)
      .to(C, { opacity: 0.85, xPercent: 6, yPercent: 15, duration: 0.9, ease: E }, 3.7)
      .to(C, { opacity: 0.4, xPercent: 0, yPercent: 0, duration: 0.9, ease: E }, 4.6)
      .to(A, { opacity: 0.7, rotation: -24, scale: 1.2, xPercent: 8, yPercent: 14, duration: 1.7, ease: E }, 3.7)
      .to(B, { opacity: 0.3, yPercent: -30, scale: 0.95, duration: 1.7, ease: E }, 3.7)
      .to({}, { duration: 1.2 }, 5.4);                                                       // pausa final
  }

  return { start };
}
