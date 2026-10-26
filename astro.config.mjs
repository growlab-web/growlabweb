// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://growlab.pe',
  trailingSlash: 'never',        // las direcciones van sin barra final (/nosotros); public/.htaccess hace lo mismo en el servidor
  // la antigua página /servicios ahora es una sección del inicio
  redirects: { '/servicios': '/#servicios' },
  // el CSS va dentro de cada página (pesa ~15 KB, ~4 KB comprimido): sin esa petición aparte el texto se pinta antes, sobre todo en celulares
  build: { inlineStylesheets: 'always' },
  // idiomas: español sin prefijo (/nosotros) e inglés con prefijo y direcciones propias (/en/about); ver src/i18n.js
  i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false } },
  integrations: [sitemap({ filter: (page) => !/\/servicios\/?$/.test(page) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
