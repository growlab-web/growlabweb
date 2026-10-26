// RSS del blog en cada idioma: /blog/rss.xml y /en/blog/rss.xml
import rss from '@astrojs/rss';
import { getPosts } from './posts.js';
import { getCategoryFor } from './blog.js';
import { site } from './site.js';

export async function blogRss(lang) {
  const en = lang === 'en';
  const posts = await getPosts(lang);
  return rss({
    title: en ? 'GrowLab Blog' : 'Blog de GrowLab',
    description: en ? 'Digital marketing, data and growth: paid media, SEO, tracking, ecommerce and AI.' : 'Marketing digital, datos y crecimiento: paid media, SEO, tracking, ecommerce e IA.',
    site: site.url,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `${en ? '/en' : ''}/blog/${p.id}`, categories: [getCategoryFor(p.data.category, lang)?.name].filter(Boolean) })),
    customData: en ? '<language>en</language>' : '<language>es-pe</language>',
    trailingSlash: false,
  });
}
