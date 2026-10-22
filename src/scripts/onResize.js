/**
 * Llama a `fn` cuando el elemento cambia de tamaño en pantalla, sea cual sea el motivo: la ventana cambia, se abre un panel
 * lateral del navegador (Claude, Tag Assistant…), un pin del scroll se recalcula o cambia el contenido de alrededor.
 * Escuchar sólo el «resize» de la ventana no basta: a veces llega antes de que la página se recoloque y los lienzos
 * (partículas, 3D) se quedaban con el tamaño anterior, estirados o aplanados. Si el tamaño no cambió, no hace nada.
 */
export function onResize(el, fn) {
  let lw = el.clientWidth, lh = el.clientHeight;
  const run = () => {
    const w = el.clientWidth, h = el.clientHeight;
    if (w === lw && h === lh) return;
    lw = w; lh = h;
    fn();
  };
  window.addEventListener('resize', run);
  if ('ResizeObserver' in window) new ResizeObserver(run).observe(el);
}
