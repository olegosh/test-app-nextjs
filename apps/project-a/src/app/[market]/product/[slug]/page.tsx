import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { SESSION_COOKIE_NAME } from '@product-portal/constants';
import { ProductDetail } from '@product-portal/ui';
import { verifySession } from '../../../../lib/auth';
import { fetchProductBySlug } from '../../../../lib/products';

interface Props {
  params: Promise<{ market: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, slug } = await params;
  const product = await fetchProductBySlug(isValidMarket(market) ? market : 'en', slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title} — ProjectA`,
    description: product.description,
    openGraph: { images: [{ url: product.thumbnail }] },
  };
}

async function ProductDetailContent({ market, slug }: { market: Market; slug: string }) {
  const [product, session] = await Promise.all([
    fetchProductBySlug(market, slug),
    (async () => {
      const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
      return token ? verifySession(token) : null;
    })(),
  ]);

  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      market={market}
      isAuthenticated={!!session}
      userMarket={session?.market}
      isAdmin={session?.role === 'admin'}
    />
  );
}

async function ProductDetailInner({ params }: { params: Promise<{ market: string; slug: string }> }) {
  const { market, slug } = await params;
  if (!isValidMarket(market)) notFound();
  return <ProductDetailContent market={market as Market} slug={slug} />;
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="animate-pulse max-w-4xl mx-auto px-6 py-8"><div className="h-64 bg-gray-100 rounded-xl" /></div>}>
      <ProductDetailInner params={params} />
    </Suspense>
  );
}
