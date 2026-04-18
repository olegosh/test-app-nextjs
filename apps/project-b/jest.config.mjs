import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@product-portal/ui(.*)$': '<rootDir>/../../packages/ui/src$1',
    '^@product-portal/types(.*)$': '<rootDir>/../../packages/types/src$1',
    '^@product-portal/constants(.*)$': '<rootDir>/../../packages/constants/src$1',
    '^@product-portal/constants/credentials.json$':
      '<rootDir>/../../packages/constants/src/credentials.json',
  },
};

export default createJestConfig(config);
