/**
 * Mini juego de la pantalla de gracias del formulario: una pelota que rebota y dos barras, una a cada lado.
 * Las dos barras siguen al ratón (o al dedo) en vertical; hay que parar la pelota con ellas para que no se escape por los costados.
 * Cada rebote en una barra suma un punto y acelera un poco la pelota. Al fallar, un clic empieza otra partida.
 *
 * initPong(canvas, { onScore(puntos, récord), onState('espera' | 'juego' | 'fin') }) → { stop() }
 */
const MINT = '#6df2c0', SKY = '#7ba5f0';

export function initPong(canvas, { onScore = () => {}, onState = () => {} } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop() {} };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, raf = 0, last = 0, state = 'espera', score = 0, best = 0, alive = true;
  try { best = Number(localStorage.getItem('gl-pong-best')) || 0; } catch (e) { /* sin almacenamiento */ }
  const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 7, trail: [] };
  const paddle = { y: 0, target: 0, h: 0, w: 10, inset: 16 };

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paddle.h = Math.max(54, h * 0.24); paddle.inset = w < 500 ? 10 : 16;
    ball.r = w < 500 ? 6 : 7;
    if (state !== 'juego') { paddle.y = paddle.target = h / 2; ball.x = w / 2; ball.y = h / 2; }
    draw();
  }

  function serve() {
    score = 0; onScore(score, best);
    ball.x = w / 2; ball.y = h / 2; ball.trail.length = 0;
    const speed = Math.max(260, w * 0.5), a = (Math.random() * 0.7 - 0.35), dir = Math.random() < 0.5 ? -1 : 1;
    ball.vx = Math.cos(a) * speed * dir; ball.vy = Math.sin(a) * speed;
    state = 'juego'; canvas.dataset.state = state; onState(state);
    // si la página venía desplazándose (scroll suave o inercia), se detiene en seco donde está
    const lenis = window.__lenis;
    if (lenis && lenis.scrollTo) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  }

  function over() {
    state = 'fin'; canvas.dataset.state = state; onState(state);
    if (score > best) { best = score; try { localStorage.setItem('gl-pong-best', String(best)); } catch (e) { /* sin almacenamiento */ } }
    onScore(score, best);
  }

  // rebote en una barra: el ángulo de salida depende de en qué punto de la barra pega (centro = recto, puntas = en diagonal)
  function hit(side) {
    const off = Math.max(-1, Math.min(1, (ball.y - paddle.y) / (paddle.h / 2)));
    const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.045, w * 1.7), a = off * 0.95;
    ball.vx = Math.cos(a) * speed * side; ball.vy = Math.sin(a) * speed;
    score++; onScore(score, best);
  }

  function step(dt) {
    paddle.y += (paddle.target - paddle.y) * Math.min(1, dt * 22);
    paddle.y = Math.max(paddle.h / 2, Math.min(h - paddle.h / 2, paddle.y));
    if (state !== 'juego') return;
    ball.trail.push(ball.x, ball.y); if (ball.trail.length > 24) ball.trail.splice(0, 2);
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); } else if (ball.y > h - ball.r) { ball.y = h - ball.r; ball.vy = -Math.abs(ball.vy); }
    const leftX = paddle.inset + paddle.w, rightX = w - paddle.inset - paddle.w, reach = paddle.h / 2 + ball.r;
    if (ball.vx < 0 && ball.x - ball.r <= leftX && ball.x > paddle.inset && Math.abs(ball.y - paddle.y) <= reach) { ball.x = leftX + ball.r; hit(1); }
    else if (ball.vx > 0 && ball.x + ball.r >= rightX && ball.x < w - paddle.inset && Math.abs(ball.y - paddle.y) <= reach) { ball.x = rightX - ball.r; hit(-1); }
    if (ball.x < -ball.r * 3 || ball.x > w + ball.r * 3) over();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // red central y marcador de fondo
    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 2; ctx.setLineDash([6, 10]);
    ctx.beginPath(); ctx.moveTo(w / 2, 10); ctx.lineTo(w / 2, h - 10); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.min(h * 0.62, w * 0.3)}px "Host Grotesk", system-ui, sans-serif`;
    ctx.fillText(String(score), w / 2, h / 2 + 4);
    // barras
    ctx.fillStyle = '#fff';
    for (const x of [paddle.inset, w - paddle.inset - paddle.w]) { ctx.beginPath(); ctx.roundRect(x, paddle.y - paddle.h / 2, paddle.w, paddle.h, 5); ctx.fill(); }
    // estela y pelota
    for (let i = 0; i < ball.trail.length; i += 2) { const k = (i + 2) / ball.trail.length; ctx.fillStyle = `rgba(123,165,240,${k * 0.3})`; ctx.beginPath(); ctx.arc(ball.trail[i], ball.trail[i + 1], ball.r * k * 0.9, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = MINT; ctx.shadowColor = MINT; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    // mensajes
    if (state !== 'juego') {
      ctx.fillStyle = '#fff'; ctx.font = `600 ${w < 500 ? 15 : 18}px "Host Grotesk", system-ui, sans-serif`;
      const touch = window.matchMedia('(pointer: coarse)').matches;
      ctx.fillText(state === 'fin' ? `Se te escapó · ${score} ${score === 1 ? 'rebote' : 'rebotes'}` : 'Para la pelota con las barras', w / 2, h / 2 - 44);
      ctx.fillStyle = SKY; ctx.font = `500 ${w < 500 ? 12 : 13}px "Host Grotesk", system-ui, sans-serif`;
      ctx.fillText(state === 'fin' ? (touch ? 'Toca para jugar otra vez' : 'Haz clic para jugar otra vez') : (touch ? 'Toca para empezar · mueve el dedo arriba y abajo' : 'Haz clic para empezar · mueve el ratón arriba y abajo'), w / 2, h / 2 + 48);
    }
  }

  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000 || 0, 0.033); last = now;
    step(dt / 2); step(dt / 2);       // dos pasos por fotograma: a mucha velocidad la pelota no atraviesa la barra
    draw();
  }

  const move = (e) => { const r = canvas.getBoundingClientRect(); paddle.target = e.clientY - r.top; };
  const press = (e) => { move(e); if (state !== 'juego') serve(); };
  // durante la partida la página no se desplaza: con trackpad es fácil rozar con dos dedos y que todo se mueva (y se pierda la pelota).
  // Se captura antes que el scroll suave del sitio; al terminar la partida el scroll vuelve a funcionar.
  const holdScroll = (e) => { if (state === 'juego') { e.preventDefault(); e.stopImmediatePropagation(); } };
  window.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('pointerdown', press);
  window.addEventListener('resize', resize);
  window.addEventListener('wheel', holdScroll, { passive: false, capture: true });
  resize(); onScore(score, best); onState(state);
  raf = requestAnimationFrame(frame);

  return {
    stop() {
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move); canvas.removeEventListener('pointerdown', press); window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', holdScroll, { capture: true });
    },
  };
}
