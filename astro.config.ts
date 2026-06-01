import cloudflare from '@astrojs/cloudflare'
import solid from '@astrojs/solid-js'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import type { PluginOption } from 'vite'

export default defineConfig({
  site: 'https://loke.dev',
  output: 'server',
  build: {
    inlineStylesheets: 'always',
  },
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss() as PluginOption],
    server: {
      proxy: {
        '/studio': {
          target: 'http://127.0.0.1:3333',
          changeOrigin: true,
        },
      },
    },
  },
})
