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
import { initTracking, track } from './track.js';
import { softwareGL, lowEndDevice } from './gpu.js';

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
window.__lenis = lenis;          // para piezas sueltas que necesitan frenar el scroll suave (el juego del formulario)
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
// Paradas: las etapas del hero y las secciones marcadas con data-stop (sólo en páginas con pin)
let stops = [];
const gesture = { t: 0, dir: 0, limit: null, held: false, heldAt: 0, low: 0, prev: 0 };
function measureStops() {
  const max = ScrollTrigger.maxScroll(window), out = [];
  const pins = ScrollTrigger.getAll().filter((st) => st.pin);
  pins.forEach((st) => {
    const span = st.end - st.start, tl = st.animation;
    // etapas del hero (la etiqueta «fin» sólo sirve para que el enganche pueda soltar el hero hacia abajo: no es una parada)
    const labels = tl && tl.labels ? Object.entries(tl.labels).filter(([name]) => name !== 'fin').map(([, t]) => t) : [];
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
// Táctil: no se frena el scroll por código. Las etapas del hero ya se enganchan solas (snap de su ScrollTrigger) y cortar la inercia del
// teléfono a mano hacía que, en algunos móviles, la página pareciera atascada al intentar seguir bajando.
ScrollTrigger.addEventListener('refresh', measureStops);

function limitWheel(data) {
  const e = data.event, dy = data.deltaY;
  if (!e.type.includes('wheel') || e.ctrlKey || !stops.length || !dy || Math.abs(data.deltaX) > Math.abs(dy)) return true;
  const g = gesture, now = e.timeStamp, dir = Math.sign(dy), abs = Math.abs(dy);
  // gesto nuevo: tras una pausa, al cambiar de sentido o, ya detenido en una parada, en cuanto el impulso vuelve a crecer (la inercia
  // del trackpad sólo decae; un deslizamiento nuevo empieza con valores que suben). Antes se exigía un salto grande y los trackpads,
  // que mandan valores pequeños y encadenan un gesto con la inercia del anterior, quedaban bloqueados en la galaxia.
  const rising = g.held && now - g.heldAt > 120 && abs > g.prev * 1.25 && abs > g.low + 2;
  const fresh = now - g.t > 160 || dir !== g.dir || rising;
  g.t = now; g.prev = abs;
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

// enlaces internos con ancla (#algo, /#servicios, /en#servicios): si llevan a esta misma página, se desplaza sin cambiar la dirección
const samePath = (a, b) => (a.replace(/\/+$/, '') || '/') === (b.replace(/\/+$/, '') || '/');
$$('a[href*="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const raw = a.getAttribute('href');
    const i = raw.indexOf('#'), path = raw.slice(0, i);
    if (path && (/^[a-z]+:/i.test(path) || !samePath(path, location.pathname))) return;   // a otra página: navega y allí se desplaza
    const id = raw.slice(i);
    const target = id && id.length > 1 ? $(id) : document.body;
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.1 });
    // «Saltar al contenido»: además del desplazamiento, el foco del teclado pasa al contenido
    if (a.classList.contains('skip-link')) target.focus({ preventScroll: true });
  });
});

