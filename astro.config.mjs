// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gerrymoeis.pages.dev',
  output: 'static',
  
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  
  image: {
    domains: [],
    remotePatterns: [],
  },
  
  build: {
    inlineStylesheets: 'auto',
  },
  
  vite: {
    test: {
      globals: true,
      environment: 'node',
    },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('/scripts/mouseBackground')) {
              return 'mouse-background';
            }
            if (id.includes('/scripts/parallax')) {
              return 'parallax';
            }
            if (id.includes('/scripts/viewCounter') || id.includes('ViewCounterClient')) {
              return 'view-counter';
            }
          },
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entry/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
      chunkSizeWarningLimit: 500,
    },
  },
});
