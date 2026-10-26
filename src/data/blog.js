// Categorías del blog: cada una se apoya en un servicio (el artículo enlaza a él y al contacto) y tiene su color
// (filtros, etiqueta de las tarjetas y cabecera al filtrar). Colores claros: se leen sobre el fondo oscuro y, de fondo, con texto negro.
export const blogCategories = [
  { slug: 'paid-media', slugEn: 'paid-media', nameEn: 'Paid Media', descriptionEn: 'Meta Ads, Google Ads and TikTok Ads: strategy, budget and campaign optimization.', color: '#ff9f7a', name: 'Paid Media', description: 'Meta Ads, Google Ads y TikTok Ads: estrategia, presupuesto y optimización de campañas.', service: 'paid-media' },
  { slug: 'seo', slugEn: 'seo', nameEn: 'SEO', descriptionEn: 'Rankings on Google and AI search engines: technical SEO, content and authority.', color: '#ffd27a', name: 'SEO', description: 'Posicionamiento en Google y en buscadores con IA: técnico, contenido y autoridad.', service: 'seo' },
  { slug: 'tracking-analitica', slugEn: 'tracking-analytics', nameEn: 'Tracking & analytics', descriptionEn: 'GA4, Tag Manager, pixels, Conversions API and attribution to measure every sale.', color: '#7fa8ff', name: 'Tracking y analítica', description: 'GA4, Tag Manager, píxeles, API de conversiones y atribución para medir cada venta.', service: 'tracking-attribution' },
  { slug: 'ecommerce-web', slugEn: 'ecommerce-web', nameEn: 'Ecommerce & web', descriptionEn: 'Online stores, Shopify, user experience and conversion.', color: '#ff8fd0', name: 'Ecommerce y web', description: 'Tiendas online, Shopify, experiencia de usuario y conversión.', service: 'web-development' },
  { slug: 'ia-automatizacion', slugEn: 'ai-automation', nameEn: 'AI & automation', descriptionEn: 'Artificial intelligence and automated workflows applied to marketing and sales.', color: '#b69cff', name: 'IA y automatización', description: 'Inteligencia artificial y flujos automáticos aplicados al marketing y las ventas.', service: 'ai-automation' },
  { slug: 'email-marketing', slugEn: 'email-marketing', nameEn: 'Email marketing', descriptionEn: 'Newsletters, automations and customer retention by email.', color: '#6fe3f2', name: 'Email marketing', description: 'Newsletters, automatizaciones y fidelización de clientes por correo.', service: 'email-marketing' },
];

export const getCategory = (slug) => blogCategories.find((c) => c.slug === slug);
/** Categorías en el idioma de la página (en inglés: nombre y descripción del campo `nameEn` / `descriptionEn`). */
export const categoriesFor = (lang) => (lang === 'en' ? blogCategories.map((c) => ({ ...c, name: c.nameEn, description: c.descriptionEn })) : blogCategories);
export const getCategoryFor = (slug, lang) => categoriesFor(lang).find((c) => c.slug === slug);
// dirección de cada categoría: en inglés lleva su propio nombre (/en/blog/category/tracking-analytics)
export const catSlugEn = (slug) => blogCategories.find((c) => c.slug === slug)?.slugEn || slug;
export const catSlugEs = (slugEn) => blogCategories.find((c) => c.slugEn === slugEn)?.slug || slugEn;

// Minutos de lectura aproximados (≈ 220 palabras por minuto)
export const readingTime = (text = '') => Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));

export const formatDate = (d, lang = 'es') => new Date(d).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
