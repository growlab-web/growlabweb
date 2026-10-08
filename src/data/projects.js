/**
 * Proyectos del portafolio.
 *
 * ⚠ PROYECTOS DE EJEMPLO. Los nombres, textos, años y resultados son inventados para mostrar el diseño.
 *   Hay que reemplazarlos por los casos reales de GrowLab.
 *
 * Imágenes: cada proyecto usa MAQUETAS de sitios web (marcas ficticias) guardadas en /public/projects/<slug>/
 *   cover.jpg → imagen del panel 3D;  1.jpg, 2.jpg, 3.jpg → imágenes de la página del proyecto.
 * Para usar las capturas reales de tus clientes, reemplaza esos archivos (1440×900 recomendado) con el mismo nombre.
 * Si faltan, se dibuja una imagen por código a partir de `palette` y `art` (ver scripts/projectArt.js).
 *
 * art: 'hero' | 'catalog' | 'editorial'  → estilo de la imagen generada.
 */
export const projects = [
  {
    slug: 'aurora-studio',
    cover: '/projects/aurora-studio/cover.jpg',
    images: ['/projects/aurora-studio/cover.jpg', '/projects/aurora-studio/1.jpg', '/projects/aurora-studio/2.jpg', '/projects/aurora-studio/3.jpg'],
    name: 'Aurora Studio',
    desc: 'Rediseño completo de la tienda Shopify y embudo de Meta Ads con email automatizado para una marca de moda sostenible.',
    category: 'Moda · Shopify',
    year: '2025',
    services: ['Paid Media & Traffic Generation', 'Web Development', 'AI Automation'],
    result: { value: '+312%', label: 'ventas online en 6 meses' },
    palette: { bg: '#e9c6cf', fg: '#2a1620', accent: '#b3405e' },
    art: 'editorial',
  },
  {
    slug: 'nordika',
    cover: '/projects/nordika/cover.jpg',
    images: ['/projects/nordika/cover.jpg', '/projects/nordika/1.jpg', '/projects/nordika/2.jpg', '/projects/nordika/3.jpg'],
    name: 'Nórdika',
    desc: 'Tienda de mobiliario escandinavo: arquitectura de catálogo, fichas de producto y checkout optimizados para conversión.',
    category: 'Hogar · Shopify',
    year: '2025',
    services: ['Web Development', 'Tracking & Attribution', 'Reporting & Dashboards'],
    result: { value: '+84%', label: 'tasa de conversión' },
    palette: { bg: '#d9d3c7', fg: '#1d1b17', accent: '#7a6a4f' },
    art: 'catalog',
  },
  {
    slug: 'flowly',
    cover: '/projects/flowly/cover.jpg',
    images: ['/projects/flowly/cover.jpg', '/projects/flowly/1.jpg', '/projects/flowly/2.jpg', '/projects/flowly/3.jpg'],
    name: 'Flowly',
    desc: 'Medición de punta a punta y campañas de captación de demos para un SaaS B2B, con atribución real por canal.',
    category: 'SaaS · B2B',
    year: '2024',
    services: ['Data Analytics', 'Tracking & Attribution', 'Paid Media & Traffic Generation'],
    result: { value: '-48%', label: 'coste por lead' },
    palette: { bg: '#0f2a1d', fg: '#e9ffd5', accent: '#abe155' },
    art: 'hero',
  },
  {
    slug: 'casa-brasa',
    cover: '/projects/casa-brasa/cover.jpg',
    images: ['/projects/casa-brasa/cover.jpg', '/projects/casa-brasa/1.jpg', '/projects/casa-brasa/2.jpg', '/projects/casa-brasa/3.jpg'],
    name: 'Casa Brasa',
    desc: 'Restaurante con delivery propio: pedidos online, campañas locales y automatización de reservas y reactivación de clientes.',
    category: 'Restauración',
    year: '2024',
    services: ['Paid Media & Traffic Generation', 'AI Automation'],
    result: { value: '3,1M', label: 'visualizaciones orgánicas' },
    palette: { bg: '#2a0f0a', fg: '#ffe9d6', accent: '#ff7a3d' },
    art: 'hero',
  },
  {
    slug: 'vertice-fit',
    cover: '/projects/vertice-fit/cover.jpg',
    images: ['/projects/vertice-fit/cover.jpg', '/projects/vertice-fit/1.jpg', '/projects/vertice-fit/2.jpg', '/projects/vertice-fit/3.jpg'],
    name: 'Vértice Fit',
    desc: 'Ecommerce de suplementación deportiva con suscripciones, dashboards de rentabilidad y flujos automáticos de recompra.',
    category: 'Salud · Ecommerce',
    year: '2025',
    services: ['Reporting & Dashboards', 'AI Automation', 'Web Development'],
    result: { value: '4,8x', label: 'ROAS medio' },
    palette: { bg: '#0b1c44', fg: '#e6efff', accent: '#386fde' },
    art: 'catalog',
  },
  {
    slug: 'lumen-joyas',
    cover: '/projects/lumen-joyas/cover.jpg',
    images: ['/projects/lumen-joyas/cover.jpg', '/projects/lumen-joyas/1.jpg', '/projects/lumen-joyas/2.jpg', '/projects/lumen-joyas/3.jpg'],
    name: 'Lumen Joyas',
    desc: 'Joyería de autor: tienda con narrativa visual, catálogo de colecciones y campañas de remarketing dinámico.',
    category: 'Joyería · Shopify',
    year: '2024',
    services: ['Web Development', 'Paid Media & Traffic Generation'],
    result: { value: '+156%', label: 'ticket medio' },
    palette: { bg: '#15110a', fg: '#f3e6c4', accent: '#d9b25f' },
    art: 'editorial',
  },
  {
    slug: 'terra-cafe',
    cover: '/projects/terra-cafe/cover.jpg',
    images: ['/projects/terra-cafe/cover.jpg', '/projects/terra-cafe/1.jpg', '/projects/terra-cafe/2.jpg', '/projects/terra-cafe/3.jpg'],
    name: 'Terra Café',
    desc: 'Café de especialidad directo al consumidor: tienda de suscripción, medición de cohortes y campañas de adquisición.',
    category: 'Café · DTC',
    year: '2025',
    services: ['Data Analytics', 'Paid Media & Traffic Generation', 'Reporting & Dashboards'],
    result: { value: '92%', label: 'retención a 6 meses' },
    palette: { bg: '#1b2418', fg: '#eef3df', accent: '#9ccf5a' },
    art: 'catalog',
  },
  {
    slug: 'kodo-tech',
    cover: '/projects/kodo-tech/cover.jpg',
    images: ['/projects/kodo-tech/cover.jpg', '/projects/kodo-tech/1.jpg', '/projects/kodo-tech/2.jpg', '/projects/kodo-tech/3.jpg'],
    name: 'Kodo Tech',
    desc: 'Retail de electrónica: feeds de producto, campañas de Google Ads y Meta y un panel único de resultados en tiempo real.',
    category: 'Electrónica · Ecommerce',
    year: '2024',
    services: ['Paid Media & Traffic Generation', 'Tracking & Attribution', 'Reporting & Dashboards'],
    result: { value: '+2,3x', label: 'ingresos por canal de pago' },
    palette: { bg: '#120d2e', fg: '#ece6ff', accent: '#7b6cff' },
    art: 'hero',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
