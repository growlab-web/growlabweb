/**
 * Medición: todos los eventos del sitio se dejan en `dataLayer`, que es de donde los lee Google Tag Manager.
 * El sitio no habla con GA4 ni con ningún píxel directamente: eso se configura dentro de GTM (ID en data/site.js).
 *
 * Eventos que se envían:
 *   generate_lead   formulario enviado          → lead_method (formulario, diagnostico), lead_service_primary, lead_services,
 *                   lead_services_count, form_location  (+ user_data, ver abajo)
 *   lead_service    uno por cada servicio pedido → lead_service, form_location  (en GA4: contactos por servicio)
 *   schedule_click  botón «Agendar reunión» tras enviar el formulario (abre Calendly) → form_location
 *   ig_follow_click botón «Seguir a @lab.grow» del diagnóstico gratuito → form_location ('diagnostico')
 *   schedule_start  fecha y hora elegidas en la agenda del diagnóstico (Calendly dentro de la página) → form_location
 *   meeting_scheduled reunión del diagnóstico agendada en Calendly → form_location  (el lead ya se contó con el formulario)
 *   thanks_game_play alguien juega tras enviar  → form_location
 *   form_start      primer campo que se toca    → form_location
 *   cta_click       botones «Agendar reunión»   → cta_location (menu, hero, portafolio, pie…)
 *   contact_click   correo, teléfono y redes    → contact_method (email, telefono, whatsapp, instagram, linkedin)
 *   hero_stage      etapas del hero al bajar    → stage (esfera, galaxia, cerebro)
 *   section_view    secciones del inicio        → section (quienes-somos, servicios, contacto)
 *   services_slide  flechas del carrusel        → direction (siguiente, anterior)
 *   project_view    proyecto abierto            → project
 *   render_mode     versión del hero que se ve  → render_mode ('3d', o 'imagenes' si el navegador no tiene aceleración gráfica)
 *   blog_read       lectura de un artículo      → article, category, percent (50 o 90)
 *   blog_share      artículo compartido         → article, method (linkedin, whatsapp, x, copiar)
 *   blog_filter     filtro de categoría del blog → category
 *   page_not_found  página de error 404         → missing_path, referrer
 *   notfound_broken alguien rompió el 404       → (sin datos)
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
    if (href.startsWith('tel:')) return track('contact_click', { contact_method: 'telefono', link_location: whereIs(a) });
    if (/wa\.me|whatsapp\.com/i.test(href)) return track('contact_click', { contact_method: 'whatsapp', link_location: a.classList.contains('is-morph') && window.scrollY < 60 ? 'hero' : 'flotante' });
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
