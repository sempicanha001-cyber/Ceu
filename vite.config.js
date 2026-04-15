import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime'],
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/*.png',
      ],
      manifest: {
        name: 'CéuClaro - Previsão do Tempo',
        short_name: 'CéuClaro',
        description: 'Previsão do tempo bonita, precisa e offline para o Brasil',
        theme_color: '#1a6fc4',
        background_color: '#0a0e2e',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/?utm_source=pwa',
        categories: ['weather'],
        screenshots: [
          {
            src: '/icons/screenshot-1.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/icons/screenshot-2.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Previsão atual',
            short_name: 'Previsão',
            description: 'Ver previsão do tempo atual',
            url: '/?mode=forecast',
            icons: [
              {
                src: '/icons/icon-96.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // API de previsão - Network first com cache de 30min
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast.*/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'weather-api-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 60, // 30 minutos
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 8,
            },
          },
          // API de geocoding - Network first com cache de 24h
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'geocoding-api-v1',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Nominatim (OSM) - Cache first com fallback
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            method: 'GET',
            options: {
              cacheName: 'nominatim-v1',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}',
        ],
        globIgnores: [
          '**/node_modules/**/*',
          '**/dist/**/*',
        ],
      },
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        navigateFallback: '/index.html',
        suppressWarnings: true,
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    reportCompressedSize: true,
    sourcemap: false,
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
      'Service-Worker-Allowed': '/',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
