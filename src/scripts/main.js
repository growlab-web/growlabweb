/**
 * Punto de entrada de todas las páginas: scroll suave (Lenis) y animaciones con GSAP + ScrollTrigger.
 * - Inicio: pantalla de carga con lluvia + hero 3D (se carga sólo ahí).
 * - Páginas interiores (servicios, portafolio, contacto): entran directamente.
 * Cada bloque comprueba que sus elementos existan, así el mismo script sirve para todas las páginas.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { startRain } from './loaderRain.js';
import { initDataFlow } from './dataflow.js';
import { initDust } from './dust.js';
import { initCursor } from './cursor.js';
import { initTracking } from './track.js';

gsap.registerPlugin(ScrollTrigger);

initCursor();
initTracking();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 800;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* ---------- Red de datos del panel de contacto ---------- */
$$('[data-flow]').forEach((c) => initDataFlow(c));

/* ---------- Partículas flotando en fondos sin objeto 3D (contacto) ---------- */
$$('[data-dust]').forEach((c) => initDust(c));

/* ---------- Scroll suave (Lenis) sincronizado con GSAP ---------- */
const isApp = document.body.hasAttribute('data-app');       // portafolio 3D: maneja su propia rueda/arrastre
const lenis = isApp
  ? { on() {}, raf() {}, stop() {}, start() {}, scrollTo() {}, resize() {} }
  : new Lenis({ lerp: 0.14, smoothWheel: !reduceMotion, virtualScroll: limitWheel });
if (!isApp) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
}
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({ ignoreMobileResize: true });      // la barra del navegador móvil no obliga a recalcular todo en pleno scroll
// el scroll sólo se retiene en el inicio, hasta que el hero fijo está montado (si no, la página saltaría al crearse);
// en las demás páginas se puede hacer scroll desde el primer momento, aunque las fuentes o el 3D sigan cargando
if ($('[data-hero][data-pin]') || isApp) lenis.stop();

/* ---------- Paradas de scroll: un gesto de rueda o trackpad avanza como mucho hasta la siguiente ---------- */
// la inercia del trackpad sigue mandando scroll un buen rato después de soltar: sin esto, un gesto rápido cruza toda la página
// Paradas: las etapas del hero, los tramos del carrusel de servicios y las secciones marcadas con data-stop (sólo en páginas con pin)
let stops = [];
const gesture = { t: 0, dir: 0, limit: null, held: false, heldAt: 0, low: 0 };
function measureStops() {
  const max = ScrollTrigger.maxScroll(window), out = [];
  const pins = ScrollTrigger.getAll().filter((st) => st.pin);
  pins.forEach((st) => {
    const span = st.end - st.start, tl = st.animation, labels = tl && tl.labels ? Object.values(tl.labels) : [];
    if (labels.length) return labels.forEach((time) => out.push(st.start + (span * time) / tl.duration()));
    const n = Math.max(1, Math.round(span / window.innerHeight));       // sin etiquetas: tramos de más o menos una pantalla
    for (let i = 0; i <= n; i++) out.push(st.start + (span * i) / n);
  });
  if (pins.length) $$('[data-stop]').forEach((el) => {
    const r = el.getBoundingClientRect(), top = r.top + window.scrollY;
    out.push(el.dataset.stop === 'center' ? top + r.height / 2 - window.innerHeight / 2 : top);
  });
  stops = [...new Set(out.map((v) => Math.round(Math.min(max, Math.max(0, v)))))].sort((a, b) => a - b);
}
// Táctil: el scroll es el nativo del teléfono y no se puede recortar gesto a gesto como la rueda. Mientras el dedo arrastra, manda el dedo;
// al soltar empieza la inercia, y si esa inercia alcanza la siguiente parada (contando desde donde se soltó) se corta ahí.
if (window.matchMedia('(pointer: coarse)').matches && !isApp) {
  const root = document.documentElement;
  let coasting = false, from = 0, lastY = 0, idle = 0, hold = null;
  const halt = (y) => {
    coasting = false;
    hold = { y, until: performance.now() + 260 };
    root.style.overflow = 'hidden';                       // sin scroll un instante: es lo que detiene la inercia del navegador
    window.scrollTo(0, y);
    setTimeout(() => { root.style.overflow = ''; }, 60);
  };
  window.addEventListener('touchstart', () => { coasting = false; hold = null; }, { passive: true });
  const release = (e) => {
    if (e.touches.length || !stops.length) return;
    coasting = true; from = lastY = window.scrollY;
    clearTimeout(idle); idle = setTimeout(() => { coasting = false; }, 160);
  };
  window.addEventListener('touchend', release, { passive: true });
  window.addEventListener('touchcancel', release, { passive: true });
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hold) {                                             // recién detenido: si la inercia aún empuja, se devuelve a la parada
      if (performance.now() > hold.until) hold = null;
      else if (Math.abs(y - hold.y) > 1) window.scrollTo(0, hold.y);
      return;
    }
    if (!coasting) return;
    clearTimeout(idle); idle = setTimeout(() => { coasting = false; }, 160);
    const dir = Math.sign(y - lastY); lastY = y;
    if (!dir) return;
    const limit = dir > 0 ? stops.find((s) => s > from + 2) : stops.findLast((s) => s < from - 2);
    if (limit != null && (y - limit) * dir >= 0) halt(limit);
  }, { passive: true });
}
ScrollTrigger.addEventListener('refresh', measureStops);

