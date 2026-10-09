// Datos generales del sitio: se editan aquí y se usan en el menú, el pie y la página de contacto.
export const site = {
  name: 'GrowLab',
  url: 'https://growlab.pe',
  country: 'Perú',
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
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/#servicios', label: 'Servicios' },
    { href: '/portafolio', label: 'Portafolio' },
    { href: '/nosotros', label: 'Nosotros' },
  ],
  contact: { href: '/contacto', label: 'Contacto' },
  privacy: { href: '/privacidad', label: 'Política de privacidad y protección de datos' },   // enlace del pie y del formulario
  cta: 'Agendar reunión', // texto del botón del menú (lleva a la página de contacto)
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/lab.grow/' },   // @lab.grow
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/grow-digital-marketing-lab/' },
  ],
  // cifras de la agencia: las mismas en la galaxia del inicio y en «Nosotros» (v = valor, s = sufijo, d = decimales, i = icono)
  stats: [
    { v: 50, s: '+', l: 'Proyectos culminados', i: 'folder-check' },
    { v: 5, s: 'M$', l: 'Facturación generada', i: 'money-bag' },
    { v: 4.8, s: 'x', d: 1, l: 'ROAS promedio en campañas', i: 'trending-up' },
    { v: 95, s: '%', l: 'Clientes recurrentes', i: 'repeat' },
  ],
};
