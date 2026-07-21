import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://devstudiocraft.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
