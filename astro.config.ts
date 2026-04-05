import solid from '@astrojs/solid-js'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const isrBypassToken = process.env.VERCEL_ISR_BYPASS_TOKEN

export default defineConfig({
  site: 'https://loke.dev',
  output: 'server',
  build: {
    inlineStylesheets: 'always',
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
    isr: {
      ...(isrBypassToken ? { bypassToken: isrBypassToken } : {}),
      // ISR cache keys ignore search params, so keep /blog (uses ?page=) out of ISR.
      exclude: [/^\/blog\/?$/, /^\/api\/.+/],
    },
    imageService: true,
    imagesConfig: {
      sizes: [
        192, 256, 320, 384, 512, 640, 750, 768, 828, 1024, 1080, 1200, 1280,
        1600, 1920, 2048, 3840,
      ],
    },
  }),
  integrations: [solid()],
  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
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
