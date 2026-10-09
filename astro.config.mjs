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
  integrations: [sitemap({ filter: (page) => !/\/servicios\/?$/.test(page) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
