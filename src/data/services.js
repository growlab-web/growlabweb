/**
 * Servicios de GrowLab. Cada uno tiene su subpágina en /servicios/<slug>.
 *
 * ⚠ PENDIENTE: los textos de abajo (tagline, intro, long, includes, benefits) son BORRADORES.
 *   Hay que reemplazarlos con la información oficial de https://growlab.pe/servicios/
 *   (esa web tiene una verificación anti-robots y no se pudo leer automáticamente).
 *
 * shape → estructura 3D de la cabecera (ver scripts/shapes.js).
 */
export const services = [
  {
    slug: 'performance-ads',
    n: '01',
    name: 'Performance & Ads',
    shape: 'performance',
    icon: 'target',
    art: 'bars',
    short: 'Campañas en Meta, Google y TikTok optimizadas para maximizar tu ROAS.',
    tagline: ['Tráfico que se', 'convierte en clientes.'],
    intro: 'Diseñamos, lanzamos y optimizamos campañas de pago con un único objetivo: que cada sol invertido vuelva multiplicado.',
    long: 'Construimos el embudo completo: desde la audiencia correcta y la creatividad que detiene el scroll, hasta la landing que convierte y la medición que demuestra el retorno. Probamos, medimos y escalamos solo lo que funciona.',
    includes: [
      { i: 'funnel', t: 'Estrategia por embudo', d: 'Definimos objetivos, audiencias y presupuesto para cada etapa: descubrimiento, consideración y conversión.' },
      { i: 'palette', t: 'Creatividades que convierten', d: 'Anuncios y piezas en formato estático y vídeo, probados con variantes para encontrar el mensaje ganador.' },
      { i: 'megaphone', t: 'Gestión en Meta, Google y TikTok', d: 'Campañas de búsqueda, display, social y remarketing gestionadas en un mismo tablero.' },
      { i: 'trending-up', t: 'Optimización y escalado', d: 'Ajustes semanales de pujas, audiencias y presupuesto para bajar el costo por adquisición y subir el ROAS.' },
    ],
    benefits: ['Más ventas con el mismo presupuesto', 'Costo por adquisición bajo control', 'Decisiones basadas en datos, no en intuición'],
  },
  {
    slug: 'data-analytics',
    n: '02',
    name: 'Data Analytics',
    shape: 'analytics',
    icon: 'chart-column',
    art: 'rings',
    short: 'Convertimos tus datos en decisiones: audiencias, embudos y rentabilidad.',
    tagline: ['Tus datos,', 'convertidos en decisiones.'],
    intro: 'Analizamos el comportamiento de tus clientes y la rentabilidad de cada canal para que sepas dónde invertir y dónde parar.',
    long: 'Unimos las fuentes de datos de tu negocio y las convertimos en respuestas: qué canales traen clientes rentables, dónde se pierde la gente en el embudo y qué segmentos merecen más inversión.',
    includes: [
      { i: 'search', t: 'Auditoría de datos', d: 'Revisamos qué datos tienes, su calidad y qué falta para medir bien el negocio.' },
      { i: 'chart-pie', t: 'Análisis de audiencias y embudos', d: 'Segmentamos clientes, medimos conversiones por etapa e identificamos fugas.' },
      { i: 'coins', t: 'Rentabilidad por canal', d: 'Calculamos CAC, LTV y retorno real de cada canal de captación.' },
      { i: 'lightbulb', t: 'Recomendaciones accionables', d: 'Cada análisis termina en decisiones concretas, con prioridad e impacto estimado.' },
    ],
    benefits: ['Claridad sobre qué funciona', 'Inversión dirigida a lo rentable', 'Menos desperdicio de presupuesto'],
  },
  {
    slug: 'data-tracking',
    n: '03',
    name: 'Data Tracking',
    shape: 'tracking',
    icon: 'radar',
    art: 'dots',
    short: 'Medición fiable con píxeles, GA4 y API de conversiones para que cada clic cuente.',
    tagline: ['Cada clic cuenta,', 'cada dato viaja.'],
    intro: 'Implementamos una medición precisa y verificable para que los datos que alimentan tus decisiones sean confiables.',
    long: 'Configuramos el seguimiento de principio a fin: eventos, conversiones y atribución entre tu web, tus anuncios y tu CRM. Así cada venta se vincula con el canal que la generó.',
    includes: [
      { i: 'tag', t: 'GA4 y Google Tag Manager', d: 'Plan de medición, eventos y conversiones configurados y documentados.' },
      { i: 'plug', t: 'Píxeles y API de conversiones', d: 'Meta, Google y TikTok conectados también del lado del servidor, para no perder señal.' },
      { i: 'link', t: 'Atribución y UTMs', d: 'Convenciones claras para saber de dónde viene cada lead y cada venta.' },
      { i: 'shield-check', t: 'Verificación continua', d: 'Auditorías periódicas para asegurar que la medición sigue funcionando.' },
    ],
    benefits: ['Datos confiables', 'Atribución correcta de las ventas', 'Mejor rendimiento de las campañas'],
  },
  {
    slug: 'reporting',
    n: '04',
    name: 'Reporting',
    shape: 'reporting',
    icon: 'layout-dashboard',
    art: 'bars-rev',
    short: 'Dashboards y reportes claros, en tiempo real, con las métricas que importan.',
    tagline: ['Resultados claros,', 'siempre a la vista.'],
    intro: 'Dashboards y reportes que muestran lo importante, sin ruido, para que tomes decisiones rápido y con confianza.',
    long: 'Centralizamos tus métricas en un panel vivo y lo acompañamos con reportes periódicos que explican qué pasó, por qué pasó y qué haremos a continuación.',
    includes: [
      { i: 'layout-dashboard', t: 'Dashboards en tiempo real', d: 'Un panel único con marketing, ventas y finanzas, siempre actualizado.' },
      { i: 'file-text', t: 'Reportes periódicos', d: 'Resúmenes semanales y mensuales con lectura clara de resultados.' },
      { i: 'crosshair', t: 'KPIs a medida', d: 'Definimos contigo las métricas que de verdad mueven tu negocio.' },
      { i: 'users', t: 'Reuniones de resultados', d: 'Revisamos juntos el desempeño y acordamos los siguientes pasos.' },
    ],
    benefits: ['Visibilidad total', 'Decisiones más rápidas', 'Transparencia con tu equipo y socios'],
  },
  {
    slug: 'web-development-ecommerce',
    n: '05',
    name: 'Web Development & Ecommerce',
    shape: 'web',
    icon: 'app-window',
    art: 'shapes',
    short: 'Webs y tiendas rápidas, pensadas para convertir y listas para escalar.',
    tagline: ['Webs y tiendas que', 'venden por ti.'],
    intro: 'Desarrollamos sitios y tiendas online rápidos, medibles y optimizados para convertir visitas en clientes.',
    long: 'Diseño y desarrollo pensados desde la conversión: arquitectura clara, velocidad, SEO técnico y medición integrada desde el primer día, listos para crecer con tus campañas.',
    includes: [
      { i: 'pen-tool', t: 'Diseño y desarrollo a medida', d: 'Interfaces claras y rápidas, adaptadas a tu marca y a tu público.' },
      { i: 'shopping-cart', t: 'Ecommerce', d: 'Tiendas con catálogo, pasarelas de pago y logística integradas.' },
      { i: 'flask-conical', t: 'Optimización de conversión (CRO)', d: 'Pruebas A/B y mejoras continuas sobre el recorrido de compra.' },
      { i: 'gauge', t: 'SEO técnico y rendimiento', d: 'Velocidad, estructura y buenas prácticas para posicionar mejor.' },
    ],
    benefits: ['Más conversiones por visita', 'Carga rápida en cualquier dispositivo', 'Base sólida para escalar'],
  },
  {
    slug: 'ai-automations',
    n: '06',
    name: 'AI Automations',
    shape: 'ai',
    icon: 'bot',
    art: 'chips',
    short: 'Flujos con IA que atienden, califican leads y recuperan ventas sin intervención manual.',
    tagline: ['Procesos que', 'trabajan solos.'],
    intro: 'Automatizamos tareas repetitivas con inteligencia artificial para que tu equipo se dedique a lo que realmente aporta valor.',
    long: 'Diseñamos flujos que atienden consultas, califican leads, actualizan tu CRM y recuperan oportunidades en segundo plano, conectando tus herramientas con modelos de IA.',
    includes: [
      { i: 'message-circle', t: 'Atención y calificación de leads', d: 'Asistentes que responden, filtran y derivan consultas a tu equipo en el momento adecuado.' },
      { i: 'database', t: 'Integración con tu CRM', d: 'Datos y tareas sincronizados entre formularios, anuncios, CRM y correo.' },
      { i: 'rotate-ccw', t: 'Recuperación de ventas', d: 'Secuencias automáticas para carritos abandonados y oportunidades frías.' },
      { i: 'workflow', t: 'Flujos a medida', d: 'Automatizaciones diseñadas para tus procesos, con supervisión y mejora continua.' },
    ],
    benefits: ['Menos trabajo manual', 'Respuesta inmediata a tus clientes', 'Más oportunidades aprovechadas'],
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);
