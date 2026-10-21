import rss from '@astrojs/rss';
import { getPosts } from '../../data/posts.js';
import { getCategory } from '../../data/blog.js';
import { site } from '../../data/site.js';

export async function GET() {
  const posts = await getPosts();
  return rss({
    title: 'Blog de GrowLab',
    description: 'Marketing digital, datos y crecimiento: paid media, SEO, tracking, ecommerce e IA.',
    site: site.url,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/blog/${p.id}`, categories: [getCategory(p.data.category)?.name].filter(Boolean) })),
    customData: '<language>es-pe</language>',
    trailingSlash: false,
  });
}
