import baseConfig from '@product-portal/config/eslint/next';

export default [
  ...baseConfig,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];
