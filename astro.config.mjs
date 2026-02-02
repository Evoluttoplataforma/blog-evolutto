import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.evolutto.com.br',
  integrations: [
    react(),
    // sitemap temporarily disabled
    // sitemap({
    //   filter: (page) => !page.includes('/admin/'),
    // }),
  ],
  output: 'static',
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  markdown: {
    // Handle images in markdown
    remarkRehype: {
      allowDangerousHtml: true,
    },
  },
  vite: {
    build: {
      rollupOptions: {
        external: [/^images\//],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            motion: ['framer-motion'],
          },
        },
      },
    },
    assetsInclude: ['**/*.webp', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif'],
  },
});
