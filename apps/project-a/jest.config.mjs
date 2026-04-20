import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/../../packages/ui/src'],
  moduleNameMapper: {
    '^@product-portal/ui(.*)$': '<rootDir>/../../packages/ui/src$1',
    '^@product-portal/types(.*)$': '<rootDir>/../../packages/types/src$1',
    '^@product-portal/constants(.*)$': '<rootDir>/../../packages/constants/src$1',
    '^@product-portal/constants/credentials.json$':
      '<rootDir>/../../packages/constants/src/credentials.json',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/../../packages/ui/src/**/*.test.{ts,tsx}',
  ],
};

export default createJestConfig(config);