/* ---------- Objeto 3D (sólo en el inicio): se descarga en segundo plano mientras llueve ---------- */
const hasHero = !!$('[data-hero]');
let hero3d = null;                 // se rellena cuando el objeto del hero (3D o imágenes) está listo
let heroWanted = false;            // la página ya se mostró y espera al objeto para arrancarlo
const startHero = () => { if (!hero3d) { heroWanted = true; return; } hero3d.start(reduceMotion); };
const heroReady = hasHero
  // sin aceleración gráfica (equipos muy básicos y herramientas de medición) el hero usa imágenes fijas en vez de la escena 3D: ver gpu.js
  ? softwareGL()
      .then((soft) => { track('render_mode', { render_mode: soft ? 'imagenes' : innerWidth < 800 && lowEndDevice() ? '3d-ligero' : '3d' });   // medición: cuántas visitas ven cada versión
        if (soft) document.documentElement.classList.add('no-3d'); return soft ? import('./heroStatic.js').then((m) => m.initHeroStatic()) : import('./hero3d.js').then((m) => m.initHero3D()); })
      .then((h) => Promise.race([h.ready, new Promise((r) => setTimeout(r, 3000))]).then(() => {   // espera a que la gráfica esté lista (máx. 3 s)
        hero3d = h;
        if (!heroWanted) return;
        // la página se mostró antes (ver sceneReady): el objeto arranca ahora y, como su pin se crea tarde, se reordenan y recalculan los demás
        hero3d.start(reduceMotion); ScrollTrigger.sort(); ScrollTrigger.refresh();
      }))
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
// el texto no espera indefinidamente al objeto del hero: si tarda (sin aceleración gráfica la comprobación es lenta), la página
// se muestra igual y el objeto aparece cuando esté. Con aceleración llega mucho antes de ese margen.
const sceneReady = Promise.all([Promise.race([heroReady, new Promise((r) => setTimeout(r, 900))]), pfReady]);

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
  // la dirección queda limpia, sin el #ancla (growlab.pe/ en vez de growlab.pe/#servicios): la página ya se coloca en la sección
  if (window.__glHash) window.__glHash = null;
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
    startHero();
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

  /* SERVICIOS: carrusel lateral sin fin, con flechas (el scroll vertical no lo mueve) */
  const svcTrack = $('[data-services-track]');
  const svcCards = svcTrack ? [...svcTrack.children] : [];        // las tarjetas reales (las copias se añaden abajo)
  if (svcTrack && svcCards.length) {
    const bars = $$('[data-services-bar]'), prev = $('[data-services-prev]'), next = $('[data-services-next]');
    // Sin fin: la serie se repite antes y después con copias (ocultas para lectores de pantalla). Se empieza en la serie del medio y,
    // cada vez que el desplazamiento se detiene dentro de una copia, se salta sin que se note al mismo punto de la serie real.
    const copy = (c) => { const n = c.cloneNode(true); n.setAttribute('aria-hidden', 'true'); n.inert = true; return n; };
    svcTrack.prepend(...svcCards.map(copy));
    svcTrack.append(...svcCards.map(copy));
    const gap = () => parseFloat(getComputedStyle(svcTrack).columnGap || '0');
    const step = () => svcCards[0].getBoundingClientRect().width + gap();
    const setW = () => step() * svcCards.length;                  // ancho de una serie completa
    const jump = (x) => { svcTrack.style.scrollSnapType = 'none'; svcTrack.scrollLeft = x; svcTrack.style.scrollSnapType = ''; };
    const settle = () => { const w = setW(), x = svcTrack.scrollLeft; if (x < w - 2) jump(x + w); else if (x >= 2 * w - 2) jump(x - w); };   // siempre de vuelta a la serie real (la del medio)
    // Indicador: un tramo que ocupa la parte de la serie que se ve y se desplaza con el carrusel. Como el carrusel no tiene fin,
    // al llegar al último servicio el tramo sale por la derecha mientras su gemelo entra por la izquierda: nunca salta ni se vacía.
    const upd = () => {
      const w = setW(), pos = (((svcTrack.scrollLeft % w) + w) % w) / w;            // 0…1: por dónde va dentro de la serie
      const frac = Math.min(1, (svcTrack.clientWidth + gap()) / w);                 // parte de la serie visible a la vez
      bars.forEach((b, i) => { b.style.width = frac * 100 + '%'; b.style.transform = `translateX(${((pos - i) / frac) * 100}%)`; });
    };
    // cada flecha pasa una "página": tantas tarjetas como se ven a la vez
    const move = (dir) => {
      settle();
      svcTrack.scrollBy({ left: dir * Math.max(1, Math.round((svcTrack.clientWidth + gap()) / step())) * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
      track('services_slide', { direction: dir > 0 ? 'siguiente' : 'anterior' });
    };
    if (prev) prev.addEventListener('click', () => move(-1));
    if (next) next.addEventListener('click', () => move(1));
    let idle = 0;
    svcTrack.addEventListener('scroll', () => { upd(); clearTimeout(idle); idle = setTimeout(settle, 140); }, { passive: true });
    window.addEventListener('resize', () => { jump(setW()); upd(); });
    jump(setW()); upd();
    gsap.from('[data-services-head] > *', {
      y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-services]', start: isTouch ? 'top 95%' : 'top 70%' },
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
  enter(svcCards, '[data-services]', { y: 0, x: 140, stagger: 0.09, duration: 1.1 }, 'top 75%');
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
  if (isTouch && hasHero && !location.hash && !window.__glHashArrived) setTimeout(initSections, 900); else initSections();
}
