'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

interface PaymentPageProps {
  market: Market;
}

const DUMMY_CARD = {
  number: '4242 4242 4242 4242',
  name: 'John Doe',
  expiry: '12/28',
  cvv: '123',
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'apple', label: 'Apple Pay', icon: '🍎' },
] as const;

export function PaymentPage({ market }: PaymentPageProps) {
  const { theme } = useBrand();
  const { totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);

  function autofill() {
    setCard(DUMMY_CARD);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    console.log('Payment processing', {
      method,
      card: method === 'card' ? { ...card, cvv: '***' } : undefined,
      total: totalPrice.toFixed(2),
    });

    // Simulate processing delay
    setTimeout(() => {
      clearCart();
      router.push(routes.confirmation(market));
    }, 1500);
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent';

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Payment</h1>
      <p className="text-sm text-gray-500 mb-8">Total: ${totalPrice.toFixed(2)}</p>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="flex flex-col gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <label
                key={pm.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                  method === pm.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={pm.id}
                  checked={method === pm.id}
                  onChange={() => setMethod(pm.id)}
                  className="accent-gray-900"
                />
                <span className="text-base">{pm.icon}</span>
                <span className="text-sm font-medium text-gray-700">{pm.label}</span>
              </label>
            ))}
          </div>
        </div>

        {method === 'card' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Card Details</h2>
              <button
                type="button"
                onClick={autofill}
                className="text-xs font-medium px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Autofill demo card
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                <input
                  className={inputClass}
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder Name</label>
                <input
                  className={inputClass}
                  value={card.name}
                  onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry</label>
                <input
                  className={inputClass}
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                <input
                  className={inputClass}
                  placeholder="123"
                  type="password"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {method !== 'card' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6 text-center">
            <p className="text-sm text-gray-500">
              You will be redirected to {PAYMENT_METHODS.find((m) => m.id === method)?.label} to complete payment.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(routes.checkout(market))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white text-center transition-colors cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </form>
    </main>
  );
}
