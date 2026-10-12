/**
 * ¿El navegador dibuja WebGL por software, sin aceleración gráfica? OJO: no es «no tener tarjeta de vídeo dedicada»: los gráficos
 * integrados (Intel, AMD, Apple, cualquier móvil) SÍ aceleran y ven el 3D normal. Esto sólo ocurre cuando no hay ninguna aceleración:
 * aceleración por hardware desactivada en el navegador, máquinas virtuales, escritorios remotos y las
 * herramientas de medición (PageSpeed/Lighthouse). Ahí sólo crear la escena 3D deja la página bloqueada varios segundos
 * (medido: ~3 s, frente a 0,07 s con aceleración), así que en esos equipos el hero usa imágenes fijas (heroStatic.js).
 */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

export function isSoftwareGL(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return SOFTWARE.test(String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)));
  } catch (e) { return false; }
}

/**
 * Lo mismo, pero averiguado en un hilo aparte: la comprobación en sí también es lenta sin aceleración gráfica y, hecha aquí,
 * no bloquea la página. Devuelve una promesa; ante cualquier duda (prueba no disponible, sin respuesta) se asume que hay aceleración
 * y se muestra el 3D.
 */
let probe = null;
export function softwareGL() {
  if (probe) return probe;
  probe = new Promise((resolve) => {
    let worker = null, done = false;
    const finish = (v) => { if (done) return; done = true; if (worker) worker.terminate(); resolve(v); };
    try {
      if (typeof OffscreenCanvas === 'undefined' || typeof Worker === 'undefined') return finish(false);
      const code = `try { const gl = new OffscreenCanvas(1, 1).getContext('webgl'); const e = gl && gl.getExtension('WEBGL_debug_renderer_info');
        postMessage(gl ? String(e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : 'sin webgl'); } catch (err) { postMessage(''); }`;
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      worker = new Worker(url);
      worker.onmessage = (ev) => { URL.revokeObjectURL(url); finish(ev.data === 'sin webgl' || SOFTWARE.test(String(ev.data))); };
      worker.onerror = () => finish(false);
      setTimeout(() => finish(false), 6000);
    } catch (e) { finish(false); }
  });
  return probe;
}
