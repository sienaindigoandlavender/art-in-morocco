import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://moroccoartguide.com',
  build: {
    format: 'directory'
  }
});
