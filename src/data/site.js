// Datos generales del sitio: se editan aquí y se usan en el menú, el pie y la página de contacto.
export const site = {
  name: 'GrowLab',
  email: 'hola@nova.agency', // TODO: cambiar por el correo real de GrowLab
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/portafolio', label: 'Portafolio' },
    { href: '/nosotros', label: 'Nosotros' },
  ],
  contact: { href: '/contacto', label: 'Contacto' },
  // ⚠ Marcas de EJEMPLO para el indicador «en vivo» del inicio. Reemplazar por clientes reales (y sus métricas reales).
  clients: [
    { name: 'Aurora Studio', tag: 'Moda · Shopify', metric: 'pedidos hoy', base: 128, color: '#386fde' },
    { name: 'Flowly', tag: 'SaaS · B2B', metric: 'leads hoy', base: 46, color: '#abe155' },
    { name: 'Casa Brasa', tag: 'Restauración', metric: 'reservas hoy', base: 73, color: '#7ba5f0' },
    { name: 'Nórdika', tag: 'Hogar · Shopify', metric: 'ventas hoy', base: 94, color: '#abe155' },
    { name: 'Vértice Fit', tag: 'Salud · Ecommerce', metric: 'altas hoy', base: 31, color: '#386fde' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
};
