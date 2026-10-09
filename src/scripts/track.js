/**
 * Medición: todos los eventos del sitio se dejan en `dataLayer`, que es de donde los lee Google Tag Manager.
 * El sitio no habla con GA4 ni con ningún píxel directamente: eso se configura dentro de GTM (ID en data/site.js).
 *
 * Eventos que se envían:
 *   generate_lead   formulario enviado          → lead_services, lead_services_count, form_location  (+ user_data, ver abajo)
 *   form_start      primer campo que se toca    → form_location
 *   cta_click       botones «Agendar reunión»   → cta_location (menu, hero, portafolio, pie…)
 *   contact_click   correo y redes sociales     → contact_method (email, instagram, linkedin)
 *   hero_stage      etapas del hero al bajar    → stage (esfera, galaxia, cerebro)
 *   section_view    secciones del inicio        → section (quienes-somos, servicios, contacto)
 *   project_view    proyecto abierto            → project
 *
 * ⚠ Datos personales: el nombre, el correo y el teléfono NO deben enviarse a GA4 (Google lo prohíbe).
 *   En generate_lead viajan dentro de `user_data` sólo para las conversiones mejoradas de Google Ads / Meta,
 *   que los cifran antes de usarlos. En GTM no hay que mapear `user_data` a ningún parámetro de GA4.
 */
window.dataLayer = window.dataLayer || [];

export function track(event, params = {}) {
  window.dataLayer.push({ event, ...params });
}

const seen = new Set();
/** Igual que track, pero una sola vez por página para la misma clave (etapas y secciones). */
export function trackOnce(key, event, params) {
  if (seen.has(key)) return;
  seen.add(key);
  track(event, params);
}

const whereIs = (el) =>
  el.closest('#nav-sheet') ? 'menu-movil' : el.closest('[data-nav]') ? 'menu' : el.closest('footer') ? 'pie'
    : el.closest('[data-hero]') ? 'hero' : el.closest('[data-portfolio]') ? 'portafolio' : 'pagina';

export function initTracking() {
  // clics: botones de contacto, correo y redes
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return track('contact_click', { contact_method: 'email', link_location: whereIs(a) });
    if (/instagram\.com/i.test(href)) return track('contact_click', { contact_method: 'instagram', link_location: whereIs(a) });
    if (/linkedin\.com/i.test(href)) return track('contact_click', { contact_method: 'linkedin', link_location: whereIs(a) });
    if (/^\/contacto\/?$/.test(href) && (a.classList.contains('hbtn') || /agendar/i.test(a.textContent || ''))) track('cta_click', { cta_location: whereIs(a), cta_text: (a.textContent || '').trim() || 'Contacto' });
  });

  // secciones del inicio: cuentan cuando ocupan buena parte de la pantalla
  if ('IntersectionObserver' in window) {
    const sections = [['[data-manifesto]', 'quienes-somos'], ['[data-services-pin]', 'servicios'], ['[data-contact]', 'contacto']];
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      trackOnce('section:' + en.target.dataset.trackSection, 'section_view', { section: en.target.dataset.trackSection });
      io.unobserve(en.target);
    }), { threshold: 0.25 });
    sections.forEach(([sel, name]) => { const el = document.querySelector(sel); if (el) { el.dataset.trackSection = name; io.observe(el); } });
  }
}
