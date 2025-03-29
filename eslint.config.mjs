import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/typescript', 'eslint:recommended'],
    rules: {},
  }),
]

export default eslintConfig
