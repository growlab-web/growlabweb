/**
 * Estructuras 3D de partículas para cada servicio (cada una representa lo que el servicio hace).
 * buildShape(nombre, n) → { pos, col, path } con n partículas.
 *   pos  : posiciones (x,y,z), todas dentro de ~±1.8 en x e y.
 *   col  : color por partícula (0-1).
 *   path : posición a lo largo de una línea (para que el shader haga viajar "paquetes de datos");
 *          -1 = partícula estática (nodos, relleno).
 */
const BLUE = [0.22, 0.435, 0.87], SKY = [0.5, 0.7, 0.97], GREEN = [0.43, 0.95, 0.75], WHITE = [0.93, 0.96, 1.0], DEEP = [0.14, 0.28, 0.72];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const TAU = Math.PI * 2;
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* ---------- primitivas ---------- */
// segmento entre a y b; flow = las partículas llevan "path" para animar el pulso
const seg = (a, b, o = {}) => ({
  w: dist(a, b) * 30 * (o.w ?? 1), jit: o.jit ?? 0.016,
  at: (t) => lerp3(a, b, t),
  col: (t) => mix(o.colA ?? BLUE, o.colB ?? SKY, t),
  path: o.flow === false ? null : (t) => (o.rev ? 1 - t : t) + (o.off ?? 0),
});
const poly = (pts, o = {}) => pts.slice(1).map((p, i) => seg(pts[i], p, { ...o, off: (o.off ?? 0) + i * 0.6 }));
// arco de circunferencia en un plano
const circle = (c, r, plane, o = {}) => {
  const a0 = o.a0 ?? 0, a1 = o.a1 ?? TAU;
  return {
    w: r * Math.abs(a1 - a0) * 30 * (o.w ?? 1), jit: o.jit ?? 0.016,
    at: (t) => {
      const a = a0 + (a1 - a0) * t, cs = Math.cos(a) * r, sn = Math.sin(a) * r;
      return plane === 'xz' ? [c[0] + cs, c[1], c[2] + sn] : plane === 'yz' ? [c[0], c[1] + cs, c[2] + sn] : [c[0] + cs, c[1] + sn, c[2]];
    },
    col: (t) => mix(o.colA ?? BLUE, o.colB ?? SKY, t),
    path: o.flow ? (t) => t + (o.off ?? 0) : null,
  };
};
const rectO = (x0, y0, x1, y1, z, o = {}) => [
  seg([x0, y0, z], [x1, y0, z], o), seg([x1, y0, z], [x1, y1, z], { ...o, off: 0.6 }),
  seg([x1, y1, z], [x0, y1, z], { ...o, off: 1.2 }), seg([x0, y1, z], [x0, y0, z], { ...o, off: 1.8 }),
];
// nube esférica (nodos)
const blob = (c, r, o = {}) => ({
  w: o.w ?? 25, jit: 0, path: null,
  at: () => {
    const u = Math.random() * 2 - 1, th = Math.random() * TAU, s = Math.sqrt(1 - u * u), rr = r * Math.cbrt(Math.random());
    return [c[0] + rr * s * Math.cos(th), c[1] + rr * u, c[2] + rr * s * Math.sin(th)];
  },
  col: () => o.col ?? GREEN,
});
// relleno disperso dentro de un rectángulo
const fillRect = (x0, y0, x1, y1, z, o = {}) => ({
  w: o.w ?? 30, jit: 0, path: () => Math.random() * 20,
  at: () => [x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0), z],
  col: () => mix(o.colA ?? DEEP, o.colB ?? SKY, Math.random()),
});

function sample(prims, n) {
  const flat = prims.flat();
  const cum = []; let acc = 0;
  for (const p of flat) { acc += p.w; cum.push(acc); }
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), path = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = Math.random() * acc; let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    const p = flat[lo], t = Math.random(), q = p.at(t), j = p.jit;
    pos[i * 3] = q[0] + (Math.random() - 0.5) * 2 * j; pos[i * 3 + 1] = q[1] + (Math.random() - 0.5) * 2 * j; pos[i * 3 + 2] = q[2] + (Math.random() - 0.5) * 2 * j;
    let c = p.col(t); if (Math.random() < 0.05) c = mix(c, WHITE, 0.6);
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    path[i] = p.path ? p.path(t) : -1;
  }
  return { pos, col, path };
}

