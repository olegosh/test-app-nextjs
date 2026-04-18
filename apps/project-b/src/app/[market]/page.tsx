import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { isValidMarket, routes } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';

interface Props {
  params: Promise<{ market: string }>;
}

const marketContent: Record<Market, { headline: string; body: string }> = {
  en: {
    headline: 'Welcome to ProjectB',
    body: 'Browse our curated selection of products, exclusively for our English-speaking customers.',
  },
  ca: {
    headline: 'Bienvenue sur ProjectB',
    body: 'Découvrez notre sélection exclusive de produits pour nos clients canadiens.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market } = await params;
  if (!isValidMarket(market)) return {};
  return {
    title: `${marketContent[market].headline} — ProjectB`,
    description: marketContent[market].body,
  };
}

async function WelcomeContent({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();
  const content = marketContent[market];

  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <div className="inline-block rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-medium text-red-700 mb-6">
        {market.toUpperCase()} Market
      </div>
      <h1 className="text-5xl font-bold mb-6 tracking-tight text-gray-900">{content.headline}</h1>
      <p className="text-lg text-gray-500 leading-relaxed mb-8">{content.body}</p>
      <Link
        href={routes.products(market)}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
      >
        Browse products
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
      </Link>
    </main>
  );
}

export default function WelcomePage({ params }: Props) {
  return (
    <Suspense>
      <WelcomeContent params={params} />
    </Suspense>
  );
}