function limitWheel(data) {
  const e = data.event, dy = data.deltaY;
  if (!e.type.includes('wheel') || e.ctrlKey || !stops.length || !dy || Math.abs(data.deltaX) > Math.abs(dy)) return true;
  const g = gesture, now = e.timeStamp, dir = Math.sign(dy), abs = Math.abs(dy);
  // gesto nuevo: tras una pausa, al cambiar de sentido o, ya detenido, cuando el impulso vuelve a crecer (la inercia sólo decae)
  const fresh = now - g.t > 160 || dir !== g.dir || (g.held && now - g.heldAt > 220 && abs > Math.max(g.low * 3, g.low + 30));
  g.t = now;
  if (fresh) {
    const from = lenis.targetScroll;
    g.dir = dir; g.held = false;
    g.limit = dir > 0 ? stops.find((s) => s > from + 2) : stops.findLast((s) => s < from - 2);
  }
  if (g.limit == null) return true;                     // más allá de la última parada el scroll es libre
  if (g.held) g.low = Math.min(g.low, abs);
  else {
    const left = (g.limit - lenis.targetScroll) * dir;
    if (left > abs) return true;
    g.held = true; g.heldAt = now; g.low = abs;
    if (left >= 1) { data.deltaY = left * dir; return true; }   // el último tramo llega justo a la parada
  }
  if (e.cancelable) e.preventDefault();                 // el resto del gesto (inercia) se descarta
  return false;
}

// enlaces internos con ancla (#algo) dentro de la misma página
$$('a[href^="#"], a[href^="/#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const raw = a.getAttribute('href');
    if (raw.startsWith('/#') && location.pathname !== '/') return;      // desde otra página: navega al inicio y allí se desplaza
    const id = raw.startsWith('/#') ? raw.slice(1) : raw;
    const target = id && id.length > 1 ? $(id) : document.body;
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.1 });
  });
});

/* ---------- Objeto 3D (sólo en el inicio): se descarga en segundo plano mientras llueve ---------- */
const hasHero = !!$('[data-hero]');
let hero3d = { start() {} };
const heroReady = hasHero
  ? import('./hero3d.js')
      .then((m) => { hero3d = m.initHero3D(); return Promise.race([hero3d.ready, new Promise((r) => setTimeout(r, 3000))]); })   // espera a que la gráfica esté lista (máx. 3 s)
      .catch((err) => console.warn('WebGL no disponible, se omite el objeto 3D.', err))
  : Promise.resolve();

