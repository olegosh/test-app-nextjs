'use client';

import type { ReactNode } from 'react';
import type { BrandConfig } from '@product-portal/types';
import { BrandContext } from '../context/BrandContext';

interface Props {
  config: BrandConfig;
  children: ReactNode;
}

export function BrandProvider({ config, children }: Props) {
  return <BrandContext.Provider value={config}>{children}</BrandContext.Provider>;
}
