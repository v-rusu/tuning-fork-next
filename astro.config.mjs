import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tuningfork.co',
  output: 'static',
  integrations: [react(), tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
