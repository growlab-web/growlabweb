// Artículos publicados del blog (sin borradores), del más reciente al más antiguo. En inglés salen de la colección blogEn.
import { getCollection } from 'astro:content';

export async function getPosts(lang = 'es') {
  const posts = await getCollection(lang === 'en' ? 'blogEn' : 'blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Dirección del mismo artículo en el otro idioma (o la portada del blog de ese idioma si no está traducido). */
export async function postCounterpart(post, lang) {
  if (lang === 'en') return `/blog/${post.data.translationOf}`;
  const en = (await getPosts('en')).find((p) => p.data.translationOf === post.id);
  return en ? `/en/blog/${en.id}` : '/en/blog';
}
