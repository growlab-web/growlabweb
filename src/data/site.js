// Datos generales del sitio: se editan aquí y se usan en el menú, el pie y la página de contacto.
export const site = {
  name: 'GrowLab',
  url: 'https://growlab.pe',
  country: 'Perú',
  city: 'Arequipa',     // sede: se usa en los datos estructurados para Google
  /* --- Medición ---
     gtm: ID del contenedor de Google Tag Manager (formato GTM-XXXXXXX). Mientras esté vacío no se carga GTM ni se muestra el aviso de cookies.
     GA4 y los píxeles se configuran DENTRO de Tag Manager; el sitio sólo deja los eventos preparados (ver scripts/track.js).
     consentDefault: 'denied' = no se mide con cookies hasta que el visitante acepta; 'granted' = se mide desde el principio. */
  gtm: 'GTM-MZG4N9QJ',
  consentDefault: 'denied',
  // datos legales del responsable, para la política de privacidad (si se dejan vacíos, no se muestran)
  legal: { name: '', ruc: '', address: '' },
  email: 'hola.grow.lab@gmail.com', // correo al que llegan los mensajes del formulario
  phone: { href: 'tel:+51989134545', label: '+51 989 134 545' },   // teléfono de la empresa (contacto y pie)
  // WhatsApp (botón del hero y botón flotante): abre el chat con un mensaje ya escrito
  whatsapp: { href: 'https://wa.me/51989134545?text=' + encodeURIComponent('Hola GrowLab, quiero más información sobre sus servicios.'), label: 'Escríbenos por WhatsApp' },
  whatsappEn: { href: 'https://wa.me/51989134545?text=' + encodeURIComponent('Hi GrowLab, I would like more information about your services.'), label: 'Message us on WhatsApp' },
  nav: [
    { href: '/', label: 'Inicio', en: 'Home' },
    { href: '/#servicios', label: 'Servicios', en: 'Services' },
    { href: '/portafolio', label: 'Portafolio', en: 'Portfolio' },
    { href: '/nosotros', label: 'Nosotros', en: 'About' },
  ],
  contact: { href: '/contacto', label: 'Contacto', en: 'Contact' },
  privacy: { href: '/privacidad', label: 'Política de privacidad y protección de datos', en: 'Privacy and data protection policy' },   // enlace del pie y del formulario
  calendly: 'https://calendly.com/lab-grow/30min',
  // agenda del diagnóstico gratuito (/diagnostico): si en Calendly creas un evento propio para el diagnóstico, pon aquí su enlace
  calendlyDiagnostico: 'https://calendly.com/lab-grow/30min',
  instagram: { user: 'lab.grow', href: 'https://www.instagram.com/lab.grow/' },   // cuenta a la que invita a seguir el diagnóstico (aviso, no obligatorio)
  cta: 'Agendar reunión', // texto del botón del menú (lleva a la página de contacto)
  ctaEn: 'Book a meeting',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/lab.grow/' },   // @lab.grow
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/grow-digital-marketing-lab/' },
  ],
  // cifras de la agencia: las mismas en la galaxia del inicio y en «Nosotros» (v = valor, s = sufijo, d = decimales, i = icono)
  stats: [
    { v: 50, s: '+', l: 'Proyectos culminados', en: 'Projects delivered', i: 'folder-check' },
    { v: 5, s: 'M$', l: 'Facturación generada', en: 'Revenue generated', i: 'money-bag' },
    { v: 4.8, s: 'x', d: 1, l: 'ROAS promedio en campañas', en: 'Average campaign ROAS', i: 'trending-up' },
    { v: 95, s: '%', l: 'Clientes recurrentes', en: 'Returning clients', i: 'repeat' },
  ],
};

/** Textos del sitio en el idioma de la página (las etiquetas en inglés van en el campo `en` de cada elemento). */
export function siteFor(lang) {
  if (lang !== 'en') return site;
  const L = (x) => ({ ...x, label: x.en || x.label });
  return {
    ...site,
    whatsapp: site.whatsappEn,
    nav: site.nav.map(L),
    contact: L(site.contact),
    privacy: L(site.privacy),
    cta: site.ctaEn,
    stats: site.stats.map((x) => ({ ...x, l: x.en || x.l })),
  };
}
