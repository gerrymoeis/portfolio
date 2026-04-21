// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Site URL for sitemap generation and canonical URLs
  // Update this to your actual domain in production
  site: 'https://octoporto.pages.dev',
  
  output: 'static', // SSG mode - generate static HTML files at build time
  
  // Integrations
  integrations: [
    sitemap({
      // Customize sitemap generation
      filter: (page) => !page.includes('/api/'), // Exclude API routes if any
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  
  // Image optimization configuration
  image: {
    // Enable image optimization for all formats
    // Astro will automatically generate optimized versions
    domains: [],
    remotePatterns: [],
  },
  
  build: {
    // Inline small stylesheets automatically for better performance
    inlineStylesheets: 'auto',
    
    // Enable code splitting for better caching and smaller initial bundles
    // Each page will only load the JavaScript it needs
    split: true,
  },
  
  vite: {
    test: {
      globals: true,
      environment: 'node',
    },
    
    build: {
      // Enable minification for production builds
      minify: 'esbuild',
      
      // Configure chunk splitting for optimal caching
      rollupOptions: {
        output: {
          // Manual chunk splitting for better code organization
          manualChunks: (id) => {
            // Vendor chunks for node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            
            // Separate chunks for client scripts
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
          
          // Optimize chunk file names for better caching
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entry/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
      
      // Set chunk size warning limit (in KB)
      chunkSizeWarningLimit: 500,
    },
  },
});
