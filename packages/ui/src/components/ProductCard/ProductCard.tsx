'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import { routes } from '@product-portal/constants';
import { useBrand } from '../../context/BrandContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../Button';

interface ProductCardProps {
  product: Product;
  market: Market;
  isAuthenticated: boolean;
  onRequestAuth?: () => void;
}

export function ProductCard({ product, market, isAuthenticated, onRequestAuth }: ProductCardProps) {
  const { productCard: cfg, id: brandId } = useBrand();
  const { addItem, getItemQuantity } = useCart();

  const quantityInCart = getItemQuantity(product.id);

  function handleAddToCart() {
    console.log(`${market.toUpperCase()} product "${product.title}" has been added in ${brandId}`);
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      market,
    });
  }

  const titleBlock = (
    <h2 className="text-base font-semibold leading-snug text-gray-900">{product.title}</h2>
  );

  const priceBlock = <span className="text-lg font-bold text-gray-900">${product.price}</span>;

  const categoryTag = cfg.showCategoryTag ? (
    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200">
      {product.category}
    </span>
  ) : null;

  const ratingBlock = (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <span>★</span>
      <span>{product.rating}</span>
    </div>
  );

  const detailsButton = isAuthenticated ? (
    <Link
      href={routes.product(market, product.slug)}
      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
    >
      Details
    </Link>
  ) : (
    <button
      onClick={onRequestAuth}
      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      Details
    </button>
  );

  const addToCartButton = (
    <Button label={quantityInCart > 0 ? `Add (${quantityInCart})` : 'Add to Cart'} onClick={handleAddToCart} />
  );

  const actionBlock = (
    <div className="flex items-center gap-2">
      {detailsButton}
      {addToCartButton}
    </div>
  );

  if (cfg.layout === 'vertical') {
    return (
      <article className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow duration-200">
        <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f9fafb' }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            style={{ objectFit: 'contain', padding: '8px' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            {ratingBlock}
            <div className="text-right flex-1">{titleBlock}</div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {priceBlock}
            {categoryTag}
          </div>
          <div className="mt-auto">{actionBlock}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-row rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      <div style={{ position: 'relative', width: '160px', minHeight: '160px', flexShrink: 0 }}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="160px"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-1">
          {priceBlock}
          {ratingBlock}
        </div>
        {categoryTag && <div className="mb-2">{categoryTag}</div>}
        <div className="mt-auto flex flex-col gap-3">
          {titleBlock}
          {actionBlock}
        </div>
      </div>
    </article>
  );
}
