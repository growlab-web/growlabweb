/**
 * Idiomas del sitio: español (por defecto, sin prefijo: /nosotros) e inglés (con prefijo y direcciones propias: /en/about).
 *
 *   const { lang, en, t, href } = useLang(Astro);
 *   t('Texto en español', 'Text in English')   → el del idioma de la página
 *   href('/nosotros')                          → '/nosotros' o '/en/about' según el idioma (acepta #anclas)
 *
 * Para añadir una página: súmala a PAGES (y, si tiene subpáginas, a PREFIXES) y crea su versión en src/pages/en/.
 */
import { catSlugEn, catSlugEs } from './data/blog.js';

export const LOCALES = ['es', 'en'];

// páginas: dirección en español → dirección en inglés
const PAGES = {
  '/': '/en',
  '/nosotros': '/en/about',
  '/portafolio': '/en/portfolio',
  '/contacto': '/en/contact',
  '/diagnostico': '/en/free-audit',
  '/privacidad': '/en/privacy',
  '/blog': '/en/blog',
};
// subpáginas: el resto de la dirección se conserva (los artículos del blog tienen su propia dirección en inglés, ver blogPath)
const PREFIXES = [
  ['/portafolio/', '/en/portfolio/'],
  ['/blog/categoria/', '/en/blog/category/'],
];

const split = (p) => { const i = p.indexOf('#'); return i < 0 ? [p, ''] : [p.slice(0, i), p.slice(i)]; };
const clean = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

/** Dirección en inglés de una dirección en español (si no hay equivalente, el inicio en inglés). */
export function toEn(esPath) {
  const [p, hash] = split(esPath);
  const path = clean(p || '/');
  if (path === '/en' || path.startsWith('/en/')) return path + hash;
  if (PAGES[path]) return PAGES[path] + hash;
  for (const [es, en] of PREFIXES) if (path.startsWith(es)) return en + (es === '/blog/categoria/' ? catSlugEn(path.slice(es.length)) : path.slice(es.length)) + hash;
  return '/en' + hash;
}

/** Dirección en español de una dirección en inglés. */
export function toEs(enPath) {
  const [p, hash] = split(enPath);
  const path = clean(p || '/');
  if (!(path === '/en' || path.startsWith('/en/'))) return path + hash;
  for (const [es, en] of Object.entries(PAGES)) if (en === path) return es + hash;
  for (const [es, en] of PREFIXES) if (path.startsWith(en)) return es + (es === '/blog/categoria/' ? catSlugEs(path.slice(en.length)) : path.slice(en.length)) + hash;
  return '/' + hash;
}

export const langOf = (Astro) => (Astro.currentLocale === 'en' ? 'en' : 'es');

export function useLang(Astro) {
  const lang = langOf(Astro);
  const en = lang === 'en';
  return {
    lang,
    en,
    t: (es, english) => (en ? english : es),
    href: (esPath) => (en ? toEn(esPath) : esPath),
  };
}
