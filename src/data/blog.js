// Categorías del blog: cada una se apoya en un servicio (el artículo enlaza a él y al contacto).
export const blogCategories = [
  { slug: 'paid-media', name: 'Paid Media', description: 'Meta Ads, Google Ads y TikTok Ads: estrategia, presupuesto y optimización de campañas.', service: 'paid-media' },
  { slug: 'seo', name: 'SEO', description: 'Posicionamiento en Google y en buscadores con IA: técnico, contenido y autoridad.', service: 'seo' },
  { slug: 'tracking-analitica', name: 'Tracking y analítica', description: 'GA4, Tag Manager, píxeles, API de conversiones y atribución para medir cada venta.', service: 'tracking-attribution' },
  { slug: 'ecommerce-web', name: 'Ecommerce y web', description: 'Tiendas online, Shopify, experiencia de usuario y conversión.', service: 'web-development' },
  { slug: 'ia-automatizacion', name: 'IA y automatización', description: 'Inteligencia artificial y flujos automáticos aplicados al marketing y las ventas.', service: 'ai-automation' },
  { slug: 'email-marketing', name: 'Email marketing', description: 'Newsletters, automatizaciones y fidelización de clientes por correo.', service: 'email-marketing' },
];

export const getCategory = (slug) => blogCategories.find((c) => c.slug === slug);

// Minutos de lectura aproximados (≈ 220 palabras por minuto)
export const readingTime = (text = '') => Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));

export const formatDate = (d) => new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
