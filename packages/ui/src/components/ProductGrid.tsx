'use client';

import { useState } from 'react';
import type { Product } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { ProductCard } from './ProductCard';
import { AuthModal } from './AuthModal';
import { useBrand } from '../context/BrandContext';

interface ProductGridProps {
  products: Product[];
  market: Market;
  isAuthenticated?: boolean;
}

export function ProductGrid({ products, market, isAuthenticated }: ProductGridProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { productCard } = useBrand();
  const { minCardWidth, gap } = productCard.grid;

  return (
    <>
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`,
          gap,
        }}
      >
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