/* ---------- 1) Performance & Ads: embudo de conversión (el tráfico entra arriba y sale como cliente) ---------- */
function performance(n) {
  const P = [], H0 = 1.5, H1 = -1.45, R = (y) => 1.75 - 1.5 * Math.pow((H0 - y) / (H0 - H1), 0.85);
  for (let k = 0; k <= 9; k++) { const y = H0 - ((H0 - H1) * k) / 9; P.push(circle([0, y, 0], R(y), 'xz', { colA: mix(BLUE, GREEN, k / 9), colB: mix(BLUE, GREEN, k / 9), w: 0.9 })); }
  for (let a = 0; a < 14; a++) {
    const g = (a / 14) * TAU;
    P.push(seg([Math.cos(g) * R(H0), H0, Math.sin(g) * R(H0)], [Math.cos(g) * R(H1), H1, Math.sin(g) * R(H1)], { colA: BLUE, colB: GREEN, off: a * 0.37, w: 0.7, jit: 0.012 }));
  }
  P.push(blob([0, H1 - 0.12, 0], 0.26, { w: 60, col: GREEN }));
  P.push({ w: 70, jit: 0, path: () => Math.random() * 20,   // "leads" cayendo por el embudo
    at: () => { const y = H1 + Math.random() * (H0 - H1), r = R(y) * Math.sqrt(Math.random()) * 0.95, a = Math.random() * TAU; return [Math.cos(a) * r, y, Math.sin(a) * r]; },
    col: () => mix(SKY, GREEN, Math.random()) });
  return sample(P, n);
}

/* ---------- 2) Data Analytics: gráfico de barras 3D + línea de tendencia ---------- */
function analytics(n) {
  const P = [], cols = 6, rows = 4;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = -1.5 + i * 0.6, z = -0.8 + j * 0.55, h = 0.3 + 1.15 * (0.5 + 0.5 * Math.sin(i * 1.25 + j * 0.8 + 0.6)) + i * 0.05;
    P.push(seg([x, -1, z], [x, -1 + h, z], { colA: BLUE, colB: mix(BLUE, GREEN, Math.min(1, h / 1.4)), w: 1.5, jit: 0.04, flow: false }));
    P.push(blob([x, -1 + h, z], 0.05, { w: 6, col: SKY }));
  }
  for (let i = 0; i <= cols; i++) P.push(seg([-1.8 + i * 0.6, -1, -1.05], [-1.8 + i * 0.6, -1, 1.05], { colA: DEEP, colB: DEEP, w: 0.5, jit: 0.008 }));
  for (let j = 0; j <= rows; j++) P.push(seg([-1.8, -1, -1.05 + j * 0.525], [1.8, -1, -1.05 + j * 0.525], { colA: DEEP, colB: DEEP, w: 0.5, jit: 0.008 }));
  const line = Array.from({ length: 8 }, (_, i) => [-1.75 + i * 0.5, -0.55 + Math.pow(i / 7, 1.25) * 1.95 + 0.12 * Math.sin(i * 2), 1.15]);
  poly(line, { colA: SKY, colB: GREEN, w: 2.4, jit: 0.02 }).forEach((s) => P.push(s));
  line.forEach((p) => P.push(blob(p, 0.07, { w: 10, col: GREEN })));
  return sample(P, n);
}

/* ---------- 3) Data Tracking: mapa de la información viajando entre puntos de contacto ---------- */
function tracking(n) {
  const r = rng(7), P = [], nodes = [];
  while (nodes.length < 18) { const p = [(r() * 2 - 1) * 1.7, (r() * 2 - 1) * 1.35, (r() * 2 - 1) * 1.0]; if (Math.hypot(p[0] / 1.7, p[1] / 1.35, p[2]) < 1.05) nodes.push(p); }
  nodes.unshift([0, 0, 0]);
  const used = new Set();
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [dist(a, b), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, i === 0 ? 6 : 2).forEach(([, j]) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (used.has(key)) return; used.add(key);
      P.push(seg(a, nodes[j], { colA: BLUE, colB: SKY, rev: r() < 0.5, off: r() * 8, w: 0.8, jit: 0.012 }));
    });
  });
  nodes.forEach((p, i) => P.push(blob(p, i === 0 ? 0.17 : 0.075, { w: i === 0 ? 70 : 24, col: i === 0 ? GREEN : mix(SKY, GREEN, r()) })));
  P.push(circle([0, 0, 0], 1.85, 'xz', { colA: DEEP, colB: DEEP, w: 0.5, jit: 0.01, flow: true }));
  P.push(circle([0, 0, 0], 1.5, 'xy', { colA: DEEP, colB: DEEP, w: 0.5, jit: 0.01, flow: true, off: 2 }));
  return sample(P, n);
}

