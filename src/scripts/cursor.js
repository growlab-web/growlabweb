/**
 * Puntero propio: una mira (punto central + anillo con cuatro marcas) que sigue al ratón.
 * El punto va pegado al cursor y el anillo lo sigue con un pequeño retraso; sobre enlaces y botones el anillo se abre.
 * Solo en equipos con ratón (no en táctiles).
 */
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const el = document.createElement('div');
  el.className = 'gl-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<i class="gl-cursor__ring"><b></b><b></b><b></b><b></b></i><i class="gl-cursor__dot"></i>';
  document.body.appendChild(el);
  const ring = el.querySelector('.gl-cursor__ring'), dot = el.querySelector('.gl-cursor__dot');
  document.documentElement.classList.add('has-cursor');

  let x = -100, y = -100, rx = -100, ry = -100, seen = false;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!seen) { seen = true; rx = x; ry = y; el.classList.add('is-on'); }
    el.classList.toggle('is-link', !!e.target.closest?.('a, button, [role="button"], input, textarea, select, label, [data-pf-canvas]'));
  }, { passive: true });
  document.addEventListener('pointerdown', () => el.classList.add('is-down'));
  document.addEventListener('pointerup', () => el.classList.remove('is-down'));
  document.documentElement.addEventListener('mouseleave', () => el.classList.remove('is-on'));
  document.documentElement.addEventListener('mouseenter', () => seen && el.classList.add('is-on'));

  (function frame() {
    rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(frame);
  })();
}
