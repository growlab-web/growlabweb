/**
 * Imágenes de proyecto generadas por código (canvas 2D) mientras no haya capturas reales.
 * Cada función dibuja una "captura" de sitio web con la paleta del proyecto.
 * makeArt(project, kind, w, h) → <canvas>   (kind: 'cover' | 'stats' | 'catalog' | 'hero' | 'editorial' | 'mobile')
 */
const SANS = '"Host Grotesk", system-ui, sans-serif';
const DISPLAY = '"Syne", "Host Grotesk", system-ui, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
function wrap(ctx, text, x, y, maxW, lh) {
  let line = '';
  for (const word of text.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = word; } else line = t;
  }
  if (line) ctx.fillText(line, x, y);
  return y;
}
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

function nav(ctx, w, p, s, h = 0) {
  ctx.fillStyle = p.palette.fg; ctx.font = `700 ${22 * s}px ${DISPLAY}`; ctx.textBaseline = 'middle';
  ctx.fillText(p.name, 44 * s, 52 * s);
  ctx.font = `500 ${13 * s}px ${SANS}`; ctx.globalAlpha = 0.7;
  if (!h || w >= h) ['Tienda', 'Colecciones', 'Nosotros', 'Contacto'].forEach((t, i) => ctx.fillText(t, w - (420 - i * 100) * s, 52 * s));
  ctx.globalAlpha = 1;
  ctx.fillStyle = p.palette.accent; rr(ctx, w - 118 * s, 36 * s, 74 * s, 32 * s, 16 * s); ctx.fill();
}

function drawHero(ctx, w, h, p) {
  const s = w / 1200, { bg, fg, accent } = p.palette;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * 0.72, h * 0.55, 0, w * 0.72, h * 0.55, w * 0.42);
  g.addColorStop(0, hexA(accent, 0.95)); g.addColorStop(0.55, hexA(accent, 0.35)); g.addColorStop(1, hexA(accent, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = hexA(fg, 0.25); ctx.lineWidth = 2 * s;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.arc(w * 0.72, h * 0.55, w * 0.1 * i, 0, Math.PI * 2); ctx.stroke(); }
  nav(ctx, w, p, s, h);
  ctx.fillStyle = fg; ctx.textBaseline = 'alphabetic';
  ctx.font = `800 ${76 * s}px ${DISPLAY}`;
  const words = p.name.split(' ');
  words.forEach((t, i) => ctx.fillText(t.toUpperCase(), 44 * s, (250 + i * 84) * s));
  ctx.font = `400 ${18 * s}px ${SANS}`; ctx.globalAlpha = 0.8;
  const endY = wrap(ctx, p.desc.length > 84 ? p.desc.slice(0, p.desc.lastIndexOf(' ', 84)) + '…' : p.desc, 44 * s, (words.length * 84 + 290) * s, 430 * s, 26 * s);
  ctx.globalAlpha = 1;
  const by = endY + 26 * s;                                       // el botón va bajo el texto, lejos de la etiqueta de la tarjeta
  ctx.fillStyle = fg; rr(ctx, 44 * s, by, 170 * s, 50 * s, 25 * s); ctx.fill();
  ctx.fillStyle = bg; ctx.font = `600 ${15 * s}px ${SANS}`; ctx.textBaseline = 'middle'; ctx.fillText('Comprar ahora  →', 70 * s, by + 25 * s);
}

function drawCatalog(ctx, w, h, p) {
  const s = w / 1200, { bg, fg, accent } = p.palette, portrait = h > w;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  nav(ctx, w, p, s, h);
  ctx.fillStyle = fg; ctx.font = `700 ${40 * s}px ${DISPLAY}`; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Nueva colección', 44 * s, 150 * s);
  const cols = portrait ? 2 : 4, rows = portrait ? 2 : 1, gap = 20 * s;
  const cw = (w - 88 * s - gap * (cols - 1)) / cols, top = 190 * s, ch = (h - top - 60 * s - gap * (rows - 1)) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, x = 44 * s + c * (cw + gap), y = top + r * (ch + gap);
    ctx.fillStyle = hexA(fg, 0.08 + (i % 2) * 0.05); rr(ctx, x, y, cw, ch * 0.74, 14 * s); ctx.fill();
    const gg = ctx.createLinearGradient(x, y, x + cw, y + ch * 0.74);
    gg.addColorStop(0, hexA(accent, 0.9 - i * 0.12)); gg.addColorStop(1, hexA(fg, 0.25));
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x + cw / 2, y + ch * 0.37, Math.min(cw, ch) * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = fg; ctx.font = `600 ${15 * s}px ${SANS}`; ctx.fillText(['Edición 01', 'Classic', 'Studio', 'Limited'][i % 4], x, y + ch * 0.74 + 30 * s);
    ctx.globalAlpha = 0.6; ctx.font = `400 ${14 * s}px ${SANS}`; ctx.fillText(`S/ ${(89 + i * 30)}.00`, x, y + ch * 0.74 + 54 * s); ctx.globalAlpha = 1;
  }
}

