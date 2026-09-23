import eslint from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**'],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]
