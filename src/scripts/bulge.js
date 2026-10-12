/**
 * Efecto de las portadas del portafolio, aplicado a una imagen normal de la página: al pasar el cursor, la imagen se abomba
 * como una tela empujada por una esfera que sigue al ratón (lo de debajo del cursor se acerca, con su luz y su sombra).
 * En el carrusel 3D eso es geometría real; aquí se imita en 2D con un sombreador que deforma la imagen (WebGL sin librerías).
 *
 * attachBulge(figure, img) → función que lo desmonta.  Sólo actúa en equipos con ratón; el lienzo se crea en el primer hover.
 */
const VERT = 'attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `
  precision mediump float;
  uniform sampler2D t; uniform vec2 m; uniform float k, asp; varying vec2 v;
  void main(){
    vec2 d = v - m; d.x *= asp;                                   // distancia al cursor, sin deformar por la proporción de la imagen
    float R = 0.62;                                               // radio de la "esfera" (en altos de imagen)
    float h = clamp(1.0 - dot(d, d) / (R * R), 0.0, 1.0);
    float cap = h * h * (3.0 - 2.0 * h);                          // mismo perfil suave que en el carrusel: 0 en el borde, 1 en el centro
    vec2 uv = m + (v - m) * (1.0 - 0.17 * k * cap);               // la zona abombada queda más cerca: se ve ampliada
    vec3 c = texture2D(t, uv).rgb;
    float shade = (-2.0 * d.x / (R * R)) * 6.0 * h * (1.0 - h) * 0.2;
    c *= 1.0 + clamp(shade, -1.0, 1.0) * 0.15 * k;                // luz a un lado del bulto y sombra al otro
    c += cap * 0.03 * k;
    gl_FragColor = vec4(c, 1.0);
  }`;

export function attachBulge(fig, img) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let canvas = null, gl = null, uni = null, raf = 0, last = 0, k = 0, target = 0;
  const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  function setup() {
    canvas = document.createElement('canvas');
    canvas.className = 'pf-bulge';
    canvas.setAttribute('aria-hidden', 'true');
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { canvas = null; return false; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; canvas = null; return false; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    uni = { m: gl.getUniformLocation(prog, 'm'), k: gl.getUniformLocation(prog, 'k'), asp: gl.getUniformLocation(prog, 'asp') };
    fig.appendChild(canvas);
    return true;
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now;
    k += (target - k) * Math.min(1, dt * 7);
    m.x += (m.tx - m.x) * Math.min(1, dt * 5.5); m.y += (m.ty - m.y) * Math.min(1, dt * 5.5);      // la esfera sigue al cursor con el mismo retraso que en el carrusel
    const w = Math.round(fig.clientWidth * Math.min(window.devicePixelRatio || 1, 2)), h = Math.round(fig.clientHeight * Math.min(window.devicePixelRatio || 1, 2));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(uni.m, m.x, m.y); gl.uniform1f(uni.k, k); gl.uniform1f(uni.asp, w / h);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    canvas.style.opacity = '1';
    if (target === 0 && k < 0.004) { canvas.style.opacity = '0'; raf = 0; return; }                 // de vuelta al reposo: se deja de dibujar y queda la imagen normal
    raf = requestAnimationFrame(frame);
  }

  const at = (e) => { const r = fig.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height; };
  const enter = (e) => {
    if (!img.complete || !img.naturalWidth) return;
    if (!canvas && !setup()) return;
    at(e); if (k < 0.01) { m.x = m.tx; m.y = m.ty; }
    target = 1;
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  };
  const leave = () => { target = 0; };
  fig.addEventListener('pointerenter', enter);
  fig.addEventListener('pointermove', at);
  fig.addEventListener('pointerleave', leave);

  return () => {
    cancelAnimationFrame(raf);
    fig.removeEventListener('pointerenter', enter); fig.removeEventListener('pointermove', at); fig.removeEventListener('pointerleave', leave);
    if (gl) { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
    if (canvas) canvas.remove();
  };
}
