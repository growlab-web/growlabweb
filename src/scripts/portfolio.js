/**
 * Portafolio 3D (inspirado en jesperlandberg.com).
 *  - Carrusel de paneles curvados que pasan por delante de la cámara con perspectiva, sobre un suelo de partículas.
 *  - Rueda / arrastre / teclado, con inercia y "snap" al proyecto más cercano.
 *  - Etiqueta y botón "+" pegados a cada panel (proyectados desde 3D a pantalla).
 *  - Vista «Todos» (lista de nombres) y página de proyecto (panel blanco) con URL propia /portafolio/<slug>.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { projects, getProject } from '../data/projects.js';
import { makeArt, projectImageKinds } from './projectArt.js';

const N = projects.length;
let CARD_W = 3.6, CARD_H = 2.25;                  // en móvil se cambian a un formato vertical (ver initPortfolio)
const GAP = 0.2;
const RC = 10;                       // radio del cilindro: los paneles forman una tira continua y curva
const BEND_R = RC;                   // cada panel se curva con el mismo radio, así encajan sin huecos
let SPACING = CARD_W + GAP;          // separación entre centros (sobre el arco)
let DTH = SPACING / RC;              // ángulo entre un panel y el siguiente
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smoothstepJS = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const mod = (v, n) => ((v % n) + n) % n;
// diferencia con signo más corta entre dos posiciones de la tira circular (-N/2 … N/2): el último proyecto queda junto al primero
const wrapD = (v) => { const d = mod(v, N); return d > N / 2 ? d - N : d; };
const $ = (s, r) => r.querySelector(s);
const $$ = (s, r) => Array.from(r.querySelectorAll(s));

export async function initPortfolio(root) {
  // móvil (< 700 px): paneles verticales, más grandes en pantalla
  const PORTRAIT = window.innerWidth < 700;
  if (PORTRAIT) { CARD_W = 2.4; CARD_H = 3.0; SPACING = CARD_W + GAP; DTH = SPACING / RC; }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = $('[data-pf-canvas]', root);
  const labelsEl = $('[data-pf-labels]', root);
  const modal = $('[data-pf-modal]', root);
  const loaderEl = $('[data-pf-loader]', root);

  /* ===================== Renderer y cámara ===================== */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const PR = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const cam = { baseZ: 8, offX: 0.3 };

  /* ===================== Fuentes (para dibujar las imágenes) ===================== */
  try {
    await Promise.all([document.fonts.load('800 40px "Syne"'), document.fonts.load('700 22px "Syne"'), document.fonts.load('500 14px "Host Grotesk"')]);
  } catch (e) { /* se usa la fuente de reserva */ }

  /* ===================== Paneles (proyectos) ===================== */
  const cardVert = `
    uniform float uBend, uTime, uHover, uFlag, uPhase; uniform vec2 uMouseUV;
    varying vec2 vUv; varying float vShade;
    void main(){
      vUv = uv; vec3 p = position;
      // onda circular que nace donde pasa el ratón (relieve local del panel)
      float ar = 1.6;
      float dm = distance(vec2(uv.x * ar, uv.y), vec2(uMouseUV.x * ar, uMouseUV.y));
      float rip = sin(dm * 15.0 - uTime * 6.5) * exp(-dm * 2.6) * uHover;
      p.z += rip * 0.15;
      float slope = cos(dm * 15.0 - uTime * 6.5) * exp(-dm * 2.6) * uHover * 0.4;
      // curva del cilindro
      float a = p.x / uBend;
      p.x = uBend * sin(a);
      p.z += uBend * (1.0 - cos(a));
      // BANDERA: una sola onda para toda la tira visible. El panel central (x≈0) no se mueve y queda al frente;
      // los laterales ondean hacia atrás, como la tela de una bandera sujeta por el centro.
      vec4 wp = modelMatrix * vec4(p, 1.0);
      float env = smoothstep(0.0, 3.6, abs(wp.x));
      float w1 = 0.5 + 0.5 * sin(wp.x * 0.85 + uPhase);
      float w2 = 0.5 + 0.5 * sin(wp.x * 1.7 - uPhase * 1.5);
      wp.z -= uFlag * env * (0.75 * w1 + 0.25 * w2);
      wp.y += uFlag * 0.12 * env * sin(wp.x * 0.8 + uPhase * 1.2);
      slope += -uFlag * env * (0.75 * 0.5 * 0.85 * cos(wp.x * 0.85 + uPhase) + 0.25 * 0.5 * 1.7 * cos(wp.x * 1.7 - uPhase * 1.5)) * 0.8;
      vShade = slope;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`;
  const cardFrag = `
    uniform sampler2D uMap; uniform float uBright, uOpacity, uHover; uniform vec2 uSize; varying vec2 vUv; varying float vShade;
    float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r; }
    void main(){
      vec2 p = (vUv - 0.5) * uSize;
      float d = sdBox(p, uSize * 0.5, 0.14);
      float mask = 1.0 - smoothstep(-0.012, 0.012, d);
      vec2 uv = (vUv - 0.5) * (1.0 - uHover * 0.04) + 0.5;     // zoom suave al pasar el ratón
      vec3 c = texture2D(uMap, uv).rgb * uBright;
      c *= 1.0 + clamp(vShade, -1.0, 1.0) * 0.15;                  // luz y sombra de los pliegues de la onda
      c = mix(c, c * 0.3, smoothstep(0.32, 0.0, vUv.y) * 0.6);   // sombra inferior para la etiqueta
      c += smoothstep(-0.06, 0.0, d) * 0.1;                       // borde claro
      gl_FragColor = vec4(c, mask * uOpacity);
    }`;
  const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 56, 28);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const cards = projects.map((p, i) => {
    const tex = new THREE.CanvasTexture(PORTRAIT ? makeArt(p, 'cover', 960, 1200) : makeArt(p, 'cover', 1280, 800));
    tex.anisotropy = maxAniso;
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, vertexShader: cardVert, fragmentShader: cardFrag,
      uniforms: { uMap: { value: tex }, uBend: { value: BEND_R }, uBright: { value: 1 }, uOpacity: { value: 1 }, uHover: { value: 0 }, uSize: { value: new THREE.Vector2(CARD_W, CARD_H) }, uTime: { value: 0 }, uFlag: { value: 0 }, uPhase: { value: 0 }, uMouseUV: { value: new THREE.Vector2(0.5, 0.5) } },
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.i = i;
    scene.add(mesh);
    return { mesh, mat, hover: 0, p, muv: new THREE.Vector2(0.5, 0.5) };
  });

  /* ===================== Partículas: suelo en perspectiva + polvo ===================== */
  const noiseless = `uniform float uTime, uOffset, uPR;`;
  const SP = 0.55, NX = 61, NZ = 52;
  const xz = new Float32Array(NX * NZ * 2);
  for (let a = 0, k = 0; a < NX; a++) for (let b = 0; b < NZ; b++, k += 2) { xz[k] = (a - NX / 2) * SP; xz[k + 1] = 6 - b * SP; }
  const floorGeo = new THREE.BufferGeometry();
  floorGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NX * NZ * 3), 3));
  floorGeo.setAttribute('aXZ', new THREE.BufferAttribute(xz, 2));
  const floorMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOffset: { value: 0 }, uPR: { value: PR }, uFade: { value: 1 } },
    vertexShader: `${noiseless}
      attribute vec2 aXZ; varying float vA; varying vec3 vC;
      void main(){
        float sp = ${SP.toFixed(2)};
        float x = aXZ.x - mod(uOffset, sp); float z = aXZ.y;
        float y = -1.5 + sin((x + uOffset) * 0.55 + uTime * 0.5) * 0.07 + cos(z * 0.45 - uTime * 0.35) * 0.07;
        vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(uPR * 34.0 / max(-mv.z, 1.0), 1.8 * uPR, 9.0 * uPR);
        float depthFade = smoothstep(30.0, 7.0, -mv.z);
        vA = depthFade * (0.55 + 0.6 * smoothstep(12.0, 0.0, abs(x - 0.7)));
        vC = mix(vec3(0.22, 0.435, 0.87), vec3(0.67, 0.88, 0.33), smoothstep(-6.0, -24.0, z) * 0.55);
      }`,
    fragmentShader: `uniform float uFade; varying float vA; varying vec3 vC;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.1, d); gl_FragColor = vec4(vC, a * vA * uFade); }`,
  });
  const floor = new THREE.Points(floorGeo, floorMat);
  floor.frustumCulled = false;
  scene.add(floor);

  const DUST = 700, dpos = new Float32Array(DUST * 3), dseed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) { dpos[i * 3] = (Math.random() - 0.5) * 26; dpos[i * 3 + 1] = -1.4 + Math.random() * 6.5; dpos[i * 3 + 2] = 5 - Math.random() * 22; dseed[i] = Math.random(); }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dseed, 1));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: PR }, uOffset: { value: 0 } },
    vertexShader: `uniform float uTime, uPR, uOffset; attribute float aSeed; varying float vA; varying float vS;
      void main(){
        vec3 p = position;
        p.y += mod(uTime * (0.05 + aSeed * 0.1) + aSeed * 8.0, 6.5) - 1.0 - (position.y + 1.4);
        p.x += sin(uTime * 0.25 + aSeed * 20.0) * 0.4 - mod(uOffset * 0.35, 26.0);
        p.x = mod(p.x + 13.0, 26.0) - 13.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(uPR * (2.0 + aSeed * 3.5) * (7.0 / max(-mv.z, 1.0)), 1.0, 8.0 * uPR);
        vA = smoothstep(26.0, 6.0, -mv.z) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.2 + aSeed * 30.0)));
        vS = aSeed;
      }`,
    fragmentShader: `varying float vA; varying float vS;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d);
        vec3 c = mix(vec3(0.5, 0.7, 1.0), vec3(0.75, 0.95, 0.55), step(0.82, vS)); gl_FragColor = vec4(c, a * vA * 0.8); }`,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  /* ===================== Etiquetas y botón "+" (HTML pegado a cada panel) ===================== */
  const tags = projects.map((p, i) => {
    const label = document.createElement('button');
    label.type = 'button'; label.className = 'pf-label'; label.textContent = p.name; label.dataset.i = i; label.tabIndex = -1;
    const plus = document.createElement('button');
    plus.type = 'button'; plus.className = 'pf-plus'; plus.setAttribute('aria-label', `Abrir proyecto ${p.name}`); plus.dataset.i = i;
    plus.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    labelsEl.append(label, plus);
    return { label, plus };
  });

  /* ===================== Estado ===================== */
  const S = { flag: 0, flagV: 0, phase: 0, dir: 1, vel: 0, pos: 0, target: 0, intro: reduce ? 1 : 0, mode: 1, dim: 0, lastInput: 0, dragging: false, moved: 0, open: null, started: false, mx: 0, my: 0, hover: -1 };
  const introCard = projects.map(() => 0);
  let width = 1, height = 1;

  function resize() {
    width = root.clientWidth; height = root.clientHeight;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect; camera.updateProjectionMatrix();
    cam.baseZ = aspect >= 1.25 ? 8 : PORTRAIT ? 10.6 : 8 + (1.25 - aspect) * 9;
    cam.offX = aspect >= 1.25 ? 0.3 : 0;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ===================== Entrada: rueda, arrastre, teclado ===================== */
  const touch = (dv) => { S.target += dv; S.lastInput = performance.now(); };
  const canNav = () => !S.open && S.mode > 0.5;
  window.addEventListener('wheel', (e) => {
    if (!canNav()) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    touch(d * 0.0021);
  }, { passive: true });
  let dragX = 0;
  canvas.addEventListener('pointerdown', (e) => { if (!canNav()) return; S.dragging = true; S.moved = 0; dragX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.classList.add('pf-grabbing'); });
  canvas.addEventListener('pointermove', (e) => {
    S.mx = (e.clientX / width) * 2 - 1; S.my = -((e.clientY / height) * 2 - 1);
    S.px = e.clientX; S.py = e.clientY;
    if (!S.dragging) return;
    const dx = e.clientX - dragX; dragX = e.clientX; S.moved += Math.abs(dx);
    touch(-dx / (width * 0.27));
  });
  const endDrag = (e) => {
    if (!S.dragging) return;
    S.dragging = false; canvas.classList.remove('pf-grabbing');
    if (S.moved < 6 && S.hover >= 0) {
      const off = wrapD(S.hover - S.pos);
      if (Math.abs(off) < 0.5) openProject(projects[S.hover].slug);
      else { S.target = Math.round(S.pos + off); S.lastInput = performance.now(); }
    }
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { S.hover = -1; });

  window.addEventListener('keydown', (e) => {
    if (S.open) {
      if (e.key === 'Escape') closeProject();
      else if (e.key === 'ArrowRight') stepProject(1);
      else if (e.key === 'ArrowLeft') stepProject(-1);
      return;
    }
    if (S.mode < 0.5) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { S.target = Math.round(S.target) + 1; S.lastInput = performance.now(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { S.target = Math.round(S.target) - 1; S.lastInput = performance.now(); }
    else if (e.key === 'Enter') openProject(projects[mod(Math.round(S.pos), N)].slug);
  });

  labelsEl.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const i = Number(b.dataset.i);
    const off = wrapD(i - S.pos);
    if (Math.abs(off) < 0.6) openProject(projects[i].slug); else { S.target = Math.round(S.pos + off); S.lastInput = performance.now(); }
  });

  /* ===================== Bucle de render ===================== */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const v3 = new THREE.Vector3();
  let last = performance.now(), time = 0, running = true;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;

    // inercia + imán al proyecto más cercano cuando no hay entrada
    if (!S.dragging && !S.open && now - S.lastInput > 150) S.target = Math.round(S.target);
    const prevPos = S.pos;
    S.pos += (S.target - S.pos) * Math.min(1, dt * 6.5);
    S.vel += ((S.pos - prevPos) / Math.max(dt, 0.001) - S.vel) * Math.min(1, dt * 9);   // cartas/segundo, suavizada

    // cámara con ligero paralaje
    // amplitud de la bandera: muelle subamortiguado hacia la velocidad del scroll (impulso + rebote)
    const flagTarget = clamp(Math.abs(S.vel) * 0.55, 0, 1.7) * (S.open ? 0 : 1);
    S.flagV += (62 * (flagTarget - S.flag) - 7.5 * S.flagV) * dt;
    S.flag += S.flagV * dt;
    if (Math.abs(S.vel) > 0.05) S.dir += (Math.sign(S.vel) - S.dir) * Math.min(1, dt * 6);   // la onda viaja hacia donde vas
    S.phase += dt * (3.4 + Math.abs(S.vel) * 2.4) * S.dir;

    const camZ = cam.baseZ + S.dim * 0.9;
    camera.position.set(cam.offX - 0.8 + S.mx * 0.35, 0.55 + S.my * 0.18, camZ);
    camera.lookAt(cam.offX, -0.08, 0);

    // hover
    ndc.set(S.mx, S.my);
    raycaster.setFromCamera(ndc, camera);
    const visible = cards.filter((c) => c.mesh.visible).map((c) => c.mesh);
    const hit = !S.open && S.mode > 0.5 && S.px != null ? raycaster.intersectObjects(visible)[0] : null;
    S.hover = hit ? hit.object.userData.i : -1;
    if (hit && hit.uv) cards[S.hover].muv.lerp(hit.uv, Math.min(1, dt * 12));
    canvas.style.cursor = S.dragging ? 'grabbing' : S.hover >= 0 ? 'pointer' : 'grab';

    cards.forEach((c, i) => {
      const d = wrapD(i - S.pos), ad = Math.abs(d), focus = Math.max(0, 1 - ad);   // distancia con signo por el camino más corto
      // entrada escalonada desde el panel central hacia fuera
      const t = reduce ? 1 : clamp(S.intro * 2.2 - Math.abs(wrapD(i - S.target)) * 0.22, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      introCard[i] = e;
      c.hover += ((S.hover === i ? 1 : 0) - c.hover) * Math.min(1, dt * 8);

      const m = c.mesh;
      m.visible = ad < 3.4 && e > 0.001 && S.mode > 0.01;
      if (!m.visible) { tags[i].label.style.opacity = 0; tags[i].plus.style.opacity = 0; tags[i].label.style.pointerEvents = tags[i].plus.style.pointerEvents = 'none'; return; }
      // posición sobre el cilindro (el centro del cilindro queda delante del panel central)
      const th = d * DTH * (1 + (1 - e) * 0.18);
      m.position.set(RC * Math.sin(th), Math.sin(time * 0.6 + i) * 0.04 - (1 - e) * 0.9, RC * (1 - Math.cos(th)) - (1 - e) * 4.5);
      m.rotation.y = -th + S.mx * 0.09 * c.hover;
      m.rotation.x = -S.my * 0.1 * c.hover;
      m.scale.setScalar(1 + focus * 0.045 + c.hover * 0.02);
      const fade = 1 - clamp((ad - 2.4) / 2.2, 0, 1);
      c.mat.uniforms.uBright.value = (0.28 + 0.72 * Math.pow(focus, 0.6)) * (1 - S.dim * 0.65) * (1 + c.hover * 0.1);
      c.mat.uniforms.uOpacity.value = e * fade * S.mode;
      c.mat.uniforms.uHover.value = c.hover;
      c.mat.uniforms.uBend.value = BEND_R / (1 + c.hover * 0.45);
      c.mat.uniforms.uTime.value = time;
      c.mat.uniforms.uFlag.value = S.flag;
      c.mat.uniforms.uPhase.value = S.phase;
      c.mat.uniforms.uMouseUV.value.copy(c.muv);
      m.renderOrder = -Math.round(ad * 10);

      // etiqueta + botón "+" proyectados a pantalla
      m.updateMatrixWorld();
      const place = (el, lx, ly, off) => {
        const lz = BEND_R * (1 - Math.cos(lx / BEND_R));
        v3.set(Math.sin(lx / BEND_R) * BEND_R, ly, lz).applyMatrix4(m.matrixWorld);
        const env = smoothstepJS(0, 3.6, Math.abs(v3.x));
        v3.z -= S.flag * env * (0.75 * (0.5 + 0.5 * Math.sin(v3.x * 0.85 + S.phase)) + 0.25 * (0.5 + 0.5 * Math.sin(v3.x * 1.7 - S.phase * 1.5)));
        v3.y += S.flag * 0.12 * env * Math.sin(v3.x * 0.8 + S.phase * 1.2);
        const sc = clamp((camZ / camera.position.distanceTo(v3)) * m.scale.x, 0.4, 1.35);
        v3.project(camera);
        const x = (v3.x * 0.5 + 0.5) * width, y = (-v3.y * 0.5 + 0.5) * height;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) ${off} scale(${sc.toFixed(3)})`;
      };
      const vis = e * S.mode * (1 - clamp((ad - 0.4) / 1.4, 0, 1)) * (1 - S.dim);
      const visPlus = e * S.mode * (1 - clamp((ad - 0.15) / 0.55, 0, 1)) * (1 - S.dim);   // el "+" de los paneles vecinos se apaga antes
      place(tags[i].label, -CARD_W / 2 + 0.2, -CARD_H / 2 + 0.2, 'translate(0,-100%)');
      place(tags[i].plus, CARD_W / 2 - 0.3, -CARD_H / 2 + 0.3, 'translate(-50%,-50%)');
      tags[i].label.style.opacity = vis.toFixed(3);
      tags[i].plus.style.opacity = visPlus.toFixed(3);
      tags[i].label.style.pointerEvents = vis > 0.4 ? 'auto' : 'none';
      tags[i].plus.style.pointerEvents = visPlus > 0.4 ? 'auto' : 'none';
    });

    floorMat.uniforms.uTime.value = dustMat.uniforms.uTime.value = time;
    floorMat.uniforms.uOffset.value = dustMat.uniforms.uOffset.value = S.pos * SPACING;
    floorMat.uniforms.uFade.value = 1 - S.dim * 0.45;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (running = en.isIntersecting)).observe(root);

  /* ===================== Vista «Destacados / Todos» ===================== */
  const fullEl = $('[data-pf-full]', root);
  const modeBtns = $$('[data-pf-mode]', root);
  function setMode(mode) {
    const toFull = mode === 'full';
    modeBtns.forEach((b) => b.classList.toggle('is-on', b.dataset.pfMode === mode));
    gsap.to(S, { mode: toFull ? 0 : 1, duration: 0.7, ease: 'power2.inOut' });
    if (toFull) { fullEl.hidden = false; gsap.fromTo($$('[data-pf-full-item]', fullEl), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out', delay: 0.25 }); }
    else gsap.to($$('[data-pf-full-item]', fullEl), { autoAlpha: 0, y: -8, duration: 0.3, stagger: 0.015, onComplete: () => { fullEl.hidden = true; } });
  }
  modeBtns.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.pfMode)));
  $$('[data-pf-full-item]', fullEl).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openProject(a.dataset.slug); }));

  /* ===================== Página de proyecto (panel blanco) ===================== */
  const panel = $('[data-pf-panel]', modal);
  const scroller = $('[data-pf-scroll]', modal);
  const imagesEl = $('[data-pf-images]', modal);
  const ring = $('[data-pf-ring]', modal);
  const RING_LEN = 2 * Math.PI * 9;
  const imgCache = new Map();
  const baseTitle = document.title;

  function fillProject(p) {
    $('[data-pf-title]', modal).textContent = p.name;
    $('[data-pf-desc]', modal).textContent = p.desc;
    $('[data-pf-count]', modal).textContent = `${String(projects.indexOf(p) + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    $('[data-pf-chips]', modal).innerHTML =
      `<span class="pf-dot" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span>` +
      `<span class="pf-chip">${p.category}</span><span class="pf-chip">${p.year}</span>` +
      `<span class="pf-chip pf-chip--result"><b>${p.result.value}</b> ${p.result.label}</span>`;
    $('[data-pf-services]', modal).innerHTML = p.services.map((s) => `<li>${s}</li>`).join('');
    const prev = projects[(projects.indexOf(p) - 1 + N) % N], next = projects[(projects.indexOf(p) + 1) % N];
    $('[data-pf-prev-name]', modal).textContent = prev.name; $('[data-pf-next-name]', modal).textContent = next.name;
    // imágenes
    imagesEl.innerHTML = '';
    if (!imgCache.has(p.slug)) imgCache.set(p.slug, projectImageKinds(p).map((k) => makeArt(p, k, 1400, 880)));
    const imgs = (p.images && p.images.length) ? p.images.map((src) => { const im = new Image(); im.src = src; im.alt = p.name; return im; }) : imgCache.get(p.slug);
    imgs.forEach((el) => { const fig = document.createElement('figure'); fig.className = 'pf-fig'; el.className = 'pf-img'; fig.append(el); imagesEl.append(fig); });
    scroller.scrollTop = 0; ring.style.strokeDashoffset = RING_LEN;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { root: scroller, threshold: 0.15 });
      $$('.pf-fig', imagesEl).forEach((f) => io.observe(f));
    } else $$('.pf-fig', imagesEl).forEach((f) => f.classList.add('is-in'));
  }

  scroller.addEventListener('scroll', () => {
    const max = scroller.scrollHeight - scroller.clientHeight;
    ring.style.strokeDashoffset = RING_LEN * (1 - (max > 0 ? scroller.scrollTop / max : 0));
  }, { passive: true });

  function openProject(slug, { push = true } = {}) {
    const p = getProject(slug); if (!p) return;
    const wasOpen = !!S.open;
    S.open = slug;
    document.body.classList.add('pf-open');
    S.target = Math.round(S.pos) + wrapD(projects.indexOf(p) - Math.round(S.pos)); S.lastInput = performance.now();
    document.title = `${p.name} · Portafolio · GrowLab`;
    if (push && location.pathname !== `/portafolio/${slug}`) { try { history.pushState({ slug }, '', `/portafolio/${slug}`); } catch (e) { /* entorno sin historial (vista previa) */ } }
    if (wasOpen) {
      gsap.to(panel, { opacity: 0, y: 14, duration: 0.2, onComplete: () => { fillProject(p); gsap.to(panel, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }); } });
      return;
    }
    fillProject(p);
    modal.hidden = false;
    gsap.to(S, { dim: 1, duration: 0.8, ease: 'power2.inOut' });
    gsap.killTweensOf([panel, modal]);
    gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
    gsap.fromTo(panel, { y: reduce ? 0 : '7%', scale: reduce ? 1 : 0.965, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: reduce ? 0.01 : 0.85, ease: 'expo.out' });
    gsap.fromTo($$('[data-pf-reveal]', modal), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: reduce ? 0 : 0.25 });
    $('[data-pf-close]', modal).focus({ preventScroll: true });
  }

  function closeProject({ push = true } = {}) {
    if (!S.open) return;
    S.open = null;
    document.body.classList.remove('pf-open');
    document.title = baseTitle;
    if (push && location.pathname !== '/portafolio') { try { history.pushState({}, '', '/portafolio'); } catch (e) { /* idem */ } }
    gsap.to(S, { dim: 0, duration: 0.8, ease: 'power2.inOut' });
    gsap.to(panel, { y: reduce ? 0 : '6%', scale: reduce ? 1 : 0.97, autoAlpha: 0, duration: reduce ? 0.01 : 0.5, ease: 'power3.in' });
    gsap.to(modal, { autoAlpha: 0, duration: 0.45, delay: 0.1, onComplete: () => { modal.hidden = true; } });
  }

  function stepProject(dir) {
    const i = projects.findIndex((p) => p.slug === S.open);
    openProject(projects[(i + dir + N) % N].slug);
  }

  $('[data-pf-close]', modal).addEventListener('click', () => closeProject());
  $('[data-pf-prev]', modal).addEventListener('click', () => stepProject(-1));
  $('[data-pf-next]', modal).addEventListener('click', () => stepProject(1));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
  window.addEventListener('popstate', () => {
    const m = location.pathname.match(/^\/portafolio\/([^/]+)\/?$/);
    if (m && getProject(m[1])) openProject(m[1], { push: false }); else closeProject({ push: false });
  });

  /* ===================== Arranque (cuando termina la pantalla de carga) ===================== */
  function start() {
    if (S.started) return; S.started = true;
    gsap.to(loaderEl, { autoAlpha: 0, duration: 0.5, delay: 0.1 });
    gsap.to($$('[data-pf-ui]', root), { autoAlpha: 1, duration: 1, delay: 0.9 });
    if (reduce) { S.intro = 1; } else gsap.to(S, { intro: 1, duration: 2.4, ease: 'power2.out', delay: 0.15 });
    const initial = root.dataset.open;
    if (initial && getProject(initial)) setTimeout(() => openProject(initial, { push: false }), reduce ? 50 : 1400);
  }

  return { start };
}
