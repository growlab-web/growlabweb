/**
 * Red de datos animada (canvas 2D) para el panel visual del formulario de contacto:
 * nodos que derivan despacio, se conectan entre sí y por cuyas líneas viajan "paquetes" de luz.
 * Sólo anima mientras el panel está en pantalla.
 */
const BLUE = '56,111,222', SKY = '123,165,240', GREEN = '171,225,85';

export function initDataFlow(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, nodes = [], packets = [], raf = 0, visible = false, last = performance.now();
  const mouse = { x: -999, y: -999 };

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, Math.max(26, (w * h) / 14000)));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 18, vy: (Math.random() - 0.5) * 18,
      r: 1.4 + Math.random() * 2.2, hub: Math.random() < 0.12,
    }));
    packets = [];
  }
  resize();
  window.addEventListener('resize', resize);
  canvas.parentElement.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });

  const LINK = () => Math.min(w, h) * 0.24;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    ctx.clearRect(0, 0, w, h);
    const L = LINK();

    for (const n of nodes) {
      n.x += n.vx * dt; n.y += n.vy * dt;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 120) { n.x += (dx / (d || 1)) * (120 - d) * dt * 1.5; n.y += (dy / (d || 1)) * (120 - d) * dt * 1.5; }  // aparta suave
    }

    // conexiones
    const links = [];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < L) {
        const o = (1 - d / L) * 0.5;
        ctx.strokeStyle = `rgba(${BLUE},${o})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        links.push([a, b]);
      }
    }

    // paquetes de datos viajando por las conexiones
    if (links.length && packets.length < 26 && Math.random() < 0.35) {
      const [a, b] = links[(Math.random() * links.length) | 0];
      packets.push({ a, b, t: 0, s: 0.5 + Math.random() * 0.8, c: Math.random() < 0.35 ? GREEN : SKY });
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]; p.t += p.s * dt;
      if (p.t >= 1) { packets.splice(i, 1); continue; }
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, `rgba(${p.c},.95)`); g.addColorStop(1, `rgba(${p.c},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
    }

    // nodos
    for (const n of nodes) {
      ctx.fillStyle = n.hub ? `rgba(${GREEN},.95)` : `rgba(${SKY},.85)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r + 1.6 : n.r, 0, Math.PI * 2); ctx.fill();
      if (n.hub) { ctx.strokeStyle = `rgba(${GREEN},.35)`; ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2); ctx.stroke(); }
    }
  }
  raf = requestAnimationFrame(frame);

  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(canvas);
  else visible = true;
}
