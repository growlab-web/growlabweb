/**
 * Servicios de GrowLab (se muestran en la sección «Servicios» del inicio y en la línea que se va escribiendo bajo el titular).
 * Los nombres van en inglés porque así los conoce el mercado.
 *
 * icon → nombre del icono (ver components/Icon.astro).  art → dibujo de la tarjeta, uno distinto por servicio (bars, search, chips, shapes, dots, mail, rings, path, dash).
 * ⚠ Las descripciones (`short`) son borradores: revísalas y ajústalas a cómo describe GrowLab cada servicio.
 */
export const services = [
  {
    slug: 'paid-media',
    n: '01',
    name: 'Paid Media & Traffic Generation',
    icon: 'target',
    art: 'bars',
    short: 'Campañas en Meta, Google y TikTok que atraen tráfico cualificado y lo convierten en ventas.',
    shortEn: 'Meta, Google and TikTok campaigns that attract qualified traffic and turn it into sales.',
  },
  {
    slug: 'seo',
    n: '02',
    name: 'SEO',
    icon: 'search',
    art: 'search',
    short: 'Posicionamiento orgánico en Google y en buscadores con IA: SEO técnico, contenido y autoridad para atraer tráfico que no depende de la pauta.',
    shortEn: 'Organic rankings on Google and AI search engines: technical SEO, content and authority to bring traffic that does not depend on ad spend.',
  },
  {
    slug: 'web-development',
    n: '03',
    name: 'Web Development & Ecommerce',
    icon: 'app-window',
    art: 'chips',
    short: 'Webs y tiendas online (Shopify y a medida) rápidas, medibles y listas para escalar con tus campañas.',
    shortEn: 'Fast, measurable websites and online stores (Shopify and custom) ready to scale with your campaigns.',
  },
  {
    slug: 'ux-ui-design',
    n: '04',
    name: 'UX/UI Design',
    icon: 'palette',
    art: 'shapes',
    short: 'Interfaces claras y atractivas, diseñadas para que el usuario avance hasta comprar.',
    shortEn: 'Clear, attractive interfaces designed to guide users all the way to purchase.',
  },
  {
    slug: 'ai-automation',
    n: '05',
    name: 'AI Automation',
    icon: 'bot',
    art: 'dots',
    short: 'Flujos con IA que atienden, califican leads y recuperan ventas sin intervención manual.',
    shortEn: 'AI workflows that answer, qualify leads and recover sales with no manual work.',
  },
  {
    slug: 'email-marketing',
    n: '06',
    name: 'Email Marketing',
    icon: 'mail',
    art: 'mail',
    short: 'Newsletters y flujos automáticos que nutren, fidelizan y reactivan a tus clientes con el mensaje justo en cada etapa.',
    shortEn: 'Newsletters and automated flows that nurture, retain and re-engage your customers with the right message at every stage.',
  },
  {
    slug: 'data-analytics',
    n: '07',
    name: 'Data Analytics',
    icon: 'chart-column',
    art: 'rings',
    short: 'Convertimos tus datos en decisiones: audiencias, embudos y rentabilidad por canal.',
    shortEn: 'We turn your data into decisions: audiences, funnels and profitability by channel.',
  },
  {
    slug: 'tracking-attribution',
    n: '08',
    name: 'Tracking & Attribution',
    icon: 'radar',
    art: 'path',
    short: 'Medición fiable con GA4, píxeles y API de conversiones para saber qué canal genera cada venta.',
    shortEn: 'Reliable measurement with GA4, pixels and the Conversions API to know which channel drives every sale.',
  },
  {
    slug: 'reporting-dashboards',
    n: '09',
    name: 'Reporting & Dashboards',
    icon: 'layout-dashboard',
    art: 'dash',
    short: 'Dashboards en Looker Studio y reportes claros, con las métricas que importan a tu negocio.',
    shortEn: 'Looker Studio dashboards and clear reports with the metrics that matter to your business.',
  },
];

/** Servicios en el idioma de la página (los nombres ya van en inglés; cambia la descripción). */
export const servicesFor = (lang) => (lang === 'en' ? services.map((x) => ({ ...x, short: x.shortEn || x.short })) : services);
