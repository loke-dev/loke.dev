import path from 'path'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      'sanity.config': path.resolve(__dirname, './sanity.config.ts'),
    },
  },
  ssr: {
    noExternal: ['styled-components', '@sanity/ui', '@sanity/vision'],
  },
  optimizeDeps: {
    include: ['styled-components'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react/jsx-runtime') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('/node_modules/@radix-ui/')) {
            return 'vendor-radix'
          }
        },
      },
    },
    commonjsOptions: {
      include: [/styled-components/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
})
