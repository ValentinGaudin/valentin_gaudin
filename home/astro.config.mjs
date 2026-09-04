import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://valentingaudin.com',
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
});
