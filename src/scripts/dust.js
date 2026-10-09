/**
 * Partículas flotando (canvas 2D) para fondos sin objeto 3D, como la página de contacto:
 * polvo fino que sube muy despacio, se mece de lado y parpadea, con el mismo aire que el polvo del hero.
 * Las de "delante" son más grandes, más rápidas y se desplazan un poco con el cursor. Sólo anima mientras está en pantalla.
 */
const COLORS = ['235,245,255', '123,165,240', '109,242,192'];   // blanco, celeste y menta

export function initDust(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // en táctil el lienzo cubre toda la sección (varias pantallas de alto): con menos resolución no pesa al hacer scroll
  const dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.25 : 2);
  let w = 0, h = 0, dots = [], visible = false, last = performance.now(), t = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(170, Math.max(40, (w * h) / 9000)));
    dots = Array.from({ length: n }, () => {
      const z = Math.pow(Math.random(), 2.2);                      // casi todas al fondo; unas pocas cerca
      return {
        x: Math.random() * w, y: Math.random() * h, z,
        r: 0.5 + z * 2.1, vy: 5 + z * 16, sway: 6 + Math.random() * 16, ph: Math.random() * 6.28, f: 0.2 + Math.random() * 0.5,
        a: 0.2 + Math.random() * 0.5, c: COLORS[Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 1 : 2],
      };
    });
    if (still) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      const x = d.x + Math.sin(t * d.f + d.ph) * d.sway + mouse.x * d.z * 26, y = d.y + mouse.y * d.z * 26;
      const a = d.a * (0.55 + 0.45 * Math.sin(t * (0.6 + d.f) + d.ph * 3));          // parpadeo lento
      if (d.z > 0.45) {                                                              // las cercanas, desenfocadas
        const g = ctx.createRadialGradient(x, y, 0, x, y, d.r * 2.4);
        g.addColorStop(0, `rgba(${d.c},${a * 0.8})`); g.addColorStop(1, `rgba(${d.c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, d.r * 2.4, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(${d.c},${a})`;
        ctx.beginPath(); ctx.arc(x, y, d.r, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
    for (const d of dots) {
      d.y -= d.vy * dt;
      if (d.y < -30) { d.y = h + 30; d.x = Math.random() * w; }                     // al salir por arriba vuelve a entrar por abajo
    }
    draw();
  }

  resize();
  window.addEventListener('resize', resize);
  if (still) return;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => { mouse.tx = 0.5 - e.clientX / window.innerWidth; mouse.ty = 0.5 - e.clientY / window.innerHeight; }, { passive: true });
  }
  requestAnimationFrame(frame);
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(canvas);
  else visible = true;
}
