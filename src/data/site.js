// Datos generales del sitio: se editan aquí y se usan en el menú, el pie y la página de contacto.
export const site = {
  name: 'GrowLab',
  email: 'hola.grow.lab@gmail.com', // correo al que llegan los mensajes del formulario
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/#servicios', label: 'Servicios' },
    { href: '/portafolio', label: 'Portafolio' },
    { href: '/nosotros', label: 'Nosotros' },
  ],
  contact: { href: '/contacto', label: 'Contacto' },
  cta: 'Agendar reunión', // texto del botón del menú (lleva a la página de contacto)
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/lab.grow/' },   // @lab.grow
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/grow-digital-marketing-lab/' },
  ],
  // cifras de la agencia: las mismas en la galaxia del inicio y en «Nosotros» (v = valor, s = sufijo, d = decimales, i = icono)
  stats: [
    { v: 50, s: '+', l: 'Proyectos culminados', i: 'folder-check' },
    { v: 5, s: 'M$', l: 'Facturación generada', i: 'coins' },
    { v: 4.8, s: 'x', d: 1, l: 'ROAS promedio en campañas', i: 'trending-up' },
    { v: 95, s: '%', l: 'Clientes recurrentes', i: 'repeat' },
  ],
};
