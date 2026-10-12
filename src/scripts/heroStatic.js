/**
 * Hero sin WebGL, para equipos que no tienen tarjeta gráfica (ver gpu.js): en lugar de la escena de partículas se muestran
 * imágenes fijas de cada forma (capturas de la escena real, en /public/hero/), que se funden entre sí con el scroll.
 * El resto del hero (textos, etapas, degradados) se mueve igual, con la misma secuencia de heroStages.js.
 */
import gsap from 'gsap';
import { startHeroStages } from './heroStages.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function initHeroStatic() {
  const hero = document.querySelector('[data-hero]');
  const canvas = hero && hero.querySelector('#hero3d');
  if (!canvas) return { start() {}, ready: Promise.resolve() };
  const pinned = hero.hasAttribute('data-pin');
  const MOB = window.innerWidth < 800;
  const size = MOB ? 'm' : 'd';
  // inicio: las tres formas; páginas interiores: sólo la suya
  const names = pinned ? ['esfera', 'galaxia', 'cerebro'] : ['pagina-' + (hero.dataset.shape || 'sphere')];

  const layer = document.createElement('div');
  layer.className = 'hero-static';
  layer.setAttribute('aria-hidden', 'true');
  const imgs = names.map((name, i) => {
    const im = new Image();
    im.decoding = 'async'; im.alt = '';
    if (i > 0) im.style.opacity = '0';
    im.src = `/hero/${name}-${size}.jpg`;
    layer.appendChild(im);
    return im;
  });
  canvas.replaceWith(layer);
  gsap.set(layer, { autoAlpha: 0 });

  const ready = (imgs[0].decode ? imgs[0].decode() : Promise.resolve()).catch(() => {});
  const state = { morph: 0 }, position = { x: 0 };

  function start(reduce) {
    gsap.to(layer, { autoAlpha: 1, duration: reduce ? 0 : 1.4, ease: 'power2.out' });
    if (reduce) return;
    startHeroStages({ hero, pinned, MOB, state, position, homeX: 0 });
    // cada imagen se ve mientras su forma es la protagonista (morph 0, 1 y 2) y se funde con la siguiente
    if (pinned) gsap.ticker.add(() => imgs.forEach((im, i) => { im.style.opacity = String(clamp01(1 - Math.abs(state.morph - i) * 1.6)); }));
  }
  return { start, ready };
}
