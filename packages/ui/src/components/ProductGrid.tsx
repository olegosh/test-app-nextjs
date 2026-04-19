'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

export function ProductGrid({ products: initialProducts, market, isAuthenticated }: ProductGridProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { productCard, theme } = useBrand();
  const { minCardWidth, gap } = productCard.grid;

  // Reset when market or initial products change
  useEffect(() => {
    setAllProducts(initialProducts);
    setPage(1);
    setHasMore(true);
  }, [initialProducts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/products?market=${market}&page=${page}`);
      const data = await res.json();

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p: Product) => p.id));
          const newProducts = data.products.filter((p: Product) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
        setPage((p) => p + 1);
        if (data.products.length < 30) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, market, page]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <p className="text-sm text-gray-500 mt-1 mb-6">{allProducts.length} items available</p>
      <ul
        className="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`,
          gap,
        }}
      >
        {allProducts.map((product) => (
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

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading && (
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${theme.primaryColor}40`, borderTopColor: 'transparent' }}
            />
          )}
        </div>
      )}

      {!hasMore && allProducts.length > initialProducts.length && (
        <p className="text-center text-xs text-gray-400 py-6">All products loaded</p>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        loginHref={routes.login(market)}
      />
    </>
  );
}
