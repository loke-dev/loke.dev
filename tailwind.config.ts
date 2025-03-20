import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F9F5F1',
        'deep-charcoal': '#282828',
        'mid-gray': '#A0A0A0',
        'modern-teal': '#008080',
        'vibrant-coral': '#FF7F50',
        'earthy-olive': '#6B8E23',
        'muted-blue-gray': '#B0C4DE',
        'light-terracotta': '#E2725B',
      },
    },
  },
}

export default config
