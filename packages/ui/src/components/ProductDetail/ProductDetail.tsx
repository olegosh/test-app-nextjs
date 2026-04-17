'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../../context/BrandContext';

interface ProductDetailProps {
  product: Product;
  market: Market;
  isAuthenticated: boolean;
}

export function ProductDetail({ product, market, isAuthenticated }: ProductDetailProps) {
  const { productDetail: cfg, theme } = useBrand();

  const backLink = (
    <Link
      href={routes.products(market)}
      className="text-sm text-gray-500 hover:underline mb-6 inline-block"
    >
      ← Back to Products
    </Link>
  );

  const memberListSection = isAuthenticated && cfg.memberSectionStyle === 'list' && (
    <aside className="rounded-lg bg-amber-50 border border-amber-200 p-4">
      <h2 className="font-semibold mb-2">Member Details</h2>
      <ul className="text-sm space-y-1 text-gray-700">
        <li>Rating: {product.rating}/5</li>
        <li>Stock: {product.stock} units available</li>
        <li>Discount: {product.discountPercentage}% off</li>
        <li>Brand: {product.brand}</li>
      </ul>
    </aside>
  );

  const memberCardsSection = isAuthenticated && cfg.memberSectionStyle === 'cards' && (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
        <p className="text-xs text-gray-500 mt-1">In Stock</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{product.rating}</p>
        <p className="text-xs text-gray-500 mt-1">Rating</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          {product.discountPercentage}%
        </p>
        <p className="text-xs text-gray-500 mt-1">Discount</p>
      </div>
    </div>
  );

  const tags = (
    <div className="flex flex-wrap items-center gap-3">
      {cfg.showCategoryTag && (
        <span
          className="rounded-full px-3 py-1 text-xs font-medium border"
          style={{
            backgroundColor: `${theme.primaryColor}10`,
            borderColor: `${theme.primaryColor}30`,
            color: theme.primaryColor,
          }}
        >
          {product.category}
        </span>
      )}
      {cfg.showBrandTag && product.brand && (
        <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
          {product.brand}
        </span>
      )}
      <div className="flex items-center gap-1 text-sm text-amber-600">
        <span>★</span>
        <span className="font-medium">{product.rating}/5</span>
      </div>
    </div>
  );

  if (cfg.layout === 'side-by-side') {
    return (
      <main className="max-w-4xl mx-auto px-6 py-8">
        {backLink}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
            {tags}
            {memberListSection}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      {backLink}
      <div
        style={{ position: 'relative', width: '100%', height: '360px' }}
        className="rounded-xl overflow-hidden mb-6"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
      </div>
      <div className="mb-4">{tags}</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
      <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
        {product.discountPercentage > 0 && (
          <span
            className="text-sm font-medium rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor: `${theme.primaryColor}10`,
              color: theme.primaryColor,
            }}
          >
            -{product.discountPercentage}% off
          </span>
        )}
      </div>
      {memberCardsSection}
    </main>
  );
}
