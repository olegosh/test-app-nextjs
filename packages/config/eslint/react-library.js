import baseConfig from './base.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['flat/recommended'],
  {
    settings: {
      react: { version: 'detect' },
    },
  },
];
