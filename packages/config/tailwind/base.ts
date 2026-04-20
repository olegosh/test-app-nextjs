import type { Config } from 'tailwindcss';

export const sharedContent = [
  './src/**/*.{ts,tsx}',
  '../../packages/ui/src/**/*.{ts,tsx}',
];

export function createTailwindConfig(overrides: Partial<Config> = {}): Config {
  return {
    content: sharedContent,
    ...overrides,
  };
}
