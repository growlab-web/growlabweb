// Colecciones de contenido. El blog vive en src/content/blog (español) y src/content/blog-en (inglés): un archivo Markdown por artículo
// (se edita desde Pages CMS, ver .pages.yml).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogCategories } from './data/blog.js';

const fields = {
    title: z.string(),
    description: z.string().max(170),                         // resumen: tarjetas, buscadores y redes (≤ 160 caracteres ideal)
    date: z.coerce.date(),                                     // fecha de publicación
    updated: z.coerce.date().optional(),                       // última actualización relevante
    category: z.enum(blogCategories.map((c) => c.slug) as [string, ...string[]]),
    cover: z.string().optional(),                              // /images/blog/…
    coverAlt: z.string().optional(),
    author: z.string().default('GrowLab'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),                         // borrador: no se publica
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object(fields),
});

// Blog en inglés (/en/blog): mismos campos y, además, el artículo en español del que es traducción (para el botón ES | EN)
const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-en' }),
  schema: z.object({ ...fields, translationOf: z.string() }),
});

export const collections = { blog, blogEn };
