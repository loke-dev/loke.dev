import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://loke.dev',
  output: 'server',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
