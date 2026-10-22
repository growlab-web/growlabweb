/**
 * Cerebro en 3D para el hero: una forma anatómica construida con volúmenes (no un dibujo de perfil con grosor),
 * para que se reconozca desde cualquier ángulo mientras gira.
 *
 *   - dos hemisferios separados por la cisura longitudinal (el surco que se ve desde arriba)
 *   - lóbulos temporales hacia abajo y adelante, con la cisura lateral que los separa del resto
 *   - cerebelo atrás y abajo, con sus pliegues finos y paralelos
 *   - tronco encefálico
 *   - circunvoluciones: surcos sinuosos (ruido 3D) donde hay menos partículas y que se hunden un poco
 *
 * Ejes: x = de delante (-) hacia atrás (+), y = arriba, z = de un lado al otro. Mide ~2,8 de largo y ~2,6 de alto,
 * como el cerebro anterior, para que encaje igual en la escena.
 */

/* ---------- ruido 3D (Perlin) con semilla fija: el cerebro sale igual en cada visita ---------- */
const perm = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 1234567;
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const grad = (h, x, y, z) => { const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); };
function noise(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z, B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
  return lerp(
    lerp(lerp(grad(perm[AA] & 15, x, y, z), grad(perm[BA] & 15, x - 1, y, z), u), lerp(grad(perm[AB] & 15, x, y - 1, z), grad(perm[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(perm[AA + 1] & 15, x, y, z - 1), grad(perm[BA + 1] & 15, x - 1, y, z - 1), u), lerp(grad(perm[AB + 1] & 15, x, y - 1, z - 1), grad(perm[BB + 1] & 15, x - 1, y - 1, z - 1), u), v),
    w,
  );
}

/* ---------- la forma: distancia con signo a la superficie (negativa dentro) ---------- */
// elipsoide (aproximación habitual de distancia)
function ellipsoid(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = x - cx, py = y - cy, pz = z - cz;
  const k0 = Math.hypot(px / rx, py / ry, pz / rz), k1 = Math.hypot(px / (rx * rx), py / (ry * ry), pz / (rz * rz));
  return k1 === 0 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}
// unión suave: k = cuánto se funden (pequeño = queda un pliegue entre las dos piezas)
function smin(a, b, k) { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }

// un hemisferio (s = +1 izquierdo, -1 derecho): más alto hacia atrás, base más plana, polo frontal algo más estrecho
function hemisphere(x, y, z, s) {
  const zz = z * s;
  const ry = y > 0.1 ? 0.98 : 0.72;                          // arriba abombado, abajo (base) más plano
  const rz = 0.6 + 0.05 * Math.tanh(x * 1.6);                // un poco más ancho hacia atrás
  const yy = y - 0.1 * x;                                    // el techo sube hacia atrás
  let d = ellipsoid(x, yy, zz, 0.02, 0.18, 0.43, 1.36, ry, rz);
  // lóbulo temporal: hacia abajo y adelante, unido con un pliegue (cisura lateral)
  const t = ellipsoid(x, y, zz, -0.2, -0.5, 0.56, 0.78, 0.4, 0.42);
  d = smin(d, t, 0.1);
  // lóbulo occipital: el polo de atrás algo más saliente y bajo
  d = smin(d, ellipsoid(x, y, zz, 0.95, -0.05, 0.4, 0.5, 0.55, 0.5), 0.25);
  return d;
}
function cerebrum(x, y, z) { return smin(hemisphere(x, y, z, 1), hemisphere(x, y, z, -1), 0.05); }   // cisura longitudinal: poca fusión
function cerebellum(x, y, z) {
  const l = ellipsoid(x, y, z, 0.78, -0.86, 0.3, 0.5, 0.33, 0.42), r = ellipsoid(x, y, z, 0.78, -0.86, -0.3, 0.5, 0.33, 0.42);
  return smin(l, r, 0.12);
}
function brainstem(x, y, z) {
  // cápsula inclinada: del centro de la base hacia abajo
  const ax = 0.18, ay = -0.45, bx = 0.34, by = -1.38;
  const vx = bx - ax, vy = by - ay, h = Math.min(1, Math.max(0, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy)));
  const r = 0.16 - 0.04 * h;
  return Math.hypot(x - ax - vx * h, y - ay - vy * h, z) - r;
}
// partes: 0 = cerebro, 1 = cerebelo, 2 = tronco (cada una tiene su textura)
function sdf(x, y, z) {
  const a = cerebrum(x, y, z), b = cerebellum(x, y, z), c = brainstem(x, y, z);
  return smin(smin(a, b, 0.04), c, 0.12);
}
function part(x, y, z) {
  const a = cerebrum(x, y, z), b = cerebellum(x, y, z), c = brainstem(x, y, z);
  return a <= b && a <= c ? 0 : b <= c ? 1 : 2;
}
function normalAt(x, y, z) {
  const e = 0.004;
  const nx = sdf(x + e, y, z) - sdf(x - e, y, z), ny = sdf(x, y + e, z) - sdf(x, y - e, z), nz = sdf(x, y, z + e) - sdf(x, y, z - e);
  const l = Math.hypot(nx, ny, nz) || 1;
  return [nx / l, ny / l, nz / l];
}

/* ---------- textura: circunvoluciones y pliegues del cerebelo ---------- */
// valor cercano a 0 = surco. En el cerebro, líneas sinuosas (ruido con el dominio deformado); en el cerebelo, franjas paralelas.
function groove(x, y, z, kind) {
  if (kind === 1) {
    const f = Math.sin((y * 1.0 + x * 0.35 + noise(x * 2, y * 2, z * 2) * 0.1) * 40);
    return Math.abs(f);
  }
  if (kind === 2) return 1;
  const az = Math.abs(z);                                    // simétrico entre hemisferios (como uno real, casi)
  const wx = noise(x * 1.6 + 7.1, y * 1.6, az * 1.6) * 0.5, wy = noise(x * 1.6, y * 1.6 + 3.7, az * 1.6) * 0.5, wz = noise(x * 1.6 + 2.3, y * 1.6, az * 1.6 + 5.2) * 0.5;
  const n = noise((x + wx) * 4.2, (y + wy) * 4.2, (az + wz) * 4.2 + 11);
  return Math.abs(n) * 2.4;
}

/**
 * Rellena P (posiciones) y Nrm (normales) con `count` puntos sobre la superficie del cerebro. Devuelve la caja que ocupa (x0, x1, y0, y1).
 * set3(arr, i, x, y, z) es el mismo ayudante de hero3d.js.
 */
export function buildBrainShape(count, P, Nrm, set3) {
  // 1) candidatos: puntos al azar dentro de una caja, llevados a la superficie siguiendo la distancia (unos pasos de Newton)
  const cand = [];
  const want = Math.round(count * 2.2);
  let guard = 0;
  while (cand.length < want && guard++ < want * 3) {
    let x = (Math.random() * 2 - 1) * 1.55, y = Math.random() * 2.75 - 1.7, z = (Math.random() * 2 - 1) * 1.15;
    let ok = false;
    for (let it = 0; it < 6; it++) {
      const d = sdf(x, y, z);
      if (Math.abs(d) < 0.002) { ok = true; break; }
      const [nx, ny, nz] = normalAt(x, y, z);
      x -= nx * d; y -= ny * d; z -= nz * d;
    }
    if (!ok && Math.abs(sdf(x, y, z)) > 0.01) continue;
    const kind = part(x, y, z);
    // tronco: sólo la parte que asoma bajo el cerebro (la de dentro no se ve)
    if (kind === 2 && y > -0.62) continue;
    cand.push(x, y, z, kind);
  }
  // 2) reparto parejo: al proyectar, las partículas se amontonan en las zonas salientes; se aclaran según cuántas hay alrededor
  const G = 36, cell = new Map(), key = (x, y, z) => (((x + 1.6) / 3.2 * G) | 0) * G * G + (((y + 1.75) / 3.5 * G) | 0) * G + (((z + 1.2) / 2.4 * G) | 0);
  const nC = cand.length / 4;
  for (let i = 0; i < nC; i++) { const k = key(cand[i * 4], cand[i * 4 + 1], cand[i * 4 + 2]); cell.set(k, (cell.get(k) || 0) + 1); }
  const counts = [...cell.values()].sort((a, b) => a - b), target = counts[(counts.length * 0.45) | 0];

  // 3) selección final con la textura: en los surcos quedan pocas partículas y se hunden un poco; en las crestas, muchas
  const box = { x0: 0, x1: 0, y0: 0, y1: 0 };
  let n = 0;
  const order = Array.from({ length: nC }, (_, i) => i);
  for (let i = nC - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
  for (let pass = 0; pass < 3 && n < count; pass++) {
    for (const i of order) {
      if (n >= count) break;
      if (cand[i * 4 + 3] < 0) continue;                         // ya usado
      let x = cand[i * 4], y = cand[i * 4 + 1], z = cand[i * 4 + 2];
      const kind = cand[i * 4 + 3];
      if (Math.random() > Math.min(1, target / cell.get(key(x, y, z))) * (pass === 0 ? 1 : 1.6)) continue;
      const g = groove(x, y, z, kind);
      const inGroove = g < (kind === 1 ? 0.38 : 0.3);
      if (inGroove && Math.random() > (pass === 2 ? 0.3 : 0.06)) continue;
      // dentro de la cisura entre hemisferios se juntan muchas partículas y, vista de frente o desde arriba, parecía una línea de luz
      if (kind === 0 && Math.abs(z) < 0.05 && Math.random() > 0.15) continue;
      let [nx, ny, nz] = normalAt(x, y, z);
      const sx = nx, sy = ny, sz = nz;                           // normal de la forma lisa (para el relieve)
      // la normal se inclina hacia los surcos siguiendo la pendiente de cada pliegue: así la luz de la escena dibuja las circunvoluciones
      if (kind !== 2) {
        const e = 0.012, k = kind === 1 ? 0.025 : 0.05;
        let gx = (groove(x + e, y, z, kind) - groove(x - e, y, z, kind)) / (2 * e);
        let gy = (groove(x, y + e, z, kind) - groove(x, y - e, z, kind)) / (2 * e);
        let gz = (groove(x, y, z + e, kind) - groove(x, y, z - e, kind)) / (2 * e);
        const dn = gx * nx + gy * ny + gz * nz; gx -= dn * nx; gy -= dn * ny; gz -= dn * nz;   // sólo la parte a lo largo de la superficie
        nx -= gx * k; ny -= gy * k; nz -= gz * k;
        const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      }
      // relieve: los surcos se hunden y las crestas sobresalen un poco
      const lift = kind === 2 ? 0 : (inGroove ? -0.06 : 0.02 * Math.min(1, g)) + (Math.random() - 0.5) * 0.01;
      x += sx * lift; y += sy * lift; z += sz * lift;
      set3(P, n, x, y, z); set3(Nrm, n, nx, ny, nz);
      if (x < box.x0) box.x0 = x; if (x > box.x1) box.x1 = x; if (y < box.y0) box.y0 = y; if (y > box.y1) box.y1 = y;
      cand[i * 4 + 3] = -1;
      n++;
    }
  }
  // si faltaran (no debería), se repiten puntos ya colocados
  for (let i = n; i < count; i++) { const s = (Math.random() * Math.max(1, n)) | 0; set3(P, i, P[s * 3], P[s * 3 + 1], P[s * 3 + 2]); set3(Nrm, i, Nrm[s * 3], Nrm[s * 3 + 1], Nrm[s * 3 + 2]); }
  return box;
}
