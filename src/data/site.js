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
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
};