/* ---------- Portafolio 3D (sólo en /portafolio): también se carga mientras llueve ---------- */
const pfEl = $('[data-portfolio]');
let pf = { start() {} };
const pfReady = pfEl
  ? import('./portfolio.js')
      .then(async (m) => { pf = await m.initPortfolio(pfEl); })
      .catch((err) => { console.warn('No se pudo iniciar el portafolio 3D.', err); const l = $('[data-pf-loader]'); if (l) l.remove(); })
  : Promise.resolve();
const sceneReady = Promise.all([heroReady, pfReady]);

/* ---------- Pantalla de carga con lluvia (sólo en el inicio) ---------- */
let introSeen = false;
try { introSeen = sessionStorage.getItem('gl-intro') === '1'; } catch (e) { /* sin sessionStorage */ }
const loaderEl = $('#loader');
if (loaderEl && introSeen) loaderEl.remove();
const loader = introSeen ? null : loaderEl;
if (loader) { try { sessionStorage.setItem('gl-intro', '1'); } catch (e) { /* sin sessionStorage */ } }
const heroEl = $('[data-hero]');
const objectOnRight = heroEl && !heroEl.hasAttribute('data-pin');   // páginas interiores: el objeto va a la derecha
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
let revealed = false;

function reveal() {
  if (revealed) return;
  revealed = true;
  initPage();
}

if (loader) {
  const rain = startRain($('[data-rain]', loader), { cx: objectOnRight ? 0.7 : 0.5, cy: objectOnRight ? 0.5 : 0.54 });
  gsap.to({ v: 0 }, { v: 1, duration: 0.4, ease: 'power1.in', onUpdate() { rain.setIntensity(this.targets()[0].v); } });
  const minTime = new Promise((r) => setTimeout(r, reduceMotion ? 200 : 1100));
  Promise.all([minTime, sceneReady, fontsReady]).then(() => {
    // la lluvia se encoge y viaja hacia el centro mientras la esfera se ensambla detrás
    const c = { v: 0 };
    gsap.to(c, { v: 1, duration: 1, ease: 'power2.in', onUpdate: () => rain.setConverge(c.v) });
    gsap.to(loader, { opacity: 0, duration: 0.7, delay: 0.45, ease: 'power1.out', onComplete: () => { rain.stop(); loader.remove(); } });
    reveal();
  });
} else {
  Promise.all([sceneReady, fontsReady]).then(reveal);
}

/* ---------- Escritura de servicios (inicio): se teclea, se pausa, se borra y sigue con el siguiente ---------- */
function initTypewriter() {
  $$('[data-typewriter]').forEach((el) => {
    let words = [];
    try { words = JSON.parse(el.dataset.words || '[]'); } catch (e) { /* sin datos */ }
    if (!words.length || reduceMotion) return;        // con "reducir movimiento" queda el primer servicio fijo
    let w = 0, i = 0, deleting = false;
    el.textContent = '';
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        i++; el.textContent = word.slice(0, i);
        if (i === word.length) { deleting = true; return setTimeout(tick, 1100); }   // pausa con la palabra completa
        return setTimeout(tick, 26 + Math.random() * 20);
      }
      i--; el.textContent = word.slice(0, i);
      if (i === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 180); }
      return setTimeout(tick, 14);
    };
    setTimeout(tick, 900);
  });
}

