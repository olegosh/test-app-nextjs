'use client';

import { useState } from 'react';
import type { Product } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { ProductCard } from './ProductCard';
import { AuthModal } from './AuthModal';

interface ProductGridProps {
  products: Product[];
  market: Market;
  isAuthenticated?: boolean;
}

export function ProductGrid({ products, market, isAuthenticated }: ProductGridProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              market={market}
              isAuthenticated={isAuthenticated ?? false}
              onRequestAuth={() => setShowAuthModal(true)}
            />
          </li>
        ))}
      </ul>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        loginHref={routes.login(market)}
      />
    </>
  );
}
