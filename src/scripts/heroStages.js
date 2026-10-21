/**
 * Movimiento del hero que no depende de WebGL: la deriva de los degradados del fondo y, en el inicio, la secuencia de scroll
 * con el hero fijo (casi-esfera → galaxia → cerebro). La usan la versión 3D (hero3d.js) y la de imágenes fijas (heroStatic.js).
 *
 * state.morph va de 0 (esfera) a 1 (galaxia) y 2 (cerebro); position.x es la posición horizontal del objeto.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trackOnce } from './track.js';

gsap.registerPlugin(ScrollTrigger);

export function startHeroStages({ hero, pinned, MOB, state, position, homeX }) {
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
  const cueDots = [...hero.querySelectorAll('[data-cue-dot]')];
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero, start: 'top top', end: MOB ? '+=170%' : '+=260%', pin: true,   // en móvil, menos recorrido de dedo entre etapas
      scrub: 0.35, anticipatePin: 1,
      onUpdate: (self) => {
        const stage = self.progress < 0.23 ? 0 : self.progress < 0.72 ? 1 : 2;
        cueDots.forEach((d, i) => d.classList.toggle('is-on', i === stage));     // punto de la etapa actual en la señal de scroll
        if (stage) trackOnce('hero:' + stage, 'hero_stage', { stage: ['esfera', 'galaxia', 'cerebro'][stage] });   // medición: hasta qué etapa llega cada visita
      },
      // cada etapa se engancha sola: un gesto de scroll basta para pasar a la siguiente
      // en móvil el enganche espera a que el dedo y la inercia terminen, para no pelearse con el scroll del teléfono
      snap: MOB
        ? { snapTo: 'labelsDirectional', duration: { min: 0.25, max: 0.6 }, delay: 0.16, inertia: false, ease: 'power1.inOut' }
        : { snapTo: 'labelsDirectional', duration: { min: 0.15, max: 0.5 }, delay: 0.05, ease: 'power1.inOut' },
    },
  });
  tl.to(state, { morph: 1, duration: 1.7, ease: E }, 0.6)                                   // → galaxia
    .to(position, { x: 0, duration: 1.7, ease: E }, 0.6)                                    // la galaxia va centrada bajo su titular
    .to(p1, hide, 0.7)
    .fromTo('[data-panel="2"]', { autoAlpha: 0, y: 40 }, show, 1.9)
    .from('[data-panel="2"] [data-in]', { autoAlpha: 0, y: 34, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 1.8)   // sus piezas entran una tras otra
    // fondo: franja azul en diagonal en la explosión; con la galaxia queda muy tenue
    .to(A, { opacity: 0.5, rotation: -30, scale: 1.3, xPercent: 18, yPercent: 30, duration: 0.9, ease: E }, 0.6)
    .to(A, { opacity: 0.16, rotation: -12, scale: 1.0, xPercent: 0, yPercent: 0, duration: 0.9, ease: E }, 1.5)
    .to(B, { opacity: 0.2, yPercent: -90, scale: 1.1, duration: 1.7, ease: E }, 0.6)
    // salida de la galaxia: zoom in hacia su núcleo (la cámara se mete en ella, fly negativo) mientras empieza a deshacerse,
    // y del interior sale el cerebro, que se aleja hasta su sitio
    .to(state, { fly: -0.4, duration: 0.8, ease: 'power2.in' }, 3.7)
    .to(state, { fly: 0, duration: 1.0, ease: 'power2.out' }, 4.5)
    .to(state, { morph: 2, duration: 1.7, ease: E }, 3.7)                                   // → cerebro
    .to(position, { x: homeX, duration: 1.7, ease: E }, 3.7)
    .to('[data-panel="2"]', hide, 3.8)
    .fromTo('[data-panel="3"]', { autoAlpha: 0, y: 40 }, show, 5.0)
    .from('[data-panel="3"] [data-in]', { autoAlpha: 0, y: 34, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 5.0)
    .to(A, { opacity: 0.45, rotation: -24, scale: 1.2, xPercent: 8, yPercent: 14, duration: 1.7, ease: E }, 3.7)
    .to(B, { opacity: 0.25, yPercent: -30, scale: 0.95, duration: 1.7, ease: E }, 3.7)
    .to({}, { duration: 0.25 }, 5.8)                                                       // pausa final mínima: tras el cerebro el scroll sigue enseguida
    .addLabel('esfera', 0).addLabel('galaxia', 2.75).addLabel('cerebro', 5.95)
    // final del hero: sin esta etiqueta, un gesto corto hacia abajo desde el cerebro quedaba dentro del hero y el enganche lo
    // devolvía al cerebro, como si la página no quisiera bajar
    .addLabel('fin', 6.05);
}
