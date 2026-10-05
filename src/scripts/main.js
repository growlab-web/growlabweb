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

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* ---------- Scroll suave (Lenis) sincronizado con GSAP ---------- */
const lenis = new Lenis({ lerp: 0.14, smoothWheel: !reduceMotion });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

// enlaces internos con ancla (#algo) dentro de la misma página
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
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
      .then((m) => { hero3d = m.initHero3D(); })
      .catch((err) => console.warn('WebGL no disponible, se omite el objeto 3D.', err))
  : Promise.resolve();

/* ---------- Pantalla de carga con lluvia (sólo en el inicio) ---------- */
const loader = $('#loader');
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
let revealed = false;

function reveal() {
  if (revealed) return;
  revealed = true;
  initPage();
}

if (loader) {
  const rain = startRain($('[data-rain]', loader));
  gsap.to({ v: 0 }, { v: 1, duration: 0.7, ease: 'power1.in', onUpdate() { rain.setIntensity(this.targets()[0].v); } });
  const minTime = new Promise((r) => setTimeout(r, reduceMotion ? 200 : 2100));
  Promise.all([minTime, heroReady, fontsReady]).then(() => {
    gsap.to(loader, { opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => { rain.stop(); loader.remove(); } });
    reveal();
  });
} else {
  Promise.all([heroReady, fontsReady]).then(reveal);
}

/* ---------- Página ---------- */
function initPage() {
  lenis.start();

  gsap.from('[data-nav]', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out' });

  if (hasHero) {
    // entrada del hero: el texto sale del desenfoque
    gsap.from('[data-line]', { autoAlpha: 0, y: 26, filter: 'blur(14px)', duration: 1.3, stagger: 0.14, ease: 'power3.out' });
    gsap.from('[data-foot], [data-actions]', { autoAlpha: 0, y: 20, filter: 'blur(8px)', duration: 1.1, stagger: 0.12, delay: 0.35, ease: 'power3.out' });
    hero3d.start(reduceMotion);
  }

  if (reduceMotion) return;

  /* Barra de progreso de scroll */
  gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

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
      scrollTrigger: { trigger: manifesto, start: 'top 80%', end: 'bottom 55%', scrub: true },
    });
  }

  /* SERVICIOS: scroll horizontal con pin */
  const track = $('[data-services-track]');
  if (track) {
    const getDist = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -getDist(), ease: 'none',
      scrollTrigger: { trigger: '[data-services-pin]', start: 'top top', end: () => '+=' + getDist(), pin: true, scrub: 0.4, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    gsap.from('[data-services-head] > *', {
      y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-services]', start: 'top 70%' },
    });
  }

  /* PORTAFOLIO: tarjetas apiladas que se encogen al llegar la siguiente */
  const cases = $$('[data-case]');
  if (cases.length) {
    gsap.from('[data-cases-head] > *', {
      y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-cases-head]', start: 'top 80%' },
    });
    cases.forEach((c, i) => {
      const inner = $('[data-case-inner]', c);
      gsap.from(inner, { y: 120, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%' } });
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
      gsap.from(li.children, { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 80%' } });
    });
    gsap.from('[data-process-left] > *', {
      y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-process]', start: 'top 70%' },
    });
  }

  /* CTA: texto gigante que crece y se asienta */
  if ($('[data-cta]')) {
    gsap.from('[data-cta-line]', { yPercent: 100, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-cta]', start: 'top 60%' } });
    gsap.fromTo('[data-cta-big]', { scale: 0.5, yPercent: 30, opacity: 0.2 }, {
      scale: 1, yPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top 80%', end: 'center center', scrub: true },
    });
    gsap.to('[data-cta-blob]', {
      scale: 1.4, rotate: 90, ease: 'none',
      scrollTrigger: { trigger: '[data-cta]', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }

  ScrollTrigger.refresh();
}
