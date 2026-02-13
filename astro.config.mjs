import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://moroccoartguide.com',
  build: {
    format: 'directory'
  }
});
