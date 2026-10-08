/**
 * Servicios de GrowLab (se muestran en la sección «Servicios» del inicio y en la línea que se va escribiendo bajo el titular).
 * Los nombres van en inglés porque así los conoce el mercado.
 *
 * icon → nombre del icono (ver components/Icon.astro).  art → dibujo de la tarjeta (bars, bars-rev, rings, dots, shapes, chips).
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
  },
  {
    slug: 'web-development',
    n: '02',
    name: 'Web Development',
    icon: 'app-window',
    art: 'chips',
    short: 'Webs y tiendas rápidas, medibles y listas para escalar con tus campañas.',
  },
  {
    slug: 'ux-ui-design',
    n: '03',
    name: 'UX/UI Design',
    icon: 'palette',
    art: 'shapes',
    short: 'Interfaces claras y atractivas, diseñadas para que el usuario avance hasta comprar.',
  },
  {
    slug: 'ai-automation',
    n: '04',
    name: 'AI Automation',
    icon: 'bot',
    art: 'dots',
    short: 'Flujos con IA que atienden, califican leads y recuperan ventas sin intervención manual.',
  },
  {
    slug: 'data-analytics',
    n: '05',
    name: 'Data Analytics',
    icon: 'chart-column',
    art: 'rings',
    short: 'Convertimos tus datos en decisiones: audiencias, embudos y rentabilidad por canal.',
  },
  {
    slug: 'tracking-attribution',
    n: '06',
    name: 'Tracking & Attribution',
    icon: 'radar',
    art: 'bars-rev',
    short: 'Medición fiable con GA4, píxeles y API de conversiones para saber qué canal genera cada venta.',
  },
  {
    slug: 'reporting-dashboards',
    n: '07',
    name: 'Reporting & Dashboards',
    icon: 'layout-dashboard',
    art: 'bars',
    short: 'Dashboards en Looker Studio y reportes claros, con las métricas que importan a tu negocio.',
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);
