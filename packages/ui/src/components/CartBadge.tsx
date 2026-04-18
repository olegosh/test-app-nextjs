'use client';

import Link from 'next/link';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';

interface CartBadgeProps {
  market: Market;
  userMarket?: string | null | undefined;
  isAdmin?: boolean | undefined;
}

export function CartBadge({ market, userMarket, isAdmin }: CartBadgeProps) {
  const { state } = useCart();
  const { theme, featureFlags } = useBrand();

  const visibleItems = featureFlags.cartMarketSeparation && userMarket && !isAdmin
    ? state.items.filter((i) => i.market === userMarket)
    : state.items;

  const totalItems = visibleItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link
      href={routes.cart(market)}
      className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      Cart
      {totalItems > 0 && (
        <span
          className="absolute flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
          style={{
            backgroundColor: theme.primaryColor,
            top: theme.menuPosition === 'side' ? '50%' : '-8px',
            transform: theme.menuPosition === 'side' ? 'translateY(-50%)' : 'none',
            right: theme.menuPosition === 'side' ? '-16px' : '-20px',
          }}
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
}