/* ---------- Si la URL trae #ancla (p. ej. /#servicios), la página aparece ya colocada en esa sección ---------- */
// El ancla se retira de la URL al cargar (Layout.astro) para que el navegador no salte antes de tiempo: con el hero fijo, la sección
// queda mucho más abajo de donde está al principio, y ese primer salto se veía como un tirón (sección → hero → sección otra vez).
function scrollToHash() {
  const root = document.documentElement, id = window.__glHash || location.hash;
  const show = () => {
    if (!root.classList.contains('hash-pending')) return;
    root.classList.remove('hash-pending');
    gsap.fromTo('main, footer', { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out', clearProps: 'opacity' });
  };
  if (window.__glHash) { history.replaceState(null, '', id); window.__glHash = null; }      // la URL recupera su ancla (sin provocar salto)
  const target = id && id.length > 1 ? $(id) : null;
  if (!target) return show();
  // Lenis mide el alto de la página con retraso: se le pide que lo actualice antes, o recortaría el salto al alto anterior a los pines
  const go = () => { lenis.resize(); lenis.scrollTo(target, { immediate: true, force: true }); ScrollTrigger.update(); };
  go();
  show();
  // si algo termina de medirse después (imágenes, fuentes), se corrige hasta quedar justo en la sección
  [400, 1200].forEach((ms) => setTimeout(() => { if (Math.abs(target.getBoundingClientRect().top) > 4) { ScrollTrigger.refresh(); go(); } }, ms));
}

/* ---------- Página ---------- */
function initPage() {
  lenis.start();

  gsap.from('[data-nav]', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out' });

  pf.start();

  if (hasHero) {
    // entrada del hero: el texto sale del desenfoque
    // en táctil sin desenfoque: animar un blur es de lo más caro en un teléfono y coincide con el arranque del 3D
    gsap.from('[data-line]', { autoAlpha: 0, y: 26, ...(isTouch ? {} : { filter: 'blur(14px)' }), duration: 1.3, stagger: 0.14, ease: 'power3.out' });
    gsap.from('[data-foot], [data-actions] > *, [data-logos] > *', { autoAlpha: 0, y: 20, ...(isTouch ? {} : { filter: 'blur(8px)' }), duration: 1.1, stagger: 0.12, delay: 0.35, ease: 'power3.out' });
    hero3d.start(reduceMotion);
    initTypewriter();
  }

  if (reduceMotion) { scrollToHash(); return; }

  // el resto de secciones se prepara aparte: en táctil, un momento después, para no competir con la entrada del hero
  const initSections = () => {

  /* MARQUEE: se mueve según el scroll, en direcciones opuestas */
  if ($('[data-marquee]')) {
    $$('[data-marquee-row]').forEach((row) => {
      const dir = Number(row.dataset.marqueeRow);
      gsap.fromTo(row, { xPercent: dir === -1 ? 0 : -50 }, {
        xPercent: dir === -1 ? -50 : 0, ease: 'none',
        scrollTrigger: { trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top', scrub: 0.3 },
      });
    });
  }

  /* MANIFIESTO: palabras que se iluminan con el scroll */
  const manifesto = $('[data-manifesto]');
  if (manifesto) {
    manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to($$('.w', manifesto), {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: manifesto, start: isTouch ? 'top 95%' : 'top 80%', end: 'bottom 55%', scrub: true },
    });
  }

  /* SERVICIOS: scroll horizontal con pin */
  const track = $('[data-services-track]');
  // en móvil y tablet la gente arrastra las tarjetas de lado: ahí es un carrusel que se desliza con el dedo, sin pin
  const swipeServices = window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;
  if (track && swipeServices) {
    const bar = $('[data-services-bar]');
    const upd = () => { const max = track.scrollWidth - track.clientWidth; if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.max(0.08, track.scrollLeft / max) : 1})`; };
    track.addEventListener('scroll', upd, { passive: true });
    upd();
  }
  if (track) {
    const getDist = () => track.scrollWidth - window.innerWidth;
    if (!swipeServices) gsap.to(track, {
      x: () => -getDist(), ease: 'none',
      scrollTrigger: { trigger: '[data-services-pin]', start: 'top top', end: () => '+=' + getDist(), pin: true, scrub: 0.4, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => { const bar = $('[data-services-bar]'); if (bar) bar.style.transform = `scaleX(${Math.max(0.08, self.progress)})`; } },   // la barra bajo las tarjetas marca cuánto falta
    });
    gsap.from('[data-services-head] > *', {
      y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-services]', start: isTouch ? 'top 95%' : 'top 70%' },
    });
  }

  /* PORTAFOLIO: tarjetas apiladas que se encogen al llegar la siguiente */
  const cases = $$('[data-case]');
  if (cases.length) {
    gsap.from('[data-cases-head] > *', {
      y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-cases-head]', start: isTouch ? 'top 95%' : 'top 80%' },
    });
    cases.forEach((c, i) => {
      const inner = $('[data-case-inner]', c);
      gsap.from(inner, { y: 120, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: isTouch ? 'top 95%' : 'top 85%' } });
      if (cases[i + 1]) {
        gsap.to(inner, {
          scale: 0.9, opacity: 0.35, filter: 'blur(4px)', ease: 'none',
          scrollTrigger: { trigger: cases[i + 1], start: 'top 90%', end: 'top 12%', scrub: true },
        });
      }
    });
  }

  /* PROCESO: línea de progreso + pasos que aparecen */
  if ($('[data-process]')) {
    gsap.to('[data-process-line]', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-process-steps]', start: 'top 60%', end: 'bottom 70%', scrub: true },
    });
    $$('[data-process-steps] > li').forEach((li) => {
      gsap.from(li.children, { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: li, start: isTouch ? 'top 95%' : 'top 80%' } });
    });
    gsap.from('[data-process-left] > *', {
      y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-process]', start: isTouch ? 'top 95%' : 'top 70%' },
    });
  }

  /* CTA: texto gigante que crece y se asienta */
  if ($('[data-cta]')) {
    gsap.from('[data-cta-line]', { yPercent: 100, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-cta]', start: isTouch ? 'top 95%' : 'top 60%' } });
    gsap.fromTo('[data-cta-big]', { scale: 0.5, yPercent: 30, opacity: 0.2 }, {
      scale: 1, yPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top 80%', end: 'center center', scrub: true },
    });
    gsap.to('[data-cta-blob]', {
      scale: 1.4, rotate: 90, ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }

  /* CONTADORES: cifras que suben hasta su valor */
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count), dec = Number(el.dataset.dec || 0), suffix = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => (el.textContent = o.v.toFixed(dec) + suffix),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* ENTRADAS de lo que no tenía animación propia: marquesina, antetítulos, tarjetas de servicios, contacto y pie */
  const enter = (els, trigger, vars = {}, start = 'top 85%') => {
    if (isTouch) { start = 'top 97%'; vars = { ...vars, duration: 0.8 }; }   // en el teléfono las piezas aparecen en cuanto asoman
    els = (typeof els === 'string' ? $$(els) : els).filter(Boolean);
    if (els.length) gsap.from(els, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, ...vars, scrollTrigger: { trigger: trigger || els[0], start } });
  };
  enter('[data-marquee]', null, { y: 30, duration: 1.2 }, 'top 92%');
  $$('[data-manifesto]').forEach((m) => enter([m.previousElementSibling], m.parentElement));
  enter('[data-services-track] > *', '[data-services]', { y: 0, x: 140, stagger: 0.09, duration: 1.1 }, swipeServices ? 'top 75%' : 'top 55%');
  $$('[data-contact]').forEach((c) => {
    enter([c.firstElementChild], c, { y: 0, x: -50, duration: 1.3 }, 'top 75%');
    enter($$('[data-contact-form] > *', c), $('[data-contact-form]', c), { y: 26, stagger: 0.06, duration: 0.9 }, 'top 88%');
  });
  enter('footer > *', 'footer', { y: 20, stagger: 0.1 }, 'top 98%');

  /* REVELADO: cualquier bloque marcado con data-reveal sube y aparece al entrar en pantalla */
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: isTouch ? 0.8 : 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: isTouch ? 'top 97%' : 'top 88%' } });
  });

  ScrollTrigger.refresh();
  scrollToHash();
  };
  if (isTouch && hasHero && !location.hash) setTimeout(initSections, 900); else initSections();
}
