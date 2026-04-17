'use client';

import { createContext, useContext } from 'react';
import type { BrandConfig } from '@product-portal/types';

const BrandContext = createContext<BrandConfig | null>(null);

export function useBrand(): BrandConfig {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error('useBrand must be used inside BrandProvider');
  }
  return ctx;
}

export { BrandContext };
