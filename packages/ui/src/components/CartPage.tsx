'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  market: Market;
  userMarket?: string | null | undefined;
  isAdmin?: boolean | undefined;
}

export function CartPage({ market, userMarket, isAdmin }: CartPageProps) {
  const { cart: cfg, theme, featureFlags } = useBrand();
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  // When cartMarketSeparation is enabled, filter items to user's market (admin sees all)
  const visibleItems = featureFlags.cartMarketSeparation && userMarket && !isAdmin
    ? state.items.filter((i) => i.market === userMarket)
    : state.items;

  const totalItems = visibleItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = visibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function handleCheckout() {
    console.log('Checkout initiated', {
      items: visibleItems,
      totalItems,
      totalPrice: totalPrice.toFixed(2),
    });
  }

  if (visibleItems.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-sm text-gray-500 mb-8">Browse products and add items to your cart.</p>
        <Link
          href={routes.products(market)}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: theme.primaryColor }}
        >
          Browse products →
        </Link>
      </main>
    );
  }

  const isCompact = cfg.layout === 'compact';

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cart</h1>
          <p className="text-sm text-gray-500 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <div className={`flex flex-col ${isCompact ? 'gap-2' : 'gap-4'}`}>
        {visibleItems.map((item) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white ${isCompact ? 'p-3' : 'p-4'}`}
          >
            <div style={{ position: 'relative', width: isCompact ? '48px' : '72px', height: isCompact ? '48px' : '72px', flexShrink: 0 }}>
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                sizes="72px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {item.title}
              </h3>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
              >
                +
              </button>
            </div>

            <p className={`font-bold text-gray-900 w-20 text-right ${isCompact ? 'text-sm' : 'text-base'}`}>
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-sm"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Total ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
          <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <Link
            href={routes.products(market)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors"
          >
            Continue shopping
          </Link>
          <button
            onClick={handleCheckout}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white text-center transition-colors cursor-pointer"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {cfg.checkoutLabel}
          </button>
        </div>
      </div>
    </main>
  );
}