/* ---------- 4) Reporting: panel de informes con gráficos ---------- */
function reporting(n) {
  const P = [];
  // panel A (grande): barras + línea
  P.push(...rectO(-1.8, -0.95, 0.4, 0.95, 0, { colA: BLUE, colB: SKY, w: 1 }));
  P.push(seg([-1.8, 0.68, 0], [0.4, 0.68, 0], { colA: DEEP, colB: DEEP, w: 0.8 }));
  [-1.62, -1.5, -1.38].forEach((x, i) => P.push(blob([x, 0.82, 0], 0.045, { w: 8, col: [GREEN, SKY, BLUE][i] })));
  [0.5, 0.9, 0.65, 1.15, 0.85, 1.3].forEach((h, i) => P.push(seg([-1.5 + i * 0.32, -0.75, 0], [-1.5 + i * 0.32, -0.75 + h * 0.8, 0], { colA: BLUE, colB: GREEN, w: 2, jit: 0.05, flow: false })));
  poly([[-1.55, -0.2, 0.05], [-1.15, 0.05, 0.05], [-0.8, -0.1, 0.05], [-0.4, 0.25, 0.05], [-0.0, 0.2, 0.05], [0.3, 0.5, 0.05]], { colA: SKY, colB: GREEN, w: 2.4 }).forEach((s) => P.push(s));
  P.push(fillRect(-1.75, -0.9, 0.35, 0.62, 0, { w: 40 }));
  // panel B: indicador circular
  P.push(...rectO(0.7, 0.0, 1.8, 0.95, 0.25, { colA: BLUE, colB: SKY, w: 1 }));
  P.push(circle([1.25, 0.47, 0.25], 0.3, 'xy', { colA: DEEP, colB: DEEP, w: 1, jit: 0.012 }));
  P.push(circle([1.25, 0.47, 0.25], 0.3, 'xy', { a0: -Math.PI / 2, a1: -Math.PI / 2 + TAU * 0.72, colA: SKY, colB: GREEN, w: 2.6, jit: 0.02, flow: true }));
  // panel C: barras de progreso
  P.push(...rectO(0.7, -0.95, 1.8, -0.15, 0.1, { colA: BLUE, colB: SKY, w: 1 }));
  [[-0.4, 0.8], [-0.55, 0.55], [-0.7, 0.9]].forEach(([y, f], i) => {
    P.push(seg([0.82, y - 0.04, 0.1], [1.68, y - 0.04, 0.1], { colA: DEEP, colB: DEEP, w: 0.7, jit: 0.01, flow: false }));
    P.push(seg([0.82, y - 0.04, 0.1], [0.82 + 0.86 * f, y - 0.04, 0.1], { colA: SKY, colB: GREEN, w: 2.2, jit: 0.02 }));
  });
  // conexiones entre paneles
  P.push(seg([0.4, 0.3, 0.05], [0.7, 0.4, 0.25], { colA: SKY, colB: GREEN, w: 1.5 }));
  P.push(seg([0.4, -0.3, 0.05], [0.7, -0.5, 0.1], { colA: SKY, colB: GREEN, w: 1.5, off: 1 }));
  return sample(P, n);
}

