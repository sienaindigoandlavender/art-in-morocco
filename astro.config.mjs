import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    runtime: 'nodejs20.x',
  }),
  site: 'https://moroccoartguide.com',
  build: {
    format: 'directory'
  }
});
