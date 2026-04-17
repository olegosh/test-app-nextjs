import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { SESSION_COOKIE_NAME } from '@product-portal/constants';
import { verifySession } from '../../../lib/auth';
import { fetchProducts, shuffleFirst } from '../../../lib/products';
import { ProductGrid } from '@product-portal/ui';

interface Props {
  params: Promise<{ market: string }>;
}

export const metadata: Metadata = {
  title: 'Products — ProjectB',
  description: 'Browse our full product catalog.',
};

async function ProductsContent({ market }: { market: Market }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  const allProducts = await fetchProducts(market);
  const products = shuffleFirst(allProducts);

  return (
    <>
      <p className="text-sm text-gray-500 mt-1 mb-6">{products.length} items available</p>

      <ProductGrid products={products} market={market} isAuthenticated={!!session} />

      <div className={`mt-8 rounded-lg border px-4 py-3 text-xs font-medium ${
        session
          ? 'border-amber-200 bg-amber-50 text-amber-800'
          : 'border-blue-200 bg-blue-50 text-blue-800'
      }`}>
        {session ? (
          <span>SEO: This page is <strong>hidden from search engines</strong> (meta robots: noindex). Authenticated content is excluded from crawling to prevent duplicate indexing.</span>
        ) : (
          <span>SEO: This page is <strong>indexable by search engines</strong> (meta robots: index, follow). Public product listings are optimized for crawlers.</span>
        )}
      </div>
    </>
  );
}

function ProductsSkeleton() {
  return (
    <div className="animate-pulse mt-6">
      <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white h-72" />
        ))}
      </div>
    </div>
  );
}

async function ProductsPageInner({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
      <ProductsContent market={market} />
    </>
  );
}

export default function ProductsPage({ params }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsPageInner params={params} />
      </Suspense>
    </main>
  );
}
