'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../context/BrandContext';

interface ConfirmationPageProps {
  market: Market;
}

export function ConfirmationPage({ market }: ConfirmationPageProps) {
  const { theme } = useBrand();
  const [orderId, setOrderId] = useState('ORD-...');

  useEffect(() => {
    setOrderId(`ORD-${Date.now().toString(36).toUpperCase()}`);
  }, []);

  return (
    <main className="max-w-lg mx-auto px-6 py-24 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6 text-white text-2xl"
        style={{ backgroundColor: theme.primaryColor }}
      >
        ✓
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed</h1>
      <p className="text-sm text-gray-500 mb-1">Thank you for your purchase!</p>
      <p className="text-xs text-gray-400 mb-8">Order ID: {orderId}</p>

      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8 text-left">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">What happens next?</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-xs mt-0.5" style={{ color: theme.primaryColor }}>1.</span>
            You will receive an order confirmation email shortly.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xs mt-0.5" style={{ color: theme.primaryColor }}>2.</span>
            Your order will be processed within 1-2 business days.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xs mt-0.5" style={{ color: theme.primaryColor }}>3.</span>
            Tracking information will be sent once shipped.
          </li>
        </ul>
      </div>

      <Link
        href={routes.products(market)}
        className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: theme.primaryColor }}
      >
        Continue Shopping
      </Link>
    </main>
  );
}
