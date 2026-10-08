/**
 * Lluvia de líneas diagonales para la pantalla de carga (canvas 2D).
 * Devuelve { setIntensity(v), setConverge(v), stop() }.
 *  - setIntensity: opacidad general de la lluvia (0 → 1).
 *  - setConverge: 0 = cae en diagonal; 1 = todas las líneas se encogen y viajan hacia el centro,
 *    donde el hero 3D está ensamblando la esfera (la lluvia "se convierte" en las partículas).
 */
const PALETTE = ['255,255,255', '255,255,255', '140,180,255', '56,111,222', '51,219,128'];

export function startRain(canvas, opts = {}) {
  const cxRatio = opts.cx ?? 0.5, cyRatio = opts.cy ?? 0.54;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setIntensity() {}, setConverge() {}, stop() {} };

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const angle = (17 * Math.PI) / 180; // inclinación: caen hacia abajo-izquierda
  const dx = -Math.sin(angle), dy = Math.cos(angle);
  let w = 0, h = 0, intensity = 0, converge = 0, raf = 0, last = performance.now(), drops = [];

  function makeDrop(initial) {
    const len = 50 + Math.random() * 190;
    return {
      x: Math.random() * (w + h * Math.tan(angle) + 200),
      y: initial ? Math.random() * (h + len) - len : -len - Math.random() * h * 0.5,
      len,
      speed: 1100 + Math.random() * 1900,
      alpha: 0.25 + Math.random() * 0.65,
      width: Math.random() < 0.15 ? 1.6 : 1,
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
    };
  }

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(130 * Math.min(1.4, (w * h) / (1440 * 900)) + 40);
    drops = Array.from({ length: n }, () => makeDrop(true));
  }
  resize();
  window.addEventListener('resize', resize);

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    const cx = w * cxRatio, cy = h * cyRatio;       // centro aproximado del objeto 3D
    const fadeR = Math.min(w, h) * 0.2;             // cerca del centro las líneas se apagan
    for (const d of drops) {
      let vx = dx, vy = dy;
      if (converge > 0) {                           // el rumbo gira hacia el centro
        const tx = cx - d.x, ty = cy - d.y, tl = Math.hypot(tx, ty) || 1;
        vx = dx * (1 - converge) + (tx / tl) * converge;
        vy = dy * (1 - converge) + (ty / tl) * converge;
        const vl = Math.hypot(vx, vy) || 1; vx /= vl; vy /= vl;
      }
      const sp = d.speed * (1 + converge * 0.9);
      d.x += vx * sp * dt; d.y += vy * sp * dt;
      if (converge === 0 && (d.y - d.len > h || d.x < -d.len)) Object.assign(d, makeDrop(false));

      const len = d.len * (1 - 0.85 * converge);
      const x2 = d.x - vx * len, y2 = d.y - vy * len;   // cola
      const near = converge > 0 ? Math.min(1, Math.hypot(cx - d.x, cy - d.y) / fadeR) : 1;
      const a = d.alpha * intensity * near;
      if (a < 0.01) continue;
      const gr = ctx.createLinearGradient(x2, y2, d.x, d.y);
      gr.addColorStop(0, `rgba(${d.color},0)`);
      gr.addColorStop(1, `rgba(${d.color},${a})`);
      ctx.strokeStyle = gr; ctx.lineWidth = d.width;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(d.x, d.y); ctx.stroke();
    }
  }
  raf = requestAnimationFrame(frame);

  return {
    setIntensity(v) { intensity = v; },
    setConverge(v) { converge = v; },
    stop() { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); },
  };
}