function drawEditorial(ctx, w, h, p) {
  const s = w / 1200, { bg, fg, accent } = p.palette;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  nav(ctx, w, p, s, h);
  ctx.fillStyle = hexA(accent, 0.18); rr(ctx, w * 0.62, h * 0.2, w * 0.3, h * 0.66, 200 * s); ctx.fill();
  ctx.fillStyle = hexA(accent, 0.5); ctx.beginPath(); ctx.arc(w * 0.77, h * 0.52, w * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = fg; ctx.textBaseline = 'alphabetic';
  ctx.font = `italic 400 ${110 * s}px ${SERIF}`;
  ctx.fillText(p.name.split(' ')[0], 44 * s, h * 0.55);
  ctx.font = `italic 400 ${64 * s}px ${SERIF}`; ctx.globalAlpha = 0.85;
  ctx.fillText(p.name.split(' ').slice(1).join(' ') || p.category.split(' ·')[0], 44 * s, h * 0.55 + 76 * s);
  ctx.globalAlpha = 1;
  ctx.fillRect(44 * s, h * 0.55 + 120 * s, 120 * s, 2 * s);
  ctx.font = `500 ${14 * s}px ${SANS}`; ctx.globalAlpha = 0.7;
  ctx.fillText(p.category.toUpperCase() + '  ·  ' + p.year, 44 * s, h * 0.55 + 156 * s); ctx.globalAlpha = 1;
}

function drawStats(ctx, w, h, p) {
  const s = w / 1200, { bg, fg, accent } = p.palette;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = hexA(accent, 0.22); ctx.beginPath(); ctx.arc(w * 0.12, h * 0.9, w * 0.34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = fg; ctx.textBaseline = 'alphabetic';
  ctx.font = `700 ${22 * s}px ${DISPLAY}`; ctx.globalAlpha = 0.6; ctx.fillText('RESULTADO', 60 * s, 110 * s); ctx.globalAlpha = 1;
  ctx.font = `800 ${220 * s}px ${DISPLAY}`; ctx.fillStyle = accent; ctx.fillText(p.result.value, 56 * s, h * 0.58);
  ctx.fillStyle = fg; ctx.font = `500 ${28 * s}px ${SANS}`; ctx.fillText(p.result.label, 60 * s, h * 0.58 + 54 * s);
  // mini gráfico
  ctx.strokeStyle = accent; ctx.lineWidth = 5 * s; ctx.lineJoin = 'round'; ctx.beginPath();
  const pts = [0.9, 0.82, 0.86, 0.7, 0.62, 0.55, 0.38, 0.3, 0.16];
  const portrait = h > w;
  pts.forEach((v, i) => {
    const x = portrait ? w * 0.1 + (i / 8) * w * 0.8 : w * 0.52 + (i / 8) * w * 0.4;
    const y = portrait ? h * (0.7 + v * 0.22) : h * (0.2 + v * 0.55);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
}

function drawMobile(ctx, w, h, p) {
  const s = w / 1200, { bg, fg, accent } = p.palette;
  ctx.fillStyle = hexA(fg, 0.07); ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); ctx.fillStyle = hexA(fg, 0.06); ctx.fillRect(0, 0, w, h);
  const pw = w >= h ? w * 0.22 : w * 0.28, ph = w >= h ? h * 0.86 : h * 0.6;
  (w >= h ? [0.14, 0.39, 0.64] : [0.06, 0.36, 0.66]).forEach((fx, i) => {
    const x = w * fx, y = h * 0.07 + (i === 1 ? -12 * s : 14 * s);
    ctx.fillStyle = bg; rr(ctx, x, y, pw, ph, 26 * s); ctx.fill();
    ctx.strokeStyle = hexA(fg, 0.35); ctx.lineWidth = 2 * s; ctx.stroke();
    ctx.fillStyle = hexA(accent, 0.35 + i * 0.2); rr(ctx, x + 14 * s, y + 40 * s, pw - 28 * s, ph * 0.38, 14 * s); ctx.fill();
    ctx.fillStyle = hexA(fg, 0.7); rr(ctx, x + 14 * s, y + ph * 0.48, pw * 0.6, 12 * s, 6 * s); ctx.fill();
    ctx.fillStyle = hexA(fg, 0.3); rr(ctx, x + 14 * s, y + ph * 0.48 + 26 * s, pw * 0.8, 9 * s, 5 * s); ctx.fill();
    rr(ctx, x + 14 * s, y + ph * 0.48 + 44 * s, pw * 0.5, 9 * s, 5 * s); ctx.fill();
    ctx.fillStyle = accent; rr(ctx, x + 14 * s, y + ph - 70 * s, pw - 28 * s, 40 * s, 20 * s); ctx.fill();
  });
}

const KINDS = { hero: drawHero, catalog: drawCatalog, editorial: drawEditorial, stats: drawStats, mobile: drawMobile };

export function makeArt(project, kind = 'cover', w = 1200, h = 750) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const fn = KINDS[kind === 'cover' ? project.art : kind] || drawHero;
  fn(ctx, w, h, project);
  return canvas;
}

/** Imágenes de la página de un proyecto: la portada + resultado + catálogo/estilo alterno + móvil */
export function projectImageKinds(project) {
  const alt = project.art === 'catalog' ? 'hero' : 'catalog';
  return ['cover', 'stats', alt, 'mobile'];
}
