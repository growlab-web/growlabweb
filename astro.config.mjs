// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // la antigua página /servicios ahora es una sección del inicio
  redirects: { '/servicios': '/#servicios' },
  vite: {
    plugins: [tailwindcss()],
  },
});
