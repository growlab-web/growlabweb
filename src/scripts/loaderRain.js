/**
 * Lluvia de líneas diagonales para la pantalla de carga (canvas 2D).
 * Devuelve { setIntensity(v), stop() }.
 */
const PALETTE = ['255,255,255', '255,255,255', '140,180,255', '56,111,222', '171,225,85'];

export function startRain(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setIntensity() {}, stop() {} };

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const angle = (17 * Math.PI) / 180; // inclinación: caen hacia abajo-izquierda
  const dx = -Math.sin(angle), dy = Math.cos(angle);
  let w = 0, h = 0, intensity = 0, raf = 0, last = performance.now(), drops = [];

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
    for (const d of drops) {
      d.x += dx * d.speed * dt; d.y += dy * d.speed * dt;
      if (d.y - d.len > h || d.x < -d.len) Object.assign(d, makeDrop(false));
      const x2 = d.x - dx * d.len, y2 = d.y - dy * d.len;      // cola
      const gr = ctx.createLinearGradient(x2, y2, d.x, d.y);
      gr.addColorStop(0, `rgba(${d.color},0)`);
      gr.addColorStop(1, `rgba(${d.color},${d.alpha * intensity})`);
      ctx.strokeStyle = gr; ctx.lineWidth = d.width;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(d.x, d.y); ctx.stroke();
    }
  }
  raf = requestAnimationFrame(frame);

  return {
    setIntensity(v) { intensity = v; },
    stop() { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); },
  };
}