/* ---------- 5) Web Development & Ecommerce: ventana de navegador + tienda ---------- */
function web(n) {
  const P = [];
  P.push(...rectO(-1.8, -1.1, 1.5, 1.1, 0, { colA: BLUE, colB: SKY, w: 1.1 }));
  P.push(...rectO(-1.45, -0.75, 1.85, 1.4, -0.5, { colA: DEEP, colB: DEEP, w: 0.5, flow: false }));   // ventana detrás (profundidad)
  P.push(seg([-1.8, 0.8, 0], [1.5, 0.8, 0], { colA: BLUE, colB: SKY, w: 0.9 }));
  [-1.65, -1.5, -1.35].forEach((x, i) => P.push(blob([x, 0.95, 0], 0.045, { w: 8, col: [GREEN, SKY, BLUE][i] })));
  P.push(...rectO(-1.0, 0.86, 1.2, 1.04, 0, { colA: DEEP, colB: SKY, w: 0.7 }));                       // barra de direcciones
  P.push(...rectO(-1.6, 0.0, 1.3, 0.62, 0, { colA: BLUE, colB: GREEN, w: 1 }));                       // hero de la web
  P.push(seg([-1.4, 0.45, 0], [-0.3, 0.45, 0], { colA: SKY, colB: SKY, w: 1.1 }));
  P.push(seg([-1.4, 0.3, 0], [-0.6, 0.3, 0], { colA: SKY, colB: SKY, w: 1.1, off: 1 }));
  P.push(...rectO(-1.4, 0.08, -0.9, 0.2, 0, { colA: GREEN, colB: GREEN, w: 1.2 }));
  for (let i = 0; i < 3; i++) {                                                                         // tarjetas de producto
    const x0 = -1.6 + i * 1.0;
    P.push(...rectO(x0, -1.0, x0 + 0.85, -0.2, 0, { colA: BLUE, colB: SKY, w: 0.9 }));
    P.push(circle([x0 + 0.425, -0.45, 0], 0.17, 'xy', { colA: SKY, colB: GREEN, w: 1.2, flow: true }));
    P.push(seg([x0 + 0.15, -0.8, 0], [x0 + 0.7, -0.8, 0], { colA: DEEP, colB: SKY, w: 0.9, off: i }));
  }
  // carrito flotando delante
  const cart = [[1.0, -0.55, 0.7], [1.15, -0.55, 0.7], [1.3, -1.0, 0.7], [1.75, -1.0, 0.7], [1.85, -0.65, 0.7], [1.2, -0.65, 0.7]];
  poly(cart, { colA: GREEN, colB: GREEN, w: 1.8 }).forEach((s) => P.push(s));
  P.push(circle([1.42, -1.15, 0.7], 0.07, 'xy', { colA: GREEN, colB: GREEN, w: 3 }));
  P.push(circle([1.68, -1.15, 0.7], 0.07, 'xy', { colA: GREEN, colB: GREEN, w: 3 }));
  P.push(fillRect(-1.75, -1.05, 1.45, 0.75, 0, { w: 30 }));
  return sample(P, n);
}

/* ---------- 6) AI Automations: red neuronal con señales que viajan de capa en capa ---------- */
function ai(n) {
  const r = rng(11), P = [], layers = [4, 6, 6, 3], xs = [-1.65, -0.55, 0.55, 1.65], L = [];
  layers.forEach((c, li) => L.push(Array.from({ length: c }, (_, k) => [xs[li], (k - (c - 1) / 2) * 0.58, (r() - 0.5) * 0.7])));
  for (let li = 0; li < L.length - 1; li++) for (const a of L[li]) for (const b of L[li + 1])
    P.push(seg(a, b, { colA: mix(BLUE, SKY, li / 3), colB: mix(SKY, GREEN, (li + 1) / 3), off: r() * 6, w: 0.35, jit: 0.01 }));
  L.forEach((layer, li) => layer.forEach((p) => {
    P.push(blob(p, li === L.length - 1 ? 0.11 : 0.08, { w: 30, col: mix(SKY, GREEN, li / 3) }));
    P.push(circle(p, 0.17, 'xy', { colA: DEEP, colB: SKY, w: 0.6, jit: 0.008 }));
  }));
  L[0].forEach((p, i) => P.push(seg([-2.0, p[1], p[2]], p, { colA: DEEP, colB: BLUE, w: 0.8, off: i })));
  L[L.length - 1].forEach((p, i) => P.push(seg(p, [2.0, p[1], p[2]], { colA: GREEN, colB: GREEN, w: 0.8, off: i * 0.5 })));
  P.push({ w: 40, jit: 0, path: () => Math.random() * 20, at: () => [(r() * 2 - 1) * 1.9, (r() * 2 - 1) * 1.4, (r() * 2 - 1) * 0.8], col: () => mix(DEEP, SKY, Math.random()) });
  return sample(P, n);
}

const GENERATORS = { performance, analytics, tracking, reporting, web, ai };
export const SERVICE_SHAPES = Object.keys(GENERATORS);
export const isServiceShape = (name) => name in GENERATORS;
export const buildShape = (name, n) => GENERATORS[name](n);
