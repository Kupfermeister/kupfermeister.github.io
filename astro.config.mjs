import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Adresse der Seite. Für kupfermeister.github.io/JF stattdessen: base: '/JF'
export default defineConfig({
  site: 'https://kupfermeister.github.io',
  base: '/',
  trailingSlash: 'always',
  integrations: [mdx()],
});
