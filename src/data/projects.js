/**
 * Proyectos del portafolio.
 *
 * Sólo proyectos reales. Los de ejemplo (marcas ficticias) se retiraron a ejemplos/proyectos-de-ejemplo.js.
 *
 * Imágenes en /public/projects/<slug>/: cover.jpg → portada del panel 3D;  1.jpg … 6.jpg → capturas de la ficha del proyecto.
 * Si faltan, se dibuja una imagen por código a partir de `palette` y `art` (ver scripts/projectArt.js).
 *
 * art: 'hero' | 'catalog' | 'editorial'  → estilo de la imagen generada.
 *
 * Vídeo: en `images` también se puede poner un .mp4 (grabación de la web con sus animaciones); se reproduce solo, en bucle y sin sonido.
 * Portada animada: `coverVideo` (.mp4) sustituye a `cover` en el panel 3D en cuanto puede reproducirse; `cover` queda como imagen inicial.
 * Opcionales: `url` (enlace «Ver sitio» al proyecto publicado) y `result` (si no hay una cifra real, se omite y no se muestra).
 */
export const projects = [
  {
    // PROYECTO REAL. La portada animada y las capturas están tomadas de la web publicada (relengcorp.com).
    slug: 'relengcorp',
    cover: '/projects/relengcorp/cover.jpg',
    coverVideo: '/projects/relengcorp/hero.mp4',      // portada animada del panel 3D: un ciclo completo del hero (sin sonido, en bucle)
    // capturas: hero · soluciones · cifras · página de servicio · nosotros · portafolio
    images: [1, 2, 3, 4, 5, 6].map((n) => `/projects/relengcorp/${n}.jpg`),
    name: 'Relengcorp',
    // título y descripción para Google (máx. ~60 y ~160 caracteres)
    seo: { title: 'Relengcorp: web de ingeniería industrial | Portafolio GrowLab', description: 'Sitio corporativo para Relengcorp, empresa de ingeniería en operaciones críticas: diseño UX/UI, desarrollo web, animaciones y medición de conversiones.' },
    desc: 'Sitio corporativo para una empresa de ingeniería especializada en operaciones críticas: siete soluciones estratégicas, portafolio de proyectos, clientes y blog, con animaciones que acompañan el scroll.',
    category: 'Ingeniería industrial · Web corporativa',
    year: '2025',
    url: 'https://www.relengcorp.com/',
    services: ['UX/UI Design', 'Web Development & Ecommerce', 'Tracking & Attribution'],
    palette: { bg: '#141b2d', fg: '#ffffff', accent: '#00a8e8' },
    art: 'hero',
  },
  {
    // PROYECTO REAL. Portada animada y capturas tomadas de la tienda publicada (alpaca111.com).
    slug: 'alpaca-111',
    cover: '/projects/alpaca-111/cover.jpg',
    coverVideo: '/projects/alpaca-111/hero.mp4',
    // capturas: hero · campaña de temporada · productos destacados · hombre y mujer · colección · ficha de producto
    images: [1, 2, 3, 4, 5, 6].map((n) => `/projects/alpaca-111/${n}.jpg`),
    name: 'Alpaca 111',
    // título y descripción para Google (máx. ~60 y ~160 caracteres)
    seo: { title: 'Alpaca 111: ecommerce de moda en alpaca | Portafolio GrowLab', description: 'Ecommerce de moda sostenible en fibra de alpaca para Alpaca 111: diseño UX/UI, colecciones, fichas de producto y compra en línea.' },
    desc: 'Tienda online de moda sostenible en fibra de alpaca para mujer, hombre y hogar: campañas de temporada, colecciones, fichas de producto y compra en línea.',
    category: 'Moda · Ecommerce',
    year: '2024',
    url: 'https://alpaca111.com/',
    services: ['UX/UI Design', 'Web Development & Ecommerce'],
    palette: { bg: '#efefef', fg: '#111111', accent: '#5d6b2f' },
    art: 'catalog',
  },
  {
    // PROYECTO REAL. Portada animada y capturas tomadas de la web publicada (pacomarca.com).
    slug: 'pacomarca',
    cover: '/projects/pacomarca/cover.jpg',
    coverVideo: '/projects/pacomarca/hero.mp4',
    // capturas: hero · cifras de impacto · fibras · programas · página de fibras · El Quintal del Inca
    images: [1, 2, 3, 4, 5, 6].map((n) => `/projects/pacomarca/${n}.jpg`),
    name: 'Pacomarca',
    // título y descripción para Google (máx. ~60 y ~160 caracteres)
    seo: { title: 'Pacomarca: web institucional bilingüe | Portafolio GrowLab', description: 'Sitio institucional en español e inglés para Pacomarca, ecosistema de alpaca sostenible del Grupo Inca: diseño UX/UI, desarrollo y medición.' },
    desc: 'Sitio institucional del ecosistema de alpaca sostenible impulsado por el Grupo Inca: investigación científica, fibras, programas sociales y blog, en español e inglés.',
    category: 'Sostenibilidad · Web institucional',
    year: '2026',
    url: 'https://pacomarca.com/',
    services: ['UX/UI Design', 'Web Development & Ecommerce', 'Tracking & Attribution'],
    palette: { bg: '#1c211b', fg: '#ffffff', accent: '#b9c48a' },
    art: 'hero',
  },
  {
    // PROYECTO REAL. Sólo diseño UX/UI. La portada es el home (imagen fija: su hero no tiene animación); el resto, páginas interiores.
    slug: 'kuna',
    cover: '/projects/kuna/cover.jpg',
    // capturas: home · Vikuna · Fall Winter 26 · colección · ficha de producto · home (Sassa de Osma). Las dos últimas las envió el cliente.
    images: [1, 2, 3, 4, 5, 6].map((n) => `/projects/kuna/${n}.jpg`),
    name: 'Kuna',
    // título y descripción para Google (máx. ~60 y ~160 caracteres)
    seo: { title: 'Kuna: diseño UX/UI de ecommerce de lujo | Portafolio GrowLab', description: 'Diseño UX/UI de la tienda online de KUNA, marca peruana de prendas de alpaca y vicuña: páginas de colección, campaña, catálogo y ficha de producto.' },
    desc: 'Diseño UX/UI de la tienda online de KUNA, marca peruana de prendas de alpaca y vicuña: páginas de colección y de campaña, catálogo y ficha de producto. Las adaptaciones del home fueron realizadas por otra agencia.',
    category: 'Moda de lujo · Ecommerce',
    year: '2025',
    url: 'https://pe.kunastores.com/',
    services: ['UX/UI Design'],
    palette: { bg: '#1a1a1a', fg: '#ffffff', accent: '#8a4b2a' },
    art: 'editorial',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
