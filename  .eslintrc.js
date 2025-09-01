const path = require('path');

module.exports = {
  root: true,
  overrides: [
    {
      // API app (NestJS)
      files: ['apiapp/**/*.{ts,tsx,js}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: path.resolve(__dirname, 'apiapp/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
      ],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(__dirname, 'apiapp/tsconfig.json'),
          },
        },
      },
    },
    {
      // Web app (Next.js)
      files: ['webapp/**/*.{ts,tsx,js}'],
      extends: [
        'next/core-web-vitals',
        'next/typescript',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
      ],
      plugins: ['import'],
      rules: {
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(__dirname, 'webapp/tsconfig.json'),
          },
        },
      },
    },
  ],
};