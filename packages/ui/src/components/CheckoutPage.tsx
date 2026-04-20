'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  market: Market;
}

const DUMMY_ADDRESS = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'IL',
  zip: '62704',
  country: 'United States',
};

export function CheckoutPage({ market }: CheckoutPageProps) {
  const { theme } = useBrand();
  const { totalItems, totalPrice } = useCart();
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [filled, setFilled] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  function autofill() {
    setForm(DUMMY_ADDRESS);
    setFilled(true);
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Checkout initiated', { ...form, comment, totalItems, totalPrice: totalPrice.toFixed(2) });
    router.push(routes.payment(market));
  }

  if (totalItems === 0) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nothing to checkout</h1>
        <p className="text-sm text-gray-500 mb-6">Add some products to your cart first.</p>
        <a
          href={routes.products(market)}
          className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >
          Browse products
        </a>
      </main>
    );
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent';

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-8">{totalItems} item{totalItems !== 1 ? 's' : ''} &middot; ${totalPrice.toFixed(2)}</p>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Shipping Details</h2>
            <button
              type="button"
              onClick={autofill}
              className="text-xs font-medium px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Autofill demo data
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input className={inputClass} value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
              <input className={inputClass} value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input className={inputClass} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <input className={inputClass} value={form.address} onChange={(e) => handleChange('address', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input className={inputClass} value={form.city} onChange={(e) => handleChange('city', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <input className={inputClass} value={form.state} onChange={(e) => handleChange('state', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code</label>
              <input className={inputClass} value={form.zip} onChange={(e) => handleChange('zip', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
              <input className={inputClass} value={form.country} onChange={(e) => handleChange('country', e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Order Comment (optional)</h2>
          <textarea
            className={`${inputClass} resize-none h-20`}
            placeholder="Any special instructions..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(routes.cart(market))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={!filled && !form.firstName}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white text-center transition-colors cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </main>
  );
}
