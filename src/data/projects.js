/**
 * Proyectos del portafolio.
 *
 * ⚠ PROYECTOS DE EJEMPLO. Los nombres, textos, años y resultados son inventados para mostrar el diseño.
 *   Hay que reemplazarlos por los casos reales de GrowLab.
 *
 * Imágenes: mientras no haya capturas reales, cada proyecto genera sus imágenes por código
 * (ver scripts/projectArt.js) a partir de `palette` y `art`. Para usar capturas reales basta añadir:
 *   cover:  '/projects/aurora/cover.jpg'          → imagen de la tarjeta 3D
 *   images: ['/projects/aurora/1.jpg', '…']        → imágenes de la página del proyecto
 * (los archivos van en la carpeta /public).
 *
 * art: 'hero' | 'catalog' | 'editorial'  → estilo de la imagen generada.
 */
export const projects = [
  {
    slug: 'aurora-studio',
    name: 'Aurora Studio',
    desc: 'Rediseño completo de la tienda Shopify y embudo de Meta Ads con email automatizado para una marca de moda sostenible.',
    category: 'Moda · Shopify',
    year: '2025',
    services: ['Performance & Ads', 'Web Development & Ecommerce', 'AI Automations'],
    result: { value: '+312%', label: 'ventas online en 6 meses' },
    palette: { bg: '#e9c6cf', fg: '#2a1620', accent: '#b3405e' },
    art: 'editorial',
  },
  {
    slug: 'nordika',
    name: 'Nórdika',
    desc: 'Tienda de mobiliario escandinavo: arquitectura de catálogo, fichas de producto y checkout optimizados para conversión.',
    category: 'Hogar · Shopify',
    year: '2025',
    services: ['Web Development & Ecommerce', 'Data Tracking', 'Reporting'],
    result: { value: '+84%', label: 'tasa de conversión' },
    palette: { bg: '#d9d3c7', fg: '#1d1b17', accent: '#7a6a4f' },
    art: 'catalog',
  },
  {
    slug: 'flowly',
    name: 'Flowly',
    desc: 'Medición de punta a punta y campañas de captación de demos para un SaaS B2B, con atribución real por canal.',
    category: 'SaaS · B2B',
    year: '2024',
    services: ['Data Analytics', 'Data Tracking', 'Performance & Ads'],
    result: { value: '-48%', label: 'coste por lead' },
    palette: { bg: '#0f2a1d', fg: '#e9ffd5', accent: '#abe155' },
    art: 'hero',
  },
  {
    slug: 'casa-brasa',
    name: 'Casa Brasa',
    desc: 'Restaurante con delivery propio: pedidos online, campañas locales y automatización de reservas y reactivación de clientes.',
    category: 'Restauración',
    year: '2024',
    services: ['Performance & Ads', 'AI Automations'],
    result: { value: '3,1M', label: 'visualizaciones orgánicas' },
    palette: { bg: '#2a0f0a', fg: '#ffe9d6', accent: '#ff7a3d' },
    art: 'hero',
  },
  {
    slug: 'vertice-fit',
    name: 'Vértice Fit',
    desc: 'Ecommerce de suplementación deportiva con suscripciones, dashboards de rentabilidad y flujos automáticos de recompra.',
    category: 'Salud · Ecommerce',
    year: '2025',
    services: ['Reporting', 'AI Automations', 'Web Development & Ecommerce'],
    result: { value: '4,8x', label: 'ROAS medio' },
    palette: { bg: '#0b1c44', fg: '#e6efff', accent: '#386fde' },
    art: 'catalog',
  },
  {
    slug: 'lumen-joyas',
    name: 'Lumen Joyas',
    desc: 'Joyería de autor: tienda con narrativa visual, catálogo de colecciones y campañas de remarketing dinámico.',
    category: 'Joyería · Shopify',
    year: '2024',
    services: ['Web Development & Ecommerce', 'Performance & Ads'],
    result: { value: '+156%', label: 'ticket medio' },
    palette: { bg: '#15110a', fg: '#f3e6c4', accent: '#d9b25f' },
    art: 'editorial',
  },
  {
    slug: 'terra-cafe',
    name: 'Terra Café',
    desc: 'Café de especialidad directo al consumidor: tienda de suscripción, medición de cohortes y campañas de adquisición.',
    category: 'Café · DTC',
    year: '2025',
    services: ['Data Analytics', 'Performance & Ads', 'Reporting'],
    result: { value: '92%', label: 'retención a 6 meses' },
    palette: { bg: '#1b2418', fg: '#eef3df', accent: '#9ccf5a' },
    art: 'catalog',
  },
  {
    slug: 'kodo-tech',
    name: 'Kodo Tech',
    desc: 'Retail de electrónica: feeds de producto, campañas de Google Ads y Meta y un panel único de resultados en tiempo real.',
    category: 'Electrónica · Ecommerce',
    year: '2024',
    services: ['Performance & Ads', 'Data Tracking', 'Reporting'],
    result: { value: '+2,3x', label: 'ingresos por canal de pago' },
    palette: { bg: '#120d2e', fg: '#ece6ff', accent: '#7b6cff' },
    art: 'hero',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
